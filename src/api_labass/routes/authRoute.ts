// src/routes.ts
import express from "express";
import { AuthController } from "../controllers/authController";
import { authValidation } from "../middlewares/validation/authValidation";
import { container } from "tsyringe";

const authController = container.resolve(AuthController);


const authRouter = express.Router();
authRouter.post(
  "/auth",
  authValidation,
  // AuthMiddleware,
  authController.verifyOTPAndAuthenticate
);

export default authRouter;
