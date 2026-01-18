import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { extractToken} from "../utils/extractToken";
import {getEnvVariable } from "../utils/getEnvVariable"

export const authenticationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.jsonError("Missing authorization header", 401);
    }

 
    const token = extractToken(authorization);

    if (!token) {
      return res.jsonError("Invalid authorization header", 401);
    }

   
    jwt.verify(token, getEnvVariable("JWT_SECRET"));

    
    next();
  } catch (error) {
    return res.jsonError("Invalid or expired token", 401);
  }
};

