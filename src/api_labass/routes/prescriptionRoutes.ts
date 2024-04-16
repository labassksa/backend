import { Request, Response } from "express";
import express from "express";
import { PrescriptionController } from "../controllers/prescriptionController";
import { container } from "tsyringe";
import { AuthMiddleware } from "../middlewares/authMiddleware";
import { prescriptionValidationRules } from "../middlewares/validation/prescriptionvalidationRules";

const prescriptionRouter = express.Router();
const prescriptionController = container.resolve(PrescriptionController);
// Route to issue or update a prescription
prescriptionRouter.post(
  "/consultations/:consultationId/prescription",
  AuthMiddleware,
  prescriptionValidationRules,
  (req: Request, res: Response) =>
    prescriptionController.issueOrUpdatePrescription(req, res)
);

// Route to get a prescription by consultation ID
prescriptionRouter.get(
  "/consultations/:consultationId/prescription",
  AuthMiddleware,
  (req: Request, res: Response) =>
    prescriptionController.getPrescriptionByConsultationId(req, res)
);

export default prescriptionRouter;
