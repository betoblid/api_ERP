import express from "express"
import { CategoriaController } from "../controller/categoria/categoria.controller"
import { verifyToken, isAdminOrManager } from "../middleware/auth.middleware"

const categoriaRouter = express.Router()

// Aplica o middleware de autenticação em todas as rotas
categoriaRouter.use(verifyToken)

// Listar todas as categorias
categoriaRouter.get("/categoria", (req, res) => CategoriaController.getAllCategorias(req, res))

// Buscar uma categoria por ID
categoriaRouter.get("/categoria/:id", (req, res) => CategoriaController.getCategoriaById(req, res))

// Criar uma nova categoria (somente admin ou gerente)
categoriaRouter.post("/categoria", isAdminOrManager, (req, res) => CategoriaController.createCategoria(req, res))

// Atualizar uma categoria existente (somente admin ou gerente)
categoriaRouter.put("/categoria/:id", isAdminOrManager, (req, res) => CategoriaController.updateCategoria(req, res))

// Deletar uma categoria (somente admin ou gerente)
categoriaRouter.delete("/categoria/:id", isAdminOrManager, (req, res) => CategoriaController.deleteCategoria(req, res))

export default categoriaRouter
