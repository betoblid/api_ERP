import { Request, Response } from "express"
import { prisma } from "../../prisma";

export class ClienteController {
    // Buscar todos os clientes
    static async getAllClientes(req: Request, res: Response) {
        
        try {
            const clientes = await prisma.cliente.findMany({
                orderBy: { nome: "asc" },
            })

            res.json(clientes);

            return;
        } catch (error) {

            console.error("Get all clientes error:", error)
            res.status(500).json({ message: "Erro ao buscar clientes" });

            return;
        }
    }

    // Buscar cliente por ID
    static async getClienteById(req: Request, res: Response) {
        try {
            const { id } = req.params

            const cliente = await prisma.cliente.findUnique({
                where: { id: parseInt(id) },
                include: {
                    pedidos: {
                        orderBy: { data: "desc" },
                        take: 10,
                    },
                },
            })

            if (!cliente) {
                res.status(404).json({ message: "Cliente não encontrado" });
                return;
            }

            res.json(cliente);
            return;
        } catch (error) {
            console.error("Get cliente by ID error:", error)
            res.status(500).json({ message: "Erro ao buscar cliente" });
            return;
        }
    }

    // Criar novo cliente
    static async createCliente(req: Request, res: Response) {
        try {
            const { nome, tipoDocumento, documento, endereco, telefone, email } = req.body

            const existingCliente = await prisma.cliente.findFirst({
                where: { documento },
            })

            if (existingCliente) {
                res.status(400).json({ message: "Documento já cadastrado" });
                return;
            }

            const newCliente = await prisma.cliente.create({
                data: {
                    nome,
                    tipoDocumento,
                    documento,
                    endereco,
                    telefone,
                    email,
                },
            })

            res.status(201).json({
                message: "Cliente criado com sucesso",
                cliente: newCliente,
            });
            return;
        } catch (error) {
            console.error("Create cliente error:", error)
            res.status(500).json({ message: "Erro ao criar cliente" });
            return;
        }
    }

    // Atualizar cliente existente
    static async updateCliente(req: Request, res: Response) {
        try {
            const { id } = req.params
            const { nome, tipoDocumento, documento, endereco, telefone, email } = req.body

            const cliente = await prisma.cliente.findUnique({
                where: { id: parseInt(id) },
            })

            if (!cliente) {
                res.status(404).json({ message: "Cliente não encontrado" });
                return;
            }

            if (documento) {
                const existingCliente = await prisma.cliente.findFirst({
                    where: {
                        documento,
                        NOT: { id: Number(id) },
                    },
                })

                if (existingCliente) {
                    res.status(400).json({ message: "Documento já cadastrado" });
                    return;
                }
            }

            const updatedCliente = await prisma.cliente.update({
                where: { id: parseInt(id) },
                data: {
                    nome: nome ?? cliente.nome,
                    tipoDocumento: tipoDocumento ?? cliente.tipoDocumento,
                    documento: documento ?? cliente.documento,
                    endereco: endereco ?? cliente.endereco,
                    telefone: telefone ?? cliente.telefone,
                    email: email ?? cliente.email,
                },
            })

            res.json({
                message: "Cliente atualizado com sucesso",
                cliente: updatedCliente,
            });
            return;
        } catch (error) {
            console.error("Update cliente error:", error)
            res.status(500).json({ message: "Erro ao atualizar cliente" });
            return;
        }
    }

    // Excluir cliente
    static async deleteCliente(req: Request, res: Response) {
        try {
            const { id } = req.params

            const cliente = await prisma.cliente.findUnique({
                where: { id: parseInt(id) },
                include: { pedidos: true },
            })

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

            await prisma.cliente.delete({
                where: { id: parseInt(id) },
            })


            res.json({ message: "Cliente excluído com sucesso" });
            return;
        } catch (error) {
            console.error("Delete cliente error:", error)
            res.status(500).json({ message: "Erro ao excluir cliente" });
            return;
        }
    }
}
