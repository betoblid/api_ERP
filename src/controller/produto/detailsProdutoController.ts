import { Request, Response } from "express";
import { DetailsUProdutoService } from "../../service/produto/detailsProdutoService";



export class DetailsProdutoController {

    async handler(req: Request<{id: string}>, res: Response) {

        const codigoBarras = req.params.id

        //válidar código de barras
        if(!codigoBarras || codigoBarras.length <= 6) {
            res.status(404).json({status: 404, message: "Códio de barras inválido, padrão é 8 digitos."})
        }
        //iniciar banco
        const ProdutoDetails = new DetailsUProdutoService()

        const Produtos = await ProdutoDetails.execute(codigoBarras)

        res.status(Produtos.status). json(Produtos)
    }
}