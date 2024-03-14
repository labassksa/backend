// src/routes.ts
import express from "express";
import { AuthController } from "../controllers/authController";
import { authValidation } from "../middlewares/validation/authValidation";
import { container } from "tsyringe";
import { AuthMiddleware } from "../middlewares/authMiddleware";

const authRouter = express.Router();
const authController = container.resolve(AuthController);
authRouter.post(
  "/auth",
  authValidation,
  // AuthMiddleware,
  authController.verifyOTPAndAuthenticate
);

export default authRouter;
