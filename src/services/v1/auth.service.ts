import admin from "firebase-admin";
import { guardarLogError } from "../../utils/logs";
import { connectToDB } from "../../config/db";
import { RowDataPacket } from "mysql2";

export const getCorreoFirebase = async (uid: string) => {
  try {
    const userRecord = await admin.auth().getUser(uid);
    const userEmail = userRecord.email;
    return userEmail;
  } catch (error: any) {
    const message = error.message as string;
    guardarLogError("Error en getCorreoFirebase() v1: " + message);
    return null;
  }
};

export const getPermisosUsuarioService = async (id: number) => {
  try {
    const pool = await connectToDB();
    const [response] = await pool.query<RowDataPacket[]>(
      `
      SELECT
        *
      FROM
        view_permisos
      WHERE
        id_usuario_portal = ? 
      `,
      [id]
    );
    return response;
  } catch (error: any) {
    guardarLogError("Error en getPermisosUsuarioService() v1: " + error.message);
    return null;
  }
};
