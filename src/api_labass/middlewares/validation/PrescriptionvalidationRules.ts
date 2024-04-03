import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const prescriptionValidationRules = [
  body("strength")
    .exists()
    .withMessage("Strength is required.")
    .isString()
    .withMessage("Strength must be a string."),
  body("pharmaceuticalForm")
    .exists()
    .withMessage("Pharmaceutical form is required.")
    .isString()
    .withMessage("Pharmaceutical form must be a string."),
  body("dose")
    .exists()
    .withMessage("Dose is required.")
    .isString()
    .withMessage("Dose must be a string."),
  body("route")
    .exists()
    .withMessage("Route is required.")
    .isString()
    .withMessage("Route must be a string."),
  body("frequency")
    .exists()
    .withMessage("Frequency is required.")
    .isNumeric()
    .withMessage("Frequency must be a number."),
  body("duration")
    .exists()
    .withMessage("Duration is required.")
    .isNumeric()
    .withMessage("Duration must be a number."),
  body("durationUnit")
    .exists()
    .withMessage("Duration unit is required.")
    .isIn(["days", "weeks", "months"])
    .withMessage(
      "Invalid duration unit. Valid options are days, weeks, or months."
    ),
  body("diagnoses")
    .optional()
    .isArray()
    .withMessage("Diagnoses must be an array."),
  body("allergies")
    .optional()
    .isArray()
    .withMessage("Allergies must be an array."),
  // Check the validation result and return errors if validation failed
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
