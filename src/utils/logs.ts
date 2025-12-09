import fs from "fs";
import path from "path";

export const guardarLogError = (informacion: string) => {
  const date = new Date();
  const dia = `0${date.getDate()}`.slice(-2);
  const mes = `0${date.getMonth() + 1}`.slice(-2);
  const file_name = `${dia}-${mes}-${date.getFullYear()}.log`;
  const data = `${dia}-${mes}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} - ${informacion}`;

  const logDir = path.join(process.cwd(), "logs", "errors");
  const filePath = path.join(logDir, file_name);

  // Verificar si la carpeta 'logs/error' existe, si no, crearla de forma recursiva
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  // Agregar contenido al archivo de log
  fs.appendFileSync(filePath, data + "\n");
};

export const guardarLogInfo = (informacion: string) => {
  const date = new Date();
  const dia = `0${date.getDate()}`.slice(-2);
  const mes = `0${date.getMonth() + 1}`.slice(-2);
  const file_name = `${dia}-${mes}-${date.getFullYear()}.log`;
  const data = `${dia}-${mes}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} - ${informacion}`;

  const logDir = path.join(process.cwd(), "logs", "info");
  const filePath = path.join(logDir, file_name);

  // Verificar si la carpeta 'logs/info' existe, si no, crearla de forma recursiva
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  // Agregar contenido al archivo de log
  fs.appendFileSync(filePath, data + "\n");
};