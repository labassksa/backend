import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const createUserValidation = [
  body("phoneNumber")
  // Use regex to enforce that phoneNumber starts with '0' and is 10 digits long
  .matches(/^0\d{9}$/)
  .withMessage("Phone number must start with 0 and be 10 digits long"),
  body("role")
    .isIn(["patient", "doctor", "admin"]) // replace it with Roles enum if applicable
    .withMessage("Invalid role specified"),
  // Function to check the validation result and return errors if validation failed
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
