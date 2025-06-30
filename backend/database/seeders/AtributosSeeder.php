<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Atributo;
use App\Models\TipoDeNegocios;

class AtributosSeeder extends Seeder
{
    public function run(): void
    {
        $dados = [
            'Loja de roupas' => [
                'Cor', 'Tamanho', 'Estampa', 'Gênero', 'Tipo de tecido'
            ],
            'Loja de calçados' => [
                'Número', 'Material externo', 'Material interno', 'Altura do salto'
            ],
            'Loja de eletrônicos' => [
                'Voltagem', 'Marca', 'Modelo', 'Capacidade', 'Conectividade'
            ],
            'Loja de cosméticos' => [
                'Fragrância', 'Peso líquido', 'Tipo de pele', 'Fórmula (sem álcool)'
            ],
            'Loja de perfumes' => [
                'Fragrância', 'Volume', 'Fixação', 'Concentração'
            ],
            'Assistência Técnica' => [
                'Modelo', 'Marca', 'Voltagem', 'Defeito relatado'
            ],
            'Loja de acessórios' => [
                'Material', 'Cor predominante', 'Tamanho ajustável'
            ],
            'Loja de beleza' => [
                'Uso indicado', 'Tipo de pele', 'Composição'
            ],
            'Loja Virtual' => [
                'Peso', 'Dimensões', 'Cor', 'Garantia'
            ],
            'Loja Física' => [
                'Peso', 'Cor', 'Tamanho', 'Código interno'
            ],
            'Marketplace' => [
                'Marca', 'Modelo', 'Garantia'
            ],
            'Atacado' => [
                'Unidades por pacote', 'Embalagem', 'Volume'
            ],
            'Dropshipping' => [
                'Código fornecedor', 'Tempo de envio', 'Origem do estoque'
            ]
        ];

        foreach ($dados as $tipoNome => $atributos) {
            $tipo = TipoDeNegocios::where('nome', $tipoNome)->first();

            if (!$tipo) {
                $this->command->warn("Tipo de negócio não encontrado: $tipoNome");
                continue;
            }

            foreach ($atributos as $nome) {
                $atributo = Atributo::firstOrCreate(['name' => $nome]);
                $tipo->atributos()->syncWithoutDetaching([$atributo->id]);
            }
        }

        $this->command->info('Atributos e relacionamentos criados com sucesso!');
    }
}
