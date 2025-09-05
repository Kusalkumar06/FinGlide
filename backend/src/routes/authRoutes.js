import { Router } from "express";
import { register } from "../controllers/authControllers.js";
import { login } from "../controllers/authControllers.js";

const authRouter = Router()

authRouter.post("/login/",login)

authRouter.post("/register/",register)

export default authRouter