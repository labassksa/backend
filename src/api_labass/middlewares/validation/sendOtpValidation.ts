import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const sendOTPValidation = [
  body("phoneNumber")
    .matches(/^\+\d{1,3}\d{7,14}$/)
    .withMessage(
      "Phone number must start with a country code and be between 8 to 17 digits long"
    ),
  // Function to check the validation result and return errors if validation failed
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
