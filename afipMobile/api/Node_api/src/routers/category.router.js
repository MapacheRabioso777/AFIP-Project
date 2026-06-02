import { Router } from "express";
import {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} from "../controllers/category.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";
import validateSchema from "../middlewares/user.middleware.js";
import CategoryScheme from "../schemes/category.schema.js";

const router = Router();

// Todas las rutas de categorías requieren autenticación
router.post("/categorias", verifyToken, validateSchema(CategoryScheme.createCategory), createCategory);
router.get("/categorias", verifyToken, getCategories);
router.get("/categorias/:id", verifyToken, getCategoryById);
router.put("/categorias/:id", verifyToken, validateSchema(CategoryScheme.updateCategory), updateCategory);
router.delete("/categorias/:id", verifyToken, deleteCategory);

export default router;