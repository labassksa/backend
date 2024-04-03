// routes/userRoutes.ts
import { Request, Response } from "express";
import express from "express";
import { container } from "tsyringe";
import { UserController } from "../controllers/UserController";
import { createUserValidation } from "../middlewares/validation/createUserValidation";
import { AuthMiddleware } from "../middlewares/authMiddleware";
import { userInfoValidation } from "../middlewares/validation/userInfoValidation";


const userRouter = express.Router();
const userController = container.resolve(UserController);

userRouter.post("/user", createUserValidation, (req: Request, res: Response) =>
  userController.createPartialUser(req, res)
);
// userRouter.post("/CompleteUserProfile",  AuthMiddleware, userInfoValidation, (req: Request, res: Response) =>
//   userController.createPartialUser(req, res)
// );
userRouter.post(
  "/CompleteUserProfile",
  AuthMiddleware,
  userInfoValidation,
  (req: Request, res: Response) => userController.completeUserInfo(req, res)
);

userRouter.get("/user", AuthMiddleware, (req: Request, res: Response) =>
  userController.getUser(req, res)
);

userRouter.put("/users/:id", (req: Request, res: Response) =>
  userController.updateUser(req, res)
);

userRouter.delete("/users/:id", (req: Request, res: Response) =>
  userController.deleteUser(req, res)
);

export default userRouter;
