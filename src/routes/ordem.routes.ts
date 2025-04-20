import express from "express"
import {
  getAllOrdensServico,
  getOrdemServicoById,
  createOrdemServico,
  updateOrdemServico,
  deleteOrdemServico,
  getDatasComOS,
} from "../controller/ordem/ordem-servico.controller"
import { verifyToken, isAdminOrManager } from "../middleware/auth.middleware"


const router = express.Router()

// Middleware de autenticação em todas as rotas
router.use(verifyToken)

// Rota para listar todas as ordens de serviço com filtros
router.get("/ordem/listar", getAllOrdensServico)

// Rota para obter todas as datas com ordens de serviço registradas
router.get("/datas-registradas", getDatasComOS)

// Rota para obter uma ordem de serviço específica pelo ID
router.get("/detalhes/:id", getOrdemServicoById)

// Rota para criar uma nova ordem de serviço
router.post("/orderm/criar", createOrdemServico)

// Rota para atualizar uma ordem de serviço existente
router.put("/atualizar/:id", isAdminOrManager, updateOrdemServico)

// Rota para excluir uma ordem de serviço
router.delete("/excluir/:id", isAdminOrManager, deleteOrdemServico)

export default router
