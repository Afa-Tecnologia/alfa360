<?php

namespace App\Actions\User;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class CreateUser
{
    public function execute(array $data): User
    {

        $user = User::updateOrCreate([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'tenant_id' => $data['tenant_id'] ?? null,
        ]);

         $user->assignRole($data['role'] ?? 'vendedor');

        return $user->with('roles')
            ->select('id', 'uuid', 'name', 'email', 'tenant_id', 'created_at', 'updated_at')
            ->find($user->id);
    }
}