"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ordem_servico_controller_1 = require("../controller/ordem/ordem-servico.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// Middleware de autenticação em todas as rotas
router.use(auth_middleware_1.verifyToken);
// Rota para listar todas as ordens de serviço com filtros
router.get("/ordem/listar", ordem_servico_controller_1.getAllOrdensServico);
// Rota para obter todas as datas com ordens de serviço registradas
router.get("/datas-registradas", ordem_servico_controller_1.getDatasComOS);
// Rota para obter uma ordem de serviço específica pelo ID
router.get("/detalhes/:id", ordem_servico_controller_1.getOrdemServicoById);
// Rota para criar uma nova ordem de serviço
router.post("/orderm/criar", ordem_servico_controller_1.createOrdemServico);
// Rota para atualizar uma ordem de serviço existente
router.put("/atualizar/:id", auth_middleware_1.isAdminOrManager, ordem_servico_controller_1.updateOrdemServico);
// Rota para excluir uma ordem de serviço
router.delete("/excluir/:id", auth_middleware_1.isAdminOrManager, ordem_servico_controller_1.deleteOrdemServico);
exports.default = router;
