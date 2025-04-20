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
exports.FuncionarioController = void 0;
const prisma_1 = require("../../prisma");
class FuncionarioController {
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const funcionarios = yield prisma_1.prisma.funcionario.findMany({
                    orderBy: { nome: "asc" },
                    include: { usuarios: true },
                });
                res.json(funcionarios);
                return;
            }
            catch (error) {
                console.error("Get all funcionarios error:", error);
                res.status(500).json({ message: "Erro ao buscar funcionários" });
                return;
            }
        });
    }
    static getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const funcionario = yield prisma_1.prisma.funcionario.findUnique({
                    where: { id: Number(id) },
                    include: {
                        usuarios: {
                            select: {
                                id: true,
                                username: true,
                                email: true,
                                role: true,
                                ativo: true,
                            },
                        },
                        pontos: {
                            orderBy: { timestamp: "desc" },
                            take: 50,
                        },
                    },
                });
                if (!funcionario) {
                    res.status(404).json({ message: "Funcionário não encontrado" });
                    return;
                }
                res.json(funcionario);
                return;
            }
            catch (error) {
                console.error("Get funcionario by ID error:", error);
                res.status(500).json({ message: "Erro ao buscar funcionário" });
                return;
            }
        });
    }
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nome, cpf, cargo, email, jornadaInicio, jornadaFim } = req.body;
                const existingFuncionario = yield prisma_1.prisma.funcionario.findFirst({
                    where: {
                        OR: [{ cpf }, { email }],
                    },
                });
                if (existingFuncionario) {
                    res.status(400).json({ message: "CPF ou email já cadastrado" });
                    return;
                }
                const newFuncionario = yield prisma_1.prisma.funcionario.create({
                    data: {
                        nome,
                        cpf,
                        cargo,
                        email,
                        jornadaInicio,
                        jornadaFim,
                    },
                });
                res.status(201).json({
                    message: "Funcionário criado com sucesso",
                    funcionario: newFuncionario,
                });
                return;
            }
            catch (error) {
                console.error("Create funcionario error:", error);
                res.status(500).json({ message: "Erro ao criar funcionário" });
                return;
            }
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { nome, cpf, cargo, email, jornadaInicio, jornadaFim } = req.body;
                const funcionario = yield prisma_1.prisma.funcionario.findUnique({
                    where: { id: Number(id) },
                });
                if (!funcionario) {
                    res.status(404).json({ message: "Funcionário não encontrado" });
                    return;
                }
                if (cpf || email) {
                    const existingFuncionario = yield prisma_1.prisma.funcionario.findFirst({
                        where: {
                            OR: [cpf ? { cpf } : {}, email ? { email } : {}],
                            NOT: { id: Number(id) },
                        },
                    });
                    if (existingFuncionario) {
                        res.status(400).json({ message: "CPF ou email já cadastrado" });
                        return;
                    }
                }
                const updatedFuncionario = yield prisma_1.prisma.funcionario.update({
                    where: { id: Number(id) },
                    data: {
                        nome: nome !== null && nome !== void 0 ? nome : undefined,
                        cpf: cpf !== null && cpf !== void 0 ? cpf : undefined,
                        cargo: cargo !== null && cargo !== void 0 ? cargo : undefined,
                        email: email !== null && email !== void 0 ? email : undefined,
                        jornadaInicio: jornadaInicio !== null && jornadaInicio !== void 0 ? jornadaInicio : undefined,
                        jornadaFim: jornadaFim !== null && jornadaFim !== void 0 ? jornadaFim : undefined,
                    },
                });
                res.json({
                    message: "Funcionário atualizado com sucesso",
                    funcionario: updatedFuncionario,
                });
                return;
            }
            catch (error) {
                console.error("Update funcionario error:", error);
                res.status(500).json({ message: "Erro ao atualizar funcionário" });
                return;
            }
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const funcionario = yield prisma_1.prisma.funcionario.findUnique({
                    where: { id: Number(id) },
                    include: { usuarios: true },
                });
                if (!funcionario) {
                    res.status(404).json({ message: "Funcionário não encontrado" });
                    return;
                }
                if (funcionario.usuarios.length > 0) {
                    res.status(400).json({
                        message: "Não é possível excluir funcionário com usuários associados. Desvincule os usuários primeiro.",
                    });
                    return;
                }
                yield prisma_1.prisma.funcionario.delete({
                    where: { id: Number(id) },
                });
                res.json({ message: "Funcionário excluído com sucesso" });
                return;
            }
            catch (error) {
                console.error("Delete funcionario error:", error);
                res.status(500).json({ message: "Erro ao excluir funcionário" });
                return;
            }
        });
    }
}
exports.FuncionarioController = FuncionarioController;
