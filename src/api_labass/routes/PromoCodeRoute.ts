// Assuming you have a file where you define your routes
import express from "express";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { PromotionalCodeController } from "../controllers/PromoCodeController";
import { generateCodeValidation } from "../middlewares/validation/generateCodeValidation";
import { AuthMiddleware } from "../middlewares/authMiddleware";

const promoCodeRouter = express.Router();

// Resolve the controller with dependency injection
const promotionalCodeController = container.resolve(PromotionalCodeController);

// Define the route for generating a promotional code
promoCodeRouter.post(
  "/generate-promotional-code",
  AuthMiddleware,
  generateCodeValidation,
  (req: Request, res: Response) =>
    promotionalCodeController.generateCode(req, res)
);
// Toggle Promo Code
promoCodeRouter.patch(
  "/promotional-code/activate-deactivate",
  (req: Request, res: Response) =>
    promotionalCodeController.activateDeactivateCode(req, res)
);

export default promoCodeRouter;
