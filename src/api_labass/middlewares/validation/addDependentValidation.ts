// // patientValidation.ts
// import { NextFunction } from "express";
// import { body, validationResult } from "express-validator";

// export const dependentUserInfoValidation = [
//   body("phoneNumber")
//     // Ensure phoneNumber starts with '0' and is 10 digits long
//     .matches(/^0\d{9}$/)
//     .withMessage("Phone number must start with 0 and be 10 digits long"),
//   body("firstName")
//     .isLength({ min: 1 })
//     .withMessage("First name is required and must be at least 1 character"),
//   body("lastName")
//     .isLength({ min: 1 })
//     .withMessage("Last name is required and must be at least 1 character"),
//   body("email").isEmail().withMessage("A valid email is required"),
//   body("gender")
//     .isIn(["male", "female", "other"])
//     .withMessage("Gender is required and must be 'male', 'female', or 'other'"),
//   body("nationalId")
//     .isLength({ max: 10, min: 10 })
//     .withMessage("National ID is required"),
//   body("dateOfBirth")
//     .isISO8601()
//     .withMessage("A valid date of birth is required"),
//     (req: Request, res: Response, next: NextFunction) => {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//       }
//       next();
//     },
// ];
import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const dependentUserInfoValidation = [
  body("phoneNumber")
    .optional()
    // Ensure phoneNumber starts with '0' and is 10 digits long
    .matches(/^0\d{9}$/)
    .withMessage("Phone number must start with 0 and be 10 digits long"),
  body("firstName")
    .isLength({ min: 1 })
    .withMessage("First name is required and must be at least 1 character"),
  body("lastName")
    .isLength({ min: 1 })
    .withMessage("Last name is required and must be at least 1 character"),
  body("email").isEmail().withMessage("A valid email is required"),
  body("gender")
    .isIn(["male", "female", "other"])
    .withMessage(
      "Gender is required and must be 'male', or 'female. We accept only those hahahah "
    ),
  body("nationalId")
    .isLength({ max: 10, min: 10 })
    .withMessage("National ID is required"),
  body("dateOfBirth")
    .isISO8601()
    .withMessage("A valid date of birth is required"),
  // Check the validation result and return errors if validation failed
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
