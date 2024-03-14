import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const createUserValidation = [
  body('role')
    .isIn(['patient', 'doctor', 'admin'])
    .withMessage('Invalid role specified'),
  // Function to check the validation result and return errors if validation failed
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
