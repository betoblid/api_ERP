"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const pedido_controller_1 = require("../controller/pedido/pedido.controller");
const pedidoRouter = express_1.default.Router();
pedidoRouter.use(auth_middleware_1.verifyToken);
pedidoRouter.get("/pedido", pedido_controller_1.PedidoController.listarTodos);
pedidoRouter.get("/pedido/:id", pedido_controller_1.PedidoController.buscarPorId);
pedidoRouter.post("/pedido", pedido_controller_1.PedidoController.criar);
pedidoRouter.put("/pedido/:id/status", pedido_controller_1.PedidoController.atualizarStatus);
pedidoRouter.put("/pedido/:id/finalizar", pedido_controller_1.PedidoController.finalizarPedido);
pedidoRouter.delete("/pedido/:id", auth_middleware_1.isAdminOrManager, pedido_controller_1.PedidoController.deletar);
exports.default = pedidoRouter;
