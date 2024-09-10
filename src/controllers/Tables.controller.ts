import { Request, Response } from "express";
import { connectDB } from "../config/db";
import { RowDataPacket } from "mysql2";

// Get available tables nearby based on location and time

export async function getAllAvaliableTablesByRest(
  req: Request,
  res: Response
): Promise<void> {
  const { restId } = req.params;

  if (!restId) {
    res.status(400).json({ message: "Missing restaurant ID." });
    return;
  }

  let connection;
  try {
    const pool = await connectDB();
    connection = await pool.getConnection();

    // Directly use the `dd-mm-yyyyThh:mm` format without conversion
    const [rows]: [RowDataPacket[], any] = await connection.query(
      `CALL get_available_tables_by_rest(${restId});`
    );

    if (!rows || rows.length === 0) {
      res.status(404).json({ message: "No tables found." });
      return;
    }

    res.status(200).json(rows[0]);
  } catch (error: any) {
    console.error("Error fetching available tables:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  } finally {
    if (connection) connection.release();
  }
}

export async function getTablePositionsForRest(
  req: Request,
  res: Response
): Promise<void> {
  const { restId } = req.params;

  if (!restId) {
    res.status(400).json({ message: "Missing restaurant ID." });
    return;
  }

  let connection;
  try {
    const pool = await connectDB();
    connection = await pool.getConnection();
    // Call the stored procedure to get available tables nearby
    const [rows]: [RowDataPacket[], any] = await connection.query(
      `SELECT distinct Tables.position FROM defaultdb.Tables where restid=${restId};`
    );
    if (!rows || rows.length === 0) {
      res.status(404).json({ message: "No tables found." });
      return;
    }
    res.status(200).json(rows);
  } catch (error: any) {
    console.error("Error fetching available tables:", error);

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
export async function getAvailableTables(
  req: Request,
  res: Response
): Promise<void> {
  const { lat, lng, date, partySize, page = 1 } = req.query;

  if (!lat || !lng || !date) {
    res.status(400).json({ message: "Missing latitude, longitude, or date." });
    return;
  }

  let connection;

  try {
    const pool = await connectDB();
    connection = await pool.getConnection();

    // Call the stored procedure to get available tables nearby
    const [rows]: [RowDataPacket[], any] = await connection.query(
      `CALL get_available_tables_nearby(?, ?, ?, ?,?)`,
      [lat, lng, date, partySize, page]
    );

    if (!rows || rows.length === 0) {
      res.status(404).json({ message: "No available tables found." });
      return;
    }

    res.status(200).json(rows[0]);
  } catch (error: any) {
    console.error("Error fetching available tables:", error);

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
