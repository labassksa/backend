import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const sickLeaveValidationRules = [
  body("startDate")
    .exists()
    .withMessage("Start date is required.")
    .isISO8601()
    .withMessage("A valid start date (YYYY-MM-DD) is required."),
  body("endDate")
    .exists()
    .withMessage("End date is required.")
    .isISO8601()
    .withMessage("A valid end date (YYYY-MM-DD) is required.")
    .custom((value, { req }) => {
      if (new Date(value) < new Date(req.body.startDate)) {
        throw new Error("End date must be after start date.");
      }
      return true;
    }),
  // Middleware to check validation result
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
