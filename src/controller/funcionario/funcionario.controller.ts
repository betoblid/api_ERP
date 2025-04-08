import { Request, Response } from "express"
import { prisma } from "../../prisma"


export class FuncionarioController {
  static async getAll(req: Request, res: Response) {
    try {
      const funcionarios = await prisma.funcionario.findMany({
        orderBy: { nome: "asc" },
        include: { usuarios: true },
      })

      res.json(funcionarios);
      return;
    } catch (error) {
      console.error("Get all funcionarios error:", error)
      res.status(500).json({ message: "Erro ao buscar funcionários" });
      return;
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params

      const funcionario = await prisma.funcionario.findUnique({
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
      })

      if (!funcionario) {
         res.status(404).json({ message: "Funcionário não encontrado" });
         return;
      }

      res.json(funcionario);
      return;
    } catch (error) {
      console.error("Get funcionario by ID error:", error)
      res.status(500).json({ message: "Erro ao buscar funcionário" });
      return;
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { nome, cpf, cargo, email, jornadaInicio, jornadaFim } = req.body

      const existingFuncionario = await prisma.funcionario.findFirst({
        where: {
          OR: [{ cpf }, { email }],
        },
      })

      if (existingFuncionario) {
         res.status(400).json({ message: "CPF ou email já cadastrado" });
         return;
      }

      const newFuncionario = await prisma.funcionario.create({
        data: {
          nome,
          cpf,
          cargo,
          email,
          jornadaInicio,
          jornadaFim,
        },
      })

      res.status(201).json({
        message: "Funcionário criado com sucesso",
        funcionario: newFuncionario,
      });
      return;
    } catch (error) {
      console.error("Create funcionario error:", error)
      res.status(500).json({ message: "Erro ao criar funcionário" });
      return;
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { nome, cpf, cargo, email, jornadaInicio, jornadaFim } = req.body

      const funcionario = await prisma.funcionario.findUnique({
        where: { id: Number(id) },
      })

      if (!funcionario) {
         res.status(404).json({ message: "Funcionário não encontrado" });
         return;
      }

      if (cpf || email) {
        const existingFuncionario = await prisma.funcionario.findFirst({
          where: {
            OR: [cpf ? { cpf } : {}, email ? { email } : {}],
            NOT: { id: Number(id) },
          },
        })

        if (existingFuncionario) {
           res.status(400).json({ message: "CPF ou email já cadastrado" });
           return;
        }
      }

      const updatedFuncionario = await prisma.funcionario.update({
        where: { id: Number(id) },
        data: {
          nome: nome ?? undefined,
          cpf: cpf ?? undefined,
          cargo: cargo ?? undefined,
          email: email ?? undefined,
          jornadaInicio: jornadaInicio ?? undefined,
          jornadaFim: jornadaFim ?? undefined,
        },
      })

      res.json({
        message: "Funcionário atualizado com sucesso",
        funcionario: updatedFuncionario,
      });
      return;
    } catch (error) {
      console.error("Update funcionario error:", error)
      res.status(500).json({ message: "Erro ao atualizar funcionário" });
      return;
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params

      const funcionario = await prisma.funcionario.findUnique({
        where: { id: Number(id) },
        include: { usuarios: true },
      })

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

      await prisma.funcionario.delete({
        where: { id: Number(id) },
      })

      res.json({ message: "Funcionário excluído com sucesso" });
      return;
    } catch (error) {
      console.error("Delete funcionario error:", error)
      res.status(500).json({ message: "Erro ao excluir funcionário" });
      return;
    }
  }
}
