// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../interfaces/api_response";
import { guardarLogError } from "../utils/logs";

const secretKey = process.env.JWT_SECRET || "jwt";

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const response: ApiResponse = {
      result: "unauthorized",
      tit: "Token no encontrado",
      msg: "Debe proporcionar un token de autorización.",
    };
    res.status(401).json(response);
    return; // Aseguramos que finalice aquí
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secretKey) as { [key: string]: unknown }; // Tipo del token decodificado
    (req as any).user = decoded;

    next(); // Si el token es válido, pasa al siguiente middleware
  } catch (error) {
    guardarLogError(`Error en authMiddleware(): ${error}`);
    const response: ApiResponse = {
      result: "error",
      tit: "Token inválido",
      msg: "El token proporcionado no es válido o ha expirado.",
    };
    res.status(401).json(response);
  }
};
