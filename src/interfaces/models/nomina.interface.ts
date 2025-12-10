export interface InfoPersonalDocentePWC {
    PersonId: number;
    matricula: string;
    codigo: string;
    apellidos: string;
    nombre: string;
    curp: string;
    correo: string;
    codigo_tipo_correo: string;
    tipo_correo: string;
    cumpleanos: string;
    tipo_domicilio: string;
    direccion_completa: string;
    numero: string;
    codigo_postal: string;
    ciudad: string;
    estado: string;
    cat_estatuto: string;
}

export interface InfoAcademicaDocentePWC {
    codigo: string;
    event_id: string;
    anio: string;
    periodo: string;
    campus: string;
    sections: string;
    nombre_materia: string;
    periodo_inicial: Date;
    periodo_final: Date;
    total_horas_programa: number;
    total_semanas_efectivas: number;
    horas_por_semana: number;
    lunes_entrada: string | null;
    lunes_salida: string | null;
    lunes_total: number;
    martes_entrada: string | null;
    martes_salida: string | null;
    martes_total: number;
    miercoles_entrada: string | null;
    miercoles_salida: string | null;
    miercoles_total: number;
    jueves_entrada: string | null;
    jueves_salida: string | null;
    jueves_total: number;
    viernes_entrada: string | null;
    viernes_salida: string | null;
    viernes_total: number;
}

export interface InfoDocenteNomipaq {
    idempleado: number;
    codigoempleado: string;
    apellidos: string;
    nombre: string;
    curp: string;
    rfc: string;
    correo: string;
    direccion: string;
    ciudad: string;
}
