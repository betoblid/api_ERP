import { Request, Response } from "express";
import { UpdateProdutoService } from "../../service/produto/updateProdutoService";
import { typeProduto } from "../../@types/produto.type";



export class updateProdutoController {

    async handler(req: Request<{id: string}, {}, typeProduto>, res: Response) {

        const codigoBarras = req.params.id
     

        //válidar código de barras
        if(!codigoBarras || codigoBarras.length <= 6) {
            res.status(404).json({status: 404, message: "Códio de barras inválido, padrão é 8 digitos."})
        }
        //iniciar banco
        const ProdutoUpdate = new UpdateProdutoService()

        const Produtos = await ProdutoUpdate.execute({codigoBarras: codigoBarras, item: req.body})

        res.status(Produtos.status). json(Produtos)
    }
}