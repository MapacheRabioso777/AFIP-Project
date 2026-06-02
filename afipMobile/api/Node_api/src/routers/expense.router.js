import { Router } from "express";
import {
    createExpense,
    getExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense
} from "../controllers/expense.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";
import validateSchema from "../middlewares/user.middleware.js";
import ExpenseScheme from "../schemes/expense.schema.js";

const router = Router();

// Todas las rutas de gastos requieren autenticación
router.post("/gastos", verifyToken, validateSchema(ExpenseScheme.createExpense), createExpense);
router.get("/gastos", verifyToken, getExpenses);
router.get("/gastos/:id", verifyToken, getExpenseById);
router.put("/gastos/:id", verifyToken, validateSchema(ExpenseScheme.updateExpense), updateExpense);
router.delete("/gastos/:id", verifyToken, deleteExpense);

export default router;