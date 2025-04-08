import { Router } from "express"
import { FuncionarioController } from "../controller/funcionario/funcionario.controller"
import { verifyToken, isAdminOrManager } from "../middleware/auth.middleware"

const funcionarioRoute = Router()

funcionarioRoute.use(verifyToken)

// Todas as rotas protegidas por token
funcionarioRoute.get("/funcionario", FuncionarioController.getAll)
funcionarioRoute.get("/funcionario/:id", FuncionarioController.getById)
funcionarioRoute.post("/funcionario/", isAdminOrManager, FuncionarioController.create)
funcionarioRoute.put("/funcionario/:id", isAdminOrManager, FuncionarioController.update)
funcionarioRoute.delete("/funcionario/:id", isAdminOrManager, FuncionarioController.delete)

export default funcionarioRoute
