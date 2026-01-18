import { Router } from "express";
import { EventController } from "../controller/eventController";
import { authenticationMiddleware } from "../middleware/authentificatinMiddleware";

export const eventRoutes = Router();

export function registerEventRoutes(eventController: EventController) {

  eventRoutes.use(authenticationMiddleware);

  /**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Créer un événement
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - startDate
 *               - location
 *               - capacity
 *               - price
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               location:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Événement créé
 */


  eventRoutes.post("/", (req, res, next) =>
    eventController.create(req, res, next)
  );

  eventRoutes.get("/", (req, res, next) =>
    eventController.getAll(req, res, next)
  );

  eventRoutes.get("/:id", (req, res, next) =>
    eventController.getById(req, res, next)
  );

  eventRoutes.put("/:id", (req, res, next) =>
    eventController.update(req, res, next)
  );

  eventRoutes.delete("/:id", (req, res, next) =>
    eventController.delete(req, res, next)
  );
}

