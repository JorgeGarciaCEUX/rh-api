import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { getInfoAcademicaDocentePWC, searchDocente } from "../../controllers/v1/nomina.controller";


const router = Router();

router.get("/searchDocente/:search_term", authMiddleware, searchDocente);
router.get("/getInfoAcademicaDocente/:codigo/:anio/:periodo/:campus", authMiddleware, getInfoAcademicaDocentePWC);
// router.post("/reporteNomina", authMiddleware, reporteNomina);

export default router;