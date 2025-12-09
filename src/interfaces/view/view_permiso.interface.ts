export interface ViewPermiso {
  id_permiso: number;
  id_role: number;
  id_usuario_portal: number;
  quien_dio_permiso: number;
  nombre: string;
  apellidos: string;
  nombre_quien_dio_permiso: string;
  apellidos_quien_dio_permiso: string;
  nombre_role: string;
  role: string;
  descripcion_role: string;
  fecha_registro: string;
}
