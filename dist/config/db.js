"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const promise_1 = require("mysql2/promise");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let pool;
const connectDB = async () => {
    if (!pool) {
        try {
            console.log("Initializing connection pool...");
            console.log("Creating MySQL connection pool...");
            if (!process.env.DB_SSL_CA) {
                throw new Error("DB_SSL_CA environment variable is not set or empty.");
            }
            else {
                console.log("DB_SSL_CA is loaded.");
            }
            // Correct MySQL connection with SSL
            pool = await (0, promise_1.createPool)({
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                host: process.env.DB_HOST,
                port: Number(process.env.DB_PORT),
                database: process.env.DB_NAME,
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0,
                connectTimeout: 60000,
                ssl: {
                    rejectUnauthorized: false, // Bypass SSL validation for self-signed cert
                    ca: process.env.DB_SSL_CA?.replace(/\\n/g, "\n"), // Correctly formatted certificate
                },
            });
            console.log("MySQL connection pool created successfully.");
        }
        catch (error) {
            console.error("Error during MySQL pool initialization:", error.message);
            throw error; // Rethrow the error to be caught by the caller
        }
    }
    else {
        console.log("Reusing existing MySQL connection pool.");
    }
    console.log("Returning MySQL connection pool.");
    return pool;
};
exports.connectDB = connectDB;
