// src/api_labass/controllers/paymentController.ts
import { Request, Response } from "express";
import { autoInjectable } from "tsyringe";
import { PaymentService } from "../services/paymentService";

@autoInjectable()
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  public async initiateSession(req: Request, res: Response): Promise<void> {
    try {
      const { InvoiceAmount, CurrencyIso } = req.body;
      const result = await this.paymentService.initiateSession(
        InvoiceAmount,
        CurrencyIso
      );
      res.json(result);
    } catch (error) {
      console.error("Error initiating session:", error);
      res.status(500).json({ message: "Internal Server Error", error });
    }
  }

  public async executePayment(req: Request, res: Response): Promise<void> {
    try {
      const paymentData = req.body;
      const result = await this.paymentService.executePayment(paymentData);
      res.json(result);
    } catch (error) {
      console.error("Error executing payment:", error);
      res.status(500).json({ message: "Internal Server Error", error });
    }
  }
}
