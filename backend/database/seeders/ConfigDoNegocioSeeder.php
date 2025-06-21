<?php

namespace Database\Seeders;

use App\Models\ConfigDoNegocio;
use Illuminate\Database\Seeder;
use App\Helpers\TenantContext;
use Illuminate\Support\Str;

class ConfigDoNegocioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
   
    public function run(): void
    {
        $tenantId = TenantContext::getTenantId();
        $configsDoNegocio = [
            [
                'uuid' => Str::uuid(), // UUID fixo para o ambiente de produção
                'nome' => 'Lesamis',
                'logo_url' => 'https://example.com/logo.png',
                'tipos_de_negocios_id' => 6, // Loja de roupas
                'cnpj' => '12.345.678/0001-99',
                'tenant_id' => $tenantId // Definindo tenant_id para o ambiente de produção
            ]
        ];

        foreach ($configsDoNegocio as $config) {
            ConfigDoNegocio::create($config);
        }
    }
} 
