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
exports.PedidoController = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../prisma");
class PedidoController {
    static listarTodos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pedidos = yield prisma_1.prisma.pedido.findMany({
                    include: {
                        cliente: true,
                        itens: {
                            include: {
                                produto: true,
                            },
                        },
                        ocorrencias: true
                    },
                    orderBy: { data: "desc" },
                });
                res.json(pedidos);
            }
            catch (error) {
                console.error("Erro ao buscar pedidos:", error);
                res.status(500).json({ message: "Erro ao buscar pedidos" });
            }
        });
    }
    static buscarPorId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const pedido = yield prisma_1.prisma.pedido.findUnique({
                    where: { id: Number(id) },
                    include: {
                        cliente: true,
                        itens: { include: { produto: true } },
                    },
                });
                if (!pedido) {
                    res.status(404).json({ message: "Pedido não encontrado" });
                    return;
                }
                res.json(pedido);
            }
            catch (error) {
                console.error("Erro ao buscar pedido:", error);
                res.status(500).json({ message: "Erro ao buscar pedido" });
                return;
            }
        });
    }
    static criar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { status, data, horario, endereco, clienteId, itens } = req.body;
                const cliente = yield prisma_1.prisma.cliente.findUnique({ where: { id: Number(clienteId) } });
                if (!cliente) {
                    res.status(404).json({ message: "Cliente não encontrado" });
                    return;
                }
                // const existente = await prisma.pedido.findFirst({ where: { numero } })
                // if (existente) {
                //     res.status(400).json({ message: "Número de pedido já existe" });
                //     return;
                // }
                if (!itens || !Array.isArray(itens) || itens.length === 0) {
                    res.status(400).json({ message: "Pedido deve ter pelo menos um item" });
                    return;
                }
                for (const item of itens) {
                    const produto = yield prisma_1.prisma.produto.findUnique({ where: { id: Number(item.id) } });
                    if (!produto) {
                        res.status(404).json({ message: `Produto ID ${item.produtoId} não encontrado` });
                        return;
                    }
                    if (produto.estoqueAtual < item.quantidade) {
                        res.status(400).json({ message: `Estoque insuficiente para ${produto.nome}` });
                        return;
                    }
                }
                const novoPedido = yield prisma_1.prisma.pedido.create({
                    data: {
                        status,
                        data: data ? new Date(data) : undefined,
                        horario,
                        endereco,
                        clienteId: Number(clienteId),
                        itens: {
                            create: itens.map((item) => ({
                                quantidade: Number(item.quantidade),
                                precoUnitario: Number(item.preco),
                                produtoId: Number(item.id),
                            })),
                        },
                    },
                    include: {
                        cliente: true,
                        itens: { include: { produto: true } },
                    },
                });
                // for (const item of itens) {
                //     const quantidadeItem = Number(quantidade)
                //     await prisma.produto.update({
                //         where: { id: Number(item.produtoId) },
                //         data: { estoqueAtual: { decrement: quantidadeItem } },
                //     })
                //     await prisma.estoque.create({
                //         data: {
                //             tipoMovimentacao: TipoMovimentacao.saida,
                //             quantidade,
                //             produtoId: Number(item.id),
                //             descricao: `Pedido nº ${numero} realizado`,
                //         },
                //     })
                // }
                res.status(201).json({ message: "Pedido criado com sucesso", pedido: novoPedido });
                return;
            }
            catch (error) {
                console.error("Erro ao criar pedido:", error);
                res.status(500).json({ message: "Erro ao criar pedido" });
                return;
            }
        });
    }
    static atualizarStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { status } = req.body;
                const pedido = yield prisma_1.prisma.pedido.findUnique({ where: { id: Number(id) } });
                if (!pedido) {
                    res.status(404).json({ message: "Pedido não encontrado" });
                    return;
                }
                const atualizado = yield prisma_1.prisma.pedido.update({
                    where: { id: Number(id) },
                    data: { status },
                    include: {
                        cliente: true,
                        itens: { include: { produto: true } },
                    },
                });
                res.json({ message: "Status atualizado com sucesso", pedido: atualizado });
                return;
            }
            catch (error) {
                console.error("Erro ao atualizar status:", error);
                res.status(500).json({ message: "Erro ao atualizar status do pedido" });
                return;
            }
        });
    }
    static finalizarPedido(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { horario, data, recebido, tipo, local, observacao, pedidoid, funcionarioId } = req.body;
                //validar se tem payload
                if (!horario || !data || !recebido || !tipo || !local || !observacao || !pedidoid) {
                    res.status(400).json({ message: "Dados incompletos para finalizar o pedido" });
                    return;
                }
                //validar se o pedido existe
                const pedido = yield prisma_1.prisma.pedido.findUnique({ where: { id: Number(pedidoid) } });
                if (!pedido) {
                    res.status(404).json({ message: "Pedido não encontrado" });
                    return;
                }
                const atualizado = yield prisma_1.prisma.pedido.update({
                    where: { id: Number(pedidoid) },
                    data: { status: "concluido" },
                    include: {
                        cliente: true,
                        itens: { include: { produto: true } },
                    },
                });
                for (const item of atualizado.itens) {
                    const quantidadeItem = Number(item.quantidade);
                    yield prisma_1.prisma.produto.update({
                        where: { id: item.produtoId },
                        data: { estoqueAtual: { decrement: quantidadeItem } },
                    });
                    yield prisma_1.prisma.estoque.create({
                        data: {
                            tipoMovimentacao: client_1.TipoMovimentacao.saida,
                            quantidade: quantidadeItem,
                            produtoId: item.produtoId,
                            descricao: `Pedido nº ${atualizado.id} realizado`,
                        },
                    });
                }
                yield prisma_1.prisma.ocorrencia.create({
                    data: {
                        horario,
                        data: data,
                        recebidoPor: recebido,
                        tipo,
                        local,
                        observacao,
                        pedidoId: Number(id),
                        funcionarioId: Number(funcionarioId),
                    },
                });
                res.json({ message: "Pedido finalizado com sucesso.", pedido: atualizado });
                return;
            }
            catch (error) {
                console.error("Erro ao atualizar status:", error);
                res.status(500).json({ message: "Erro ao atualizar status do pedido" });
                return;
            }
        });
    }
    static deletar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const pedido = yield prisma_1.prisma.pedido.findUnique({
                    where: { id: Number(id) },
                    include: { itens: true },
                });
                if (!pedido) {
                    res.status(404).json({ message: "Pedido não encontrado" });
                    return;
                }
                // await prisma.$transaction(async (tx) => {
                //     for (const item of pedido.itens) {
                //         await tx.produto.update({
                //             where: { id: item.produtoId },
                //             data: { estoqueAtual: { increment: item.quantidade } },
                //         })
                //         await tx.estoque.create({
                //             data: {
                //                 tipoMovimentacao: TipoMovimentacao.entrada,
                //                 quantidade: item.quantidade,
                //                 produtoId: item.produtoId,
                //                 descricao: `Reversão de pedido nº ${pedido.numero}`,
                //             },
                //         })
                //     }
                //     await tx.itemPedido.deleteMany({ where: { pedidoId: pedido.id } })
                //     await tx.pedido.delete({ where: { id: pedido.id } })
                // })
                res.json({ message: "Pedido excluído com sucesso" });
                return;
            }
            catch (error) {
                console.error("Erro ao excluir pedido:", error);
                res.status(500).json({ message: "Erro ao excluir pedido" });
                return;
            }
        });
    }
}
exports.PedidoController = PedidoController;
