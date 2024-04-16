import express from "express";
import { container } from "tsyringe";
import { SOAPController } from "../controllers/SOAPController";
import { AuthMiddleware } from "../middlewares/authMiddleware";
import { soapValidationRules } from "../middlewares/validation/SOAPValidation";

const soapRouter = express.Router();
const soapController = container.resolve(SOAPController);

soapRouter.post(
  "/consultations/:consultationId/soap",
  AuthMiddleware,
  soapValidationRules,
  soapController.issueOrUpdateSOAP
);

soapRouter.get(
  "/consultations/:consultationId/soap",
  AuthMiddleware,
  soapController.getSOAPByConsultationId
);

export  default soapRouter ;
