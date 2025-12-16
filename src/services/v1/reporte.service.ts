import { InfoNominalDocente } from "../../interfaces/models/infoNominalDocente.interface";
import { obtenerFechaActual } from "../../utils/fechas";
import { guardarLogError } from "../../utils/logs";
let excel4node = require("excel4node");

export const getReporteNominaDocenteService = async (reporte: InfoNominalDocente) => {

    if (!reporte) {
      throw new Error("No se proporcionó el reporte de nómina docente.");
    }

    var wb = new excel4node.Workbook();

    var options = {
      sheetView: {
        showGridLines: false,
      },
    };

    var styleTitulo = wb.createStyle({
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
        fgColor: "#ffffff",
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

    var encabezadosReporte = [
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
        width: 10,
        style: styleTituloDocente,
      },
      {
        nombre: "RFC",
        width: 10,
        style: styleTituloDocente,
      },
      {
        nombre: "GRADO",
        width: 15,
        style: styleTituloDocente,
      },
      {
        nombre: "CORREO ELECTRÓNICO",
        width: 10,
        style: styleTituloDocente,
      },
      {
        nombre: "DOMICILIO PARTICULAR DOCENTE (Calle, No., Colonia)",
        width: 20,
        style: styleTituloDocente,
      },
      {
        nombre: "CIUDAD O POBLACIÓN",
        width: 10,
        style: styleTituloDocente,
      },
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
      },
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
      },
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
    
    const { codigo_empleado, apellidos, nombre } = reporte.info_personal;
    const { anio, periodo, campus } = reporte.periodo_consulta

    try {
        var ws = wb.addWorksheet(`Reporte Nómina Docente - ${codigo_empleado}`, options);
        let startRow = 7;
        ws.cell(2, 1, 5, 12, true)
        .string(
            `
            PLANTILLA DOCENTES
            NOMBRE DE LA ESCUELA: ${reporte.info_academica[0].carrera}
            PERIODO: ${periodo.substring(1)}
            CICLO: ${anio} - ${periodo.charAt(0)}
        `
        )
        .style(styleTitulo);

        //encabezados
        encabezadosReporte.forEach((element, index) => {
        ws.cell(startRow, index + 1)
            .string(element.nombre)
            .style(element.style);
        ws.column(index + 1).setWidth(element.width);
        });

        startRow++;

        //datos
        ws.cell(startRow, 1).string(`${reporte.info_personal.codigo_empleado}`).style(styleDatos);
        ws.cell(startRow, 2).string(`${reporte.info_personal.apellidos} ${reporte.info_personal.nombre}`).style(styleDatos);
        ws.cell(startRow, 3).string(`${reporte.info_personal.curp}`).style(styleDatos);
        ws.cell(startRow, 4).string(`${reporte.info_personal.rfc}`).style(styleDatos);
        ws.cell(startRow, 5).string(`${reporte.info_personal.grado || ''}`).style(styleDatos);
        ws.cell(startRow, 6).string(`${reporte.info_personal.correo}`).style(styleDatos);
        ws.cell(startRow, 7).string(`${reporte.info_personal.direccion || ''}`).style(styleDatos);
        ws.cell(startRow, 8).string(`${reporte.info_personal.ciudad}`).style(styleDatos);
        ws.cell(startRow, 9).number(reporte.info_descriptiva.anios_experiencia_docente_materia).style(styleDatos);
        console.log(reporte.info_descriptiva.perfil_marca_carta);
        ws.cell(startRow, 10).string(reporte.info_descriptiva.perfil_marca_carta).style(styleDatos);
        ws.cell(startRow, 11).number(reporte.info_descriptiva.anios_experiencia_marca_carta).style(styleDatos);
        ws.cell(startRow, 12).string(reporte.info_descriptiva.estatuto).style(styleDatos);
        ws.cell(startRow, 13).number(reporte.info_descriptiva.sueldo_por_dia).style(styleDatos);
        reporte.info_academica.forEach((materia, indexMateria) => {
            const filaActual = startRow + indexMateria;
            ws.cell(filaActual, 14).string(materia.nombre_materia).style(styleDatos);
            ws.cell(filaActual, 15).string(materia.carrera).style(styleDatos);
            ws.cell(filaActual, 16).date(new Date(materia.periodo_inicial)).style(styleDatos);
            ws.cell(filaActual, 17).date(new Date(materia.periodo_final)).style(styleDatos);
            ws.cell(filaActual, 18).number(materia.total_horas_programa).style(styleDatos);
            ws.cell(filaActual, 19).number(materia.total_semanas_efectivas).style(styleDatos);
            ws.cell(filaActual, 20).number(materia.horas_por_semana).style(styleDatos);
            ws.cell(filaActual, 21).number(materia.total_horas_programa).style(styleDatos);
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

        });

    } catch (error: any) {
        guardarLogError("Error al generar el reporte de nómina docente " + error.message);
        return `Error al generar el reporte de nómina docente: ${error.message}`;
    }
    //Creación de archivo
    let buffer_xlsx = await wb.writeToBuffer();

    return buffer_xlsx;
}