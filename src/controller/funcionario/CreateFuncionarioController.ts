import { Request, Response } from "express";
import { Funcionario } from "../../@types/funcionario.type";
import { CreateUserServe } from "../../service/Funcionario/CreateFuncionarioServe";


export class CreateUserController {

    async handler(req: Request<{}, {}, Funcionario>, res: Response) {

        const {cargo, cpf, email, jornadaFim, jornadaInicio, nome} = req.body; // pegando o payload do user

        if(!cargo && !cpf && !email && !jornadaFim && !nome && !jornadaInicio) {
            res.status(402).json({status: 403, message: "Campos invalidos..."})
        }
        //iniciando serve 
        const CreateUserService = new CreateUserServe();

        const User = await CreateUserService.execute({cargo, cpf, email, jornadaFim, nome, jornadaInicio})

        res.status(User.status).json(User)
    }
}