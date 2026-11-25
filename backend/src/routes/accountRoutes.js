import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { validateCsrfToken } from "../middleware/csrfMiddleware.js";
import { createAccount,getAccounts,updateAccount,deleteAccount } from "../controllers/accountControllers.js";

const accountRouter = Router()

accountRouter.post('/createAccount',authenticate,validateCsrfToken,createAccount)

accountRouter.get('/getAccounts',authenticate,getAccounts)

// accountRouter.get('/monthlySummary',authenticate,monthlySummary)

accountRouter.put('/update/:id',authenticate,validateCsrfToken,updateAccount)

accountRouter.delete('/delete/:id',authenticate,validateCsrfToken,deleteAccount)

export default accountRouter