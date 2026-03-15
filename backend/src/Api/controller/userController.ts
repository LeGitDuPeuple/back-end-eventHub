import { Request, Response, NextFunction } from "express";
import { CreateUserUseCase } from "../../application/usecases/user/createUserUsecase";
import { LoginUserUseCase } from "../../application/usecases/user/loginUserUsecase";
import { UserEventModel } from "../../infra/models/analytics.model"; 

export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase
  ) {}

  // POST /api/users/register
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

  // POST /api/users/login
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, token } = await this.loginUserUseCase.execute(req.body);

      res.cookie("accessToken", token, {
          httpOnly: true, // Sécurité : inaccessible via JS
          secure: false,  // Mettre à true en production (HTTPS)
          sameSite: "lax",
          maxAge: 3600 * 24 * 7 * 1000
      });

      res.jsonSuccess({ user }, 200); 
    } catch (error) {
      next(error);
    }
  }

  // GET /api/auth/me (La route pour l'Hydratation)
async me(req: Request, res: Response) {
  try {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    return res.status(200).json({
      data: {
        user: { // Ajoute cet objet "user" pour matcher ton service front
          id: user.userId,
          email: user.email,
          role: user.role,
          firstname: user.firstname, // <--- VÉRIFIE QUE C'EST DANS TON TOKEN
          lastname: user.lastname    // <--- VÉRIFIE AUSSI
        }
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
}