<?php

namespace Database\Seeders;

use App\Models\Categoria;
use App\Models\Cliente;
use App\Models\Produto;
use App\Models\User;
use App\Models\Variantes;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            TipoDeNegociosSeeder::class,
            TiposDeProdutosSeeder::class,
            ConfigDoNegocioSeeder::class,
        ]);

        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@alfatecnologiabrasil.com.br',
            'password' => Hash::make('12345678'),
            'perfil'=> 'admin'
        ]);

        User::factory()->create([
            'name' => 'Renata',
            'email' => 'renatapaz@gmail.com',
            'password' => Hash::make('12345678'),
            'perfil' => 'vendedor'
        ]);

        $categoria = Categoria::create([
            'name' => 'Saias',
            'description' => 'Todas as saias da nossa loja',
            'active' => true
        ]);

        $produto = Produto::create([
            "name" => "Saia de renda",
            "description" => "Saia de rendas",
            "purchase_price" => 50,
            "selling_price" => 87.89,
            "quantity" => 10,
            "categoria_id" => $categoria->id,
            "type" => "roupa",
            "tipo_de_produto_id" => 1,
            "brand"=> "lesamis",
            "code"=> 1232
        ]);

        Variantes::create([
            "produto_id" => $produto->id,
            "name" => "SAIA DE RENDA P",
            "color" => "AZUL",
            "type" => "seila",
            "size" => "P",
            "quantity" => 50,
            "active" => true,
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
