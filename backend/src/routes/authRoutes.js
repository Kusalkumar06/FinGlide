import { Router } from "express";
import { register, login, logout, check, deleteUser, refreshToken } from "../controllers/authControllers.js";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  resolveRefreshSessionAndValidateCsrf,
  resolveLogoutSessionAndValidateCsrf,
  validateCsrfToken,
} from "../middleware/csrfMiddleware.js";
import { loginLimiter, registerLimiter } from "../middleware/rateLimitMiddleware.js";

const authRouter = Router();

authRouter.post("/login", loginLimiter, login);
authRouter.post("/register", registerLimiter, register);
authRouter.post("/refresh", resolveRefreshSessionAndValidateCsrf, refreshToken);
authRouter.post("/logout", resolveLogoutSessionAndValidateCsrf, logout);
authRouter.get("/check", authenticate, check);
authRouter.delete("/deleteuser", authenticate, validateCsrfToken, deleteUser);

export default authRouter;
