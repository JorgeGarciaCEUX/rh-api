// src/config/db.config.ts
import mysql from "mysql2/promise";
import { guardarLogError } from "../utils/logs";

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
const dbConfig = {
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  charset: "utf8mb4",
  timezone: "-08:00", // Tijuana en horario estándar (UTC-8)
  connectionLimit: 10,
};

let pool: mysql.Pool | null = null;

export async function connectToDB(): Promise<mysql.Pool> {
  try {
    if (pool != null) {
      return pool;
    }

    pool = mysql.createPool(dbConfig);

    return pool;
  } catch (err: any) {
    guardarLogError("Error in MySQL connection pool: " + err.message);
    process.exit(1);
  }
}
