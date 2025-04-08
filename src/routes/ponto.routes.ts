import { Router } from "express"
import { verifyToken } from "../middleware/auth.middleware"
import { PontoController } from "../controller/ponto/ponto.controller"

const pontoRouter = Router()

// Middleware de autenticação para todas as rotas
pontoRouter.use(verifyToken)

// Buscar pontos por funcionário
pontoRouter.get("/funcionario/ponto/:funcionarioId", PontoController.getPontosByFuncionarioId)

// Registrar ponto
pontoRouter.post("/funcionario/ponto", PontoController.registrarPonto)

// Deletar ponto (admin ou gerente)
pontoRouter.delete("/funcionario/ponto/:id", PontoController.deletarPonto)

export default pontoRouter
