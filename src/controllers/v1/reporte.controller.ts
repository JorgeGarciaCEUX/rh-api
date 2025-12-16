import { Response } from "express";
import { formatMysqlErrorResponse } from "../../utils/errores";
import { getReporteNominaDocenteService } from "../../services/v1/reporte.service";


export const reporteNominaDocente = async (req: any, res: Response) => {
    const { reporteCompleto } = req.body;

    const reporte = await getReporteNominaDocenteService(reporteCompleto);
  
  if (reporte === null || typeof reporte === "string") {
    res.json(formatMysqlErrorResponse(reporte));
    return;
  }
  
  res.json({
    result: "ok",
    tit: "ok",
    msg: "ok",
    data: { reporte },
  });
}