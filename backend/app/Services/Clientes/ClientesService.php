<?php

namespace App\Services\Clientes;

use App\Models\Cliente;
use App\Models\Clientes;

class ClientesService
{
    // Método para criar um novo Produto
    public function create(array $data)
    {
        return Cliente::create($data);
    }

    // Método para obter todos os usuários
    public function getAll()
    {
        return Cliente::all();
    }

    // Método para obter um usuário por ID
    public function getById($id)
    {
        return Cliente::find($id);
    }

    public function getClientesPorCategoria($id)
    {
        return Cliente::where('categoria_id', '=', $id)->get();
    }

    public function update($id, $data)
    {
        $cliente = Cliente::find($id);

        if (!$cliente) {
            return null; // cliente não encontrado
        }

        // Atualizando apenas os campos passados na requisição
        $cliente->update($data);

        return $cliente;
    }

    // Método para excluir um usuário
    public function delete($id)
    {
        $cliente = Cliente::find($id);
        if ($cliente) {
            $cliente->delete();
        }
        return $cliente;
    }
}
