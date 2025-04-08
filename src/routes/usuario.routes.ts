import express, { Request, Response, NextFunction } from "express"
import {
 UserController
} from "../controller/usuario/usuarioController"
import {verifyToken,isAdmin } from "../middleware/auth.middleware"

const RouteUser = express.Router()

// Middleware personalizado para verificar se é o próprio usuário ou admin
const isSelfOrAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.id === Number(req.params.id)) {
    return next()
  }
  return isAdmin(req, res, next)
}

// Middleware de autenticação para todas as rotas
RouteUser.use(verifyToken)

// Rotas
RouteUser.get("/usuarios", isAdmin, UserController.getAllUsers)
RouteUser.get("/usuarios/:id", isSelfOrAdmin, UserController.getUserById)
RouteUser.put("/usuarios/:id", isAdmin, UserController.updateUser)
RouteUser.put("/usuarios/:id/change-password", isSelfOrAdmin, UserController.changePassword)
RouteUser.delete("/usuarios/:id", isAdmin, UserController.deleteUser)
RouteUser.put("/usuarios/:id/reactivate", isAdmin, UserController.reactivateUser)

export default RouteUser
