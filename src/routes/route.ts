import { Router } from "express";
import { CreateUserController } from "../controller/funcionario/CreateFuncionarioController";
import { ListUserController } from "../controller/funcionario/ListFuncionarioController";
import { createProdutoController } from "../controller/produto/createProdutoController";
import { ListProdutoController } from "../controller/produto/ListProdutoController";
import { DetailsProdutoController } from "../controller/produto/detailsProdutoController";
import { updateProdutoController } from "../controller/produto/UpdateProdutoController";

const route = Router();



//Clientes

//Ponto

//Check

//Funcionarios
route.post("/funcionario/register", new CreateUserController().handler)

route.get("/funcionario/list", new ListUserController().handler)

//Produtos
route.post("/produto/register", new createProdutoController().handler)
//lista produtos
route.get("/produtos", new ListProdutoController().handler)
//detalhes do produto
route.get("/produto/:id", new DetailsProdutoController().handler)
//atualizar produtos
route.put("/produto/update/:id", new updateProdutoController().handler)
export default route;