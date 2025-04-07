import { prisma } from "../../prisma";



export class DetailsUProdutoService {

    async execute(codigoBarras: string) {

        try {
            //carregar banco
            const DetailsProduto = await prisma.produto.findFirst({
                where: {
                    codigoBarras: codigoBarras
                }
            })

            if (!DetailsProduto) {
                return {
                    status: 200,
                    message: "Não foi encontrado Produtos."
                }
            }

            return {
                status: 200,
                content: DetailsProduto
            }
        } catch {
            return {
                status: 404,
                content: "Produto não encontrado"
            }
        }
    }
}