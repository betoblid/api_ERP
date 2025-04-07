import { prisma } from "../../prisma";



export class ListUserService {

    async execute() {

        //carregar banco
        const ListUser = await prisma.funcionario.findMany()

        if(!ListUser){
            return{
                status: 200,
                message: "Não foi encontrado funcionarios."
            }
        }

        return {
            status: 200,
            content: ListUser
        }
    }
}