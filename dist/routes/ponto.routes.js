"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const ponto_controller_1 = require("../controller/ponto/ponto.controller");
const pontoRouter = (0, express_1.Router)();
// Middleware de autenticação para todas as rotas
pontoRouter.use(auth_middleware_1.verifyToken);
// Buscar pontos por funcionário
pontoRouter.get("/funcionario/ponto/:funcionarioId", ponto_controller_1.PontoController.getPontosByFuncionarioId);
// Registrar ponto
pontoRouter.post("/funcionario/ponto", ponto_controller_1.PontoController.registrarPonto);
// Deletar ponto (admin ou gerente)
pontoRouter.delete("/funcionario/ponto/:id", ponto_controller_1.PontoController.deletarPonto);
exports.default = pontoRouter;
