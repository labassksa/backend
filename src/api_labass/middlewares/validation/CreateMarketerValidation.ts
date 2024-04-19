import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const createMarketerValidation = [
  // Validate and sanitize phoneNumber
  body("phoneNumber")
    .matches(/^\+\d{1,3}\d{7,14}$/)
    .withMessage(
      "Phone number must start with a country code and be between 8 to 17 digits long"
    ),
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
