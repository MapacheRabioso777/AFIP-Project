import express from "express";
import { createDebtPayment, getAllDebtPayments, getDebtPaymentById, updateDebtPayment, deleteDebtPayment } from "../controllers/debtPayment.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";
import validateSchema from "../middlewares/user.middleware.js";
import DebtPaymentScheme from "../schemes/debtPayment.schema.js";

const router = express.Router();

// Todas las rutas de pagos de deuda requieren autenticación
router.post("/pago-deuda", verifyToken, validateSchema(DebtPaymentScheme.createDebtPayment), createDebtPayment);
router.get("/pago-deuda", verifyToken, getAllDebtPayments);
router.get("/pago-deuda/:id", verifyToken, getDebtPaymentById);
router.put("/pago-deuda/:id", verifyToken, validateSchema(DebtPaymentScheme.updateDebtPayment), updateDebtPayment);
router.delete("/pago-deuda/:id", verifyToken, deleteDebtPayment);

export default router;