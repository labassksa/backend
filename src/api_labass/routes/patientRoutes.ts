// patientRoutes.ts
import { Request, Response } from "express";
import express from "express";
import { PatientController } from "../controllers/patientController";
import { dependentUserInfoValidation } from "../middlewares/validation/addDependentValidation";
import { AuthMiddleware } from "../middlewares/authMiddleware";
import { container } from "tsyringe";
import { UserController } from "../controllers/userController";
import { userInfoValidation } from "../middlewares/validation/userInfoValidation";
import { isPatientProfileCompleted } from "../middlewares/checkPatientProfileExistance";

const patientRouter = express.Router();
const patientController = container.resolve(PatientController);

patientRouter.post(
  "/AddDependent",
  AuthMiddleware,
  dependentUserInfoValidation,
  isPatientProfileCompleted,
  (req: Request, res: Response) => patientController.addDependent(req, res)
);
patientRouter.post(
  "/createPatient",
  AuthMiddleware,
  (req: Request, res: Response) => patientController.createPatient(req, res)
);
// patientRouter.post(
//   "/CompleteProfile",
//   AuthMiddleware,
//   userInfoValidation,
//   (req: Request, res: Response) =>
//     patientController.fillUserInfoandCreatePatient(req, res)
// );

patientRouter.get(
  "/getPatient",
  AuthMiddleware,
  (req: Request, res: Response) => patientController.getPatient(req, res)
);
patientRouter.get(
  "/Dependents",
  AuthMiddleware,
  isPatientProfileCompleted,
  (req: Request, res: Response) => patientController.getDependents(req, res)
);

export default patientRouter;
