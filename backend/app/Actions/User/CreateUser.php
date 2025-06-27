<?php

namespace App\Actions\User;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class CreateUser
{
    public function execute(array $data): User
    {

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'tenant_id' => $data['tenant_id'] ?? null,
        ]);

         $user->assignRole($data['role'] ?? 'vendedor');

        return $user;
    }
}