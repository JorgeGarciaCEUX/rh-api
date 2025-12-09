import { ViewPermiso } from "./view_permiso.interface";

export interface ViewUser {
  id: number;
  nombre: string;
  apellidos: string;
  correo: string;
  id_campus: number;
  campus: string;
  fecha_registro: Date;
  fecha_eliminacion?: Date | null;
  permisos: ViewPermiso[];
}
