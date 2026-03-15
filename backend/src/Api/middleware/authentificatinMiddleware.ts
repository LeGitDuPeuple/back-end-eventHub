import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: "Accès refusé : aucun token trouvé dans les cookies ou le header" 
    });
  }

  try {
    const secret = process.env.JWT_SECRET || "ton_secret_key";
    const decoded = jwt.verify(token, secret);
    
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: "Session expirée ou token invalide" 
    });
  }
};