import { Request, Response } from "express";
import { CreateProdutoService } from "../../service/produto/CreateProdutoService";
import { ProdutoInput } from "../../@types/produto.type";


export class createProdutoController {

    async handler(req: Request<{}, {}, ProdutoInput>, res: Response) {


        if (!req.body.categoriaId && !req.body.codigo && !req.body.fornecedor && !req.body.nome && !req.body.preco && !req.body.estoque) {
            res.status(402).json({
                status: 402,
                message: "Obrigatório o envio dos campos: categoria, codigoBarras, fornecedor, nome, preco, quantidadeEstoque"
            })
            
        }
        try {
            //iniciar camada de serviço
            const createProduto = new CreateProdutoService()

            //criar produto
            const produto = await createProduto.execute(req.body)

            res.status(produto.status).json(produto)
        } catch {
            res.status(417).json({ status: 417, message: "falha ao cadastrar produto." })
        }
    }
}