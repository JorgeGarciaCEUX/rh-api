import { InfoNominalDocente } from "../../interfaces/models/infoNominalDocente.interface";
import { ReporteCompletoPlantilla } from "../../interfaces/models/ReporteCompletoPlantilla.interface";
import { guardarLogError } from "../../utils/logs";
let excel4node = require("excel4node");

/**
 * Interface para definir el periodo de una quincena
 */
interface Quincena {
  nombre: string;
  fechaInicio: Date;
  fechaFin: Date;
  dias: number;
}

/**
 * Convierte un número de columna a su nombre en Excel (A, B, C, ..., AA, AB, etc.)
 * @param columnNumber - Número de columna (1-indexed)
 * @returns Nombre de columna en formato Excel
 */
const getExcelColumnName = (columnNumber: number): string => {
  let columnName = '';
  while (columnNumber > 0) {
    const remainder = (columnNumber - 1) % 26;
    columnName = String.fromCharCode(65 + remainder) + columnName;
    columnNumber = Math.floor((columnNumber - 1) / 26);
  }
  return columnName;
};

/**
 * Genera las quincenas entre dos fechas
 * @param fechaInicio - Fecha de inicio del periodo
 * @param fechaFin - Fecha de fin del periodo
 * @returns Array de quincenas con sus fechas y días
 */
const generarQuincenas = (fechaInicio: Date, fechaFin: Date): Quincena[] => {
  const quincenas: Quincena[] = [];
  
  // Trabajar con las fechas originales, sin normalizar al mes completo
  let fechaActual = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth(), 1);
  const fechaLimite = new Date(fechaFin.getFullYear(), fechaFin.getMonth(), fechaFin.getDate());
  
  while (fechaActual <= fechaLimite) {
    const anio = fechaActual.getFullYear();
    const mes = fechaActual.getMonth();
    
    // Primera quincena (1-15)
    const inicioQuincena1 = new Date(anio, mes, 1);
    const finQuincena1 = new Date(anio, mes, 15);
    
    // Solo agregar si la quincena se solapa con el rango [fechaInicio, fechaFin]
    if (finQuincena1 >= fechaInicio && inicioQuincena1 <= fechaLimite) {
      const diasQuincena1 = 15;
      const nombreMes = inicioQuincena1.toLocaleDateString('es-MX', { month: 'long' }).toUpperCase();
      quincenas.push({
        nombre: `${nombreMes} 1-15`,
        fechaInicio: inicioQuincena1,
        fechaFin: finQuincena1,
        dias: diasQuincena1
      });
    }
    
    // Segunda quincena (16-fin de mes)
    const ultimoDiaMes = new Date(anio, mes + 1, 0).getDate();
    const inicioQuincena2 = new Date(anio, mes, 16);
    const finQuincena2 = new Date(anio, mes, ultimoDiaMes);
    
    // Solo agregar si la quincena se solapa con el rango [fechaInicio, fechaFin]
    if (finQuincena2 >= fechaInicio && inicioQuincena2 <= fechaLimite) {
      const diasQuincena2 = ultimoDiaMes - 15;
      const nombreMes = inicioQuincena2.toLocaleDateString('es-MX', { month: 'long' }).toUpperCase();
      quincenas.push({
        nombre: `${nombreMes} 16-${ultimoDiaMes}`,
        fechaInicio: inicioQuincena2,
        fechaFin: finQuincena2,
        dias: diasQuincena2
      });
    }
    
    // Avanzar al siguiente mes
    fechaActual = new Date(anio, mes + 1, 1);
  }
  
  return quincenas;
};

