import { Request, Response } from "express";
import { ListUserService } from "../../service/Funcionario/ListFuncionarioService";



export class ListUserController {

    async handler(req: Request, res: Response) {

        //iniciar banco
        const userList = new ListUserService()

        const users = await userList.execute()

        res.status(users.status). json(users)
    }
}