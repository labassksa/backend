// src/api_labass/services/paymentService.ts
import { autoInjectable } from "tsyringe";
import axios from "axios";

@autoInjectable()
export class PaymentService {
  private readonly baseURL: string;
  private readonly token: string;

  constructor() {
    this.baseURL =
      process.env.MYFATOORAH_BASE_URL || "https://apitest.myfatoorah.com";
    this.token = process.env.MYFATOORAH_TOKEN || "";
  }

  public async initiateSession(InvoiceAmount: number, CurrencyIso: string) {
    const response = await axios.post(
      `${this.baseURL}/v2/InitiateSession`,
      {
        InvoiceAmount,
        CurrencyIso,
      },
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  }

  public async executePayment(paymentData: any) {
    const response = await axios.post(
      `${this.baseURL}/v2/ExecutePayment`,
      paymentData,
      {
        headers: {
            Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  }
}
