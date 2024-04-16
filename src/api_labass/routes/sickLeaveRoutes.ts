import { Request, Response } from "express";
import express from "express";
import { container } from "tsyringe";
import { SickLeaveController } from "../controllers/SickLeaveController";
import { AuthMiddleware } from "../middlewares/authMiddleware";
import { sickLeaveValidationRules } from "../middlewares/validation/sickLeaveValidation";

const sickLeaveRouter = express.Router();
const sickLeaveController = container.resolve(SickLeaveController);

sickLeaveRouter.post(
  "/consultations/:consultationId/sickleave",
  AuthMiddleware,
  sickLeaveValidationRules,
  (req: Request, res: Response) =>
    sickLeaveController.issueOrUpdateSickLeave(req, res)
);
sickLeaveRouter.get(
  "/consultations/:consultationId/sickleave",
  AuthMiddleware,
  (req: Request, res: Response) =>
    sickLeaveController.getSickLeaveByConsultationId(req, res)
);
export default sickLeaveRouter;
