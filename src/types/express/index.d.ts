// types/express/index.d.ts
import { Usuario, Funcionario } from "@prisma/client"
import { JwtPayload } from "jsonwebtoken"

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number
        username: string
        email: string
        role: string
        funcionarioId?: number 
        funcionario: Funcionario | null
      }
    }
  }
}
