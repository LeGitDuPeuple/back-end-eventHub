import {Router} from "express";
import {authenticationMiddleware} from "../middleware/authentificatinMiddleware";
import { qrCode, enable } from "../controller/a2fController";

const router = Router();

router.use(authenticationMiddleware);

// L'URL pour générer le QR Code

    /**
 * @swagger
/api/a2f/qrcode:
  get:
    tags:
      - Configuration 2FA
    summary: Génération du QR Code initial
    description: >
      Génère un secret unique pour l'utilisateur et renvoie un QR Code au format Base64.
      Nécessite d'être authentifié (Vérification du cookie de session).
    security:
      - cookieAuth: []
    responses:
      200:
        description: QR Code généré avec succès.
        content:
          application/json:
            schema:
              type: object
              properties:
                qrCode:
                  type: string
                  example: "data:image/png;base64,iVBORw0KGgoAAA..."
      401:
        description: Non authentifié.
 */
router.get("/qrcode", qrCode);
// L'URL pour valider le code et ACTIVER la 2FA

    /**
 * @swagger
/api/a2f/enable:
  post:
    tags:
      - Configuration 2FA
    summary: Activation officielle de la 2FA
    description: >
      Valide le premier code OTP fourni par l'utilisateur. 
      Si valide, active 'otp_enable' en base de données et génère les 10 codes de secours.
    security:
      - cookieAuth: []
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required:
              - token
            properties:
              token:
                type: string
                description: Le code à 6 chiffres affiché sur l'application MFA.
                example: "123456"
    responses:
      200:
        description: 2FA activée. Renvoie les codes de secours à sauvegarder.
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: "Double authentification activée"
                recoveryCodes:
                  type: array
                  items:
                    type: string
                  example: ["ABC1-DEF2", "GHI3-JKL4"]
      400:
        description: Code OTP invalide.
 */
router.post("/enable", enable);


export default router;