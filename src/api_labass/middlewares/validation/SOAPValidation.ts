import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const soapValidationRules = [
  body("subjective")
    .exists()
    .withMessage("Subjective information is required."),
  body("objective").exists().withMessage("Objective information is required."),
  body("assessment").exists().withMessage("Assessment is required."),
  body("plan").exists().withMessage("Plan is required."),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