export const getReporteNominaDocenteService = async (reporteCompleto: ReporteCompletoPlantilla) => {

    if (!reporteCompleto || !reporteCompleto.registros || reporteCompleto.registros.length === 0) {
      throw new Error("No se proporcionó el reporte de nómina docente o no contiene registros.");
    }

    var wb = new excel4node.Workbook();

    var options = {
      sheetView: {
        showGridLines: false,
      },
    };

    var styleTitulo = wb.createStyle({
      alignment: {
        horizontal: ["left"],
        vertical: ["bottom"],
        wrapText: true,
      },
      font: {
        color: "#000000",
        size: 12,
        bold: true,
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        fgColor: "#FFFFFF",
      },
    });

    var styleTituloNomina = wb.createStyle({
      alignment: {
        horizontal: ["center"],
        vertical: ["center"],
        wrapText: true,
      },
      font: {
        color: "#000000",
        size: 8,
        bold: true,
      },
      border: {
        left: {
          style: "thin",
          color: "#000000",
        },
        right: {
          style: "thin",
          color: "#000000",
        },
        top: {
          style: "thin",
          color: "#000000",
        },
        bottom: {
          style: "thin",
          color: "#000000",
        },
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        fgColor: "#b9e7a7",
      },
    });

    var styleTituloQuincena = wb.createStyle({
      alignment: {
        horizontal: ["center"],
        vertical: ["center"],
        wrapText: true,
      },
      font: {
        color: "#000000",
        size: 8,
        bold: true,
      },
      border: {
        left: {
          style: "thin",
          color: "#000000",
        },
        right: {
          style: "thin",
          color: "#000000",
        },
        top: {
          style: "thin",
          color: "#000000",
        },
        bottom: {
          style: "thin",
          color: "#000000",
        },
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        fgColor: "#d4b5f7",
      },
    });

    var styleTituloDocente = wb.createStyle({
      alignment: {
        horizontal: ["center"],
        vertical: ["center"],
        wrapText: true,
      },
      font: {
        color: "#000000",
        size: 8,
        bold: true,
      },
      border: {
        left: {
          style: "thin",
          color: "#000000",
        },
        right: {
          style: "thin",
          color: "#000000",
        },
        top: {
          style: "thin",
          color: "#000000",
        },
        bottom: {
          style: "thin",
          color: "#000000",
        },
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        fgColor: "#89aac7",
      },
    });

    var styleTituloCartaDescriptiva = wb.createStyle({
      alignment: {
        horizontal: ["center"],
        vertical: ["center"],
        wrapText: true,
      },
      font: {
        color: "#000000",
        size: 8,
        bold: true,
      },
      border: {
        left: {
          style: "thin",
          color: "#000000",
        },
        right: {
          style: "thin",
          color: "#000000",
        },
        top: {
          style: "thin",
          color: "#000000",
        },
        bottom: {
          style: "thin",
          color: "#000000",
        },
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        fgColor: "#72ba72",
      },
    });

    var styleTituloAcademico = wb.createStyle({
      alignment: {
        horizontal: ["center"],
        vertical: ["center"],
        wrapText: true,
      },
      font: {
        color: "#000000",
        size: 8,
        bold: true,
      },
      border: {
        left: {
          style: "thin",
          color: "#000000",
        },
        right: {
          style: "thin",
          color: "#000000",
        },
        top: {
          style: "thin",
          color: "#000000",
        },
        bottom: {
          style: "thin",
          color: "#000000",
        },
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        fgColor: "#f5a65f",
      },
    });

    var styleTituloHorario = wb.createStyle({
      alignment: {
        horizontal: ["center"],
        vertical: ["center"],
        wrapText: true,
      },
      font: {
        color: "#000000",
        size: 8,
        bold: true,
      },
      border: {
        left: {
          style: "thin",
          color: "#000000",
        },
        right: {
          style: "thin",
          color: "#000000",
        },
        top: {
          style: "thin",
          color: "#000000",
        },
        bottom: {
          style: "thin",
          color: "#000000",
        },
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        fgColor: "#e3c3a8",
      },
    });

    var styleDatos = wb.createStyle({
      alignment: {
        horizontal: ["right"],
        vertical: ["center"],
        wrapText: true,
      },
      font: {
        color: "#000000",
        size: 8,
      },
      border: {
        left: {
          style: "thin",
          color: "#000000",
        },
        right: {
          style: "thin",
          color: "#000000",
        },
        top: {
          style: "thin",
          color: "#000000",
        },
        bottom: {
          style: "thin",
          color: "#000000",
        },
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        fgColor: "#FFFFFF",
      },
    });

    var styleDatosNumeroContabilidad = wb.createStyle({
      alignment: {
        horizontal: ["right"],
        vertical: ["center"],
        wrapText: true,
      },
      font: {
        color: "#000000",
        size: 8,
      },
      border: {
        left: {
          style: "thin",
          color: "#000000",
        },
        right: {
          style: "thin",
          color: "#000000",
        },
        top: {
          style: "thin",
          color: "#000000",
        },
        bottom: {
          style: "thin",
          color: "#000000",
        },
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        fgColor: "#FFFFFF",
      },
      numberFormat: "$#,##0.00",
    });

    var styleDatosNumeroMillares = wb.createStyle({
      alignment: {
        horizontal: ["right"],
        vertical: ["center"],
        wrapText: true,
      },
      font: {
        color: "#000000",
        size: 8,
      },
      border: {
        left: {
          style: "thin",
          color: "#000000",
        },
        right: {
          style: "thin",
          color: "#000000",
        },
        top: {
          style: "thin",
          color: "#000000",
        },
        bottom: {
          style: "thin",
          color: "#000000",
        },
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        fgColor: "#FFFFFF",
      },
      numberFormat: "#,##0.00",
    });

    var encabezadosReporteDocente = [
      {
        nombre: "CÓDIGO EMPLEADO",
        width: 10,
        style: styleTituloDocente,
      },
      {
        nombre: "CATEDRATICO (Apellido Paterno, Materno, Nombre/s",
        width: 20,
        style: styleTituloDocente,
      },
      {
        nombre: "CURP",
        width: 15,
        style: styleTituloDocente,
      },
      {
        nombre: "RFC",
        width: 15,
        style: styleTituloDocente,
      },
      {
        nombre: "GRADO",
        width: 20,
        style: styleTituloDocente,
      },
      {
        nombre: "CORREO ELECTRÓNICO",
        width: 20,
        style: styleTituloDocente,
      },
      {
        nombre: "DOMICILIO PARTICULAR DOCENTE (Calle, No., Colonia)",
        width: 25,
        style: styleTituloDocente,
      },
      {
        nombre: "CIUDAD O POBLACIÓN",
        width: 15,
        style: styleTituloDocente,
      }
    ];

    var encabezadosReporteDescriptiva = [
      {
        nombre: "AÑOS DE EXPERIENCIA DEL DOCENTE EN LA MATERIA A IMPARTIR",
        width: 15,
        style: styleTituloCartaDescriptiva,
      },
      {
        nombre: "PERFIL QUE MARCA LA CARTA DESCRIPTIVA",
        width: 20,
        style: styleTituloCartaDescriptiva,
      },
      {
        nombre: "AÑOS DE EXPERIENCIA QUE MARCA LA CARTA DESCRIPTIVA",
        width: 15,
        style: styleTituloCartaDescriptiva,
      }
    ];

    var encabezadosReporteAcademico = [
      {
        nombre: "CAT (Estatuto)",
        width: 10,
        style: styleTituloAcademico,
      },
      {
        nombre: "-",
        width: 10,
        style: styleTituloAcademico,
      },
      {
        nombre: "MATERIA (MATERIAS DE PLAN DE ESTUDIOS)",
        width: 20,
        style: styleTituloAcademico,
      },
      {
        nombre: "CUAT",
        width: 10,
        style: styleTituloAcademico,
      },
      {
        nombre: "PERIODO INICIAL",
        width: 10,
        style: styleTituloAcademico,
      },
      {
        nombre: "PERIODO FINAL",
        width: 10,
        style: styleTituloAcademico,
      },
      {
        nombre: "TOTAL DE HORAS PROGRAMA",
        width: 10,
        style: styleTituloAcademico,
      },
      {
        nombre: "TOTAL SEMANAS EFECTIVAS DE CLASE",
        width: 10,
        style: styleTituloAcademico,
      },
      {
        nombre: "HORAS POR SEMANA (PLAN)",
        width: 10,
        style: styleTituloAcademico,
      },
      {
        nombre: "TOTAL DE HORAS",
        width: 10,
        style: styleTituloAcademico,
      }
    ];

    var encabezadosReporteHorario = [
      {
        nombre: "LUNES ENTRADA",
        width: 10,
        style: styleTituloHorario,
      },
      {        
        nombre: "LUNES SALIDA",
        width: 10,
        style: styleTituloHorario,
      },
      {
        nombre: "LUNES TOTAL",
        width: 10,
        style: styleTituloHorario,
      },
      {
        nombre: "MARTES ENTRADA",
        width: 10,
        style: styleTituloHorario,
      },
      {
        nombre: "MARTES SALIDA",
        width: 10,
        style: styleTituloHorario,
      },
      {
        nombre: "MARTES TOTAL",
        width: 10,
        style: styleTituloHorario,
      },
      {
        nombre: "MIERCOLES ENTRADA",
        width: 10,
        style: styleTituloHorario,
      },
      {
        nombre: "MIERCOLES SALIDA",
        width: 10,
        style: styleTituloHorario,
      },
      {
        nombre: "MIERCOLES TOTAL",
        width: 10,
        style: styleTituloHorario,
      },
      {
        nombre: "JUEVES ENTRADA",
        width: 10,
        style: styleTituloHorario,
      },
      {
        nombre: "JUEVES SALIDA",
        width: 10,
        style: styleTituloHorario,
      },
      {
        nombre: "JUEVES TOTAL",
        width: 10,
        style: styleTituloHorario,
      },
      {
        nombre: "VIERNES ENTRADA",
        width: 10,
        style: styleTituloHorario,
      },
      {
        nombre: "VIERNES SALIDA",
        width: 10,
        style: styleTituloHorario,
      },
      {
        nombre: "VIERNES TOTAL",
        width: 10,
        style: styleTituloHorario,
      }
    ];

    var encabezadosReporteNomina = [
      {
        nombre: "TOTAL HORAS DEL DOCENTE",
        width: 15,
        style: styleTituloDocente,
      },
      {        
        nombre: "COSTO X HORA",
        width: 15,
        style: styleTituloDocente,
      },
      {
        nombre: "TOTAL MATERIAS",
        width: 15,
        style: styleTituloDocente,
      },
      {
        nombre: "DIAS PERIODO",
        width: 15,
        style: styleTituloDocente,
      },
      {
        nombre: "COSTO X DIA",
        width: 15,
        style: styleTituloDocente,
      }
    ];

    var encabezadosReporteTotales = [
      {
        nombre: "TOTAL DIAS",
        width: 15,
        style: styleTituloNomina,
      },
      {
        nombre: "COMPROBACION DIAS",
        width: 15,
        style: styleTituloNomina,
      },
      {
        nombre: "PAGO TOTAL",
        width: 15,
        style: styleTituloNomina,
      },
      {
        nombre: "COMPROBACION PAGO TOTAL",
        width: 20,
        style: styleTituloNomina,
      }
    ];
    
    const { anio, periodo, campus } = reporteCompleto.periodo_consulta;

    try {
        var ws = wb.addWorksheet(`${campus} ${anio} ${periodo}`, options);
        let startRow = 7;

        ws.cell(2, 1, 2, 4, true).string("PLANTILLA DOCENTES").style(styleTitulo);
        ws.cell(3, 1, 3, 4, true).string(`CAMPUS: ${campus}`).style(styleTitulo);
        ws.cell(4, 1, 4, 4, true).string(`PERIODO: ${periodo.substring(1)}`).style(styleTitulo);
        ws.cell(5, 1, 5, 4, true).string(`CICLO: ${anio} - ${periodo.charAt(0)}`).style(styleTitulo);

        //Encabezado de la sección de datos del docente
        
        //Primer renglon que contiene los encabezados
        ws.cell(startRow, 1, startRow, encabezadosReporteDocente.length, true).string("DATOS DEL DOCENTE").style(styleTituloDocente);
        ws.cell(startRow, encabezadosReporteDocente.length + 1, startRow, encabezadosReporteDocente.length + encabezadosReporteDescriptiva.length, true).string("CARTA DESCRIPTIVA").style(styleTituloCartaDescriptiva);
        ws.cell(startRow, encabezadosReporteDocente.length + encabezadosReporteDescriptiva.length + 1, startRow, encabezadosReporteDocente.length + encabezadosReporteDescriptiva.length + encabezadosReporteAcademico.length + encabezadosReporteHorario.length, true).string("INFORMACIÓN PROPORCIONADA POR LA ESCUELA").style(styleTituloAcademico);
        ws.cell(startRow, encabezadosReporteDocente.length + encabezadosReporteDescriptiva.length + encabezadosReporteAcademico.length + encabezadosReporteHorario.length + 1, startRow, encabezadosReporteDocente.length + encabezadosReporteDescriptiva.length + encabezadosReporteAcademico.length + encabezadosReporteHorario.length + encabezadosReporteNomina.length, true).string("CALCULOS DE NOMINA").style(styleTituloNomina);

        startRow++;

        //Encabezados individuales

        //Datos del docente (Rows seran de 2 renglones)
        encabezadosReporteDocente.forEach((element, index) => {
            ws.cell(startRow, index + 1, startRow + 1, index + 1, true)
                .string(element.nombre)
                .style(element.style);
            ws.column(index + 1).setWidth(element.width);
        });

        //Datos de la carta descriptiva (Rows seran de 2 renglones)
        let offsetEncabezados = encabezadosReporteDocente.length;

        encabezadosReporteDescriptiva.forEach((element, index) => {
            ws.cell(startRow, offsetEncabezados + index + 1, startRow + 1, offsetEncabezados + index + 1, true)
                .string(element.nombre)
                .style(element.style);
            ws.column(offsetEncabezados + index + 1).setWidth(element.width);
        });

        //Datos académicos (Rows seran de 1 renglon)
        offsetEncabezados += encabezadosReporteDescriptiva.length;

        // Para el caso de academicos, primero se pinta el primer renglon vacio
        ws.cell(startRow, offsetEncabezados + 1, startRow, offsetEncabezados + encabezadosReporteAcademico.length, true).string("").style(styleTituloAcademico);

        startRow ++;
        // Despues se pintan los demas encabezados, pero por el renglon vacio, se empieza en el siguiente renglon y solo sera de 1 renglon
        encabezadosReporteAcademico.forEach((element, index) => {
            ws.cell(startRow, offsetEncabezados + index + 1)
                .string(element.nombre)
                .style(element.style);
            ws.column(offsetEncabezados + index + 1).setWidth(element.width);
        });

        //regresar al renglon del primer encabezado de academicos
        startRow--;

        //Horario (Rows seran de 1 renglon, para tener 1 de header para el dia (Lunes, Martes, etc) y otro renglon para entrada, salida, total)
        offsetEncabezados += encabezadosReporteAcademico.length;

        // Primero se pinta el primer renglon con el header de Lunes, Martes, etc (cada uno con length de 3 columnas)
        let diasSemana = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES"];
        diasSemana.forEach((dia, index) => {
            ws.cell(startRow, offsetEncabezados + index * 3 + 1, startRow, offsetEncabezados + index * 3 + 3, true)
                .string(dia)
                .style(styleTituloHorario);
        });

        //Despues se pintan los demas encabezados, pero por el renglon de dias, se empieza en el siguiente renglon y solo sera de 1 renglon
        startRow++;

        encabezadosReporteHorario.forEach((element, index) => {
            ws.cell(startRow, offsetEncabezados + index + 1)
                .string(element.nombre)
                .style(element.style);
            ws.column(offsetEncabezados + index + 1).setWidth(element.width);
        });

        //Reiniciar de nuevo al renglon del primer encabezado
        startRow--;

        //Encaboezados de cálculos de nómina (Rows seran de 2 renglones)
        offsetEncabezados += encabezadosReporteHorario.length;

        encabezadosReporteNomina.forEach((element, index) => {
            ws.cell(startRow, offsetEncabezados + index + 1, startRow + 1, offsetEncabezados + index + 1, true)
                .string(element.nombre)
                .style(element.style);
            ws.column(offsetEncabezados + index + 1).setWidth(element.width);
        });

        //Reiniciar de nuevo al renglon del primer encabezado
        startRow--;

        // Generar encabezados de quincenas basados en las fechas de los registros
        // 1. Encontrar las fechas más tempranas y más tardías
        let fechaMasTempranaMs = Infinity;
        let fechaMasTardiaMs = -Infinity;

        reporteCompleto.registros.forEach((registro: InfoNominalDocente) => {
            const fechaInicio = new Date(registro.info_academica.periodo_inicial).getTime();
            const fechaFin = new Date(registro.info_academica.periodo_final).getTime();
            
            if (fechaInicio < fechaMasTempranaMs) {
                fechaMasTempranaMs = fechaInicio;
            }
            if (fechaFin > fechaMasTardiaMs) {
                fechaMasTardiaMs = fechaFin;
            }
        });

        const fechaMasTemprana = new Date(fechaMasTempranaMs);
        const fechaMasTardia = new Date(fechaMasTardiaMs);

        // 2. Generar las quincenas
        const quincenas = generarQuincenas(fechaMasTemprana, fechaMasTardia);

        // 3. Agregar encabezados de quincenas
        offsetEncabezados += encabezadosReporteNomina.length;

        // Encabezados de quincenas (cada quincena tiene 6 columnas)
        const columnasQuincena = [
            { nombre: "DIAS LABORADOS", width: 12 },
            { nombre: "SUBTOTAL QUINCENA", width: 15 },
            { nombre: "HORAS FALTA", width: 12 },
            { nombre: "DESCUENTO FALTAS", width: 15 },
            { nombre: "TOTAL QUINCENA", width: 15 },
            { nombre: "TOTAL Q. POR DOCENTE", width: 18 }
        ];

        quincenas.forEach((quincena, indexQuincena) => {
            const colInicio = offsetEncabezados + indexQuincena * columnasQuincena.length + 1;
            const colFin = colInicio + columnasQuincena.length - 1;

            // Header de la quincena (primer renglón)
            ws.cell(startRow, colInicio, startRow, colFin, true)
                .string(quincena.nombre)
                .style(styleTituloQuincena);

            // Subheaders de cada columna (segundo y tercer renglón)
            columnasQuincena.forEach((columna, indexColumna) => {
                ws.cell(startRow + 1, colInicio + indexColumna, startRow + 2, colInicio + indexColumna, true)
                    .string(columna.nombre)
                    .style(styleTituloQuincena);
                ws.column(colInicio + indexColumna).setWidth(columna.width);
            });
        });

        // Agregar encabezados de totales después de las quincenas
        offsetEncabezados += quincenas.length * columnasQuincena.length;

        // Agregar una columna de separación vacía
        offsetEncabezados += 1;
        offsetEncabezados += 1;

        // Agregar primero un agrupador de totales de 1 de alto para los totales
        ws.cell(startRow, offsetEncabezados, startRow, offsetEncabezados + encabezadosReporteTotales.length - 1, true)
            .string("TOTALES")
            .style(styleTituloNomina);

        startRow++;

        // Agregar los 4 encabezados de totales (2 filas de alto para coincidir con las quincenas)
        encabezadosReporteTotales.forEach((element, index) => {
            ws.cell(startRow, offsetEncabezados + index, startRow + 1, offsetEncabezados + index, true)
                .string(element.nombre)
                .style(element.style);
            ws.column(offsetEncabezados + index).setWidth(element.width);
        });

        startRow++;
        startRow++;

        // Iterar sobre todos los registros del reporte (un registro = un docente con una materia)
        reporteCompleto.registros.forEach((registro: InfoNominalDocente, indexRegistro: number) => {
            const filaActual = startRow;
            
            // Datos del docente
            ws.cell(filaActual, 1).string(`${registro.info_personal.codigo_empleado}`).style(styleDatos);
            ws.cell(filaActual, 2).string(`${registro.info_personal.apellidos} ${registro.info_personal.nombre}`).style(styleDatos);
            ws.cell(filaActual, 3).string(`${registro.info_personal.curp}`).style(styleDatos);
            ws.cell(filaActual, 4).string(`${registro.info_personal.rfc}`).style(styleDatos);
            ws.cell(filaActual, 5).string(`${registro.info_personal.grado || ''}`).style(styleDatos);
            ws.cell(filaActual, 6).string(`${registro.info_personal.correo}`).style(styleDatos);
            ws.cell(filaActual, 7).string(`${registro.info_personal.direccion || ''}`).style(styleDatos);
            ws.cell(filaActual, 8).string(`${registro.info_personal.ciudad}`).style(styleDatos);
            
            // Datos de la carta descriptiva
            ws.cell(filaActual, 9).number(registro.info_descriptiva.anios_experiencia_docente_materia).style(styleDatos);
            ws.cell(filaActual, 10).string(registro.info_descriptiva.perfil_marca_carta).style(styleDatos);
            ws.cell(filaActual, 11).number(registro.info_descriptiva.anios_experiencia_marca_carta).style(styleDatos);
            ws.cell(filaActual, 12).string(registro.info_descriptiva.estatuto).style(styleDatos);
            ws.cell(filaActual, 13).number(registro.info_descriptiva.sueldo_por_dia).style(styleDatos);
            
            // Datos académicos (ahora es un objeto único, no un array)
            const materia = registro.info_academica;
            ws.cell(filaActual, 14).string(materia.nombre_materia).style(styleDatos);
            ws.cell(filaActual, 15).string(materia.periodo.charAt(0)).style(styleDatos);
            ws.cell(filaActual, 16).date(new Date(materia.periodo_inicial)).style(styleDatos);
            ws.cell(filaActual, 17).date(new Date(materia.periodo_final)).style(styleDatos);
            ws.cell(filaActual, 18).number(materia.total_horas_programa).style(styleDatos);
            ws.cell(filaActual, 19).number(materia.total_semanas_efectivas).style(styleDatos);
            ws.cell(filaActual, 20).number(materia.horas_por_semana).style(styleDatos);
            ws.cell(filaActual, 21).number(materia.total_horas_programa).style(styleDatos);
            
            // Horarios
            ws.cell(filaActual, 22).string(materia.lunes_entrada || '').style(styleDatos);
            ws.cell(filaActual, 23).string(materia.lunes_salida || '').style(styleDatos);
            ws.cell(filaActual, 24).number(materia.lunes_total).style(styleDatos);
            ws.cell(filaActual, 25).string(materia.martes_entrada || '').style(styleDatos);
            ws.cell(filaActual, 26).string(materia.martes_salida || '').style(styleDatos);
            ws.cell(filaActual, 27).number(materia.martes_total).style(styleDatos);
            ws.cell(filaActual, 28).string(materia.miercoles_entrada || '').style(styleDatos);
            ws.cell(filaActual, 29).string(materia.miercoles_salida || '').style(styleDatos);
            ws.cell(filaActual, 30).number(materia.miercoles_total).style(styleDatos);
            ws.cell(filaActual, 31).string(materia.jueves_entrada || '').style(styleDatos);
            ws.cell(filaActual, 32).string(materia.jueves_salida || '').style(styleDatos);
            ws.cell(filaActual, 33).number(materia.jueves_total).style(styleDatos);
            ws.cell(filaActual, 34).string(materia.viernes_entrada || '').style(styleDatos);
            ws.cell(filaActual, 35).string(materia.viernes_salida || '').style(styleDatos);
            ws.cell(filaActual, 36).number(materia.viernes_total).style(styleDatos);
            
            // Cálculos de nómina
            // Total de horas del docente (ahora es solo el total de la única materia)
            ws.cell(filaActual, 37).number(materia.total_horas_programa).style(styleDatos);
            
            // Costo x hora (Obtener de columna M)
            ws.cell(filaActual, 38).formula(`=+M${filaActual}`).style(styleDatos);
            
            // Total Materias (Multiplicar Total de horas del docente * Costo x hora)
            ws.cell(filaActual, 39).formula(`=+AK${filaActual}*AL${filaActual}`).style(styleDatosNumeroContabilidad);
            
            // Dias periodo (Obtener la diferencia entre fecha de inicio y fin del periodo)
            ws.cell(filaActual, 40).formula(`=+Q${filaActual}-P${filaActual}+1`).style(styleDatos);
            
            // Costo x dia (Dividir Total materias / Dias periodo)
            ws.cell(filaActual, 41).formula(`=+AM${filaActual}/AN${filaActual}`).style(styleDatosNumeroMillares);
            
            // Datos de quincenas
            let colQuincena = 42; // Columna después de los cálculos de nómina
            
            // Array para almacenar las columnas de días laborados y subtotales
            const columnasDiasLaborados: string[] = [];
            const columnasSubtotalQuincena: string[] = [];
            
            quincenas.forEach((quincena) => {
                const fechaInicioMateria = new Date(materia.periodo_inicial);
                const fechaFinMateria = new Date(materia.periodo_final);
                
                // Calcular la intersección entre el periodo de la materia y la quincena
                const fechaInicioInterseccion = new Date(Math.max(fechaInicioMateria.getTime(), quincena.fechaInicio.getTime()));
                const fechaFinInterseccion = new Date(Math.min(fechaFinMateria.getTime(), quincena.fechaFin.getTime()));
                
                let diasLaborados = 0;
                
                // Si hay intersección entre la materia y la quincena
                if (fechaInicioInterseccion <= fechaFinInterseccion) {
                    // Calcular días laborados (diferencia de días + 1)
                    diasLaborados = Math.floor((fechaFinInterseccion.getTime() - fechaInicioInterseccion.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                }
                
                // DIAS LABORADOS
                ws.cell(filaActual, colQuincena).number(diasLaborados).style(styleDatos);
                columnasDiasLaborados.push(getExcelColumnName(colQuincena));
                
                // SUBTOTAL QUINCENA (COSTO X DIA * Dias Laborados)
                // COSTO X DIA está en la columna AO (columna 41)
                const colDiasLaborados = getExcelColumnName(colQuincena);
                ws.cell(filaActual, colQuincena + 1).formula(`=+AO${filaActual}*${colDiasLaborados}${filaActual}`).style(styleDatosNumeroContabilidad);
                columnasSubtotalQuincena.push(getExcelColumnName(colQuincena + 1));
                
                // HORAS FALTA (Input manual del usuario)
                ws.cell(filaActual, colQuincena + 2).number(0).style(styleDatos);
                
                // DESCUENTO FALTAS (COSTO X HORA * Horas Falta)
                // COSTO X HORA está en la columna AL (columna 38)
                const colHorasFalta = getExcelColumnName(colQuincena + 2);
                ws.cell(filaActual, colQuincena + 3).formula(`=+AL${filaActual}*${colHorasFalta}${filaActual}`).style(styleDatosNumeroContabilidad);
                
                // TOTAL QUINCENA (Subtotal Quincena - Descuento Faltas)
                const colSubtotalQuincena = getExcelColumnName(colQuincena + 1);
                const colDescuentoFaltas = getExcelColumnName(colQuincena + 3);
                ws.cell(filaActual, colQuincena + 4).formula(`=+${colSubtotalQuincena}${filaActual}-${colDescuentoFaltas}${filaActual}`).style(styleDatosNumeroContabilidad);
                
                // TOTAL Q. POR DOCENTE (Input manual del usuario)
                ws.cell(filaActual, colQuincena + 5).number(0).style(styleDatosNumeroContabilidad);
                
                colQuincena += 6; // Avanzar a la siguiente quincena (6 columnas)
            });
            
            // Agregar columnas de totales después de las quincenas
            // Saltar una columna de separación
            colQuincena += 1;
            
            // TOTAL DIAS (Suma de todos los días laborados)
            const formulaTotalDias = columnasDiasLaborados.map(col => `${col}${filaActual}`).join('+');
            ws.cell(filaActual, colQuincena).formula(`=+${formulaTotalDias}`).style(styleDatos);
            
            // COMPROBACION DIAS (DIAS PERIODO - TOTAL DIAS)
            // DIAS PERIODO está en la columna AN (columna 40)
            const colTotalDias = getExcelColumnName(colQuincena);
            ws.cell(filaActual, colQuincena + 1).formula(`=+AN${filaActual}-${colTotalDias}${filaActual}`).style(styleDatos);
            
            // PAGO TOTAL (Suma de todos los subtotales de quincena)
            const formulaPagoTotal = columnasSubtotalQuincena.map(col => `${col}${filaActual}`).join('+');
            ws.cell(filaActual, colQuincena + 2).formula(`=+${formulaPagoTotal}`).style(styleDatosNumeroContabilidad);
            
            // COMPROBACION PAGO TOTAL (TOTAL MATERIAS - PAGO TOTAL)
            // TOTAL MATERIAS está en la columna AM (columna 39)
            const colPagoTotal = getExcelColumnName(colQuincena + 2);
            ws.cell(filaActual, colQuincena + 3).formula(`=+AM${filaActual}-${colPagoTotal}${filaActual}`).style(styleDatosNumeroContabilidad);
            
            // Actualizar startRow para el siguiente registro
            startRow++;
        });

    } catch (error: any) {
        guardarLogError("Error al generar el reporte de nómina docente " + error.message);
        return `Error al generar el reporte de nómina docente: ${error.message}`;
    }
    //Creación de archivo
    let buffer_xlsx = await wb.writeToBuffer();

    return buffer_xlsx;
}