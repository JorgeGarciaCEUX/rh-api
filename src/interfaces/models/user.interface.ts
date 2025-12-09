export interface User {
  id: number;
  nombre: string;
  apellidos: string;
  correo: string;
  id_campus: number;

  fecha_registro?: Date | null;
  fecha_eliminacion?: Date | null;
}
