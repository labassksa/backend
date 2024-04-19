// src/routes/doctorRoutes.ts
import { Router } from "express";
import { container } from "tsyringe";
import { DoctorProfileController } from "../controllers/doctorProfileController";
import { AuthMiddleware } from "../middlewares/authMiddleware";

const doctorRouter = Router();
const doctorProfileController = container.resolve(DoctorProfileController);

doctorRouter.post(
  "/doctor",
  AuthMiddleware,
  doctorProfileController.createDoctor
);
doctorRouter.get(
  "/doctors",
  AuthMiddleware,
  doctorProfileController.getAllDoctors
);

export default doctorRouter;
