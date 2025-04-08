import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { prisma } from "../prisma";

interface JwtPayload {
  id: number
  role: string
  // adicione outros campos se quiser
}


// Middleware to verify JWT token
export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
      res.status(401).json({ message: "Token não fornecido" })
      return; // caso não existir o token, quebre o código
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as unknown
    const payload = decoded as JwtPayload


    const user = await prisma.usuario.findUnique({
      where: { id: payload.id },
      include: { funcionario: true },
    })

    if (!user || !user.ativo) {
      res.status(401).json({ message: "Usuário não encontrado ou inativo" })
      return // 👈 isso resolve o erro
    }

    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      funcionarioId: user.funcionarioId,
      funcionario: user.funcionario,
    }

    next()
  } catch (error) {
    res.status(401).json({ message: "Token inválido" })
    return;
  }
}


// Middleware to check user role
export const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void | Promise<void> =>  {
    if (!req.user) {
       res.status(401).json({ message: "Não autenticado" })
       return;
    }

    if (!roles.includes(req.user.role)) {
       res.status(403).json({ message: "Você não tem permissão para acessar esta página" })
      return;
    }

    next()
  }
}

// Admin only middleware
export const isAdmin = checkRole(["admin"])

// Admin or manager middleware
export const isAdminOrManager = checkRole(["admin", "gerente"])
