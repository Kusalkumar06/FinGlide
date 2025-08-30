import { Router } from "express";
import { register } from "../controllers/authControllers.js";
import { login } from "../controllers/authControllers.js";

const router = Router()

router.post("/login/",login)

router.post("/register/",register)

export default router