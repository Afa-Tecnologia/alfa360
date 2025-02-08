<?php

namespace App\Services\Produtos;

use App\Models\Produto;
use App\Models\Variantes;

class ProdutoService
{
    // Método para criar um novo Produto
    public function create(array $data)
    {
        return Produto::create($data);
    }

    // Método para obter todos os usuários
    public function getAll()
    {
        return Produto::with(['categoria', 'variantes.imagens'])->get();
    }

    // Método para obter um usuário por ID
    public function getById($id)
    {
        return Produto::with(['variantes.imagens'])->findOrFail($id);
    }

    public function getProdutoPorCategoria($id)
    {
        return Produto::where('categoria_id', '=', $id)->get();
    }

    public function getVariantesProdutos($id)
    {
        return Variantes::where('produto_id', '=', $id)->get();
    }

    public function update($id, $data)
    {
        $produto = Produto::find($id);

        if (!$produto) {
            return null; // Produto não encontrado
        }

        // Atualizando apenas os campos passados na requisição
        $produto->update($data);

        return $produto;
    }

    // Método para excluir um usuário
    public function delete($id)
    {
        $produto = Produto::find($id);
        if ($produto) {
            $produto->delete();
        }
        return $produto;
    }
}
