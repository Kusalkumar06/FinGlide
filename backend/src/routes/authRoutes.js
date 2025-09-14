import { Router } from "express";
import { register } from "../controllers/authControllers.js";
import { login,logout,check } from "../controllers/authControllers.js";

const authRouter = Router()

authRouter.post("/login/",login)

authRouter.post("/register/",register)

authRouter.post("/logout",logout)

authRouter.get('/check',check)

export default authRouter