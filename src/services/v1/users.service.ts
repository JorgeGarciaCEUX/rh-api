import { ResultSetHeader, RowDataPacket } from "mysql2";
import { connectToDB } from "../../config/db";
import { guardarLogError } from "../../utils/logs";
import { trimExtraSpaces, upperTrimExtraSpaces } from "../../utils/textos";
import { User } from "../../interfaces/models/user.interface";
import { ViewUser } from "../../interfaces/view/view_user.interface";
import { handleMysqlError } from "../../utils/errores";
import path from "path";
import fs from "fs";

export const getPermisosService = async () => {
  try {
    const pool = await connectToDB();
    const [response] = await pool.execute<RowDataPacket[]>(`
      SELECT * FROM view_permisos
    `);

    return response;
  } catch (error: any) {
    guardarLogError(`Error en getPermisosService() v1: ${error.message}`);
    return null;
  }
};

export const getUsersService = async () => {
  try {
    const pool = await connectToDB();
    const [rows] = await pool.execute<RowDataPacket[]>(`
      SELECT
        *
      FROM
        view_users
    `);

    const users: ViewUser[] = rows as ViewUser[];
    return users;
  } catch (error: any) {
    guardarLogError("Error en getUsersService() v1:");
    return handleMysqlError(error);
  }
};

export const getUserWithCorreoService = async (correo: string) => {
  try {
    const pool = await connectToDB();
    const [response] = await pool.query<RowDataPacket[]>(
      `
      SELECT 
        *
      FROM
        view_users
      WHERE
        correo = ?
    `,
      [correo]
    );

    const user: ViewUser | string = response.length > 0 ? (response[0] as ViewUser) : "usuario-no-encontrado";
    return user;
  } catch (error: any) {
    guardarLogError(`Error en getUserWithCorreoService() v1:`);
    return handleMysqlError(error);
  }
};

export const addUserService = async (u: User) => {
  try {
    const pool = await connectToDB();
    const [res] = await pool.query<ResultSetHeader>(
      ` INSERT INTO users
            (nombre, apellidos, correo, id_campus)
        VALUES
            (?, ?, ?, ?)
      `,
      [
        upperTrimExtraSpaces(u.nombre),
        upperTrimExtraSpaces(u.apellidos),
        trimExtraSpaces(u.correo),
        u.id_campus,
      ]
    );

    return res.affectedRows > 0;
  } catch (error: any) {
    guardarLogError("Error en addUserService() v1:");
    return handleMysqlError(error);
  }
};

export const editUserService = async (u: User) => {
  try {
    const pool = await connectToDB();
    const [response] = await pool.query<ResultSetHeader>(
      `
      UPDATE users
      SET
        nombre = ?,
        apellidos = ?,
        correo = ?,
        id_campus = ?
      WHERE
        id = ?
    `,
      [
        upperTrimExtraSpaces(u.nombre),
        upperTrimExtraSpaces(u.apellidos),
        trimExtraSpaces(u.correo),
        u.id_campus,
        u.id,
      ]
    );

    return response.affectedRows > 0;
  } catch (error: any) {
    guardarLogError("Error en editUserService() v1:");
    return handleMysqlError(error);
  }
};

export const deleteUserService = async (id: string) => {
  try {
    const pool = await connectToDB();
    const [response] = await pool.query<ResultSetHeader>(
      `
        UPDATE
          users
        SET
          fecha_eliminacion = NOW()
        WHERE
          id = ?;
      `,
      [id]
    );

    return response.affectedRows > 0;
  } catch (error: any) {
    guardarLogError("Error en deleteUserService() v1:");
    return handleMysqlError(error);
  }
};

export const downloadManualService = async () => {
  try {
    // Resuelve la ruta absoluta si es relativa

    const raiz = path.join(process.cwd(), "public", "api");
    const absolutePath = path.resolve(raiz, "manual.pdf");

    // Verifica que el archivo exista (opcional, fs.readFile fallará igualmente si no existe)
    try {
      fs.accessSync(absolutePath);
    } catch (error) {
      guardarLogError("El archivo manual.pdf no existe o no es accesible:");
      return null;
    }

    // Lee el archivo y devuelve el Buffer
    return fs.readFileSync(absolutePath);
  } catch (error) {
    guardarLogError("Error en downloadManualService() v1:");
    return null;
  }
};

export const updateUserRolesService = async (id_usuario: number, roles: number[], quien_cambio: number) => {
  try {
    // Validaciones de entrada
    if (!id_usuario || !Array.isArray(roles) || !quien_cambio) {
      guardarLogError("Error en updateUserRolesService() v1: Parámetros inválidos");
      return null;
    }

    const pool = await connectToDB();

    // 1. Obtener permisos actuales del usuario (no eliminados)
    const [permisosActuales] = await pool.query<RowDataPacket[]>(
      `SELECT id_permiso, id_role FROM permisos 
       WHERE id_usuario_portal = ? AND fecha_eliminacion IS NULL`,
      [id_usuario]
    );

    const rolesActuales = permisosActuales.map((permiso: any) => permiso.id_role);

    // 2. Calcular diferencias
    const rolesAAgregar = roles.filter((roleId) => !rolesActuales.includes(roleId));
    const permisosAEliminar = permisosActuales.filter((permiso: any) => !roles.includes(permiso.id_role));

    // 3. Si no hay cambios, retornar éxito
    if (rolesAAgregar.length === 0 && permisosAEliminar.length === 0) {
      return true;
    }

    // 4. Iniciar transacción para consistencia
    await pool.query("START TRANSACTION");

    try {
      // 5. Agregar nuevos roles en una sola consulta si hay varios
      if (rolesAAgregar.length > 0) {
        const valores = rolesAAgregar.map(roleId => `(${pool.escape(id_usuario)}, ${pool.escape(roleId)}, ${pool.escape(quien_cambio)})`).join(',');
        await pool.query<ResultSetHeader>(
          `INSERT INTO permisos (id_usuario_portal, id_role, quien_dio_permiso) VALUES ${valores}`
        );
      }

      // 6. Marcar como eliminados los roles removidos en una sola consulta si hay varios
      if (permisosAEliminar.length > 0) {
        const idsPermisosAEliminar = permisosAEliminar.map((permiso: any) => permiso.id_permiso);
        await pool.query<ResultSetHeader>(
          `UPDATE permisos 
           SET fecha_eliminacion = NOW() 
           WHERE id_permiso IN (${idsPermisosAEliminar.map(() => '?').join(',')})`,
          idsPermisosAEliminar
        );
      }

      // 7. Confirmar transacción
      await pool.query("COMMIT");

      return {
        success: true,
        agregados: rolesAAgregar.length,
        eliminados: permisosAEliminar.length,
      };
    } catch (transactionError: any) {
      // Rollback en caso de error
      try {
        await pool.query("ROLLBACK");
      } catch (rollbackError: any) {
        guardarLogError(`Error en ROLLBACK updateUserRolesService() v1: ${rollbackError.message}`);
      }
      throw transactionError;
    }
  } catch (error: any) {
    guardarLogError(`Error en updateUserRolesService() v1: ${error.message}`);
    return null;
  }
};
