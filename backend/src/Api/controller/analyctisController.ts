import { Request, Response, NextFunction } from "express";
import { UserEventModel } from "../../infra/models/analytics.model";
import mongoose from "mongoose";

/**
 * Controller gérant la logique de récupération des données analytiques.
 * Utilise MongoDB pour l'agrégation des événements transverses.
 */
export class AnalyticsController {
  
  /**
   * Récupère les statistiques de croissance des utilisateurs.
   * Effectue une agrégation par date pour fournir un format compatible avec Recharts.
   * * @route GET /api/analytics/user-stats
   */
async getUserStats(req: Request, res: Response, next: NextFunction) {
  try {
    // On vérifie si mongoose est bien connecté
    if (mongoose.connection.readyState !== 1) {
       return res.jsonSuccess([]); // On renvoie vide si pas connecté au lieu de crash
    }

    const stats = await UserEventModel.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const chartData = stats.map(item => ({
      date: item._id,
      total: item.count
    }));

    res.jsonSuccess(chartData);
  } catch (error) {
    console.error("Erreur Analytics détaillée:", error);
    // Au lieu de next(error) qui fait une 500, on renvoie un tableau vide
    res.jsonSuccess([]); 
  }
}
}