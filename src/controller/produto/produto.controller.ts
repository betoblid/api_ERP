import { Request, Response } from "express"
import { TipoMovimentacao } from "@prisma/client"
import { prisma } from "../../prisma"


export class ProdutoController {
  static async getAll(req: Request, res: Response) {
    try {
      const produtos = await prisma.produto.findMany({
        include: { categoria: true },
        orderBy: { nome: "asc" },
      })
      res.json(produtos)
    } catch (error) {
      console.error("Get all produtos error:", error)
      res.status(500).json({ message: "Erro ao buscar produtos" })
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const produto = await prisma.produto.findUnique({
        where: { id: Number(id) },
        include: { categoria: true },
      })

      if (!produto) {
         res.status(404).json({ message: "Produto não encontrado" });
         return;
      }

      res.json(produto)
    } catch (error) {
      console.error("Get produto by ID error:", error)
      res.status(500).json({ message: "Erro ao buscar produto" });
      return;
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { nome, codigoBarras, preco, estoqueAtual, estoqueMinimo, fornecedor, categoriaId } = req.body

      const existingProduto = await prisma.produto.findFirst({
        where: { codigoBarras },
      })

      if (existingProduto) {
         res.status(400).json({ message: "Código de barras já cadastrado" });
         return;
      }

      const categoria = await prisma.categoria.findUnique({
        where: { id: Number(categoriaId) },
      })

      if (!categoria) {
         res.status(400).json({ message: "Categoria não encontrada" });
         return;
      }

      const newProduto = await prisma.produto.create({
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
      })

      // Registra movimentação de entrada
      await prisma.estoque.create({
        data: {
          produtoId: newProduto.id,
          tipoMovimentacao: TipoMovimentacao.entrada,
          quantidade: Number(estoqueAtual),
          descricao: "Cadastro inicial do produto",
        },
      })

      res.status(201).json({
        message: "Produto criado com sucesso",
        produto: newProduto,
      })
    } catch (error) {
      console.error("Create produto error:", error)
      res.status(500).json({ message: "Erro ao criar produto" });
      return;
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { nome, codigoBarras, preco, estoqueAtual, estoqueMinimo, fornecedor, categoriaId } = req.body

      const produto = await prisma.produto.findUnique({ where: { id: Number(id) } })
      if (!produto) {
        res.status(404).json({ message: "Produto não encontrado" });
        return;
      } 

      if (codigoBarras) {
        const existing = await prisma.produto.findFirst({
          where: {
            codigoBarras,
            NOT: { id: Number(id) },
          },
        })
        if (existing) {
           res.status(400).json({ message: "Código de barras já cadastrado" });
           return
        }
      }

      const novaQuantidade = estoqueAtual !== undefined ? Number(estoqueAtual) : produto.estoqueAtual
      const diferenca = novaQuantidade - produto.estoqueAtual

      const updatedProduto = await prisma.produto.update({
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
      })

      // Se houve alteração no estoque, registrar movimentação
      if (diferenca !== 0) {
        await prisma.estoque.create({
          data: {
            produtoId: Number(id),
            tipoMovimentacao: diferenca > 0 ? TipoMovimentacao.entrada : TipoMovimentacao.saida,
            quantidade: Math.abs(diferenca),
            descricao: "Ajuste manual de estoque via edição do produto",
          },
        });
      }

      res.json({
        message: "Produto atualizado com sucesso",
        produto: updatedProduto,
      });
      return
    } catch (error) {
      console.error("Update produto error:", error)
      res.status(500).json({ message: "Erro ao atualizar produto" });
      return;
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params

      const produto = await prisma.produto.findUnique({
        where: { id: Number(id) },
        include: { itensPedido: true },
      })

      if (!produto) {
        res.status(404).json({ message: "Produto não encontrado" });
        return;
      } 
      if (produto.itensPedido.length > 0) {
         res.status(400).json({ message: "Produto vinculado a pedidos, não pode ser excluído" });
         return;
      }

      await prisma.produto.delete({ where: { id: Number(id) } })

      res.json({ message: "Produto excluído com sucesso" });
      return;
    } catch (error) {
      console.error("Delete produto error:", error)
      res.status(500).json({ message: "Erro ao excluir produto" });
      return;
    }
  }
}
