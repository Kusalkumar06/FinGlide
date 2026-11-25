import { createBudget,getBudgets,updateBudget,deleteBudget,spendVsBudget } from "../controllers/budgetControllers.js";
import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { validateCsrfToken } from "../middleware/csrfMiddleware.js";

const budgetRouter = Router();

budgetRouter.post('/createBudget',authenticate,validateCsrfToken,createBudget)

budgetRouter.get('/getBudgets',authenticate,getBudgets)

budgetRouter.get('/spendVsBudget',authenticate,spendVsBudget)

budgetRouter.put('/update/:id',authenticate,validateCsrfToken,updateBudget)

budgetRouter.delete('/delete/:id',authenticate,validateCsrfToken,deleteBudget)

export default budgetRouter