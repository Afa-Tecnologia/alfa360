<?php

namespace App\Services\Categorias;

use App\Models\Categoria;

class CategoriaService
{
    // Método para criar um nova Categoria
    public function create(array $data)
    {
        return Categoria::create($data);
    }

    // Método para obter todos os Categoria
    public function getAll()
    {
        return Categoria::all();
    }

    // Método para obter um categoria por ID
    public function getById($id)
    {
        return Categoria::find($id);
    }

    public function update($id, $data)
    {

        $categoria = Categoria::find($id);

        if (!$categoria) {
            return null; // Categoria não encontrado
        }

        // Atualizando apenas os campos passados na requisição
        $categoria->update($data);

        return $categoria;
    }

    // Método para excluir um categoria
    public function delete($id)
    {
        $categoria = Categoria::find($id);
        if ($categoria) {
            $categoria->delete();
        }
        return $categoria;
    }
}
