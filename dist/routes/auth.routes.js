"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controller/auth/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const AuthRouter = (0, express_1.Router)();
// Login route
AuthRouter.post("/login", auth_controller_1.AuthController.login);
// Register route (admin only)
AuthRouter.post("/register", auth_middleware_1.verifyToken, auth_middleware_1.isAdmin, auth_controller_1.AuthController.register);
// Get current user route
AuthRouter.get("/me", auth_middleware_1.verifyToken, auth_controller_1.AuthController.getCurrentUser);
exports.default = AuthRouter;
