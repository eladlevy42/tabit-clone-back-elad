"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.addReservation = addReservation;
exports.getReservationByRestaurantIdAndDate =
  getReservationByRestaurantIdAndDate;
exports.editReservation = editReservation;
exports.deleteReservation = deleteReservation;
exports.getReservationById = getReservationById;
const db_1 = require("../config/db");
const twilio_1 = require("twilio");
const moment_timezone_1 = __importDefault(require("moment-timezone")); // Import moment-timezone for timezone handling
// Add a reservation
async function addReservation(req, res) {
  const {
    tableId,
    restId,
    partySize,
    firstName,
    lastName,
    phoneNumber,
    email,
    notes,
    date,
  } = req.body;
  console.log("adding reservation");
  if (
    !tableId ||
    !restId ||
    !partySize ||
    !firstName ||
    !lastName ||
    !phoneNumber ||
    !email ||
    !date
  ) {
    res.status(400).json({ message: "Missing required fields." });
    return;
  }
  let connection;
  let pool;
  try {
    pool = await (0, db_1.connectDB)();
    connection = await pool.getConnection();
    // Convert the date string into a Date object
    const reservationDate = new Date(date);
    const startTime = new Date(reservationDate);
    const endTime = new Date(reservationDate);
    // Set the time range (1.5 hours before and after)
    startTime.setHours(startTime.getHours() - 1);
    startTime.setMinutes(startTime.getMinutes() - 30);
    endTime.setHours(endTime.getHours() + 1);
    endTime.setMinutes(endTime.getMinutes() + 30);
    // Check if there's any overlapping reservation on this table
    const [existingReservations] = await connection.query(
      `SELECT * FROM Reservations 
       WHERE tableId = ? 
       AND restId = ?
       AND (date > ? AND date < ?)`,
      [tableId, restId, startTime, endTime]
    );
    if (existingReservations.length > 0) {
      res.status(409).json({
        message: "Reservation conflicts with an existing reservation.",
      });
      return;
    }
    // Insert the new reservation
    const [result] = await connection.query(
      `INSERT INTO Reservations (tableId, restId, partySize, firstName, lastName, phoneNumber, email, notes, date) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        tableId,
        restId,
        partySize,
        firstName,
        lastName,
        phoneNumber,
        email,
        notes,
        reservationDate, // Pass the formatted date
      ]
    );
    const reservationId = result.insertId;
    // Fetch the restaurant details
    const [restaurantRows] = await connection.query(
      `SELECT * FROM Restaurants WHERE restId = ?`,
      [restId]
    );
    if (!restaurantRows || restaurantRows.length === 0) {
      res.status(404).json({ message: "Restaurant not found." });
      return;
    }
    const restaurant = restaurantRows[0];
    const reservation = {
      reservationId,
      tableId,
      restId,
      partySize,
      firstName,
      lastName,
      phoneNumber,
      email,
      date: reservationDate,
      notes,
    };
    // sendSMS(reservation, restaurant);
    res.status(201).json({
      message: "Reservation created successfully",
      reservationId: reservationId,
      restaurant: restaurant,
    });
  } catch (error) {
    console.error("Error adding reservation:", error);
    if (error.code === "ER_CON_COUNT_ERROR") {
      console.error("Too many connections to the database.");
    } else if (error.code === "ECONNREFUSED") {
      console.error("Database connection was refused.");
    } else if (error.code === "ETIMEDOUT") {
      console.error("Connection to the database timed out.");
    } else if (error.code === "ER_ACCESS_DENIED_ERROR") {
      console.error("Access denied for the database user.");
    }
    res.status(500).json({ message: "Server error", error: error.message });
  } finally {
    if (connection) connection.release();
  }
}
export function sendSMSReservation(reservation, restaurant) {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_NUMBER } = process.env;
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_NUMBER) {
    console.error("Twilio credentials are missing.");
    throw new Error("Twilio credentials are not properly configured.");
  }
  const client = new twilio_1.Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

  client.messages
    .create({
      body: `Hello ${reservation.firstName}, 
        Your reservation at ${restaurant.name} on ${reservation.date} for ${reservation.partySize} guests has been confirmed.
        Please inform us if there are any changes.
        Your table will be held for 15 minutes after the reserved time.
        
        For more information, visit: https://tabit-clone.vercel.app/online-reservations/reservation-details?reservationId=${reservation.reservationId}
      `,
      to: reservation.phoneNumber,
      from: TWILIO_NUMBER,
    })
    .then((message) => console.log(`Message sent: ${message.sid}`))
    .catch((error) => console.error(`Error sending message: ${error.message}`));
}

// Get reservations by restaurant ID and date
async function getReservationByRestaurantIdAndDate(req, res) {
  const { restId, date } = req.query;
  if (!restId || !date) {
    res.status(400).json({ message: "Missing restaurant ID or date." });
    return;
  }
  let connection;
  try {
    const pool = await (0, db_1.connectDB)();
    connection = await pool.getConnection();
    // Query reservations by restaurant ID and date
    const [rows] = await connection.query(
      `SELECT * FROM Reservations WHERE restId = ? AND DATE(date) = DATE(?)`,
      [restId, date]
    );
    if (!rows || rows.length === 0) {
      res.status(404).json({
        message: "No reservations found for the specified restaurant and date.",
      });
      return;
    }
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    if (error.code === "ER_CON_COUNT_ERROR") {
      console.error("Too many connections to the database.");
    } else if (error.code === "ECONNREFUSED") {
      console.error("Database connection was refused.");
    } else if (error.code === "ETIMEDOUT") {
      console.error("Connection to the database timed out.");
    } else if (error.code === "ER_ACCESS_DENIED_ERROR") {
      console.error("Access denied for the database user.");
    }
    res.status(500).json({ message: "Server error", error: error.message });
  } finally {
    if (connection) connection.release();
  }
}
// Edit a reservation
async function editReservation(req, res) {
  const { reservationId, tableId, newPartySize, newDate } = req.body;
  if (!reservationId || !newDate || !tableId || !newPartySize) {
    res.status(400).json({ message: "Missing required fields." });
    return;
  }
  let connection;
  try {
    const pool = await (0, db_1.connectDB)();
    connection = await pool.getConnection();
    // Call the stored procedure to find an available table and update the reservation
    const [result] = await connection.query(
      `CALL edit_reservation(?, ?, ?, ?)`,
      [reservationId, tableId, newPartySize, newDate]
    );
    res.status(200).json({ message: "Reservation updated successfully." });
  } catch (error) {
    console.error("Error editing reservation:", error);
    if (error.code === "ER_CON_COUNT_ERROR") {
      console.error("Too many connections to the database.");
    } else if (error.code === "ECONNREFUSED") {
      console.error("Database connection was refused.");
    } else if (error.code === "ETIMEDOUT") {
      console.error("Connection to the database timed out.");
    } else if (error.code === "ER_ACCESS_DENIED_ERROR") {
      console.error("Access denied for the database user.");
    }
    if (error.code === "45000") {
      res.status(400).json({ message: error.sqlMessage });
    } else {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  } finally {
    if (connection) connection.release();
  }
}
// Delete a reservation
async function deleteReservation(req, res) {
  const { reservationId } = req.params;
  if (!reservationId) {
    console.error("Missing reservation ID.");
    res.status(400).json({ message: "Missing reservation ID." });
    return;
  }
  let connection;
  try {
    console.log("Attempting to connect to the database...");
    const pool = await (0, db_1.connectDB)();
    connection = await pool.getConnection();
    console.log("Database connection established.");
    // Delete the reservation by ID
    console.log(`Executing query to delete reservation ID: ${reservationId}`);
    const [result] = await connection.query(
      `DELETE FROM Reservations WHERE reservationId = ?`,
      [reservationId]
    );
    if (result.affectedRows === 0) {
      console.log("No reservation found with the provided ID.");
      res.status(404).json({ message: "Reservation not found." });
      return;
    }
    console.log("Reservation deleted successfully.");
    res.status(200).json({ message: "Reservation deleted successfully." });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    // Check if the error is related to MySQL connection issues
    if (error.code === "ER_CON_COUNT_ERROR") {
      console.error("Too many connections to the database.");
    } else if (error.code === "ECONNREFUSED") {
      console.error("Database connection was refused.");
    } else if (error.code === "ETIMEDOUT") {
      console.error("Connection to the database timed out.");
    } else if (error.code === "ER_ACCESS_DENIED_ERROR") {
      console.error("Access denied for the database user.");
    }
    res.status(500).json({ message: "Server error", error: error.message });
  } finally {
    if (connection) {
      console.log("Releasing database connection.");
      connection.release();
    }
  }
}
async function getReservationById(req, res) {
  let connection;
  const { reservationId } = req.params; // Get reservation ID from request parameters
  try {
    const pool = await (0, db_1.connectDB)(); // Connect to the database
    connection = await pool.getConnection(); // Get a connection from the pool
    // Execute the stored procedure
    const [rows] = await connection.query(`CALL get_reservation_by_id(?)`, [
      reservationId,
    ]);
    // Check if any result is returned
    if (!rows || rows.length === 0 || rows[0].length === 0) {
      res.status(404).json({ message: "Reservation not found." });
      return;
    }
    const reservation = rows[0][0]; // Get the first row
    // Convert the date to the local timezone
    if (reservation.date) {
      reservation.date = (0, moment_timezone_1.default)(reservation.date)
        .tz("Asia/Jerusalem") // Convert to Israel timezone
        .format("YYYY-MM-DD HH:mm:ss"); // Format as MySQL DATETIME
    }
    // Return the fetched reservation data
    res.status(200).json(reservation); // Return the reservation object
  } catch (error) {
    console.error("Error fetching reservation:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  } finally {
    if (connection) connection.release(); // Release the connection back to the pool
  }
}
