import { ConnectionPool } from "mssql";
import { handleMysqlError } from "../../utils/errores";
import { guardarLogError } from "../../utils/logs";
import { getConnectionPowerCampusV2 } from "../../config/db-pwc";
import { InfoPersonalDocentePWC, InfoAcademicaDocentePWC, InfoDocenteNomipaq } from "../../interfaces/models/nomina.interface";
import { getConnectionNomipaq } from "../../config/db-paq";


export const getInfoPersonalDocentePWCService = async (search_term: string): Promise<InfoPersonalDocentePWC[] | string | null> => {
    let pwcConnection: ConnectionPool | null = null;
    try {
        pwcConnection = await getConnectionPowerCampusV2();
        if (pwcConnection === null) {
            throw new Error("No se pudo establecer la conexión con PowerCampus.");
        }

        const result_info_personal = await pwcConnection.request().query(`
            WITH ACADEMIC_INFO AS (
                SELECT DISTINCT
                    p.PersonId,
                    p.PEOPLE_ID as matricula,
                    p.PEOPLE_CODE_ID as codigo,
                    UPPER(RTRIM(CONCAT(p.FIRST_NAME, ' ', p.MIDDLE_NAME)))  as nombre,
                    UPPER(RTRIM(CONCAT(p.LAST_NAME, ' ', p.Last_Name_Prefix))) as apellidos,
                    p.GOVERNMENT_ID AS curp,
                    CONVERT(varchar, p.BIRTH_DATE, 23) cumpleanos,
                    ea.Email as correo,
                    ea.EmailType as codigo_tipo_correo,
                    ce.LONG_DESC as tipo_correo,
                    a.ADDRESS_TYPE tipo_domicilio,
                    RTRIM(
                        COALESCE(NULLIF(a.ADDRESS_LINE_1, ''), '') + ' ' + 
                        COALESCE(NULLIF(a.ADDRESS_LINE_2, ''), '') + ' ' + 
                        COALESCE(NULLIF(a.ADDRESS_LINE_3, ''), '') + ' ' + 
                        COALESCE(NULLIF(a.ADDRESS_LINE_4, ''), '')
                    ) AS direccion_completa,
                    a.HOUSE_NUMBER as numero,
                    a.STATE as estado,
                    UPPER(a.CITY ) as ciudad,
                    a.ZIP_CODE as codigo_postal,
                    p.PREFIX as prefijo
                FROM 
                    PEOPLE AS p
                    LEFT JOIN EmailAddress as ea ON p.PEOPLE_ID = ea.PeopleOrgId 
                    INNER JOIN CODE_EMAILTYPE as ce ON ce.CODE_VALUE = ea.EmailType AND ea.EmailType = 'PERSONAL'
                    LEFT JOIN ADDRESSSCHEDULE as a ON p.PEOPLE_ID = a.PEOPLE_ORG_ID AND a.ADDRESS_TYPE = 'CASA'
                    OUTER APPLY (
                        SELECT TOP 1 
                            s.EVENT_ID, 
                            s.CREATE_DATE
                        FROM SECTIONPER s
                        WHERE s.PERSON_CODE_ID = p.PEOPLE_CODE_ID 
                        ORDER BY s.CREATE_DATE DESC
                    ) sp
            )
            SELECT DISTINCT
            PersonId,
            matricula,
            codigo,
            apellidos,
            nombre,
            curp,
            correo,
            codigo_tipo_correo,
            tipo_correo,
            cumpleanos,
            tipo_domicilio,
            direccion_completa,
            numero,
            codigo_postal,
            ciudad,
            estado,
            cat_estatuto
            FROM 
            ACADEMIC_INFO
            WHERE 
            ( nombre LIKE '%' + '${search_term}' + '%' OR apellidos LIKE '%' + '${search_term}' + '%')
            ORDER BY apellidos, nombre
      `);

        const info_docente = result_info_personal.recordset;

        console.log("Información personal del docente desde PWC:", info_docente);

        if (!info_docente) {
            throw new Error("No se pudo obtener la información personal del docente desde PWC.");
        }

        return info_docente as InfoPersonalDocentePWC[];
    } catch (error: any) {
        guardarLogError("Error en getInfoPersonalDocentePWCService() v1:");
        return handleMysqlError(error);
    }
};

