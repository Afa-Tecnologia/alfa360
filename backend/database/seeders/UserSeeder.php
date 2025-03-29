<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Cria um usuário admin
        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Administrador',
                'email' => 'admin@example.com',
                'password' => 'adminlesamis3238*',
                'role' => 'admin'
            ]
        );

        // Cria vendedores
        $vendedores = [
            [
                'name' => 'Vendedor 1',
                'email' => 'vendedor1@example.com',
                'password' => Hash::make('password'),
                'role' => 'vendedor'
            ],
            [
                'name' => 'Vendedor 2',
                'email' => 'vendedor2@example.com',
                'password' => Hash::make('password'),
                'role' => 'vendedor'
            ],
            [
                'name' => 'Vendedor 3',
                'email' => 'vendedor3@example.com',
                'password' => Hash::make('password'),
                'role' => 'vendedor'
            ]
        ];

        foreach ($vendedores as $vendedor) {
            User::updateOrCreate(
                ['email' => $vendedor['email']],
                $vendedor
            );
        }
    }
} 