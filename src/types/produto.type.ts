
export type typeProduto = {
    nome?: string
    codigoBarra?: string
    categoria?: string
    preco?: string
    fornecedor?: string
    quantidadeEstoque?: string
}

export type ProdutoInput = {
    nome: string;
    codigo: string;
    preco: string;
    estoque: string;
    fornecedor: string;
    categoriaId: string;
    estoqueMinimo?: string; // opcional com valor padrão no backend
  };
  