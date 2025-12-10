import { Response } from "express";
import { getInfoAcademicaDocentePWCService, getInfoDocenteNomipaqService, getInfoPersonalDocentePWCService } from "../../services/v1/nomina.service";
import { formatMysqlErrorResponse } from "../../utils/errores";


export const getInfoDocente = async (req: any, res: Response) => {
    const { search_term } = req.params;
    
    const info_docente_pwc = await getInfoPersonalDocentePWCService(search_term);

    if (typeof info_docente_pwc === "string" || info_docente_pwc === null) {
        res.json(formatMysqlErrorResponse(info_docente_pwc));
        return;
    }

    const info_docente_nomipaq = await getInfoDocenteNomipaqService(search_term);

    if (typeof info_docente_nomipaq === "string" || info_docente_nomipaq === null) {
        res.json(formatMysqlErrorResponse(info_docente_nomipaq));
        return;
    }

    res.json({
        result: "ok",
        tit: "ok",
        msg: "ok",
        data: { info_docente_pwc, info_docente_nomipaq },
    });
};

export const getInfoAcademicaDocentePWC = async (req: any, res: Response) => {
    const { codigo, anio, periodo, campus } = req.params as { codigo: string; anio: string; periodo: string; campus: string };

    const info_academica_docente_pwc = await getInfoAcademicaDocentePWCService(codigo, anio, periodo, campus);

    if (typeof info_academica_docente_pwc === "string" || info_academica_docente_pwc === null) {
        res.json(formatMysqlErrorResponse(info_academica_docente_pwc));
        return;
    }

    res.json({
        result: "ok",
        tit: "ok",
        msg: "ok",
        data: { info_academica_docente_pwc },
    });
};