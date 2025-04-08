import { Request, Response } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export class AuthController {
  // Registro de um novo usuário
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password, funcionarioId, role } = req.body

      // Verifica se o usuário ou email já existe
      const existingUser = await prisma.usuario.findFirst({
        where: {
          OR: [{ username }, { email }],
        },
      })

      if (existingUser) {
        res.status(400).json({ message: "Usuário ou email já existe" })
        return
      }

      // Se funcionarioId for informado, valida se o funcionário existe
      if (funcionarioId) {
        const funcionario = await prisma.funcionario.findUnique({
          where: { id: funcionarioId },
        })

        if (!funcionario) {
          res.status(400).json({ message: "Funcionário não encontrado" })
          return
        }
      }

      // Gera hash da senha
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      // Cria o usuário no banco
      const newUser = await prisma.usuario.create({
        data: {
          username,
          email,
          password: hashedPassword,
          funcionarioId: funcionarioId || null,
          role,
        },
      })

      // Remove a senha antes de retornar o usuário
      const { password: _, ...userWithoutPassword } = newUser

      res.status(201).json({
        message: "Usuário criado com sucesso",
        user: userWithoutPassword,
      })
    } catch (error) {
      console.error("Erro ao registrar usuário:", error)
      res.status(500).json({ message: "Erro interno do servidor" })
    }
  }

  // Login de usuário e retorno de token JWT
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body

      const user = await prisma.usuario.findUnique({
        where: { email },
        include: { funcionario: true },
      })

      if (!user) {
        res.status(400).json({ message: "Credenciais inválidas" })
        return
      }

      if (!user.ativo) {
        res.status(403).json({ message: "Usuário desativado" })
        return
      }

      const isPasswordValid = await bcrypt.compare(password, user.password)

      if (!isPasswordValid) {
        res.status(400).json({ message: "Credenciais inválidas" })
        return
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "24h" }
      )

      const { password: _, ...userWithoutPassword } = user

      res.json({
        message: "Login realizado com sucesso",
        token,
        user: userWithoutPassword,
      })
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      res.status(500).json({ message: "Erro interno do servidor" })
    }
  }

  // Obter usuário autenticado
  static async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id

      if (!userId) {
        res.status(401).json({ message: "Usuário não autenticado" })
        return
      }

      const user = await prisma.usuario.findUnique({
        where: { id: userId },
        include: { funcionario: true },
      })

      if (!user) {
        res.status(404).json({ message: "Usuário não encontrado" })
        return
      }

      const { password, ...userWithoutPassword } = user

      res.json(userWithoutPassword)
    } catch (error) {
      console.error("Erro ao buscar usuário:", error)
      res.status(500).json({ message: "Erro interno do servidor" })
    }
  }
}
