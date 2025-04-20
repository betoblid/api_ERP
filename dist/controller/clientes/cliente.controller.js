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
exports.ClienteController = void 0;
const prisma_1 = require("../../prisma");
class ClienteController {
    // Buscar todos os clientes
    static getAllClientes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const clientes = yield prisma_1.prisma.cliente.findMany({
                    orderBy: { nome: "asc" },
                });
                res.json(clientes);
                return;
            }
            catch (error) {
                console.error("Get all clientes error:", error);
                res.status(500).json({ message: "Erro ao buscar clientes" });
                return;
            }
        });
    }
    // Buscar cliente por ID
    static getClienteById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const cliente = yield prisma_1.prisma.cliente.findUnique({
                    where: { id: parseInt(id) },
                    include: {
                        pedidos: {
                            orderBy: { data: "desc" },
                            take: 10,
                        },
                    },
                });
                if (!cliente) {
                    res.status(404).json({ message: "Cliente não encontrado" });
                    return;
                }
                res.json(cliente);
                return;
            }
            catch (error) {
                console.error("Get cliente by ID error:", error);
                res.status(500).json({ message: "Erro ao buscar cliente" });
                return;
            }
        });
    }
    // Criar novo cliente
    static createCliente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nome, tipoDocumento, documento, endereco, telefone, email } = req.body;
                const existingCliente = yield prisma_1.prisma.cliente.findFirst({
                    where: { documento },
                });
                if (existingCliente) {
                    res.status(400).json({ message: "Documento já cadastrado" });
                    return;
                }
                const newCliente = yield prisma_1.prisma.cliente.create({
                    data: {
                        nome,
                        tipoDocumento,
                        documento,
                        endereco,
                        telefone,
                        email,
                    },
                });
                res.status(201).json({
                    message: "Cliente criado com sucesso",
                    cliente: newCliente,
                });
                return;
            }
            catch (error) {
                console.error("Create cliente error:", error);
                res.status(500).json({ message: "Erro ao criar cliente" });
                return;
            }
        });
    }
    // Atualizar cliente existente
    static updateCliente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { nome, tipoDocumento, documento, endereco, telefone, email } = req.body;
                const cliente = yield prisma_1.prisma.cliente.findUnique({
                    where: { id: parseInt(id) },
                });
                if (!cliente) {
                    res.status(404).json({ message: "Cliente não encontrado" });
                    return;
                }
                if (documento) {
                    const existingCliente = yield prisma_1.prisma.cliente.findFirst({
                        where: {
                            documento,
                            NOT: { id: Number(id) },
                        },
                    });
                    if (existingCliente) {
                        res.status(400).json({ message: "Documento já cadastrado" });
                        return;
                    }
                }
                const updatedCliente = yield prisma_1.prisma.cliente.update({
                    where: { id: parseInt(id) },
                    data: {
                        nome: nome !== null && nome !== void 0 ? nome : cliente.nome,
                        tipoDocumento: tipoDocumento !== null && tipoDocumento !== void 0 ? tipoDocumento : cliente.tipoDocumento,
                        documento: documento !== null && documento !== void 0 ? documento : cliente.documento,
                        endereco: endereco !== null && endereco !== void 0 ? endereco : cliente.endereco,
                        telefone: telefone !== null && telefone !== void 0 ? telefone : cliente.telefone,
                        email: email !== null && email !== void 0 ? email : cliente.email,
                    },
                });
                res.json({
                    message: "Cliente atualizado com sucesso",
                    cliente: updatedCliente,
                });
                return;
            }
            catch (error) {
                console.error("Update cliente error:", error);
                res.status(500).json({ message: "Erro ao atualizar cliente" });
                return;
            }
        });
    }
    // Excluir cliente
    static deleteCliente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const cliente = yield prisma_1.prisma.cliente.findUnique({
                    where: { id: parseInt(id) },
                    include: { pedidos: true },
                });
                if (!cliente) {
                    res.status(404).json({ message: "Cliente não encontrado" });
                    return;
                }
                if (cliente.pedidos.length > 0) {
                    res.status(400).json({
                        message: "Não é possível excluir cliente com pedidos associados",
                    });
                    return;
                }
                yield prisma_1.prisma.cliente.delete({
                    where: { id: parseInt(id) },
                });
                res.json({ message: "Cliente excluído com sucesso" });
                return;
            }
            catch (error) {
                console.error("Delete cliente error:", error);
                res.status(500).json({ message: "Erro ao excluir cliente" });
                return;
            }
        });
    }
}
exports.ClienteController = ClienteController;
