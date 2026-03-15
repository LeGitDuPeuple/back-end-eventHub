import { Router } from "express";
import { AnalyticsController } from "../controller/analyctisController";

const router = Router();
const analyticsController = new AnalyticsController();

// Route pour le graphique
router.get("/user-stats", (req, res, next) => analyticsController.getUserStats(req, res, next));

export default router;