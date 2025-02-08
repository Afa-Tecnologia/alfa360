<?php

namespace App\Services\Imagem;
use App\Models\Imagem;
use App\Models\Imagens;

class ImagemService
{
    // Método para criar um novo Produto
    public function create(array $data)
    {
        return Imagens::create($data);
    }

    // Método para obter todos os usuários
    public function getAll()
    {
        return Imagens::all();
    }

    // Método para obter um usuário por ID
    public function getById($id)
    {
        return Imagens::find($id);
    }

    public function update($id, $data)
    {
        $imagem = Imagens::find($id);

        if (!$imagem) {
            return null; // cliente não encontrado
        }

        // Atualizando apenas os campos passados na requisição
        $imagem->update($data);

        return $imagem;
    }

    // Método para excluir um usuário
    public function delete($id)
    {
        $imagem = Imagens::find($id);
        if ($imagem) {
            $imagem->delete();
        }
        return $imagem;
    }
}
