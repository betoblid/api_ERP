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
exports.getDatasComOS = exports.deleteOrdemServico = exports.updateOrdemServico = exports.createOrdemServico = exports.getOrdemServicoById = exports.getAllOrdensServico = void 0;
const prisma_1 = require("../../prisma");
const getAllOrdensServico = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data, status, funcionarioId, busca, dataInicio: di, dataFim: df } = req.query;
        const where = {};
        if (data) {
            const dataFiltro = new Date(data);
            const inicio = new Date(dataFiltro);
            inicio.setHours(0, 0, 0, 0);
            const fim = new Date(dataFiltro);
            fim.setHours(23, 59, 59, 999);
            where.dataAbertura = { gte: inicio, lte: fim };
        }
        if (di && df) {
            const inicio = new Date(di);
            inicio.setHours(0, 0, 0, 0);
            const fim = new Date(df);
            fim.setHours(23, 59, 59, 999);
            where.dataAbertura = { gte: inicio, lte: fim };
        }
        if (status && status !== "todos") {
            where.status = status;
        }
        if (funcionarioId && funcionarioId !== "todos") {
            where.funcionarioId = Number(funcionarioId);
        }
        if (busca) {
            where.OR = [
                { titulo: { contains: busca, mode: "insensitive" } },
                { endereco: { contains: busca, mode: "insensitive" } },
                { cliente: { nome: { contains: busca, mode: "insensitive" } } },
            ];
        }
        const ordensServico = yield prisma_1.prisma.ordemServico.findMany({
            where,
            include: {
                cliente: { select: { id: true, nome: true } },
                funcionario: { select: { id: true, nome: true } },
            },
            orderBy: { dataAbertura: "desc" },
        });
        res.json(ordensServico);
    }
    catch (error) {
        console.error("Get all ordens de serviço error:", error);
        res.status(500).json({ message: "Erro ao buscar ordens de serviço" });
    }
});
exports.getAllOrdensServico = getAllOrdensServico;
const getOrdemServicoById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const ordemServico = yield prisma_1.prisma.ordemServico.findUnique({
            where: { id: Number(id) },
            include: {
                cliente: { select: { id: true, nome: true } },
                funcionario: { select: { id: true, nome: true } },
            },
        });
        if (!ordemServico) {
            res.status(404).json({ message: "Ordem de serviço não encontrada" });
            return;
        }
        res.json(ordemServico);
    }
    catch (error) {
        console.error("Get ordem de serviço by ID error:", error);
        res.status(500).json({ message: "Erro ao buscar ordem de serviço" });
    }
});
exports.getOrdemServicoById = getOrdemServicoById;
const createOrdemServico = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { titulo, clienteId, funcionarioId, status, endereco, horario, descricao, data_agendado } = req.body;
        if (!titulo || !clienteId || !funcionarioId || !status || !endereco || !horario || !data_agendado) {
            res.status(400).json({ message: "Todos os campos obrigatórios devem ser preenchidos" });
            return;
        }
        const cliente = yield prisma_1.prisma.cliente.findUnique({ where: { id: Number(clienteId) } });
        if (!cliente) {
            res.status(404).json({ message: "Cliente não encontrado" });
        }
        const funcionario = yield prisma_1.prisma.funcionario.findUnique({ where: { id: Number(funcionarioId) } });
        if (!funcionario) {
            res.status(404).json({ message: "Funcionário não encontrado" });
        }
        const novaOrdemServico = yield prisma_1.prisma.ordemServico.create({
            data: {
                titulo,
                clienteId: Number(clienteId),
                funcionarioId: Number(funcionarioId),
                status,
                localExecucao: endereco,
                dataAgendado: new Date(data_agendado),
                horarioExecucao: horario,
                descricao,
            },
            include: {
                cliente: { select: { id: true, nome: true } },
                funcionario: { select: { id: true, nome: true } },
            },
        });
        res.status(201).json({
            message: "Ordem de serviço criada com sucesso",
            ordemServico: novaOrdemServico,
        });
    }
    catch (error) {
        console.error("Create ordem de serviço error:", error);
        res.status(500).json({ message: "Erro ao criar ordem de serviço" });
    }
});
exports.createOrdemServico = createOrdemServico;
const updateOrdemServico = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { titulo, clienteId, funcionarioId, status, endereco, dataAbertura, horario, descricao } = req.body;
        const ordemServico = yield prisma_1.prisma.ordemServico.findUnique({ where: { id: Number(id) } });
        if (!ordemServico) {
            res.status(404).json({ message: "Ordem de serviço não encontrada" });
            return;
        }
        if (clienteId) {
            const cliente = yield prisma_1.prisma.cliente.findUnique({ where: { id: Number(clienteId) } });
            if (!cliente) {
                res.status(404).json({ message: "Cliente não encontrado" });
                return;
            }
        }
        if (funcionarioId) {
            const funcionario = yield prisma_1.prisma.funcionario.findUnique({ where: { id: Number(funcionarioId) } });
            if (!funcionario) {
                res.status(404).json({ message: "Funcionário não encontrado" });
                return;
            }
        }
        const updatedOrdemServico = yield prisma_1.prisma.ordemServico.update({
            where: { id: Number(id) },
            data: {
                titulo,
                clienteId: clienteId !== undefined ? Number(clienteId) : undefined,
                funcionarioId: funcionarioId !== undefined ? Number(funcionarioId) : undefined,
                status,
                localExecucao: endereco,
                dataAbertura: dataAbertura ? new Date(dataAbertura) : undefined,
                horarioExecucao: horario,
                descricao,
            },
            include: {
                cliente: { select: { id: true, nome: true } },
                funcionario: { select: { id: true, nome: true } },
            },
        });
        res.json({
            message: "Ordem de serviço atualizada com sucesso",
            ordemServico: updatedOrdemServico,
        });
    }
    catch (error) {
        console.error("Update ordem de serviço error:", error);
        res.status(500).json({ message: "Erro ao atualizar ordem de serviço" });
    }
});
exports.updateOrdemServico = updateOrdemServico;
const deleteOrdemServico = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const ordemServico = yield prisma_1.prisma.ordemServico.findUnique({ where: { id: Number(id) } });
        if (!ordemServico) {
            res.status(404).json({ message: "Ordem de serviço não encontrada" });
            return;
        }
        yield prisma_1.prisma.ordemServico.delete({ where: { id: Number(id) } });
        res.json({ message: "Ordem de serviço excluída com sucesso" });
    }
    catch (error) {
        console.error("Delete ordem de serviço error:", error);
        res.status(500).json({ message: "Erro ao excluir ordem de serviço" });
    }
});
exports.deleteOrdemServico = deleteOrdemServico;
const getDatasComOS = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { mes, ano } = req.query;
        let dataInicio, dataFim;
        if (mes && ano) {
            dataInicio = new Date(Number(ano), Number(mes) - 1, 1);
            dataFim = new Date(Number(ano), Number(mes), 0);
        }
        else {
            const hoje = new Date();
            dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
            dataFim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
        }
        const result = yield prisma_1.prisma.$queryRawUnsafe(`SELECT DISTINCT DATE(data_abertura) as data FROM "OrdemServico" WHERE data_abertura >= $1 AND data_abertura <= $2 ORDER BY data`, dataInicio, dataFim);
        const datas = result.map((item) => item.data.toISOString().split("T")[0]);
        res.json(datas);
    }
    catch (error) {
        console.error("Get datas com OS error:", error);
        res.status(500).json({ message: "Erro ao buscar datas com ordens de serviço" });
    }
});
exports.getDatasComOS = getDatasComOS;
