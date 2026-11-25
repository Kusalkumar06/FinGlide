import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { validateCsrfToken } from "../middleware/csrfMiddleware.js";
import { createCategory,getCategories,updateCategory,deleteCategory,getPieData } from "../controllers/categoryControllers.js";

const categoryRouter = Router()

categoryRouter.post('/createCategory',authenticate,validateCsrfToken,createCategory)

categoryRouter.get('/getCategories',authenticate,getCategories)

categoryRouter.get('/getPieData',authenticate,getPieData)

categoryRouter.put('/update/:id',authenticate,validateCsrfToken,updateCategory)

categoryRouter.delete('/delete/:id',authenticate,validateCsrfToken,deleteCategory)

export default categoryRouter