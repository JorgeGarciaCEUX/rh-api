import { ApiResponse } from "../interfaces/api_response";
import { guardarLogError } from "./logs";

export const handleMysqlError = (e: any) => {
  guardarLogError(`code: ${e.code}`);
  guardarLogError(`errno: ${e.errno}`);
  guardarLogError(`message: ${e.message}`);
  guardarLogError(`sql: ${e.sql}`);
  guardarLogError(`sqlState: ${e.sqlState}`);
  guardarLogError(`sqlMessage: ${e.sqlMessage}`);

  if (e.code === "ECONNREFUSED") return "no-conexion";
  if (e.code === "ER_DUP_ENTRY") return "duplicado";
  if (e.code === "ER_ACCESS_DENIED_ERROR") return "acceso-denegado";
  if (e.code === "ER_BAD_DB_ERROR") return "base-datos-no-existe";
  if (e.code === "PROTOCOL_CONNECTION_LOST") return "conexion-perdida";
  if (e.code === "ER_PARSE_ERROR") return "error-sintaxis";
  if (e.code === "ER_NO_SUCH_TABLE") return "tabla-no-encontrada";
  if (e.code === "ER_ROW_IS_REFERENCED_2" || e.code === "ER_NO_REFERENCED_ROW_2") return "error-llave-foranea";
  if (e.code === "ER_DATA_TOO_LONG") return "dato-demasiado-largo";
  if (e.code === "ER_TRUNCATED_WRONG_VALUE_FOR_FIELD") return "valor-truncado";
  if (e.code === "ER_LOCK_WAIT_TIMEOUT") return "tiempo-espera-bloqueo";

  return e.message || "error-desconocido";
};

export const formatMysqlErrorResponse = (errorType: string | null): ApiResponse => {
  switch (errorType) {
    case "usuario-no-encontrado":
      return {
        result: "error",
        tit: "Usuario no encontrado",
        msg: "No tiene acceso a esta plataforma.",
      };
    case "no-conexion":
      return {
        result: "error",
        tit: "No se pudo establecer conexión con la base de datos",
        msg: "Por favor, verifique la conexión de red o contacte con soporte.",
      };

    case "duplicado":
      return {
        result: "error",
        tit: "Registro duplicado",
        msg: "El registro ya existe. Intente con valores únicos.",
      };

    case "acceso-denegado":
      return {
        result: "error",
        tit: "Acceso denegado",
        msg: "Las credenciales no son válidas. Contacte con soporte.",
      };

    case "base-datos-no-existe":
      return {
        result: "error",
        tit: "Base de datos no encontrada",
        msg: "La base de datos especificada no existe.",
      };

    case "conexion-perdida":
      return {
        result: "error",
        tit: "Conexión con la base de datos perdida",
        msg: "La conexión se interrumpió. Intente nuevamente.",
      };

    case "error-sintaxis":
      return {
        result: "error",
        tit: "Error de sintaxis SQL",
        msg: "La consulta contiene errores de sintaxis.",
      };

    case "tabla-no-encontrada":
      return {
        result: "error",
        tit: "Tabla no encontrada",
        msg: "La tabla especificada no existe en la base de datos.",
      };

    case "error-llave-foranea":
      return {
        result: "error",
        tit: "Restricción de llave foránea",
        msg: "Existen datos relacionados que impiden esta operación.",
      };

    case "dato-demasiado-largo":
      return {
        result: "error",
        tit: "Dato demasiado largo",
        msg: "Un campo excede el tamaño permitido.",
      };

    case "valor-truncado":
      return {
        result: "error",
        tit: "Valor truncado",
        msg: "El valor proporcionado no es válido para el campo.",
      };

    case "tiempo-espera-bloqueo":
      return {
        result: "error",
        tit: "Tiempo de espera de bloqueo excedido",
        msg: "La operación tardó demasiado en completarse.",
      };

    default:
      return {
        result: "error",
        tit: `Error: ${errorType}`,
        msg: "Ocurrió un error inesperado. Contacte con soporte.",
      };
  }
};
