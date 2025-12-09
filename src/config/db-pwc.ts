// src/config/db.config.ts
import sql, { ConnectionPool } from "mssql";
import { guardarLogError } from "../utils/logs";

const { DB_USER_PWC, DB_PASSWORD_PWC, DB_HOST_PWC, DB_NAME_PWC } = process.env;

const dbSettings = {
  user: DB_USER_PWC, // Usuario de la base de datos
  password: DB_PASSWORD_PWC, // Contraseña
  server: DB_HOST_PWC || "localhost", // Dirección del servidor (puede ser una IP o nombre de host)
  database: DB_NAME_PWC, // Nombre de la base de datos
  requestTimeout: 30000,
  options: {
    encrypt: false, // Requiere encriptación en Azure SQL
    trustServerCertificate: true, // Para evitar problemas con certificados en desarrollo
  },
  pool: {
    max: 20, // Número máximo de conexiones en el pool
    min: 0, // Número mínimo de conexiones en el pool
    idleTimeoutMillis: 30000, // Tiempo de inactividad antes de cerrar la conexión (30 segundos)
  },
};

// Crear un pool de conexiones
const pool = new sql.ConnectionPool(dbSettings);

// Conectar al pool
pool
  .connect()
  .then(() => {
    console.log("Conexión al pool PWC establecida");
  })
  .catch((err) => {
    guardarLogError("Error al conectar al pool: " + err.message);
  });

// Función para obtener una conexión del pool
export async function getConnectionPowerCampusV2(): Promise<ConnectionPool | null> {
  try {
    // Verificar si el pool ya está conectado
    if (pool.connected) {
      return pool;
    } else {
      // Si no está conectado, intentar reconectar
      await pool.connect();
      return pool;
    }
  } catch (error: any) {
    guardarLogError("Error en conexión con PWC: " + error.message);
    return null;
  }
}
