import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { reporteNominaDocente } from "../../controllers/v1/reporte.controller";

const router = Router();


router.post("/reporteNominaDocente", authMiddleware, reporteNominaDocente);

export default router;
