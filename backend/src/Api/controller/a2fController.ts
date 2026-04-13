import { NextFunction, Request, Response } from "express";
import { QrCodeGenerator } from "../utils/qrCodeGenerator";
import { PrismaClient } from "@prisma/client";
import * as crypto from "crypto"; // Natif Node.js
import bcrypt from "bcrypt";      // Pour hasher les codes

const prisma = new PrismaClient();
const otplib = require("otplib") as any;
const authenticator = otplib.authenticator;

const qrCodeGenerator = new QrCodeGenerator(process.env.APP_NAME || "eventHub");

// 1. GENERER LE QR CODE
export const qrCode = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const user = (req as any).user;

        if (!user || !user.userId) return (res as any).jsonError("Utilisateur non identifié.", 401);

        const secret = authenticator.generateSecret();
        await prisma.user.update({
            where: { id: user.userId }, 
            data: { otp_secret: secret }
        });

        const qrCodeData = await qrCodeGenerator.generate(user.email, secret);
        
        return (res as any).jsonSuccess({ qrCode: qrCodeData, secret: secret }, 200);
    } catch (error) {
        next(error);
    }
};

// 2. ACTIVER LA 2FA
export const enable = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { token } = req.body; 
        const user = (req as any).user;

        if (!user || !user.userId) return (res as any).jsonError("Non connecté", 401);
        const dbUser = await prisma.user.findUnique({ where: { id: user.userId } }); 

        if (!dbUser?.otp_secret) return (res as any).jsonError("Générez d'abord un QR Code", 400);

        authenticator.options = { window: [2, 2] };

        const isValid = authenticator.check(token, dbUser.otp_secret);
        if (!isValid) return (res as any).jsonError("Code invalide ou expiré", 400);

        const rawCodes: string[] = [];
        const hashedCodes: string[] = [];

        for (let i = 0; i < 10; i++) {
            const code = crypto.randomBytes(4).toString('hex').toUpperCase(); 
            rawCodes.push(code);
            hashedCodes.push(await bcrypt.hash(code, 10));
        }

        await prisma.user.update({
            where: { id: user.userId }, 
            data: { 
                otp_enable: 1,
                recovery_codes: JSON.stringify(hashedCodes)
            } as any
        });

        return (res as any).jsonSuccess({ 
            message: "Double authentification activée !", 
            recoveryCodes: rawCodes 
        }, 200);

    } catch (error) {
        next(error);
    }
};

// 3. VÉRIFIER LE CODE AU LOGIN 
export const verifyLogin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { userId, token } = req.body; 

        if (!userId || !token) return (res as any).jsonError("Données manquantes", 400);

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || !user.otp_secret) return (res as any).jsonError("Erreur 2FA", 400);

        // Vérification du token OTP
        const isValid = authenticator.check(token, user.otp_secret);

        if (!isValid) {
            // Optionnel : Ici on pourrait ajouter la logique pour vérifier si le token 
            // correspond à l'un des recovery_codes si l'OTP échoue.
            return (res as any).jsonError("Code invalide", 400);
        }

        // Si OK, génère ton JWT ici (comme dans ton login classique)
        // const accessToken = generateJWT(user);

        return (res as any).jsonSuccess({ message: "Authentification réussie !" }, 200);

    } catch (error) {
        next(error);
    }
};