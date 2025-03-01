<?php

namespace Database\Seeders;

use App\Models\Categoria;
use App\Models\Cliente;
use App\Models\Produto;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@alfatecnologiabrasil.com.br',
            'password' => '12345678',
            'perfil'=> 'admin'
        ]);
        User::factory()->create([
            'name' => 'Renata',
            'email' => 'renatapaz@gmail.com',
            'password' => '12345678',
            'perfil' => 'vendedor'
        ]);

        Categoria::create([
            'name' => 'Saias',
            'description' => 'Todas as saias da nossa loja',
            'active' => true
        ]);

        Produto::create([
            "name" => "Saia de renda",
            "description" => "Saia de rendas",
            "purchase_price" => 50,
            "selling_price" => 87.89,
            "quantity" => 10,
            "categoria_id" => 1,
            "type" => "roupa",
            "brand"=> "lesamis",
            "code"=> 1232
        ]);
        Cliente::create([
            "name" => "João",
            "last_name" => "Carneiro",
            "email" => "joao.silva@example.com",
            "phone" => "(21) 98765-4321",
            "cpf" => "123.456.789-00",
            "adress" => "Rua das Flores, 123",
            "city" => "Rio de Janeiro",
            "state" => "RJ",
            "cep" => "12345-678",
            "date_of_birth" => "1990-05-15"
        ]);

    }
}
