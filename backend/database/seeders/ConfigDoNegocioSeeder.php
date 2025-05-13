<?php

namespace Database\Seeders;

use App\Models\ConfigDoNegocio;
use Illuminate\Database\Seeder;

class ConfigDoNegocioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $configsDoNegocio = [
            [
                'nome' => 'Lesamis',
                'logo_url' => 'https://example.com/logo.png',
                'tipo_de_negocio_id' => 6, // Loja de roupas
                'cnpj' => '12.345.678/0001-99'
            ]
        ];

        foreach ($configsDoNegocio as $config) {
            ConfigDoNegocio::create($config);
        }
    }
} 