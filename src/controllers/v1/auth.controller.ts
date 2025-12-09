import { Response } from "express";
import jwt from "jsonwebtoken";
import { getCorreoFirebase, getPermisosUsuarioService } from "../../services/v1/auth.service";
import { guardarLogError, guardarLogInfo } from "../../utils/logs";
import { getUserWithCorreoService } from "../../services/v1/users.service";
import { formatMysqlErrorResponse } from "../../utils/errores";

const { JWT_SECRET } = process.env;

export const login = async (req: any, res: Response) => {
  const { authuid } = req.headers;

  try {
    const correo = await getCorreoFirebase(authuid);
    if (correo === null || correo === undefined) {
      guardarLogError("Correo no recuperado por uid: " + authuid);
      res.json({
        result: "error",
        tit: "No se logro validar el correo",
        msg: "Contacte con soporte",
      });
      return;
    }

    const usuario = await getUserWithCorreoService(correo);

    if (typeof usuario === "string" || usuario === null) {
      res.json(formatMysqlErrorResponse(usuario));
      return;
    }

    const permisos = await getPermisosUsuarioService(usuario.id);

    if (permisos === null) {
      guardarLogError("No se encontraron permisos para el usuario id: " + usuario.id);
      res.json({
        result: "error",
        tit: "No se encontraron permisos para el usuario",
        msg: "Contacte con soporte",
      });
      return;
    }

    const { nombre, apellidos, id, campus, id_campus } = usuario;
    const token = jwt.sign(
      {
        id,
        nombre,
        apellidos,
        correo,
        id_campus,
        campus,
        permisos: permisos,
      },
      JWT_SECRET || "jwt",
      {
        expiresIn: "12h",
      }
    );

    const correo_user = usuario.correo;
    guardarLogInfo(`El correo ${correo_user} ha iniciado sesión`);
    res.json({
      result: "ok",
      tit: "¡ÉXITO!",
      msg: "Sesión iniciada",
      data: { token },
    });
  } catch (error: any) {
    const message = (error.message as string) ?? "";
    guardarLogError("Error en login() v1: " + message);
    res.json({
      result: "error",
      tit: "Ocurrió un error en el servidor",
      msg: "Contacte con soporte",
    });
  }
};
