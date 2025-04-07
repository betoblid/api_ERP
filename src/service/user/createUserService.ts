import { Funcionario } from "../../@types/funcionario.type";
import { prisma } from "../../prisma";
import { hash } from "bcryptjs";


export class CreateUserServe {

    async execute(body: Funcionario){

        //Verificar no banco se esse e-mail existe
        const verifyExist = await prisma.funcionario.findFirst({
            where: {
               OR: [
                {email: body.email},
                {cpf: body.cpf}
               ]
                
            }
        });

        //se existir retorne uma mensagem de erro
        if(verifyExist){
            return{
                status: 409,
                message: "Usuário já cadastrado"
            }
        }
        
        //criptografar senha
        const passwordHash = await hash(body.password, 10);

        //Criar usuário no banco
        const RegisterUser = await prisma.funcionario.create({
            data: {
                email: body.email,
                password: passwordHash,
                nome: body.nome,
                cargo: body.cargo,
                cpf: body.cpf,
                horarioTrabalho: body.horarioTrabalho
            },
            select: {
                id: true,
                nome: true,
                // roler...
            }
        });

        return {
            status: 201,
            content: RegisterUser
        }
    }
}