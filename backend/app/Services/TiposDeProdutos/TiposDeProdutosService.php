<?php

namespace App\Services\TiposDeProdutos;

use App\Models\TiposDeProdutos;
use Illuminate\Database\Eloquent\Collection;

class TiposDeProdutosService
{
    /**
     * Retorna todos os tipos de produtos.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAll(): Collection
    {
        return TiposDeProdutos::all();
    }

    /**
     * Busca um tipo de produto pelo ID.
     *
     * @param int $id
     * @return \App\Models\TiposDeProdutos|null
     */
    public function getById(int $id): ?TiposDeProdutos
    {
        return TiposDeProdutos::find($id);
    }

    /**
     * Cria um novo tipo de produto.
     *
     * @param array $data
     * @return \App\Models\TiposDeProdutos
     */
    public function create(array $data): TiposDeProdutos
    {
        return TiposDeProdutos::create($data);
    }

    /**
     * Atualiza um tipo de produto existente.
     *
     * @param int $id
     * @param array $data
     * @return \App\Models\TiposDeProdutos|null
     */
    public function update(int $id, array $data): ?TiposDeProdutos
    {
        $tipoDeProduto = $this->getById($id);

        if (!$tipoDeProduto) {
            return null;
        }

        $tipoDeProduto->update($data);
        return $tipoDeProduto;
    }

    /**
     * Exclui um tipo de produto.
     *
     * @param int $id
     * @return bool
     */
    public function delete(int $id): bool
    {
        $tipoDeProduto = $this->getById($id);

        if (!$tipoDeProduto) {
            return false;
        }

        return $tipoDeProduto->delete();
    }
} 