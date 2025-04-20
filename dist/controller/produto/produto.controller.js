"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProdutoController = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../prisma");
class ProdutoController {
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const produtos = yield prisma_1.prisma.produto.findMany({
                    include: { categoria: true },
                    orderBy: { nome: "asc" },
                });
                res.json(produtos);
            }
            catch (error) {
                console.error("Get all produtos error:", error);
                res.status(500).json({ message: "Erro ao buscar produtos" });
            }
        });
    }
    static getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const produto = yield prisma_1.prisma.produto.findUnique({
                    where: { id: Number(id) },
                    include: { categoria: true },
                });
                if (!produto) {
                    res.status(404).json({ message: "Produto não encontrado" });
                    return;
                }
                res.json(produto);
            }
            catch (error) {
                console.error("Get produto by ID error:", error);
                res.status(500).json({ message: "Erro ao buscar produto" });
                return;
            }
        });
    }
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nome, codigoBarras, preco, estoqueAtual, estoqueMinimo, fornecedor, categoriaId } = req.body;
                const existingProduto = yield prisma_1.prisma.produto.findFirst({
                    where: { codigoBarras },
                });
                if (existingProduto) {
                    res.status(400).json({ message: "Código de barras já cadastrado" });
                    return;
                }
                const categoria = yield prisma_1.prisma.categoria.findUnique({
                    where: { id: Number(categoriaId) },
                });
                if (!categoria) {
                    res.status(400).json({ message: "Categoria não encontrada" });
                    return;
                }
                const newProduto = yield prisma_1.prisma.produto.create({
                    data: {
                        nome,
                        codigoBarras,
                        preco: Number(preco),
                        estoqueAtual: parseInt(estoqueAtual),
                        estoqueMinimo: estoqueMinimo ? Number(estoqueMinimo) : 10,
                        fornecedor,
                        categoria: {
                            connect: { id: 10 } // <- CORRETO
                        },
                    },
                    include: { categoria: true },
                });
                // Registra movimentação de entrada
                yield prisma_1.prisma.estoque.create({
                    data: {
                        produtoId: newProduto.id,
                        tipoMovimentacao: client_1.TipoMovimentacao.entrada,
                        quantidade: Number(estoqueAtual),
                        descricao: "Cadastro inicial do produto",
                    },
                });
                res.status(201).json({
                    message: "Produto criado com sucesso",
                    produto: newProduto,
                });
            }
            catch (error) {
                console.error("Create produto error:", error);
                res.status(500).json({ message: "Erro ao criar produto" });
                return;
            }
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { nome, codigoBarras, preco, estoqueAtual, estoqueMinimo, fornecedor, categoriaId } = req.body;
                const produto = yield prisma_1.prisma.produto.findUnique({ where: { id: Number(id) } });
                if (!produto) {
                    res.status(404).json({ message: "Produto não encontrado" });
                    return;
                }
                if (codigoBarras) {
                    const existing = yield prisma_1.prisma.produto.findFirst({
                        where: {
                            codigoBarras,
                            NOT: { id: Number(id) },
                        },
                    });
                    if (existing) {
                        res.status(400).json({ message: "Código de barras já cadastrado" });
                        return;
                    }
                }
                const novaQuantidade = estoqueAtual !== undefined ? Number(estoqueAtual) : produto.estoqueAtual;
                const diferenca = novaQuantidade - produto.estoqueAtual;
                const updatedProduto = yield prisma_1.prisma.produto.update({
                    where: { id: Number(id) },
                    data: {
                        nome,
                        codigoBarras,
                        preco: preco !== undefined ? Number(preco) : undefined,
                        estoqueAtual: novaQuantidade,
                        estoqueMinimo: estoqueMinimo !== undefined ? Number(estoqueMinimo) : undefined,
                        fornecedor,
                        categoriaId: categoriaId !== undefined ? Number(categoriaId) : undefined,
                    },
                    include: { categoria: true },
                });
                // Se houve alteração no estoque, registrar movimentação
                if (diferenca !== 0) {
                    yield prisma_1.prisma.estoque.create({
                        data: {
                            produtoId: Number(id),
                            tipoMovimentacao: diferenca > 0 ? client_1.TipoMovimentacao.entrada : client_1.TipoMovimentacao.saida,
                            quantidade: Math.abs(diferenca),
                            descricao: "Ajuste manual de estoque via edição do produto",
                        },
                    });
                }
                res.json({
                    message: "Produto atualizado com sucesso",
                    produto: updatedProduto,
                });
                return;
            }
            catch (error) {
                console.error("Update produto error:", error);
                res.status(500).json({ message: "Erro ao atualizar produto" });
                return;
            }
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const produto = yield prisma_1.prisma.produto.findUnique({
                    where: { id: Number(id) },
                    include: { itensPedido: true },
                });
                if (!produto) {
                    res.status(404).json({ message: "Produto não encontrado" });
                    return;
                }
                if (produto.itensPedido.length > 0) {
                    res.status(400).json({ message: "Produto vinculado a pedidos, não pode ser excluído" });
                    return;
                }
                yield prisma_1.prisma.produto.delete({ where: { id: Number(id) } });
                res.json({ message: "Produto excluído com sucesso" });
                return;
            }
            catch (error) {
                console.error("Delete produto error:", error);
                res.status(500).json({ message: "Erro ao excluir produto" });
                return;
            }
        });
    }
}
exports.ProdutoController = ProdutoController;
