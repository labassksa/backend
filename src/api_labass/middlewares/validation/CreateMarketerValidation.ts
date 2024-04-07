import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const createMarketerValidation = [
  // Validate and sanitize phoneNumber
  body("phoneNumber")
    // Use regex to enforce that phoneNumber starts with '0' and is 10 digits long
    .matches(/^0\d{9}$/)
    .withMessage("Phone number must start with 0 and be 10 digits long"),
  // Validate and sanitize firstName
  body("firstName").trim().notEmpty().withMessage("First name is required."),

  // Additional validations for other fields can be added here if necessary
  // Middleware to check the result of the above validations
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
