<?php

namespace Database\Seeders;

use App\Models\TiposDeProdutos;
use Illuminate\Database\Seeder;

class TiposDeProdutosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tiposDeProdutos = [
            [
                'nome' => 'Roupas',
                'descricao' => 'Roupas em geral como camisas, calças, vestidos, etc.',
                'ativo' => true
            ],
            [
                'nome' => 'Calçados',
                'descricao' => 'Sapatos, tênis, sandálias e outros tipos de calçados',
                'ativo' => true
            ],
            [
                'nome' => 'Acessórios',
                'descricao' => 'Bolsas, cintos, joias e outros acessórios',
                'ativo' => true
            ],

        ];

        foreach ($tiposDeProdutos as $tipo) {
            TiposDeProdutos::create($tipo);
        }
    }
} 