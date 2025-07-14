<?php

namespace App\Services\User;

use App\Models\User;

class UserService
{
    // Método para criar um novo usuário
    public function create(array $data)
    {
        return User::create($data);
    }

    // Método para obter todos os usuários
    public function getAll()
    {
        return User::with('roles')
            ->select('id', 'uuid', 'name', 'email', 'tenant_id', 'created_at', 'updated_at')
            ->get();
    }

    // Método para obter um usuário por ID
    public function getById($id)
    {
        return User::find($id);
    }

    // Método para atualizar um usuário
    public function update($id, array $data)
    {
        $user = User::find($id);
        if ($user) {
            $user->update($data);
        }
        return $user;
    }

    // Método para excluir um usuário
    public function delete($id)
    {
        $user = User::find($id);
        if ($user) {
            $user->delete();
        }
        return $user;
    }

// Método para obter todos os vendedores
    public function getVendedores()
    {

        $usersWithRoles = User::with('roles')
            ->whereHas('roles', function ($query) {
                $query->whereIn('name', ['vendedor', 'admin', 'gerente']); // Inclui administradores como vendedores
            })
            ->select('id','uuid', 'name', 'email', 'tenant_id' )
            ->get();



        return $usersWithRoles;
    }
} 
