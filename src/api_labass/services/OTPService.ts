import axios from "axios";
import { injectable } from "tsyringe";
import { Repository } from "typeorm";
import { OTPModel } from "../otpmodel/otpModel";
import { OTPDataSource } from "../../configuration/ormconfig";

interface OTPDetails {
  code: string;
  expiry: Date;
}

export
@injectable()
class OTPService {
  private otpStorage: Map<string, OTPDetails> = new Map();
  private sendOtpApiUrl = "SEND_OTP_ENDPOINT";
  private apiKey = "YOUR_API_KEY";
  // OTP expiry time (5 minutes in milliseconds)

  private otpRepository: Repository<OTPModel>;

  constructor() {
    this.otpRepository = OTPDataSource.getRepository(OTPModel);
  }

  async sendCode(phoneNumber: string): Promise<boolean> {
    try {
      // const response = await axios.post(this.sendOtpApiUrl, {
      //   apiKey: this.apiKey,
      //   phoneNumber: phoneNumber,
      // });
      // Assuming the response includes the code sent to the user and Labass backend
      // const { code } = response.data; // Adjust based on actual response structure

      const code = "1234"; // Generate or get the OTP code
      const expiry = new Date(new Date().getTime() + 5 * 60 * 1000); // 5 minutes from now

      // Create and save the OTP record
      const otpRecord = this.otpRepository.create({
        phoneNumber,
        code,
        expiry,
      });
      const savedotpRecord = await this.otpRepository.save(otpRecord);
      console.log(`Saved OTP:  ${savedotpRecord}`);
      return true;
    } catch (error) {
      console.error("Error sending OTP:", error);
      return false;
    }
  }

  async verifyCode(phoneNumber: string, otpcode: string): Promise<boolean> {
    try {
      // Retrieve the OTP record by phoneNumber
      const otpDetails = await this.otpRepository.findOneBy({ phoneNumber });
      const newDate = new Date();
      const newDateGEtTime = new Date().getTime();
      console.log(
        `Saved OTP object:  ${otpDetails}, Saved OTP CODE: ${otpDetails?.code}, SAved OTP EXPIRY: ${otpDetails?.expiry}, 
        New Typescript Date(): ${newDate} , New Typescript Date().GetTime: ${newDateGEtTime}`
      );
      // Check if the OTP record was not found
      if (!otpDetails) {
        throw new Error("OTP not found.");
      }

      // Check if the OTP has expired
      if (new Date() > otpDetails.expiry) {
        // Clean up expired OTP
        await this.otpRepository.remove(otpDetails);
        throw new Error("OTP expired.");
      }

      // Verify the provided OTP code against stored details
      if (otpDetails.code === otpcode) {
        // Clean up after successful verification
        await this.otpRepository.remove(otpDetails);
        return true; // OTP verified successfully
      } else {
        throw new Error("OTP verification failed. Incorrect code.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      // Depending on your application's error handling strategy, you might want to:
      // - Log the error to a logging service
      // - Map the error to a user-friendly message or error code
      // - Rethrow the error or return a failure response
      throw error; // or return false; depending on how you want to handle errors upstream
    }
  }
}
