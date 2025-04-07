import { prisma } from "../../prisma";



export class ListUProdutoService {

    async execute() {

        //carregar banco
        const ListProduto = await prisma.produto.findMany()

        if(!ListProduto){
            return{
                status: 200,
                message: "Não foi encontrado Produtos."
            }
        }

        return {
            status: 200,
            content: ListProduto
        }
    }
}