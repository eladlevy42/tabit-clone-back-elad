"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRestaurantOpeningHours = getRestaurantOpeningHours;
exports.getAllRestaurants = getAllRestaurants;
exports.getGiftIt = getGiftIt;
exports.getPhotosByRestId = getPhotosByRestId;
exports.getAvaliableTablesForNow = getAvaliableTablesForNow;
exports.getRestaurantById = getRestaurantById;
const db_1 = require("../config/db");
// Fetch all restaurants
async function getRestaurantOpeningHours(req, res) {
    let connection;
    const { restId } = req.params;
    try {
        const pool = await (0, db_1.connectDB)();
        connection = await pool.getConnection();
        const [rows] = await connection.query(`SELECT * FROM OpeningHours WHERE restId = ?`, [restId]);
        if (!rows || rows.length === 0) {
            res
                .status(404)
                .json({ message: "No opening hours found for this restaurant." });
            return;
        }
        res.status(200).json(rows[0]); // Returns the first matching row
    }
    catch (error) {
        console.error("Error fetching opening hours:", error);
        switch (error.code) {
            case "ER_CON_COUNT_ERROR":
                console.error("Too many connections to the database.");
                break;
            case "ECONNREFUSED":
                console.error("Database connection was refused.");
                break;
            case "ETIMEDOUT":
                console.error("Connection to the database timed out.");
                break;
            case "ER_ACCESS_DENIED_ERROR":
                console.error("Access denied for the database user.");
                break;
            default:
                console.error("Unhandled database error.");
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
    finally {
        if (connection)
            connection.release();
    }
}
async function getAllRestaurants(req, res) {
    let connection;
    const { category = null, lat = null, lng = null, name = null, page = 1, } = req.query;
    try {
        const pool = await (0, db_1.connectDB)();
        connection = await pool.getConnection();
        const [rows] = await connection.query(`CALL GetAllRestaurants(?,?,?,?,?)`, [category, lat, lng, name, page]);
        if (!rows || rows.length === 0) {
            res.status(404).json({ message: "No restaurants found." });
            return;
        }
        res.status(200).json(rows[0]); //new
    }
    catch (error) {
        console.error("Error fetching restaurants:", error);
        switch (error.code) {
            case "ER_CON_COUNT_ERROR":
                console.error("Too many connections to the database.");
                break;
            case "ECONNREFUSED":
                console.error("Database connection was refused.");
                break;
            case "ETIMEDOUT":
                console.error("Connection to the database timed out.");
                break;
            case "ER_ACCESS_DENIED_ERROR":
                console.error("Access denied for the database user.");
                break;
            default:
                console.error("Unhandled database error.");
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
    finally {
        if (connection)
            connection.release();
    }
}
async function getGiftIt(req, res) {
    let connection;
    const { q = null } = req.query;
    try {
        const pool = await (0, db_1.connectDB)();
        connection = await pool.getConnection();
        const [rows] = await connection.query(`CALL GetGiftIt(?)`, [q]);
        if (!rows || rows.length === 0) {
            res.status(404).json({ message: "No restaurants found." });
            return;
        }
        res.status(200).json(rows);
    }
    catch (error) {
        console.error("Error fetching restaurants:", error);
        switch (error.code) {
            case "ER_CON_COUNT_ERROR":
                console.error("Too many connections to the database.");
                break;
            case "ECONNREFUSED":
                console.error("Database connection was refused.");
                break;
            case "ETIMEDOUT":
                console.error("Connection to the database timed out.");
                break;
            case "ER_ACCESS_DENIED_ERROR":
                console.error("Access denied for the database user.");
                break;
            default:
                console.error("Unhandled database error.");
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
    finally {
        if (connection)
            connection.release();
    }
}
async function getPhotosByRestId(req, res) {
    const { id } = req.params;
    let connection;
    try {
        const pool = await (0, db_1.connectDB)();
        connection = await pool.getConnection();
        const [rows] = await connection.query(`SELECT * FROM RestaurantsPhotos WHERE restId =?`, [id]);
        if (!rows || rows.length === 0) {
            res.status(404).json({ message: "Restaurant not found." });
            return;
        }
        res.status(200).json(rows[0]);
    }
    catch (error) {
        console.error("Error fetching restaurant:", error);
        if (error.code === "ER_CON_COUNT_ERROR") {
            console.error("Too many connections to the database.");
        }
        else if (error.code === "ECONNREFUSED") {
            console.error("Database connection was refused.");
        }
        else if (error.code === "ETIMEDOUT") {
            console.error("Connection to the database timed out.");
        }
        else if (error.code === "ER_ACCESS_DENIED_ERROR") {
            console.error("Access denied for the database user.");
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
    finally {
        if (connection)
            connection.release();
    }
}
async function getAvaliableTablesForNow(req, res) {
    const { id } = req.params;
    let connection;
    try {
        const pool = await (0, db_1.connectDB)();
        connection = await pool.getConnection();
        const [rows] = await connection.query(`call GetAvailableTablesByNow(?)`, [id]);
        if (!rows || rows.length === 0) {
            res.status(404).json({ message: "Restaurant not found." });
            return;
        }
        res.status(200).json(rows[0]);
    }
    catch (error) {
        console.error("Error fetching restaurant:", error);
        if (error.code === "ER_CON_COUNT_ERROR") {
            console.error("Too many connections to the database.");
        }
        else if (error.code === "ECONNREFUSED") {
            console.error("Database connection was refused.");
        }
        else if (error.code === "ETIMEDOUT") {
            console.error("Connection to the database timed out.");
        }
        else if (error.code === "ER_ACCESS_DENIED_ERROR") {
            console.error("Access denied for the database user.");
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
    finally {
        if (connection)
            connection.release();
    }
}
// Fetch a single restaurant by ID
async function getRestaurantById(req, res) {
    const { id } = req.params;
    let connection;
    try {
        const pool = await (0, db_1.connectDB)();
        connection = await pool.getConnection();
        const [rows] = await connection.query("CALL getRestaurantById(?);", [id]);
        if (!rows || rows.length === 0) {
            res.status(404).json({ message: "Restaurant not found." });
            return;
        }
        res.status(200).json(rows[0]);
    }
    catch (error) {
        console.error("Error fetching restaurant:", error);
        if (error.code === "ER_CON_COUNT_ERROR") {
            console.error("Too many connections to the database.");
        }
        else if (error.code === "ECONNREFUSED") {
            console.error("Database connection was refused.");
        }
        else if (error.code === "ETIMEDOUT") {
            console.error("Connection to the database timed out.");
        }
        else if (error.code === "ER_ACCESS_DENIED_ERROR") {
            console.error("Access denied for the database user.");
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
    finally {
        if (connection)
            connection.release();
    }
}
