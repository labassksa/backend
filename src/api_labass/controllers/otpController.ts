import { Request, Response } from "express";
import { OTPService } from "../services/otpService";
import { container, inject, injectable } from "tsyringe";

@injectable()
export class OTPController {
  constructor(@inject(OTPService) private otpService: OTPService) {}
  sendOTP = async (req: Request, res: Response) => {
    try {
      const { phoneNumber } = req.body;
      const sent = await this.otpService.sendCode(phoneNumber);
      if (sent) {
        return res.status(200).json({ message: "OTP sent successfully." });
      } else {
        return res.status(500).json({ error: "Failed to send OTP." });
      }
    } catch (error) {
      return res.status(500).json({
        message: `Error sending OTP: ${
          error instanceof Error ? error.message : error
        }`,
      });
    }
  };
}