export const getInfoAcademicaDocentePWCService = async (codigo: string, anio: string, periodo: string, campus: string): Promise<InfoAcademicaDocentePWC[] | string | null> => {
    let pwcConnection: ConnectionPool | null = null;
    try {
        pwcConnection = await getConnectionPowerCampusV2();
        if (pwcConnection === null) {
            throw new Error("No se pudo establecer la conexión con PowerCampus.");
        }

        const result_info_academica = await pwcConnection.request().query(`
            WITH 
            CALENDAR_PIVOT AS (
                SELECT 
                    EVENT_ID,
                    -- 1. Redondeo del cálculo de horas semanales
                    CAST(ROUND(SUM(DATEDIFF(MINUTE, START_TIME, END_TIME) / 60.0), 0) AS INT) AS HORAS_SEMANALES_CALC,
                    -- LUNES
                    MAX(CASE WHEN [DAY] LIKE 'LUNE%' THEN FORMAT(START_TIME, 'HH:mm') END) AS LUNES_ENTRADA,
                    MAX(CASE WHEN [DAY] LIKE 'LUNE%' THEN FORMAT(END_TIME, 'HH:mm') END) AS LUNES_SALIDA,
                    -- 2. Redondeo del total Lunes
                    CAST(ROUND(SUM(CASE WHEN [DAY] LIKE 'LUNE%' THEN DATEDIFF(MINUTE, START_TIME, END_TIME) / 60.0 ELSE 0 END), 0) AS INT) AS LUNES_TOTAL,
                    -- MARTES
                    MAX(CASE WHEN [DAY] LIKE 'MART%' THEN FORMAT(START_TIME, 'HH:mm') END) AS MARTES_ENTRADA,
                    MAX(CASE WHEN [DAY] LIKE 'MART%' THEN FORMAT(END_TIME, 'HH:mm') END) AS MARTES_SALIDA,
                    -- 3. Redondeo del total Martes
                    CAST(ROUND(SUM(CASE WHEN [DAY] LIKE 'MART%' THEN DATEDIFF(MINUTE, START_TIME, END_TIME) / 60.0 ELSE 0 END), 0) AS INT) AS MARTES_TOTAL,
                    -- MIERCOLES
                    MAX(CASE WHEN [DAY] LIKE 'MIER%' THEN FORMAT(START_TIME, 'HH:mm') END) AS MIERCOLES_ENTRADA,
                    MAX(CASE WHEN [DAY] LIKE 'MIER%' THEN FORMAT(END_TIME, 'HH:mm') END) AS MIERCOLES_SALIDA,
                    -- 4. Redondeo del total Miercoles
                    CAST(ROUND(SUM(CASE WHEN [DAY] LIKE 'MIER%' THEN DATEDIFF(MINUTE, START_TIME, END_TIME) / 60.0 ELSE 0 END), 0) AS INT) AS MIERCOLES_TOTAL,
                    -- JUEVES
                    MAX(CASE WHEN [DAY] LIKE 'JUEV%' THEN FORMAT(START_TIME, 'HH:mm') END) AS JUEVES_ENTRADA,
                    MAX(CASE WHEN [DAY] LIKE 'JUEV%' THEN FORMAT(END_TIME, 'HH:mm') END) AS JUEVES_SALIDA,
                    -- 5. Redondeo del total Jueves
                    CAST(ROUND(SUM(CASE WHEN [DAY] LIKE 'JUEV%' THEN DATEDIFF(MINUTE, START_TIME, END_TIME) / 60.0 ELSE 0 END), 0) AS INT) AS JUEVES_TOTAL,
                    -- VIERNES
                    MAX(CASE WHEN [DAY] LIKE 'VIER%' THEN FORMAT(START_TIME, 'HH:mm') END) AS VIERNES_ENTRADA,
                    MAX(CASE WHEN [DAY] LIKE 'VIER%' THEN FORMAT(END_TIME, 'HH:mm') END) AS VIERNES_SALIDA,
                    -- 6. Redondeo del total Viernes
                    CAST(ROUND(SUM(CASE WHEN [DAY] LIKE 'VIER%' THEN DATEDIFF(MINUTE, START_TIME, END_TIME) / 60.0 ELSE 0 END), 0) AS INT) AS VIERNES_TOTAL
                FROM Campus.dbo.CALENDARDETAIL
                GROUP BY EVENT_ID
            ),
            SCHEDULE_INFO AS (
                SELECT DISTINCT
                    sp.PERSON_CODE_ID as codigo,
                    sp.EVENT_ID as event_id,
                    sp.ACADEMIC_YEAR as anio,
                    sp.ACADEMIC_TERM as periodo,
                    sp.ACADEMIC_SESSION as campus,
                    sp.SECTION as sections,
                    se.EVENT_LONG_NAME as nombre_materia,
                    se.START_DATE as periodo_inicial,
                    se.END_DATE as periodo_final,
                    -- COLUMNAS CALCULADAS --
                    -- Total Semanas Efectivas (Diferencia en semanas entre inicio y fin)
                    DATEDIFF(WEEK, se.START_DATE, se.END_DATE) AS total_semanas_efectivas,
                    -- Horas Por Semana (Plan) y Total de horas
                    ISNULL(cp.HORAS_SEMANALES_CALC, 0) AS horas_por_semana,
                    -- Total Horas Programa (Semanas * Horas Semanales)
                    (DATEDIFF(WEEK, se.START_DATE, se.END_DATE) * ISNULL(cp.HORAS_SEMANALES_CALC, 0)) AS total_horas_programa,
                    -- COLUMNAS DE HORARIO DIARIO --
                    cp.LUNES_ENTRADA, cp.LUNES_SALIDA, cp.LUNES_TOTAL,
                    cp.MARTES_ENTRADA, cp.MARTES_SALIDA, cp.MARTES_TOTAL,
                    cp.MIERCOLES_ENTRADA, cp.MIERCOLES_SALIDA, cp.MIERCOLES_TOTAL,
                    cp.JUEVES_ENTRADA, cp.JUEVES_SALIDA, cp.JUEVES_TOTAL,
                    cp.VIERNES_ENTRADA, cp.VIERNES_SALIDA, cp.VIERNES_TOTAL
                FROM SECTIONPER sp
                LEFT JOIN SECTIONS as se ON se.EVENT_ID = sp.EVENT_ID
                LEFT JOIN CALENDAR_PIVOT as cp ON cp.EVENT_ID = sp.EVENT_ID
            )
            SELECT DISTINCT
                codigo,
                event_id,
                anio,
                periodo,
                campus,
                sections,
                nombre_materia,
                periodo_inicial,
                periodo_final,
                total_horas_programa,
                total_semanas_efectivas,
                horas_por_semana,
                LUNES_ENTRADA as lunes_entrada, LUNES_SALIDA as lunes_salida, LUNES_TOTAL as lunes_total,
                MARTES_ENTRADA as martes_entrada, MARTES_SALIDA as martes_salida, MARTES_TOTAL as martes_total,
                MIERCOLES_ENTRADA as miercoles_entrada, MIERCOLES_SALIDA as miercoles_salida, MIERCOLES_TOTAL as miercoles_total,
                JUEVES_ENTRADA as jueves_entrada, JUEVES_SALIDA as jueves_salida, JUEVES_TOTAL as jueves_total,
                VIERNES_ENTRADA as viernes_entrada, VIERNES_SALIDA as viernes_salida, VIERNES_TOTAL as viernes_total
            FROM
                SCHEDULE_INFO
            WHERE
                codigo = '${codigo}'
                AND anio LIKE '${anio}'
                AND periodo LIKE '${periodo}'
                AND campus LIKE '${campus}'
      `);

        const info_docente = result_info_academica.recordset;

        if (!info_docente) {
            throw new Error("No se pudo obtener la información académica del docente desde PWC.");
        }

        return info_docente as InfoAcademicaDocentePWC[];
    } catch (error: any) {
        guardarLogError("Error en getInfoAcademicaDocentePWCService() v1:");
        return handleMysqlError(error);
    }
};

