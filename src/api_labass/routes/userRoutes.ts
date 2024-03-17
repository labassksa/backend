// routes/userRoutes.ts
import { Request, Response } from "express";
import express from "express";
import { container } from "tsyringe";
import { UserController } from "../controllers/userController";
import { createUserValidation } from "../middlewares/validation/createUserValidation";
import { AuthMiddleware } from "../middlewares/authMiddleware";
import { userInfoValidation } from "../middlewares/validation/userInfoValidation";

const userRouter = express.Router();
const userController = container.resolve(UserController);

// Apply authMiddleware to all routes in this router
// userRouter.use(authMiddleware);

// Setup routes with validation and error handling for createUser
/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create a new user
 *     description: Adds a new user to the system with a phone number and role.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *               - role
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 description: The phone number of the user
 *                 example: "123-456-7890"
 *               role:
 *                 type: string
 *                 description: The role of the user
 *                 example: "admin"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The user ID
 *                   example: 1
 *                 phoneNumber:
 *                   type: string
 *                   description: The phone number of the user
 *                   example: "123-456-7890"
 *                 role:
 *                   type: string
 *                   description: The role of the user
 *                   example: "admin"
 *       500:
 *         description: Error creating user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Error creating user"
 */
userRouter.post("/user", createUserValidation, (req: Request, res: Response) =>
  userController.createPartialUser(req, res)
);

userRouter.post(
  "/fillUserInfoAndCreatePatientProfile",
  AuthMiddleware,
  userInfoValidation,
  (req: Request, res: Response) =>
    userController.fillUserInfoandCreatePatient(req, res)
);
userRouter.get("/users/:id", (req: Request, res: Response) =>
  userController.getUser(req, res)
);
userRouter.put("/users/:id", (req: Request, res: Response) =>
  userController.updateUser(req, res)
);
userRouter.delete("/users/:id", (req: Request, res: Response) =>
  userController.deleteUser(req, res)
);

export default userRouter;
