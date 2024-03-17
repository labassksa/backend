import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const userInfoValidation = [
  body("firstName")
    .exists({ checkFalsy: true })
    .withMessage("The firstName field is required.")
    .isString()
    .withMessage("The firstName must be a string."),
  body("lastName")
    .exists({ checkFalsy: true })
    .withMessage("The lastName field is required.")
    .isString()
    .withMessage("The lastName must be a string."),
  body("email")
    .exists({ checkFalsy: true })
    .withMessage("A valid email is required.")
    .isEmail()
    .withMessage("A valid email is required.")
    .isString()
    .withMessage("The email must be a string."),
  body("gender")
    .exists({ checkFalsy: true })
    .withMessage("Gender must be either 'male' or 'female'.")
    .isIn(["male", "female"])
    .withMessage("Gender must be either 'male' or 'female'.")
    .isString()
    .withMessage("The gender must be a string."),
  body("nationalId")
    .exists({ checkFalsy: true })
    .withMessage("The nationalId field is required.")
    .isString()
    .withMessage("The nationalId must be a string.")
    .isLength({ max: 10, min: 10 })
    .withMessage("The nationalId must be 10 digits."),
  body("dateOfBirth")
    .exists({ checkFalsy: true })
    .withMessage("A valid dateOfBirth (YYYY-MM-DD) is required.")
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
