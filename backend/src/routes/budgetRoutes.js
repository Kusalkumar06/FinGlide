import { createBudget,getBudgets,updateBudget,deleteBudget } from "../controllers/budgetControllers.js";
import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware.js";

const budgetRouter = Router();

budgetRouter.post('/createBudget',authenticate,createBudget)

budgetRouter.get('/getBudgets',authenticate,getBudgets)

budgetRouter.put('/update/:id',authenticate,updateBudget)

budgetRouter.delete('/delete/:id',authenticate,deleteBudget)

export default budgetRouter