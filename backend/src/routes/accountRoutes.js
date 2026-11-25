import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { validateCsrfToken } from "../middleware/csrfMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  createAccountSchema,
  updateAccountSchema,
  objectIdParamSchema,
} from "../schemas/accountCategorySchemas.js";
import { createAccount, getAccounts, updateAccount, deleteAccount } from "../controllers/accountControllers.js";

const accountRouter = Router();

accountRouter.post(
  "/createAccount",
  authenticate,
  validateCsrfToken,
  validateRequest({ body: createAccountSchema }),
  createAccount
);

accountRouter.get("/getAccounts", authenticate, getAccounts);

// accountRouter.get('/monthlySummary',authenticate,monthlySummary)

accountRouter.put(
  "/update/:id",
  authenticate,
  validateCsrfToken,
  validateRequest({ params: objectIdParamSchema, body: updateAccountSchema }),
  updateAccount
);

accountRouter.delete(
  "/delete/:id",
  authenticate,
  validateCsrfToken,
  validateRequest({ params: objectIdParamSchema }),
  deleteAccount
);

export default accountRouter;