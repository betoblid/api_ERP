import express from "express"
import { PedidoController } from "../controller/pedido/pedeido.controller"
import { verifyToken, isAdminOrManager } from "../middleware/auth.middleware"

const pedidoRouter = express.Router()

pedidoRouter.use(verifyToken)

pedidoRouter.get("/pedido", PedidoController.listarTodos)
pedidoRouter.get("/pedido/:id", PedidoController.buscarPorId)
pedidoRouter.post("/pedido", PedidoController.criar)
pedidoRouter.put("/pedido/:id/status", PedidoController.atualizarStatus)
pedidoRouter.delete("/pedido/:id", isAdminOrManager, PedidoController.deletar)

export default pedidoRouter
