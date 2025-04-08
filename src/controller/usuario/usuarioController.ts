import bcrypt from "bcryptjs"
import { Request, Response } from "express"
import { prisma } from "../../prisma";


export class UserController {

    //Pegar todos os usuários
    static async getAllUsers(req: Request, res: Response) {
        try {
            const users = await prisma.usuario.findMany({
                include: { funcionario: true },
                orderBy: { createdAt: "desc" },
            })

            const usersWithoutPasswords = users.map(({ password, ...rest }) => rest)
            res.json(usersWithoutPasswords)
        } catch (error) {
            console.error("Get all users error:", error)
            res.status(500).json({ message: "Erro ao buscar usuários" })
        }
    }

    // pegar usuário pelo ID
    static async getUserById(req: Request, res: Response) {
        try {
            const { id } = req.params

            const user = await prisma.usuario.findUnique({
                where: { id: parseInt(id) },
                include: { funcionario: true },
            })

            if (!user) {
                res.status(404).json({ message: "Usuário não encontrado" });
                return;
            }

            const { password, ...userWithoutPassword } = user
            res.json(userWithoutPassword)
        } catch (error) {
            console.error("Get user by ID error:", error)
            res.status(500).json({ message: "Erro ao buscar usuário" })
        }
    }

    //atualizr dados do usuário
    static async updateUser(req: Request, res: Response) {
        try {
            const { id } = req.params
            const { username, email, role, funcionarioId, ativo } = req.body

            const existingUser = await prisma.usuario.findUnique({
                where: { id: Number(id) },
            })

            if (!existingUser) {
                res.status(404).json({ message: "Usuário não encontrado" });
                return;
            }

            if (funcionarioId !== undefined) {
                if (funcionarioId !== null) {
                    const funcionario = await prisma.funcionario.findUnique({
                        where: { id: Number(funcionarioId) },
                    })

                    if (!funcionario) {
                       res.status(400).json({ message: "Funcionário não encontrado" });
                       return;
                    }
                }
            }

            const updatedUser = await prisma.usuario.update({
                where: { id: Number(id) },
                data: {
                    username: username ?? existingUser.username,
                    email: email ?? existingUser.email,
                    role: role ?? existingUser.role,
                    funcionarioId: funcionarioId ?? existingUser.funcionarioId,
                    ativo: ativo ?? existingUser.ativo,
                },
                include: { funcionario: true },
            })

            const { password, ...userWithoutPassword } = updatedUser

            res.json({
                message: "Usuário atualizado com sucesso",
                user: userWithoutPassword,
            })
        } catch (error) {
            console.error("Update user error:", error)
            res.status(500).json({ message: "Erro ao atualizar usuário" })
        }
    }
    // alterar senha do usuário
    static async changePassword(req: Request, res: Response) {
        try {
            const { id } = req.params
            const { currentPassword, newPassword } = req.body

            const user = await prisma.usuario.findUnique({
                where: { id: parseInt(id) },
            })

            if (!user) {
                 res.status(404).json({ message: "Usuário não encontrado" });
                 return;
            }

            const isPasswordValid = await bcrypt.compare(currentPassword, user.password)

            if (!isPasswordValid) {
                 res.status(400).json({ message: "Senha atual incorreta" });
                 return;
            }

            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(newPassword, salt)

            await prisma.usuario.update({
                where: { id: Number(id) },
                data: { password: hashedPassword },
            })

            res.json({ message: "Senha alterada com sucesso" })
        } catch (error) {
            console.error("Change password error:", error)
            res.status(500).json({ message: "Erro ao alterar senha" })
        }
    }

    //Apagar usuário
    static async deleteUser(req: Request, res: Response) {
        try {
            const { id } = req.params

            const user = await prisma.usuario.findUnique({
                where: { id: parseInt(id) },
            })

            if (!user) {
                 res.status(404).json({ message: "Usuário não encontrado" });
                 return;
            }

            await prisma.usuario.update({
                where: { id: Number(id) },
                data: { ativo: false },
            })

            res.json({ message: "Usuário desativado com sucesso" })
        } catch (error) {
            console.error("Delete user error:", error)
            res.status(500).json({ message: "Erro ao desativar usuário" })
        }
    }
    //Ativar acesso do usuário
    static async reactivateUser(req: Request, res: Response) {
        try {
            const { id } = req.params

            const user = await prisma.usuario.findUnique({
                where: { id: parseInt(id) },
            })

            if (!user) {
                 res.status(404).json({ message: "Usuário não encontrado" });
                 return;
            }

            await prisma.usuario.update({
                where: { id: Number(id) },
                data: { ativo: true },
            })

            res.json({ message: "Usuário reativado com sucesso" })
        } catch (error) {
            console.error("Reactivate user error:", error)
            res.status(500).json({ message: "Erro ao reativar usuário" })
        }
    }
}
