import { Request, Response, NextFunction } from "express";
import { CreateUserUseCase } from "../../application/usecases/user/createUserUsecase";
import { LoginUserUseCase } from "../../application/usecases/user/loginUserUsecase";
import { UserEventModel } from "../../infra/models/analytics.model"; 
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const otplib = require("otplib") as any;
const authenticator = otplib.authenticator;

export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase
  ) {}

  //  REGISTER
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.createUserUseCase.execute(req.body);
      UserEventModel.create({
        userId: user.id,
        eventName: "user_registration",
        timestamp: new Date()
      }).catch(err => console.error("Analytics Error:", err));

      res.jsonSuccess(user, 201);
    } catch (error) {
      next(error);
    }
  }


 //  LOGIN 
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      // On récupère l'user depuis le usecase (vérification email/password)
      const { user } = await this.loginUserUseCase.execute(req.body);
      // On va chercher l'utilisateur DIRECTEMENT en BDD pour avoir le statut 2FA à jour
      const freshUser = await prisma.user.findUnique({ where: { id: user.id } });
      if (!freshUser) {
        return (res as any).jsonError("Utilisateur introuvable", 404);
      }
      // On vérifie sur l'utilisateur s'il a activé la 2FA
      if (freshUser.otp_enable === 1) {
        return (res as any).jsonSuccess({
          twoFactorRequired: true,
          message: "Double authentification requise",
          userId: freshUser.id 
        }, 200);
      }

      // 4. Si pas de 2FA, on continue normalement
      const secret = process.env.JWT_SECRET || "secret-key";
      const token = jwt.sign(
        { userId: freshUser.id, email: freshUser.email, role: freshUser.role, firstname: freshUser.firstname },
        secret,
        { expiresIn: "24h" }
      );

      res.cookie("accessToken", token, {
          httpOnly: true,
          secure: false,  
          sameSite: "lax",
          maxAge: 3600 * 24 * 7 * 1000
      });

      res.jsonSuccess({ user: freshUser, token }, 200); 
    } catch (error) {
      next(error);
    }
  }

  // VERIFY 2FA & RECOVERY CODES
  async verify2FA(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, token } = req.body;

      if (!userId || !token) {
        return (res as any).jsonError("Données manquantes", 400);
      }

      const user = await prisma.user.findUnique({ where: { id: userId } }) as any;
      
      if (!user || !user.otp_secret) {
        return (res as any).jsonError("Configuration 2FA introuvable", 400);
      }

      let isValid = false;
      let isRecovery = false;

      isValid = authenticator.check(token, user.otp_secret);

      if (!isValid && user.recovery_codes) {
        const hashedCodes: string[] = JSON.parse(user.recovery_codes);
        let foundIndex = -1;

        for (let i = 0; i < hashedCodes.length; i++) {
          const match = await bcrypt.compare(token, hashedCodes[i]);
          if (match) {
            foundIndex = i;
            break;
          }
        }

        if (foundIndex !== -1) {
          isValid = true;
          isRecovery = true;
          hashedCodes.splice(foundIndex, 1);
          
          await prisma.user.update({
            where: { id: userId },
            data: { 
              recovery_codes: JSON.stringify(hashedCodes) 
            } as any
          });
        }
      }

      if (!isValid) {
        return (res as any).jsonError("Code invalide ou expiré", 400);
      }
      const secret = process.env.JWT_SECRET || "secret-key";

      const accessToken = jwt.sign(
        { userId: user.id, email: user.email, role: user.role, firstname: user.firstname },
        secret,
        { expiresIn: "24h" }
      );

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 3600 * 24 * 7 * 1000
      });

      return (res as any).jsonSuccess({ 
        user: { id: user.id, email: user.email },
        message: isRecovery ? "Connecté via code de secours" : "Connecté avec succès"
      }, 200);

    } catch (error) {
      next(error);
    }
  }

  //  ME
  async me(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (!user) return res.status(401).json({ message: "Non authentifié" });

      return res.status(200).json({
        data: {
          user: { 
            id: user.userId,
            email: user.email,
            role: user.role,
            firstname: user.firstname || 'User', 
            lastname: user.lastname || ''
          }
        }
      });
    } catch (error) {
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }
}