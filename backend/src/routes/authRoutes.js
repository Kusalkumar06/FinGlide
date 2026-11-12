import { Router } from "express";
import { register, login, logout, check, deleteUser, refreshToken } from "../controllers/authControllers.js";
import { authenticate } from "../middleware/authMiddleware.js";

const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/register", register);
authRouter.post("/refresh", refreshToken);
authRouter.post("/logout", logout);
authRouter.get("/check", authenticate, check);
authRouter.delete("/deleteuser", authenticate, deleteUser);

export default authRouter;
