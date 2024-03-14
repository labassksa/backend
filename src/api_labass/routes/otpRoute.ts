import express from "express";
import { OTPController } from "../controllers/otpController";
import { sendOTPValidation } from "../middlewares/validation/sendOtpValidation";
import { container } from "tsyringe";

const otpRouter = express.Router();
const otpController = container.resolve(OTPController);

otpRouter.post("/send-otp", sendOTPValidation, otpController.sendOTP);

export default otpRouter;
