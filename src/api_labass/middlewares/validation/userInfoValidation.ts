import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const userInfoValidation = [
  body("firstName")
    .exists()
    .withMessage("The firstName field is required.")
    .notEmpty()
    .withMessage("The firstName cannot be empty.")
    .isString()
    .withMessage("The firstName must be a string."),
  body("lastName")
    .exists()
    .withMessage("The lastName field is required.")
    .notEmpty()
    .withMessage("The lastName cannot be empty.")
    .isString()
    .withMessage("The lastName must be a string."),
  body("email")
    .exists().optional()
    .withMessage("A valid email is required.")
    .notEmpty()
    .withMessage("The email cannot be empty.")
    .isEmail()
    .withMessage("A valid email is required.")
    .isString()
    .withMessage("The email must be a string."),
  body("gender")
    .exists()
    .withMessage("Gender must be either 'male' or 'female'.")
    .notEmpty()
    .withMessage("The gender cannot be empty.")
    .isIn(["male", "female"])
    .withMessage("Gender must be either 'male' or 'female'.")
    .isString()
    .withMessage("The gender must be a string."),
  body("nationalId")
    .exists()
    .withMessage("The nationalId field is required.")
    .notEmpty()
    .withMessage("The nationalId cannot be empty.")
    .isString()
    .withMessage("The nationalId must be a string.")
    .isLength({ max: 10, min: 10 })
    .withMessage("The nationalId must be 10 digits."),
  body("dateOfBirth")
    .exists()
    .withMessage("A valid dateOfBirth (YYYY-MM-DD) is required.")
    .notEmpty()
    .withMessage("The dateOfBirth cannot be empty.")
    .isString()
    .withMessage("The dateOfBirth must be a string.")
    .isDate()
    .withMessage("A valid dateOfBirth (YYYY-MM-DD) is required."),
  // Check the validation result and return errors if validation failed
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
