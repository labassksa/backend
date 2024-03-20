// insuranceRoutes.ts
import express, { Request, Response } from "express";
import { container } from "tsyringe";
import { InsuranceController } from "../controllers/insuranceController";
import { AuthMiddleware } from "../middlewares/authMiddleware";
// Import any necessary validations here, such as for updating insurance details

const insuranceRouter = express.Router();
const insuranceController = container.resolve(InsuranceController);

// Link insurance to the user
insuranceRouter.post(
  "/link-insurance",
  AuthMiddleware,
  (req: Request, res: Response) => insuranceController.linkInsurance(req, res)
);

// Update insurance details by ID
insuranceRouter.put("/:id", AuthMiddleware, (req: Request, res: Response) =>
  insuranceController.updateInsurance(req, res)
);

// Get insurance details by ID
insuranceRouter.get(
  "/insurance:id",
  AuthMiddleware,
  (req: Request, res: Response) =>
    insuranceController.getInsuranceById(req, res)
);

// Delete insurance by ID
insuranceRouter.delete(
  "/insurance:id",
  AuthMiddleware,
  (req: Request, res: Response) => insuranceController.deleteInsurance(req, res)
);

// List all insurances for the user
insuranceRouter.get(
  "/userinsurances",
  AuthMiddleware,
  (req: Request, res: Response) =>
    insuranceController.listAllInsurancesForUser(req, res)
);

export default insuranceRouter;
