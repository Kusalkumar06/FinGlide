import { createTransaction, getTransactions, updateTransaction, deleteTransaction, yearlySummary, expVsincYearly } from "../controllers/transactionControllers.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { validateCsrfToken } from "../middleware/csrfMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  createTransactionSchema,
  updateTransactionSchema,
  objectIdParamSchema,
} from "../schemas/transactionBudgetSchemas.js";
import { Router } from "express";

const trasactionRouter = Router();

trasactionRouter.post(
  "/createTransaction",
  authenticate,
  validateCsrfToken,
  validateRequest({ body: createTransactionSchema }),
  createTransaction
);

trasactionRouter.get("/getTransactions", authenticate, getTransactions);

trasactionRouter.get("/yearlySummary", authenticate, yearlySummary);

trasactionRouter.get("/expVsincYearly", authenticate, expVsincYearly);

trasactionRouter.put(
  "/update/:id",
  authenticate,
  validateCsrfToken,
  validateRequest({ params: objectIdParamSchema, body: updateTransactionSchema }),
  updateTransaction
);

trasactionRouter.delete(
  "/delete/:id",
  authenticate,
  validateCsrfToken,
  validateRequest({ params: objectIdParamSchema }),
  deleteTransaction
);

export default trasactionRouter;