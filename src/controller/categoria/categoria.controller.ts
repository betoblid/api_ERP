import { Request, Response } from "express"
import { PrismaClient, Categoria } from "@prisma/client"

const prisma = new PrismaClient()

export class CategoriaController {
    static async getAllCategorias(req: Request, res: Response): Promise<void> {
        try {
            const categorias: Categoria[] = await prisma.categoria.findMany({
                orderBy: { nome: "asc" },
            })

            res.json(categorias);
            return;
        } catch (error) {
            console.error("Get all categorias error:", error)
            res.status(500).json({ message: "Erro ao buscar categorias" });
            return;
        }
    }

    static async getCategoriaById(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id)

            if (isNaN(id)) {
                res.status(400).json({ message: "ID inválido" });
                return;
            }

            const categoria = await prisma.categoria.findUnique({
                where: { id },
                include: { produtos: true },
            })

            if (!categoria) {
                res.status(404).json({ message: "Categoria não encontrada" });
                return;
            }

            res.json(categoria);
            return;
        } catch (error) {
            console.error("Get categoria by ID error:", error)
            res.status(500).json({ message: "Erro ao buscar categoria" });
            return;
        }
    }

    static async createCategoria(req: Request, res: Response): Promise<void> {
        try {
            const { nome } = req.body

            const existingCategoria = await prisma.categoria.findFirst({
                where: { nome },
            })

            if (existingCategoria) {
                res.status(400).json({ message: "Categoria já existe" });
                return;
            }

            const newCategoria = await prisma.categoria.create({
                data: { nome },
            })

            res.status(201).json({
                message: "Categoria criada com sucesso",
                categoria: newCategoria,
            });
            return;
        } catch (error) {
            console.error("Create categoria error:", error)
            res.status(500).json({ message: "Erro ao criar categoria" });
            return;
        }
    }

    static async updateCategoria(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id)
            const { nome } = req.body

            if (isNaN(id)) {
                res.status(400).json({ message: "ID inválido" });
                return;
            }

            const categoria = await prisma.categoria.findUnique({ where: { id } })

            if (!categoria) {
                res.status(404).json({ message: "Categoria não encontrada" });
                return;
            }

            if (nome) {
                const existingCategoria = await prisma.categoria.findFirst({
                    where: {
                        nome,
                        NOT: { id },
                    },
                })

                if (existingCategoria) {
                    res.status(400).json({ message: "Categoria já existe" });
                    return;
                }
            }

            const updatedCategoria = await prisma.categoria.update({
                where: { id },
                data: { nome },
            })

            res.json({
                message: "Categoria atualizada com sucesso",
                categoria: updatedCategoria,
            });
            return;
        } catch (error) {
            console.error("Update categoria error:", error)
            res.status(500).json({ message: "Erro ao atualizar categoria" });
            return;
        }
    }

    static async deleteCategoria(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id)

            if (isNaN(id)) {
                res.status(400).json({ message: "ID inválido" });
                return;
            }

            const categoria = await prisma.categoria.findUnique({
                where: { id },
                include: { produtos: true },
            })

            if (!categoria) {
                res.status(404).json({ message: "Categoria não encontrada" });
                return;
            }

            if (categoria.produtos.length > 0) {

                res.status(400).json({
                    message: "Não é possível excluir categoria com produtos associados",
                });
                return;
            }

            await prisma.categoria.delete({ where: { id } })

            res.json({ message: "Categoria excluída com sucesso" });
            return;
        } catch (error) {
            console.error("Delete categoria error:", error)
            res.status(500).json({ message: "Erro ao excluir categoria" });
            return;
        }
    }
}
