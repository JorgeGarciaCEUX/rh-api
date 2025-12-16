/**
 * Interface que representa la información descriptiva académica del docente
 * Incluye experiencia, estatuto y salario
 */
export interface InfoDescriptivaDocente {
  // Experiencia del docente
  anios_experiencia_docente_materia: number; // Input manual del usuario //9
  
  // Información de la carta descriptiva
  perfil_marca_carta: string; // Input manual: descripción del perfil requerido //10
  anios_experiencia_marca_carta: number; // Input manual: años que requiere la carta //11
  
  // Categorización y salario
  estatuto: 'A' | 'B' | 'C' | 'D'; // Calculado automáticamente basado en prefijo y experiencia //12
  sueldo_por_dia: number; // Calculado pero editable manualmente //13
  
  // Metadata
  fecha_calculo: Date; // Timestamp del último cálculo
  es_calculo_manual: boolean; // Si el usuario editó manualmente el sueldo
}
