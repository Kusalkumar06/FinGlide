import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { validateCsrfToken } from "../middleware/csrfMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  createCategorySchema,
  updateCategorySchema,
  objectIdParamSchema,
} from "../schemas/accountCategorySchemas.js";
import { createCategory, getCategories, updateCategory, deleteCategory, getPieData } from "../controllers/categoryControllers.js";

const categoryRouter = Router();

categoryRouter.post(
  "/createCategory",
  authenticate,
  validateCsrfToken,
  validateRequest({ body: createCategorySchema }),
  createCategory
);

categoryRouter.get("/getCategories", authenticate, getCategories);

categoryRouter.get("/getPieData", authenticate, getPieData);

categoryRouter.put(
  "/update/:id",
  authenticate,
  validateCsrfToken,
  validateRequest({ params: objectIdParamSchema, body: updateCategorySchema }),
  updateCategory
);

categoryRouter.delete(
  "/delete/:id",
  authenticate,
  validateCsrfToken,
  validateRequest({ params: objectIdParamSchema }),
  deleteCategory
);

export default categoryRouter;