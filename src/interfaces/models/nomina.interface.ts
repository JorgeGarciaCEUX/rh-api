export interface InfoPersonalDocentePWC {
    PersonId: number;
    matricula: string;
    codigo: string;
    apellidos: string;
    nombre: string;
    curp: string;
    correo: string;
    cumpleanos: string;
    direccion: string;
    ciudad: string;
    prefijo: string;
}

export interface InfoAcademicaDocentePWC {
    codigo: string;
    event_id: string;
    anio: string;
    periodo: string; //15 TODO: PROCESAR EN API DESPUES
    campus: string;
    grupo: string;
    nombre_materia: string; //14
    periodo_inicial: Date; //16
    periodo_final: Date; //17
    total_horas_programa: number; //18
    total_semanas_efectivas: number; //19
    horas_por_semana: number; //20 //21 RENOMBRADO COMO TOTAL_DE_HORAS
    
    // Propiedades necesarias para el cálculo de grupo de carrera
    tipo: string; // Tipo de programa (PREP, LIC, etc.)
    carrera: string; // Nombre de la carrera
    nivel_clase: string; // Nivel de la clase (ej: 1CUA, 6N, 3SEM) - usado para determinar grupo en Medicina
    lunes_entrada: string | null; //22
    lunes_salida: string | null; //23
    lunes_total: number; //24
    martes_entrada: string | null; //25
    martes_salida: string | null; //26
    martes_total: number; //27
    miercoles_entrada: string | null; //28
    miercoles_salida: string | null; //29
    miercoles_total: number; //30
    jueves_entrada: string | null; //31
    jueves_salida: string | null; //32
    jueves_total: number; //33
    viernes_entrada: string | null; //34
    viernes_salida: string | null; //35
    viernes_total: number; //36
}

export interface InfoDocenteNomipaq {
    id_empleado: number;
    codigo_empleado: string;
    apellidos: string;
    nombre: string;
    curp: string;
    rfc: string;
    correo: string;
    direccion: string;
    ciudad: string;
}
