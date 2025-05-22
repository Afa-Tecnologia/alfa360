<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ProductionSeeder extends Seeder
{
    /**
     * Run the database seeds específicos para ambiente de produção.
     * Este seeder NÃO usa Faker e contém apenas dados essenciais.
     */
    public function run(): void
    {
        $this->call([
            TipoDeNegociosSeeder::class,
            TiposDeProdutosSeeder::class,
            ConfigDoNegocioSeeder::class,
        ]);

        // Criação de usuários essenciais para o sistema
        $users = [
            [
                'name' => 'Admin',
                'email' => 'admin@alfatecnologiabrasil.com.br',
                'password' => 'Rp8Q0dJNLN3vjf8O2Mv',
                'perfil'=> 'admin',
                'role' => 'admin'
            ]
        ];

        foreach ($users as $userData) {
            User::updateOrCreate(
                ['email' => $userData['email']],
                $userData
            );
        }
    }
} 