import { RowDataPacket } from "mysql2/promise";
import { connectToDB } from "../../config/db";
import { guardarLogError } from "../../utils/logs";
import { handleMysqlError } from "../../utils/errores";

export const getCatCampusService = async () => {
  try {
    const pool = await connectToDB();
    const [rows] = await pool.execute<RowDataPacket[]>(`
        SELECT
          *
        FROM
          xochicalco.cat_campus
      `);

    return rows;
  } catch (error: any) {
    guardarLogError("Error en getCatCampusService() v1:");
    return handleMysqlError(error);
  }
};

export const getCatRolesService = async () => {
  try {
    const pool = await connectToDB();
    const [rows] = await pool.execute<RowDataPacket[]>(`
        SELECT
          *
        FROM
          cat_roles
      `);

    return rows;
  } catch (error: any) {
    guardarLogError("Error en getCatRolesService() v1:");
    return handleMysqlError(error);
  }
};
