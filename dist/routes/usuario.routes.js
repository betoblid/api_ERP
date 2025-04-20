"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usuarioController_1 = require("../controller/usuario/usuarioController");
const auth_middleware_1 = require("../middleware/auth.middleware");
const RouteUser = express_1.default.Router();
// Middleware personalizado para verificar se é o próprio usuário ou admin
const isSelfOrAdmin = (req, res, next) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) === Number(req.params.id)) {
        return next();
    }
    return (0, auth_middleware_1.isAdmin)(req, res, next);
};
// Middleware de autenticação para todas as rotas
RouteUser.use(auth_middleware_1.verifyToken);
// Rotas
RouteUser.get("/usuarios", auth_middleware_1.isAdmin, usuarioController_1.UserController.getAllUsers);
RouteUser.get("/usuarios/:id", isSelfOrAdmin, usuarioController_1.UserController.getUserById);
RouteUser.put("/usuarios/:id", auth_middleware_1.isAdmin, usuarioController_1.UserController.updateUser);
RouteUser.put("/usuarios/:id/change-password", isSelfOrAdmin, usuarioController_1.UserController.changePassword);
RouteUser.delete("/usuarios/:id", auth_middleware_1.isAdmin, usuarioController_1.UserController.deleteUser);
RouteUser.put("/usuarios/:id/reactivate", auth_middleware_1.isAdmin, usuarioController_1.UserController.reactivateUser);
exports.default = RouteUser;
