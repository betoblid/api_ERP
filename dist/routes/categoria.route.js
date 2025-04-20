"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categoria_controller_1 = require("../controller/categoria/categoria.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const categoriaRouter = express_1.default.Router();
// Aplica o middleware de autenticação em todas as rotas
categoriaRouter.use(auth_middleware_1.verifyToken);
// Listar todas as categorias
categoriaRouter.get("/categoria", (req, res) => categoria_controller_1.CategoriaController.getAllCategorias(req, res));
// Buscar uma categoria por ID
categoriaRouter.get("/categoria/:id", (req, res) => categoria_controller_1.CategoriaController.getCategoriaById(req, res));
// Criar uma nova categoria (somente admin ou gerente)
categoriaRouter.post("/categoria", auth_middleware_1.isAdminOrManager, (req, res) => categoria_controller_1.CategoriaController.createCategoria(req, res));
// Atualizar uma categoria existente (somente admin ou gerente)
categoriaRouter.put("/categoria/:id", auth_middleware_1.isAdminOrManager, (req, res) => categoria_controller_1.CategoriaController.updateCategoria(req, res));
// Deletar uma categoria (somente admin ou gerente)
categoriaRouter.delete("/categoria/:id", auth_middleware_1.isAdminOrManager, (req, res) => categoria_controller_1.CategoriaController.deleteCategoria(req, res));
exports.default = categoriaRouter;
