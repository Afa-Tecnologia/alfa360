<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Categoria;
use App\Models\Cliente;
use App\Models\Produto;
use App\Models\Variantes;
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
        // Seeders básicos do sistema
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

        // Categoria básica
        $categoria = Categoria::updateOrCreate(
            ['name' => 'Produtos Gerais'],
            [
                'name' => 'Produtos Gerais',
                'description' => 'Categoria padrão para todos os produtos',
                'active' => true
            ]
        );

        // Produto de exemplo
        $produto = Produto::updateOrCreate(
            ['name' => 'Produto Padrão'],
            [
                "name" => "Produto Padrão",
                "description" => "Produto inicial do sistema",
                "purchase_price" => 50,
                "selling_price" => 100,
                "quantity" => 10,
                "categoria_id" => $categoria->id,
                "tipo_de_produto_id" => 1,
                "brand" => "Marca Padrão",
                "code" => 1001
            ]
        );

        // Variante do produto
        Variantes::updateOrCreate(
            ['name' => 'PRODUTO PADRÃO M'],
            [
                "produto_id" => $produto->id,
                "name" => "PRODUTO PADRÃO M",
                "color" => "PRETO",
                "type" => "default",
                "size" => "M",
                "quantity" => 10,
                "active" => true,
            ]
        );

        // Cliente de exemplo
        Cliente::updateOrCreate(
            ['email' => 'cliente@exemplo.com'],
            [
                "name" => "Cliente",
                "last_name" => "Padrão",
                "email" => "cliente@exemplo.com",
                "phone" => "(00) 00000-0000",
                "cpf" => "000.000.000-00",
                "adress" => "Rua Exemplo, 123",
                "city" => "Cidade",
                "state" => "UF",
                "cep" => "00000-000",
                "date_of_birth" => "2000-01-01"
            ]
        );
    }
} 