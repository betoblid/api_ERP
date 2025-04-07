import { ProdutoInput } from "../../@types/produto.type";
import { prisma } from "../../prisma";


export class CreateProdutoService {

    async execute(body: ProdutoInput) {
        const {
            nome,
            codigo,
            preco,
            estoque,
            fornecedor,
            categoriaId,
            estoqueMinimo
          } = body;

        try {
            //verificar se existe esse produto
            const verifyCodBarrasExist = await prisma.produto.findFirst({
                where: {
                    codigoBarras: body.codigo
                }
            });

            //se o produto já existir, retorn um erro
            if (verifyCodBarrasExist) {
                return {
                    status: 409,
                    message: "Produto já cadastrado."
                }
            }


            //cadastrar produto 
            const novoProduto = await prisma.produto.create({
                data: {
                  nome,
                  codigoBarras: codigo,
                  preco: parseFloat(preco),
                  estoqueAtual: parseInt(estoque),
                  fornecedor,
                  estoqueMinimo: estoqueMinimo ? parseInt(estoqueMinimo) : 10,
                  categoria: {
                    connect: { id: parseInt(categoriaId) }
                  }
                }
              });

            return {
                status: 201,
                content: novoProduto
            }

        } catch {
            return {
                status: 412,
                message: "Não foi possível criar o produto"
            }
        }
    }
}