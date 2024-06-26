// routes/consultationRoutes.ts
import express, { Request, Response } from "express";
import { ConsultationController } from "../controllers/consultationController";
import { AuthMiddleware } from "../middlewares/authMiddleware";
import { isPatientProfileCompleted } from "../middlewares/checkPatientProfileExistance";
import { container } from "tsyringe";

const consultationRouter = express.Router();
const consultationController = container.resolve(ConsultationController);

// Route for creating a new consultation
consultationRouter.post(
  "/consultations",
  AuthMiddleware,
  isPatientProfileCompleted,
  (req, res) => consultationController.createConsultation(req, res)
);

consultationRouter.get(
  "/consultations/:id",
  AuthMiddleware,
  // this middleware will attach the patient profile to the request
  isPatientProfileCompleted,
  (req, res) => consultationController.getConsultationById(req, res)
);

consultationRouter.get(
  "/consultations",
  AuthMiddleware,
  // this middleware will attach the patient profile to the request
  isPatientProfileCompleted,
  (req, res) => consultationController.getAllConsultationsforPatient(req, res)
);

consultationRouter.put(
  "/consultations/:id",
  AuthMiddleware,
  // this middleware will attach the patient profile to the request
  isPatientProfileCompleted,
  (req, res) => consultationController.updateConsultation(req, res)
);

consultationRouter.delete("/consultations/:id", AuthMiddleware, (req, res) =>
  consultationController.deleteConsultation(req, res)
);
export default consultationRouter;
