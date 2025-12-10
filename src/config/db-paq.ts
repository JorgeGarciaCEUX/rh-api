// src/config/db.config.ts
import sql, { ConnectionPool } from "mssql";
import { guardarLogError } from "../utils/logs";

const { DB_USER_NOMIPAQ, DB_PASSWORD_NOMIPAQ, DB_HOST_NOMIPAQ, DB_NAME_NOMIPAQ, DB_PORT_NOMIPAQ } = process.env;

const dbSettings = {
  user: DB_USER_NOMIPAQ, // Usuario de la base de datos
  password: DB_PASSWORD_NOMIPAQ, // Contraseña
  server: DB_HOST_NOMIPAQ || "localhost", // Dirección del servidor (puede ser una IP o nombre de host)
  database: DB_NAME_NOMIPAQ, // Nombre de la base de datos
  port: Number(DB_PORT_NOMIPAQ),
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
export async function getConnectionNomipaq(): Promise<ConnectionPool | null> {
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
