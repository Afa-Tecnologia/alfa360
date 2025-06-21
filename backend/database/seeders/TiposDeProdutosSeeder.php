<?php

namespace Database\Seeders;

use App\Helpers\TenantContext;
use App\Models\TiposDeProdutos;
use Illuminate\Database\Seeder;

class TiposDeProdutosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */

    public function run(): void
    {
        $tenantId = TenantContext::getTenantId();
        
        $tiposDeProdutos = [
            [
                'nome' => 'Roupas',
                'descricao' => 'Roupas em geral como camisas, calças, vestidos, etc.',
                'ativo' => true,
                'tenant_id' => $tenantId // Definindo tenant_id para o ambiente de produção
            ],
            [
                'nome' => 'Calçados',
                'descricao' => 'Sapatos, tênis, sandálias e outros tipos de calçados',
                'ativo' => true,
                'tenant_id' => $tenantId // Definindo tenant_id para o ambiente de produção
            ],
            [
                'nome' => 'Acessórios',
                'descricao' => 'Bolsas, cintos, joias e outros acessórios',
                'ativo' => true,
                'tenant_id' => $tenantId // Definindo tenant_id para o ambiente de produção
            ],

        ];

        foreach ($tiposDeProdutos as $tipo) {
            TiposDeProdutos::create($tipo);
        }
    }
} 