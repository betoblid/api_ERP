"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cliente_controller_1 = require("../controller/clientes/cliente.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const clienteRouter = express_1.default.Router();
// Apply auth middleware to all routes
clienteRouter.use(auth_middleware_1.verifyToken);
// Get all clientes (all authenticated users)
clienteRouter.get("/clientes", cliente_controller_1.ClienteController.getAllClientes);
// Get cliente by ID (all authenticated users)
clienteRouter.get("/cliente/:id", cliente_controller_1.ClienteController.getClienteById);
// Create cliente (admin or manager only)
clienteRouter.post("/cliente/register", auth_middleware_1.isAdminOrManager, cliente_controller_1.ClienteController.createCliente);
// Update cliente (admin or manager only)
clienteRouter.put("/clientes/:id", auth_middleware_1.isAdminOrManager, cliente_controller_1.ClienteController.updateCliente);
// Delete cliente (admin or manager only)
clienteRouter.delete("/cliente/:id", auth_middleware_1.isAdminOrManager, cliente_controller_1.ClienteController.deleteCliente);
exports.default = clienteRouter;
