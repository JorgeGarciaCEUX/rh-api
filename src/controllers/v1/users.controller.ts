import { Request, Response } from "express";

import { User } from "../../interfaces/models/user.interface";
import { sendMail } from "../../utils/send-mail";
import { platillaCorreoNuevoUsuario } from "../../templates/nuevo-usuario.template";
import {
  addUserService,
  deleteUserService,
  downloadManualService,
  editUserService,
  getUsersService,
  getPermisosService,
  updateUserRolesService,
} from "../../services/v1/users.service";
import { getCatCampusService, getCatRolesService } from "../../services/v1/catalogs.service";
import { formatMysqlErrorResponse } from "../../utils/errores";
import { guardarLogError } from "../../utils/logs";

export const getUsers = async (_: Request, res: Response) => {
  const users = await getUsersService();
  const cat_campus = await getCatCampusService();
  const cat_roles = await getCatRolesService();
  const permisos = await getPermisosService();

  if (typeof users === "string" || users === null) {
    res.json(formatMysqlErrorResponse(users));
    return;
  }

  if (typeof cat_campus === "string" || cat_campus === null) {
    res.json(formatMysqlErrorResponse(cat_campus));
    return;
  }

  if (typeof cat_roles === "string" || cat_roles === null) {
    res.json(formatMysqlErrorResponse(cat_roles));
    return;
  }

  res.json({
    result: "ok",
    tit: "ok",
    msg: "ok",
    data: { users, cat_campus, cat_roles, permisos },
  });
};

export const addUser = async (req: Request, res: Response) => {
  const usuario: User = req.body;

  const u = await addUserService(usuario);

  if (typeof u === "string" || u === null) {
    res.json(formatMysqlErrorResponse(u));
    return;
  }

  if (!u) {
    res.json({
      result: "error",
      tit: "No se pudo crear el usuario",
      msg: "Contacte con soporte",
    });
    return;
  }

  await sendMail("Ya tienes acceso al Portal RH", usuario.correo, platillaCorreoNuevoUsuario);

  res.json({
    result: "ok",
    tit: "Éxito",
    msg: "Usuario agregado",
  });
};

export const editUser = async (req: Request, res: Response) => {
  const usuario: User = req.body;
  const edit = await editUserService(usuario);

  if (typeof edit === "string" || edit === null) {
    res.json(formatMysqlErrorResponse(edit));
    return;
  }

  if (!edit) {
    res.json({
      result: "error",
      tit: "No se pudo actualizar el usuario",
      msg: "Contacte con soporte",
    });
    return;
  }

  res.json({
    result: "ok",
    tit: "Éxito",
    msg: "Usuario actualizado",
  });
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  const del = await deleteUserService(id);

  if (typeof del === "string" || del === null) {
    res.json(formatMysqlErrorResponse(del));
    return;
  }

  if (!del) {
    res.json({
      result: "error",
      tit: "No se pudo eliminar el usuario",
      msg: "Contacte con soporte",
    });
    return;
  }

  res.json({
    result: "ok",
    tit: "Éxito",
    msg: "Usuario eliminado",
  });
};

export const downloadManual = async (_: Request, res: Response) => {
  const manual = await downloadManualService();

  if (manual === null) {
    res.json({
      result: "error",
      tit: "No pudo recuperar el manual",
      msg: "Contacte con soporte",
    });
    return;
  }

  res.json({
    result: "ok",
    tit: "ok",
    msg: "ok",
    data: { manual },
  });
};

export const updateUserRoles = async (req: any, res: Response) => {
  try {
    const { id_usuario, role_ids } = req.body;
    const { id_usuario: quien_cambio } = req.user; // id del usuario que hizo el cambio

    // Llamar al service
    const update = await updateUserRolesService(id_usuario, role_ids, quien_cambio);

    if (update === null) {
      res.json({
        result: "error",
        tit: "Error al actualizar",
        msg: "No se pudieron actualizar los roles del usuario. Contacte con soporte",
      });
      return;
    }

    // Respuesta con información del cambio
    const responseMsg =
      typeof update === "object" && update.agregados !== undefined
        ? `Roles actualizados: ${update.agregados} agregados, ${update.eliminados} removidos`
        : "Roles del usuario actualizados correctamente";

    res.json({
      result: "ok",
      tit: "Éxito",
      msg: responseMsg,
      data: typeof update === "object" ? update : null,
    });
  } catch (error: any) {
    guardarLogError(`Error al actualizar roles del usuario ${req.body.id_usuario}: ${error.message}`);
    res.json({
      result: "error",
      tit: "Error interno",
      msg: "Ocurrió un error inesperado. Contacte con soporte",
    });
  }
};
