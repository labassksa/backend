// routes/marketerRoutes.ts
import express, { Request, Response } from "express";
import { container } from "tsyringe";
import { MarketerProfileController } from "../controllers/marketerProfileController";
// Assume similar middleware exists for marketer profiles
import { createMarketerValidation } from "../middlewares/validation/createMarketerValidation";
import { AuthMiddleware } from "../middlewares/authMiddleware";
// Assuming a validation middleware for updating marketer profiles
// import { updateMarketerInfoValidation } from "../middlewares/validation/updateMarketerInfoValidation";

const marketerRouter = express.Router();
const marketerController = container.resolve(MarketerProfileController);

// Route to create a new marketer profile
marketerRouter.post(
  "/marketer",
  createMarketerValidation,
  (req: Request, res: Response) => marketerController.createMarketer(req, res)
);

// Route to get a marketer profile by ID, including promotional codes
marketerRouter.get(
  "/marketer/:marketerId",
  AuthMiddleware,
  (req: Request, res: Response) =>
    marketerController.getMarketerWithPromotionalCodes(req, res)
);

// Route to get all marketer profiles with user details
marketerRouter.get(
  "/marketers",
  AuthMiddleware, // Assuming you want this route to be protected
  (req: Request, res: Response) =>
    marketerController.getAllMarketerProfiles(req, res)
);

// Placeholder routes for updating and deleting marketer profiles
// Uncomment and implement these routes as needed along with their corresponding methods in the controller
// marketerRouter.put("/marketer/:marketerId", updateMarketerInfoValidation, (req: Request, res: Response) =>
//   marketerController.updateMarketerProfile(req, res)
// );

// marketerRouter.delete("/marketer/:marketerId", (req: Request, res: Response) =>
//   marketerController.deleteMarketerProfile(req, res)
// );

export default marketerRouter;
