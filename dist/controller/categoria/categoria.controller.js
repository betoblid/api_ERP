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
exports.CategoriaController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class CategoriaController {
    static getAllCategorias(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categorias = yield prisma.categoria.findMany({
                    orderBy: { nome: "asc" },
                });
                res.status(200).json(categorias);
                return;
            }
            catch (error) {
                console.error("Get all categorias error:", error);
                res.status(500).json({ message: "Erro ao buscar categorias" });
                return;
            }
        });
    }
    static getCategoriaById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                if (isNaN(id)) {
                    res.status(400).json({ message: "ID inválido" });
                    return;
                }
                const categoria = yield prisma.categoria.findUnique({
                    where: { id },
                    include: { produtos: true },
                });
                if (!categoria) {
                    res.status(404).json({ message: "Categoria não encontrada" });
                    return;
                }
                res.json(categoria);
                return;
            }
            catch (error) {
                console.error("Get categoria by ID error:", error);
                res.status(500).json({ message: "Erro ao buscar categoria" });
                return;
            }
        });
    }
    static createCategoria(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nome } = req.body;
                const existingCategoria = yield prisma.categoria.findFirst({
                    where: { nome },
                });
                if (existingCategoria) {
                    res.status(400).json({ message: "Categoria já existe" });
                    return;
                }
                const newCategoria = yield prisma.categoria.create({
                    data: { nome },
                });
                res.status(201).json({
                    message: "Categoria criada com sucesso",
                    categoria: newCategoria,
                });
                return;
            }
            catch (error) {
                console.error("Create categoria error:", error);
                res.status(500).json({ message: "Erro ao criar categoria" });
                return;
            }
        });
    }
    static updateCategoria(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                const { nome } = req.body;
                if (isNaN(id)) {
                    res.status(400).json({ message: "ID inválido" });
                    return;
                }
                const categoria = yield prisma.categoria.findUnique({ where: { id } });
                if (!categoria) {
                    res.status(404).json({ message: "Categoria não encontrada" });
                    return;
                }
                if (nome) {
                    const existingCategoria = yield prisma.categoria.findFirst({
                        where: {
                            nome,
                            NOT: { id },
                        },
                    });
                    if (existingCategoria) {
                        res.status(400).json({ message: "Categoria já existe" });
                        return;
                    }
                }
                const updatedCategoria = yield prisma.categoria.update({
                    where: { id },
                    data: { nome },
                });
                res.json({
                    message: "Categoria atualizada com sucesso",
                    categoria: updatedCategoria,
                });
                return;
            }
            catch (error) {
                console.error("Update categoria error:", error);
                res.status(500).json({ message: "Erro ao atualizar categoria" });
                return;
            }
        });
    }
    static deleteCategoria(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                if (isNaN(id)) {
                    res.status(400).json({ message: "ID inválido" });
                    return;
                }
                const categoria = yield prisma.categoria.findUnique({
                    where: { id },
                    include: { produtos: true },
                });
                if (!categoria) {
                    res.status(404).json({ message: "Categoria não encontrada" });
                    return;
                }
                if (categoria.produtos.length > 0) {
                    res.status(400).json({
                        message: "Não é possível excluir categoria com produtos associados",
                    });
                    return;
                }
                yield prisma.categoria.delete({ where: { id } });
                res.json({ message: "Categoria excluída com sucesso" });
                return;
            }
            catch (error) {
                console.error("Delete categoria error:", error);
                res.status(500).json({ message: "Erro ao excluir categoria" });
                return;
            }
        });
    }
}
exports.CategoriaController = CategoriaController;
