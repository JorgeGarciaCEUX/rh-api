/**
 * Interface que representa la información personal del docente fusionada
 * desde las dos fuentes de datos: PWC y NomiPaq
 */
export interface InfoPersonalDocenteMerged {
  // === IDENTIFICADORES ===
  id_empleado: number; // Solo NomiPaq
  codigo: string; // Solo PWC
  codigo_empleado: string; // Solo NomiPaq //1
  
  // === INFORMACIÓN PERSONAL (Mergeados) ===
  apellidos: string; // Mergeado: PWC.apellidos || NomiPaq.apellidos
  nombre: string; // Mergeado: PWC.nombre || NomiPaq.nombre
  nombre_completo: string; // Calculado: apellidos + nombre //2
  curp: string; // Mergeado: PWC.curp || NomiPaq.curp //3
  
  // === CONTACTO (Mergeados) ===
  correo: string; // Mergeado: PWC.correo || NomiPaq.correo //6
  
  // === DIRECCIÓN (Mergeados) ===
  direccion: string | null; // Mergeado: PWC.direccion || NomiPaq.direccion //7
  ciudad: string; // Mergeado: PWC.ciudad || NomiPaq.ciudad //8
  
  // === SOLO DE PWC ===
  PersonId: number | null; // Solo PWC
  matricula: string | null; // Solo PWC
  cumpleanos: string | null; // Solo PWC
  prefijo: string | null; // Solo PWC (Importante para cálculo de estatuto)
  
  // === SOLO DE NOMIPAQ ===
  rfc: string | null; // Solo NomiPaq //4
  
  // === INPUT MANUAL ===
  // TODO: VERIFICAR PROCESO DE ESTE CAMPO
  grado: string | null; // Se ingresa manualmente //5
  
  // === METADATA ===
  fuente_principal: 'PWC' | 'NOMIPAQ' | 'AMBAS'; // Indica de dónde se obtuvo la info
  fecha_merge: Date; // Timestamp de cuando se hizo el merge
}
