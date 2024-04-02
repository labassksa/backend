// routes/consultationRoutes.ts
import express from "express";
import { ConsultationController } from "../controllers/ConsultationController";
import { AuthMiddleware } from "../middlewares/authMiddleware";
import { isPatientProfileCompleted } from "../middlewares/CheckPatientProfileExistance";

const consultationRouter = express.Router();
const consultationController = new ConsultationController();

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
  (req, res) => consultationController.getConsultation(req, res)
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
