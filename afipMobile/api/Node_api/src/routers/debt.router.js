import express from "express";
import { createDebt, getDebts, getDebtById, updateDebt, deleteDebt } from "../controllers/debt.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";
import validateSchema from "../middlewares/user.middleware.js";
import DebtScheme from "../schemes/debt.schema.js";

const router = express.Router();

// Todas las rutas de deuda requieren autenticación
router.post("/deuda", verifyToken, validateSchema(DebtScheme.createDebt), createDebt);
router.get("/deuda", verifyToken, getDebts);
router.get("/deuda/:id", verifyToken, getDebtById);
router.put("/deuda/:id", verifyToken, validateSchema(DebtScheme.updateDebt), updateDebt);
router.delete("/deuda/:id", verifyToken, deleteDebt);

export default router;