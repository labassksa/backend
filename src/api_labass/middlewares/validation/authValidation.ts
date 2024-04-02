import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const authValidation = [
  body("phoneNumber")
  // Use regex to enforce that phoneNumber starts with '0' and is 10 digits long
  .matches(/^0\d{9}$/)
  .withMessage("Phone number must start with 0 and be 10 digits long"),
  body("otpcode")
    .exists()
    .withMessage(
      "the otpCode field is missing or does not match otpcode spelling"
    ),
  body("role")
    .exists()
    .withMessage("the role field is missing or does not match role spelling"),
  // Function to check the validation result and return errors if validation failed
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
