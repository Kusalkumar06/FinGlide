import { createBudget, getBudgets, updateBudget, deleteBudget, spendVsBudget } from "../controllers/budgetControllers.js";
import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { validateCsrfToken } from "../middleware/csrfMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  createBudgetSchema,
  updateBudgetSchema,
  objectIdParamSchema,
} from "../schemas/transactionBudgetSchemas.js";

const budgetRouter = Router();

budgetRouter.post(
  "/createBudget",
  authenticate,
  validateCsrfToken,
  validateRequest({ body: createBudgetSchema }),
  createBudget
);

budgetRouter.get("/getBudgets", authenticate, getBudgets);

budgetRouter.get("/spendVsBudget", authenticate, spendVsBudget);

budgetRouter.put(
  "/update/:id",
  authenticate,
  validateCsrfToken,
  validateRequest({ params: objectIdParamSchema, body: updateBudgetSchema }),
  updateBudget
);

budgetRouter.delete(
  "/delete/:id",
  authenticate,
  validateCsrfToken,
  validateRequest({ params: objectIdParamSchema }),
  deleteBudget
);

export default budgetRouter;