import { Router } from "express";
import { UserController } from "../controller/userController";
import { authenticationMiddleware } from "../middleware/authentificatinMiddleware";
import {loginLimiter} from "../middleware/rateLimitingMiddleware"

export const userRoutes = Router();

export function registerUserRoutes(userController: UserController) {
  userRoutes.post("/register", (req, res, next) =>
    userController.register(req, res, next)
  );

  userRoutes.post("/login",loginLimiter, (req, res, next) =>
    userController.login(req, res, next)
  );

 /**
 * @swagger
 * /api/users/verify-2fa:
 *   post:
 *     tags:
 *       - Authentification
 *     summary: Vérification du second facteur (OTP ou Recovery)
 *     description: >
 *       Cette route permet de finaliser la connexion si la 2FA est activée.
 *       Elle accepte soit un code TOTP (6 chiffres), soit un code de secours (8-10 caractères).
 *       Elle est protégée par un Rate Limiter (5 tentatives max).
 *     operationId: verify2FA
 *     requestBody:
 *       description: Identifiant de l'utilisateur et code de vérification.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - token
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "7caecf75-87cc-4944-9aaf-c04f27057dc8"
 *               token:
 *                 type: string
 *                 description: Code OTP à 6 chiffres ou code de secours.
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Authentification réussie. Un cookie "accessToken" est déposé.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Connecté avec succès
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         email:
 *                           type: string
 *       400:
 *         description: Code invalide, expiré ou déjà utilisé.
 *       429:
 *         description: Trop de tentatives (Rate Limit atteint).
 */
userRoutes.post("/verify-2fa", loginLimiter, (req, res, next) =>
  userController.verify2FA(req, res, next)
);
  userRoutes.get('/me', authenticationMiddleware , userController.me.bind(userController));
}