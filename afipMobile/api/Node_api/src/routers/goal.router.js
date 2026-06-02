import { Router } from "express";
import {
    createGoal,
    getGoals,
    getGoalById,
    updateGoal,
    deleteGoal
} from "../controllers/goal.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";
import validateSchema from "../middlewares/user.middleware.js";
import GoalScheme from "../schemes/goal.schema.js";

const router = Router();

// Todas las rutas de metas requieren autenticación
router.post("/metas", verifyToken, validateSchema(GoalScheme.createGoal), createGoal);
router.get("/metas", verifyToken, getGoals);
router.get("/metas/:id", verifyToken, getGoalById);
router.put("/metas/:id", verifyToken, validateSchema(GoalScheme.updateGoal), updateGoal);
router.delete("/metas/:id", verifyToken, deleteGoal);

export default router;