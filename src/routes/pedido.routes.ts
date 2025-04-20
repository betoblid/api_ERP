import express from "express"
import { verifyToken, isAdminOrManager } from "../middleware/auth.middleware"
import { PedidoController } from "../controller/pedido/pedido.controller"

const pedidoRouter = express.Router()

pedidoRouter.use(verifyToken)

pedidoRouter.get("/pedido", PedidoController.listarTodos)
pedidoRouter.get("/pedido/:id", PedidoController.buscarPorId)
pedidoRouter.post("/pedido", PedidoController.criar)
pedidoRouter.put("/pedido/:id/status", PedidoController.atualizarStatus)
pedidoRouter.put("/pedido/:id/finalizar", PedidoController.finalizarPedido)
pedidoRouter.delete("/pedido/:id", isAdminOrManager, PedidoController.deletar)

export default pedidoRouter
