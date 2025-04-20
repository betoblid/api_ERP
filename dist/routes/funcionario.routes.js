"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const funcionario_controller_1 = require("../controller/funcionario/funcionario.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const funcionarioRoute = (0, express_1.Router)();
funcionarioRoute.use(auth_middleware_1.verifyToken);
// Todas as rotas protegidas por token
funcionarioRoute.get("/funcionario", funcionario_controller_1.FuncionarioController.getAll);
funcionarioRoute.get("/funcionario/:id", funcionario_controller_1.FuncionarioController.getById);
funcionarioRoute.post("/funcionario/", auth_middleware_1.isAdminOrManager, funcionario_controller_1.FuncionarioController.create);
funcionarioRoute.put("/funcionario/:id", auth_middleware_1.isAdminOrManager, funcionario_controller_1.FuncionarioController.update);
funcionarioRoute.delete("/funcionario/:id", auth_middleware_1.isAdminOrManager, funcionario_controller_1.FuncionarioController.delete);
exports.default = funcionarioRoute;
