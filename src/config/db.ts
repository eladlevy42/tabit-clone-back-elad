import { createPool, Pool } from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

let pool: Pool;

export const connectDB = async (): Promise<Pool> => {
  if (!pool) {
    try {
      console.log("Initializing connection pool...");

      console.log("Creating MySQL connection pool...");

      if (!process.env.DB_SSL_CA) {
        throw new Error("DB_SSL_CA environment variable is not set or empty.");
      } else {
        console.log("DB_SSL_CA is loaded.");
      }

      // Correct MySQL connection with SSL
      pool = await createPool({
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
    } catch (error: any) {
      console.error("Error during MySQL pool initialization:", error.message);
      throw error; // Rethrow the error to be caught by the caller
    }
  } else {
    console.log("Reusing existing MySQL connection pool.");
  }

  console.log("Returning MySQL connection pool.");
  return pool;
};
