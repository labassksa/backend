import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { container, inject, injectable } from "tsyringe";

@injectable()
export class AuthController {
  constructor(@inject(AuthService) private authService: AuthService) {}
  verifyOTPAndAuthenticate = async (req: Request, res: Response) => {
    try {
      const { phoneNumber, otpcode, role } = req.body;
      const token = await this.authService.verifyOTPAndAuthenticate(
        role,
        phoneNumber,
        otpcode
      );
      return res.status(200).json({ token });
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
      ) {
        return res.status(401).json({ error: error.message });
      } else {
        // Fallback error message if the caught 'error' doesn't have a 'message' property
        return res.status(401).json({
          error: "An unexpected error occurred during authentication.",
        });
      }
    }
  };
}
