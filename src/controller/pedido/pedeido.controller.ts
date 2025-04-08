import { Request, Response } from "express"
import { TipoMovimentacao } from "@prisma/client"
import { prisma } from "../../prisma"

export class PedidoController {
    static async listarTodos(req: Request, res: Response) {
        try {
            const pedidos = await prisma.pedido.findMany({
                include: {
                    cliente: true,
                    itens: {
                        include: { produto: true },
                    },
                },
                orderBy: { data: "desc" },
            })
            res.json(pedidos)
        } catch (error) {
            console.error("Erro ao buscar pedidos:", error)
            res.status(500).json({ message: "Erro ao buscar pedidos" })
        }
    }

    static async buscarPorId(req: Request, res: Response) {
        try {
            const { id } = req.params

            const pedido = await prisma.pedido.findUnique({
                where: { id: Number(id) },
                include: {
                    cliente: true,
                    itens: { include: { produto: true } },
                },
            })

            if (!pedido) {
                res.status(404).json({ message: "Pedido não encontrado" });
                return;
            }

            res.json(pedido)
        } catch (error) {
            console.error("Erro ao buscar pedido:", error)
            res.status(500).json({ message: "Erro ao buscar pedido" });
            return;
        }
    }

    static async criar(req: Request, res: Response) {
        try {
            const { numero, status, data, horario, endereco, clienteId, itens } = req.body

            const cliente = await prisma.cliente.findUnique({ where: { id: Number(clienteId) } })
            if (!cliente) {
                res.status(404).json({ message: "Cliente não encontrado" });
                return;
            }

            const existente = await prisma.pedido.findFirst({ where: { numero } })
            if (existente) {
                res.status(400).json({ message: "Número de pedido já existe" });
                return;
            }

            if (!itens || !Array.isArray(itens) || itens.length === 0) {
                res.status(400).json({ message: "Pedido deve ter pelo menos um item" });
                return;
            }

            for (const item of itens) {
                const produto = await prisma.produto.findUnique({ where: { id: Number(item.produtoId) } })
                if (!produto) {
                    res.status(404).json({ message: `Produto ID ${item.produtoId} não encontrado` });
                    return;
                }
                if (produto.estoqueAtual < item.quantidade) {
                    res.status(400).json({ message: `Estoque insuficiente para ${produto.nome}` });
                    return;
                }
            }

            const novoPedido = await prisma.pedido.create({
                data: {
                    numero,
                    status,
                    data: data ? new Date(data) : undefined,
                    horario,
                    endereco,
                    clienteId: Number(clienteId),
                    itens: {
                        create: itens.map((item) => ({
                            quantidade: Number(item.quantidade),
                            precoUnitario: Number(item.precoUnitario),
                            produtoId: Number(item.produtoId),
                        })),
                    },
                },
                include: {
                    cliente: true,
                    itens: { include: { produto: true } },
                },
            })

            for (const item of itens) {
                const quantidade = Number(item.quantidade)
                await prisma.produto.update({
                    where: { id: Number(item.produtoId) },
                    data: { estoqueAtual: { decrement: quantidade } },
                })
                await prisma.estoque.create({
                    data: {
                        tipoMovimentacao: TipoMovimentacao.saida,
                        quantidade,
                        produtoId: Number(item.produtoId),
                        descricao: `Pedido nº ${numero} realizado`,
                    },
                })
            }

            res.status(201).json({ message: "Pedido criado com sucesso", pedido: novoPedido });
            return;
        } catch (error) {
            console.error("Erro ao criar pedido:", error)
            res.status(500).json({ message: "Erro ao criar pedido" });
            return;
        }
    }

    static async atualizarStatus(req: Request, res: Response) {
        try {
            const { id } = req.params
            const { status } = req.body

            const pedido = await prisma.pedido.findUnique({ where: { id: Number(id) } })
            if (!pedido) {
                res.status(404).json({ message: "Pedido não encontrado" });
                return;
            }

            const atualizado = await prisma.pedido.update({
                where: { id: Number(id) },
                data: { status },
                include: {
                    cliente: true,
                    itens: { include: { produto: true } },
                },
            })

            res.json({ message: "Status atualizado com sucesso", pedido: atualizado });
            return;
        } catch (error) {
            console.error("Erro ao atualizar status:", error)
            res.status(500).json({ message: "Erro ao atualizar status do pedido" });
            return;
        }
    }

    static async deletar(req: Request, res: Response) {
        try {
            const { id } = req.params

            const pedido = await prisma.pedido.findUnique({
                where: { id: Number(id) },
                include: { itens: true },
            })
            if (!pedido) {
                res.status(404).json({ message: "Pedido não encontrado" })
                return;
            }

            await prisma.$transaction(async (tx) => {
                for (const item of pedido.itens) {
                    await tx.produto.update({
                        where: { id: item.produtoId },
                        data: { estoqueAtual: { increment: item.quantidade } },
                    })
                    await tx.estoque.create({
                        data: {
                            tipoMovimentacao: TipoMovimentacao.entrada,
                            quantidade: item.quantidade,
                            produtoId: item.produtoId,
                            descricao: `Reversão de pedido nº ${pedido.numero}`,
                        },
                    })
                }

                await tx.itemPedido.deleteMany({ where: { pedidoId: pedido.id } })
                await tx.pedido.delete({ where: { id: pedido.id } })
            })

            res.json({ message: "Pedido excluído com sucesso" });
            return;
        } catch (error) {
            console.error("Erro ao excluir pedido:", error)
            res.status(500).json({ message: "Erro ao excluir pedido" });
            return;
        }
    }
}