export const getInfoDocenteNomipaqService = async (search_term: string): Promise<InfoDocenteNomipaq[] | string | null> => {
    let pwcConnection: ConnectionPool | null = null;
    try {
        pwcConnection = await getConnectionNomipaq();
        if (pwcConnection === null) {
            throw new Error("No se pudo establecer la conexión con Nomipaq.");
        }

        const result_info_personal = await pwcConnection.request().query(`
            WITH DOCENTES AS (
                SELECT DISTINCT
                    id_empleado,
                    codigo_empleado,
                    UPPER(RTRIM(CONCAT(n.apellidopaterno, ' ', n.apellidomaterno))) as apellidos,
                    UPPER(RTRIM(n.nombre)) as nombre,
                    -- CORRECCIÓN AQUI: Usamos FORMAT para obtener '230101' (AAMMDD)
                    UPPER(RTRIM(CONCAT(n.curpi, FORMAT(n.fechanacimiento, 'yyMMdd') ,n.curpf))) as curp, 
                    UPPER(RTRIM(CONCAT(n.rfc, FORMAT(n.fechanacimiento, 'yyMMdd'),n.homoclave))) as rfc,
                    n.CorreoElectronico as correo,
                    n.direccion as direccion,
                    UPPER(RTRIM(CONCAT(n.poblacion, ', ', n.estado))) as ciudad
                FROM
                    nom10001 as n
            )
            SELECT DISTINCT
                id_empleado,
                codigo_empleado,
                apellidos,
                nombre,
                curp,
                rfc,
                correo,
                direccion,
                ciudad
            FROM 
                DOCENTES
            WHERE
                ( nombre LIKE '%' + '${search_term}' + '%' OR apellidos LIKE '%' + '${search_term}' + '%')
            ORDER BY apellidos, nombre
            `);

        const info_docente = result_info_personal.recordset;
        
        return info_docente as InfoDocenteNomipaq[];
    } catch (error: any) {
        guardarLogError("Error en getInfoDocenteNomipaqService() v1:");
        return handleMysqlError(error);
    }
};