import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { getInfoAcademicaDocentePWC, getInfoDocente } from "../../controllers/v1/nomina.controller";


const router = Router();

router.get("/getInfoDocente/:search_term", authMiddleware, getInfoDocente);
router.get("/getInfoAcademicaDocente/:codigo/:anio/:periodo/:campus", authMiddleware, getInfoAcademicaDocentePWC);
// router.post("/reporteNomina", authMiddleware, reporteNomina);

export default router;