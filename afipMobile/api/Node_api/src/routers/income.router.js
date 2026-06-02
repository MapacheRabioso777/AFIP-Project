import { Router } from "express";
import {
    createIncome,
    getIncomes,
    getIncomeById,
    updateIncome,
    deleteIncome
} from "../controllers/income.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";
import validateSchema from "../middlewares/user.middleware.js";
import IncomeScheme from "../schemes/income.schema.js";

const router = Router();

// Todas las rutas de ingresos requieren autenticación
router.post("/ingresos", verifyToken, validateSchema(IncomeScheme.createIncome), createIncome);
router.get("/ingresos", verifyToken, getIncomes);
router.get("/ingresos/:id", verifyToken, getIncomeById);
router.put("/ingresos/:id", verifyToken, validateSchema(IncomeScheme.updateIncome), updateIncome);
router.delete("/ingresos/:id", verifyToken, deleteIncome);

export default router;