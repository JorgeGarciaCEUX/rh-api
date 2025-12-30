import { InfoNominalDocente } from "../../interfaces/models/infoNominalDocente.interface";
import { ReporteCompletoPlantilla } from "../../interfaces/models/ReporteCompletoPlantilla.interface";
import { guardarLogError } from "../../utils/logs";
let excel4node = require("excel4node");

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
      fill: {
        type: "pattern",
        patternType: "solid",
        fgColor: "#b9e7a7",
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