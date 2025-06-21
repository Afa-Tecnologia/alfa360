<?php

namespace Database\Seeders;

use App\Models\TipoDeNegocios;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Helpers\TenantContext;

class TipoDeNegociosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tenantId = TenantContext::getTenantId();
        $tiposDeNegocios = [
            [
                'nome' => 'Loja Virtual',
                'descricao' => 'Loja virtual para venda de produtos online',
                'ativo' => true,
                 // Gerando UUID para tenant_id
            ],
            [
                'nome' => 'Loja Física',
                'descricao' => 'Estabelecimento comercial com presença física',
                'ativo' => true,
                 // Gerando UUID para tenant_id
            ],
            [
                'nome' => 'Marketplace',
                'descricao' => 'Plataforma que reúne diversos vendedores',
                'ativo' => true,
                
            ],
            [
                'nome' => 'Atacado',
                'descricao' => 'Venda em grandes quantidades para revendedores',
                'ativo' => true,
                
            ],
            [
                'nome' => 'Dropshipping',
                'descricao' => 'Modelo de varejo sem estoque próprio',
                'ativo' => true,
                
            ],
            [
                'nome' => 'Loja de roupas',
                'descricao' => 'Loja de roupas',
                'ativo' => true,
                
            ],
            [
                'nome' => 'Loja de calçados',
                'descricao' => 'Loja de calçados',
                'ativo' => true,
                
            ],
            [
                'nome' => 'Loja de acessórios',
                'descricao' => 'Loja de acessórios',
                'ativo' => true,
                
            ],
            [
                'nome' => 'Loja de beleza',
                'descricao' => 'Loja de beleza',
                'ativo' => true,
                
            ],
            [
                'nome' => 'Loja de cosméticos',
                'descricao' => 'Loja de cosméticos',
                'ativo' => true,
                
            ],
            [
                'nome' => 'Loja de perfumes',
                'descricao' => 'Loja de perfumes',
                'ativo' => true,
                
            ],
            [
                'nome' => 'Assistência Técnica',
                'descricao' => 'Assistência técnica para produtos eletrônicos',
                'ativo' => true,
                
            ],
            [
                'nome' => 'Loja de eletrônicos',
                'descricao' => 'Loja de eletrônicos',
                'ativo' => true,
                
            ],
            
            

            
        ];

        foreach ($tiposDeNegocios as $tipo) {
            TipoDeNegocios::create($tipo);
        }
    }
} 