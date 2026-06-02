import { Router } from "express";
//import { createUser,showUser,showUserId,updateUser,deleteUser,createUserFK,loginUser } from "../controllers/user.controller.js";
import UserController from "../controllers/user.controller.js";
import UserScheme from "../schemes/user.schema.js";
import userMiddleware from "../middlewares/user.middleware.js";
import verifyToken from "../middlewares/auth.middleware.js";

const router = Router();

// Rutas públicas (sin autenticación)
router.post("/user", userMiddleware(UserScheme.createUser), UserController.createUser);
router.post("/login", UserController.loginUser);

// Rutas protegidas (requieren autenticación)
router.get("/user", verifyToken, UserController.showUser);
router.get("/user/:id", verifyToken, UserController.showUserId);
router.put("/user/:id", verifyToken, userMiddleware(UserScheme.updateUser), UserController.updateUser);
router.delete("/user/:id", verifyToken, UserController.deleteUser);
router.post("/user/initialize-categories", verifyToken, UserController.initializeMyCategories);

export default router;