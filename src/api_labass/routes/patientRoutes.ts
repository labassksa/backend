// patientRoutes.ts
import { Request, Response } from "express";
import express from "express";
import { PatientController } from "../controllers/patientController";
import { dependentUserInfoValidation } from "../middlewares/validation/addDependentValidation";
import { AuthMiddleware } from "../middlewares/authMiddleware";
import { container } from "tsyringe";
import { UserController } from "../controllers/userController";

const patientRouter = express.Router();
const patientController = container.resolve(PatientController);

patientRouter.post(
  "/addDependent",
  dependentUserInfoValidation,
  AuthMiddleware,
  (req: Request, res: Response) => patientController.addDependent(req, res)
);
patientRouter.get(
  "/getDependents",
  AuthMiddleware,
  (req: Request, res: Response) => patientController.getDependents(req, res)
);

export default patientRouter;
