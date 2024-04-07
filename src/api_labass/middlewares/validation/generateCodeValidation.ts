import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

export const generateCodeValidation = [
  // Validate marketerId is provided and is a number
  body("marketerId")
    .exists({ checkFalsy: true })
    .withMessage("marketerId is required.")
    .isNumeric()
    .withMessage("marketerId must be a number."),

  // Validate discountPercentage is provided and is a number
  body("discountPercentage")
    .exists({ checkFalsy: true })
    .withMessage("discountPercentage is required.")
    .isNumeric()
    .withMessage("discountPercentage must be a number."),

  // Middleware to return the result of the validation
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
