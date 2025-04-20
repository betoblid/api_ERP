"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PontoController = void 0;
const prisma_1 = require("../../prisma");
class PontoController {
    static getPontosByFuncionarioId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { funcionarioId } = req.params;
                const id = Number(funcionarioId);
                const funcionario = yield prisma_1.prisma.funcionario.findUnique({ where: { id } });
                if (!funcionario) {
                    res.status(404).json({ message: "Funcionário não encontrado" });
                    return;
                }
                const pontos = yield prisma_1.prisma.ponto.findMany({
                    where: { funcionarioId: id },
                    orderBy: { timestamp: "desc" },
                });
                res.json(pontos);
                return;
            }
            catch (error) {
                console.error("Get pontos by funcionario ID error:", error);
                res.status(500).json({ message: "Erro ao buscar pontos" });
                return;
            }
        });
    }
    static registrarPonto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = req; // Aqui você força o tipo
            try {
                const { tipo, funcionarioId } = req.body;
                if (user.funcionarioId !== funcionarioId && !["admin", "gerente"].includes(user.role)) {
                    res.status(403).json({
                        message: "Você só pode registrar ponto para o seu próprio funcionário",
                    });
                    return;
                }
                const funcionario = yield prisma_1.prisma.funcionario.findUnique({
                    where: { id: funcionarioId },
                });
                if (!funcionario) {
                    res.status(404).json({ message: "Funcionário não encontrado" });
                    return;
                }
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);
                const existingPonto = yield prisma_1.prisma.ponto.findFirst({
                    where: {
                        funcionarioId,
                        tipo,
                        timestamp: {
                            gte: today,
                            lt: tomorrow,
                        },
                    },
                });
                if (existingPonto) {
                    res.status(400).json({
                        message: `Ponto de ${tipo} já registrado hoje`,
                    });
                    return;
                }
                const ponto = yield prisma_1.prisma.ponto.create({
                    data: { tipo, funcionarioId },
                });
                res.status(201).json({
                    message: "Ponto registrado com sucesso",
                    ponto,
                });
                return;
            }
            catch (error) {
                console.error("Register ponto error:", error);
                res.status(500).json({ message: "Erro ao registrar ponto" });
                return;
            }
        });
    }
    static deletarPonto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = req; // Aqui você força o tipo
            try {
                const { id } = req.params;
                const pontoId = Number(id);
                if (!["admin", "gerente"].includes(user === null || user === void 0 ? void 0 : user.role)) {
                    res.status(403).json({
                        message: "Apenas administradores e gerentes podem excluir pontos",
                    });
                    return;
                }
                const ponto = yield prisma_1.prisma.ponto.findUnique({
                    where: { id: pontoId },
                });
                if (!ponto) {
                    res.status(404).json({ message: "Ponto não encontrado" });
                    return;
                }
                yield prisma_1.prisma.ponto.delete({
                    where: { id: pontoId },
                });
                res.json({ message: "Ponto excluído com sucesso" });
                return;
            }
            catch (error) {
                console.error("Delete ponto error:", error);
                res.status(500).json({ message: "Erro ao excluir ponto" });
                return;
            }
        });
    }
}
exports.PontoController = PontoController;
