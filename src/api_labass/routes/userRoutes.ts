// routes/userRoutes.ts
import { Router } from "express";
// import { registerUser, loginUser } from '../controllers/userController';

const router = Router();

// Register route
// router.post('/register', registerUser);

// Login route
router.get("/login", (req, res) => {
  res.send("Hello from user Rote");
});

export default router;
