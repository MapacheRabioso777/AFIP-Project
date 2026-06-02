import { Router } from "express";
import { createBudget, getBudgets, getBudgetById, updateBudget, deleteBudget }
    from "../controllers/budget.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";
import validateSchema from "../middlewares/user.middleware.js";
import BudgetScheme from "../schemes/budget.schema.js";

const router = Router();

// Todas las rutas de presupuesto requieren autenticación
router.post("/presupuesto", verifyToken, validateSchema(BudgetScheme.createBudget), createBudget);
router.get("/presupuesto", verifyToken, getBudgets);
router.get("/presupuesto/:id", verifyToken, getBudgetById);
router.put("/presupuesto/:id", verifyToken, validateSchema(BudgetScheme.updateBudget), updateBudget);
router.delete("/presupuesto/:id", verifyToken, deleteBudget);

export default router;