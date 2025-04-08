// src/controller/ponto/PontoController.ts
import { Request, Response } from "express";
import { Funcionario, TipoPonto } from "@prisma/client";
import { prisma } from "../../prisma";


interface AuthenticatedRequest extends Request {
    user: {
        id: number
        username: string
        email: string
        role: string
        funcionarioId?: number
        funcionario: Funcionario | null
    }
}

export class PontoController {
    static async getPontosByFuncionarioId(req: Request, res: Response): Promise<void> {
        try {
            const { funcionarioId } = req.params;
            const id = Number(funcionarioId);

            const funcionario = await prisma.funcionario.findUnique({ where: { id } });
            if (!funcionario) {
                res.status(404).json({ message: "Funcionário não encontrado" });
                return
            }

            const pontos = await prisma.ponto.findMany({
                where: { funcionarioId: id },
                orderBy: { timestamp: "desc" },
            });

             res.json(pontos);
             return;
        } catch (error) {
            console.error("Get pontos by funcionario ID error:", error);
             res.status(500).json({ message: "Erro ao buscar pontos" });
             return;
        }
    }

    static async registrarPonto(req: Request, res: Response): Promise<void> {

        const { user } = req as AuthenticatedRequest // Aqui você força o tipo
        try {
            const { tipo, funcionarioId }: { tipo: TipoPonto; funcionarioId: number } = req.body;

            if (user.funcionarioId !== funcionarioId && !["admin", "gerente"].includes(user.role)) {
                 res.status(403).json({
                    message: "Você só pode registrar ponto para o seu próprio funcionário",
                });
                return;
            }

            const funcionario = await prisma.funcionario.findUnique({
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

            const existingPonto = await prisma.ponto.findFirst({
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

            const ponto = await prisma.ponto.create({
                data: { tipo, funcionarioId },
            });

             res.status(201).json({
                message: "Ponto registrado com sucesso",
                ponto,
            });
            return;
        } catch (error) {
            console.error("Register ponto error:", error);
             res.status(500).json({ message: "Erro ao registrar ponto" });
             return;
        }
    }

    static async deletarPonto(req: Request, res: Response): Promise<void> {

        const { user } = req as AuthenticatedRequest // Aqui você força o tipo
        try {
            const { id } = req.params;
            const pontoId = Number(id);

            if (!["admin", "gerente"].includes(user?.role)) {
                 res.status(403).json({
                    message: "Apenas administradores e gerentes podem excluir pontos",
                });
                return;
            }

            const ponto = await prisma.ponto.findUnique({
                where: { id: pontoId },
            });

            if (!ponto) {
                 res.status(404).json({ message: "Ponto não encontrado" });
                 return;
            }

            await prisma.ponto.delete({
                where: { id: pontoId },
            });

             res.json({ message: "Ponto excluído com sucesso" });
             return;
        } catch (error) {
            console.error("Delete ponto error:", error);
             res.status(500).json({ message: "Erro ao excluir ponto" });
             return;
        }
    }
}
