import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log("COOKIES REÇUS :", req.cookies); // Est-ce que le cookie arrive ?
  const token = req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({ message: "Accès refusé" });
  }

  try {
    const secret = process.env.JWT_SECRET || "secret-key";
    const decoded = jwt.verify(token, secret);
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalide" });
  }
};