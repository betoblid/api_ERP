import { Router } from "express"
import { ProdutoController } from "../controller/produto/produto.controller"
import { verifyToken } from "../middleware/auth.middleware"

const produtoRouter = Router()

// Acesso público (apenas autenticado)
produtoRouter.get("/produto", verifyToken, ProdutoController.getAll)
produtoRouter.get("/produto/:id", verifyToken, ProdutoController.getById)

// Acesso protegido (modificação de dados)
produtoRouter.post("/produto", verifyToken, ProdutoController.create)
produtoRouter.put("/produto/:id", verifyToken, ProdutoController.update)
produtoRouter.delete("/produto/:id", verifyToken, ProdutoController.delete)

export default produtoRouter
