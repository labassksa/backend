import express from "express";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { PaymentController } from "../controllers/paymentController";
import { initiateSessionValidation } from "../middlewares/validation/initaiePaymentValidation";

const paymentController = container.resolve(PaymentController);

const paymentRouter = express.Router();
paymentRouter.post(
  "/initiate-session",
  initiateSessionValidation,
  (req: Request, res: Response) => paymentController.initiateSession(req, res)
);

paymentRouter.post("/execute-payment", (req: Request, res: Response) =>
  paymentController.executePayment(req, res)
);

export default paymentRouter;
