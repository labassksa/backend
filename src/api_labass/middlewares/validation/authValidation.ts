import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const authValidation = [
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
