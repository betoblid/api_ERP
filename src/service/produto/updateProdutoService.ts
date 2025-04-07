import { typeProduto } from "../../@types/produto.type";
import { prisma } from "../../prisma";



export class UpdateProdutoService {

    async execute(produto :{item: typeProduto, codigoBarras: string }) {

        try {
            //carregar banco
            const produtoExistente = await prisma.produto.findUnique({
                where: {
                    codigoBarras: produto.codigoBarras
                }
            })

            if (!produtoExistente) {
                return {
                    status: 200,
                    message: "Não foi encontrado Produtos."
                }
            }
            //atuaizar object de produto
            const produtoAtualizado = {
                nome: produto.item.nome ?? produtoExistente.nome,
                preco: Number(produto.item.preco) ?? produtoExistente.preco,
                estoqueAtual: Number(produto.item.quantidadeEstoque) ?? produtoExistente.estoqueAtual,
                fornecedor: produto.item.fornecedor ?? produtoExistente.fornecedor
            }

            //atualizar produto
            const UpdateProduto = await prisma.produto.update({
                where: {
                    codigoBarras: produto.codigoBarras
                },
                data: {
                   ...produtoAtualizado
                }
            })
            return {
                status: 200,
                content: UpdateProduto
            }
        } catch {
            return {
                status: 404,
                content: "Não foi possível atualizar Produto"
            }
        }
    }
}