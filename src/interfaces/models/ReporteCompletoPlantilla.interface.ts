import { InfoNominalDocente } from "./infoNominalDocente.interface";

/**
 * Interface que representa el reporte completo de nómina de una plantilla docente
 * Contiene múltiples registros (uno por materia de cada docente)
 */
export interface ReporteCompletoPlantilla {
  // Parámetros globales del reporte (se lockean al inicio)
  periodo_consulta: {
    anio: string;
    periodo: '1SEMESTRE' | '2SEMESTRE' | '1CUATRIMES' | '2CUATRIMES' | '3CUATRIMES';
    campus: 'ENSENADA' | 'TIJUANA' | 'MEXICALI' | 'VIRTUAL';
  };
  
  // Array de registros individuales (uno por materia de cada docente)
  registros: InfoNominalDocente[];
  
  // Metadata del reporte
  fecha_generacion: Date;
  generado_por: string; // Usuario que generó el reporte
}
