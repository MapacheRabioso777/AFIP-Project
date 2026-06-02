import { Router } from "express";
import {
    createAccount,
    getAccounts,
    getAccountById,
    updateAccount,
    deleteAccount
} from "../controllers/account.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";
import validateSchema from "../middlewares/user.middleware.js";
import AccountScheme from "../schemes/account.schema.js";

const router = Router();

// Todas las rutas de cuentas requieren autenticación
router.post("/cuentas", verifyToken, validateSchema(AccountScheme.createAccount), createAccount);
router.get("/cuentas", verifyToken, getAccounts);
router.get("/cuentas/:id", verifyToken, getAccountById);
router.put("/cuentas/:id", verifyToken, validateSchema(AccountScheme.updateAccount), updateAccount);
router.delete("/cuentas/:id", verifyToken, deleteAccount);

export default router;