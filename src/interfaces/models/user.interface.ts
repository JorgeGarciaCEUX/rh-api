export interface User {
  id_usuario: number;
  nombre: string;
  apellidos: string;
  correo: string;
  id_campus: number;

  fecha_registro?: Date | null;
  fecha_eliminacion?: Date | null;
}
