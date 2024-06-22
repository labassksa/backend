import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

export const initiateSessionValidation = [
  body("InvoiceAmount")
    .exists({ checkFalsy: true })
    .withMessage("InvoiceAmount is required.")
    .isNumeric()
    .withMessage("InvoiceAmount must be a number."),
  body("CurrencyIso")
    .exists({ checkFalsy: true })
    .withMessage("CurrencyIso is required.")
    .isString()
    .withMessage("CurrencyIso must be a string."),
  // Middleware to return the result of the validation

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
