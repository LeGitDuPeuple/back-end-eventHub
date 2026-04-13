import {Router} from "express";
import {authenticationMiddleware} from "../middleware/authentificatinMiddleware";
import { qrCode, enable } from "../controller/a2fController";

const router = Router();

router.use(authenticationMiddleware);

// L'URL pour générer le QR Code
router.get("/qrcode", qrCode);
// L'URL pour valider le code et ACTIVER la 2FA
router.post("/enable", enable);


export default router;