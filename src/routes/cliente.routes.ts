import express from "express"
import {
  ClienteController
} from "../controller/clientes/cliente.controller"
import { verifyToken, isAdminOrManager } from "../middleware/auth.middleware"

const clienteRouter = express.Router()

// Apply auth middleware to all routes
clienteRouter.use(verifyToken)

// Get all clientes (all authenticated users)
clienteRouter.get("/clientes", ClienteController.getAllClientes)

// Get cliente by ID (all authenticated users)
clienteRouter.get("/cliente/:id", ClienteController.getClienteById)

// Create cliente (admin or manager only)
clienteRouter.post("/cliente/register", isAdminOrManager, ClienteController.createCliente)

// Update cliente (admin or manager only)
clienteRouter.put("/clientes/:id", isAdminOrManager, ClienteController.updateCliente)

// Delete cliente (admin or manager only)
clienteRouter.delete("/cliente/:id", isAdminOrManager, ClienteController.deleteCliente)

export default clienteRouter

