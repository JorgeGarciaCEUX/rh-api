import { InfoDescriptivaDocente } from "./infoDescriptivaDocente.interface";
import { InfoPersonalDocenteMerged } from "./infoPersonalDocenteMerged.interface";
import { InfoAcademicaDocentePWC } from "./nomina.interface";

/**
 * Interface principal que representa el reporte completo de nómina docente
 * Combina información personal, académica y descriptiva
 */
export interface InfoNominalDocente {
  // Información personal fusionada
  info_personal: InfoPersonalDocenteMerged;
  
  // Información descriptiva (carta, estatuto, sueldo)
  info_descriptiva: InfoDescriptivaDocente;
  
  // Información académica (materias, horarios, eventos)
  info_academica: InfoAcademicaDocentePWC[];
  
  // Parámetros de consulta
  periodo_consulta: {
    anio: string;
    periodo: '1SEMESTRE' | '2SEMESTRE' | '1CUATRIMES' | '2CUATRIMES' | '3CUATRIMES';
    campus: 'ENSENADA' | 'TIJUANA' | 'MEXICALI' | 'VIRTUAL';
  };
  
  // Totales calculados
  totales: {
    total_horas_semana: number; // Suma de todas las materias
    total_materias: number; // Cantidad de materias
    total_semanas_efectivas: number; // Promedio o total de semanas
    total_horas_periodo: number; // Total de horas en el periodo
    monto_total_estimado: number; // Cálculo final del pago
  };
  
  // Metadata
  fecha_generacion: Date;
  generado_por: string; // Usuario que generó el reporte
  status: 'BORRADOR' | 'VALIDADO' | 'APROBADO' | 'EXPORTADO';
}
