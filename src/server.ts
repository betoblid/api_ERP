
import express from "express";
import './types/express'
import cors from "cors";
import RouteUser from "./routes/usuario.routes"
import AuthRouter from "./routes/auth.routes";
import clienteRouter from "./routes/cliente.routes";
import categoriaRouter from "./routes/categoria.route";
import pontoRouter from "./routes/ponto.routes";
import pedidoRouter from "./routes/pedido.routes";
import produtoRouter from "./routes/produto.routes";
import funcionarioRoute from "./routes/funcionario.routes";
const app = express();

app.use(express.json());
app.use(AuthRouter)
app.use(RouteUser);
app.use(clienteRouter);
app.use(categoriaRouter);
app.use(pontoRouter);
app.use(pedidoRouter);
app.use(produtoRouter);
app.use(funcionarioRoute);
app.use(cors());

app.listen(3011, () => {
  console.log('Server is running on http://localhost:3011');
}  );