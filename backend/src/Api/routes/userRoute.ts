import { Router } from "express";
import { UserController } from "../controller/userController";
import { authenticationMiddleware } from "../middleware/authentificatinMiddleware";

export const userRoutes = Router();

export function registerUserRoutes(userController: UserController) {
  userRoutes.post("/register", (req, res, next) =>
    userController.register(req, res, next)
  );

  userRoutes.post("/login", (req, res, next) =>
    userController.login(req, res, next)
  );
  userRoutes.get('/me', authenticationMiddleware , userController.me.bind(userController));
}