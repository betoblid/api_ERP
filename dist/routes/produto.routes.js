"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const produto_controller_1 = require("../controller/produto/produto.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const produtoRouter = (0, express_1.Router)();
// Acesso público (apenas autenticado)
produtoRouter.get("/produto", auth_middleware_1.verifyToken, produto_controller_1.ProdutoController.getAll);
produtoRouter.get("/produto/:id", auth_middleware_1.verifyToken, produto_controller_1.ProdutoController.getById);
// Acesso protegido (modificação de dados)
produtoRouter.post("/produto", auth_middleware_1.verifyToken, produto_controller_1.ProdutoController.create);
produtoRouter.put("/produto/:id", auth_middleware_1.verifyToken, produto_controller_1.ProdutoController.update);
produtoRouter.delete("/produto/:id", auth_middleware_1.verifyToken, produto_controller_1.ProdutoController.delete);
exports.default = produtoRouter;
