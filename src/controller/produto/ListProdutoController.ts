import { Request, Response } from "express";
import { ListUProdutoService } from "../../service/produto/ListProdutoService";




export class ListProdutoController {

    async handler(req: Request, res: Response) {

        //iniciar banco
        const ProdutoList = new ListUProdutoService()

        const Produtos = await ProdutoList.execute()

        res.status(Produtos.status). json(Produtos)
    }
}