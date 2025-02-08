<?php

namespace App\Services\Variantes;
use App\Models\Variantes;

class VariantesService
{
    // Método para criar um novo Produto
    public function create(array $data)
    {
        return Variantes::create($data);
    }

    // Método para obter todos os usuários
    public function getAll()
    {
        return Variantes::all();
    }

    // Método para obter um usuário por ID
    public function getById($id)
    {
        return Variantes::with('imagens')->findOrFail($id);
    }

    public function getClientesPorCategoria($id)
    {
        return Variantes::where('categoria_id', '=', $id)->get();
    }

    public function update($id, $data)
    {
        $variante = Variantes::find($id);

        if (!$variante) {
            return null; // cliente não encontrado
        }

        // Atualizando apenas os campos passados na requisição
        $variante->update($data);

        return $variante;
    }

    // Método para excluir um usuário
    public function delete($id)
    {
        $variante = Variantes::find($id);
        if ($variante) {
            $variante->delete();
        }
        return $variante;
    }
}
