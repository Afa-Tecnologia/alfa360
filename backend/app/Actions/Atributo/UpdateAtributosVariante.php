<?php

namespace App\Actions\Atributo;

use App\Models\Atributo;
use App\Models\Variantes;

class UpdateAtributosVariante
{
    public function execute(array $data, $varianteId)
    {
        $variante = Variantes::findOrFail($varianteId);

        $novosAtributos = collect($data)->mapWithKeys(function ($item) {
            return [$item['atributo_id'] => ['valor' => $item['valor']]];
        });

        $atributosAtuais = $variante->atributos->pluck('pivot.valor', 'id');

        foreach ($atributosAtuais as $atributoId => $valorAtual) {
            if ($novosAtributos->has($atributoId)) {
                $novoValor = $novosAtributos[$atributoId]['valor'];
                if ($novoValor !== $valorAtual) {
                    $variante->atributos()->updateExistingPivot($atributoId, ['valor' => $novoValor]);
                }
                $novosAtributos->forget($atributoId);
            } else {
                $variante->atributos()->detach($atributoId);
            }
        }

        if ($novosAtributos->isNotEmpty()) {
            $variante->atributos()->attach($novosAtributos->all());
        }
    }

    public function handle(Variantes $variante, array $atributos)
    {
        $atributosMapeados = collect($atributos)->mapWithKeys(function ($item) {
            return [$item['atributo_id'] => ['valor' => $item['valor']]];
        });

        $atributosAtuais = $variante->atributos->pluck('pivot.valor', 'id');

        foreach ($atributosAtuais as $atributoId => $valorAtual) {
            if ($atributosMapeados->has($atributoId)) {
                $novoValor = $atributosMapeados[$atributoId]['valor'];
                if ($novoValor !== $valorAtual) {
                    $variante->atributos()->updateExistingPivot($atributoId, ['valor' => $novoValor]);
                }
                $atributosMapeados->forget($atributoId);
            } else {
                $variante->atributos()->detach($atributoId);
            }
        }

        if ($atributosMapeados->isNotEmpty()) {
            $variante->atributos()->attach($atributosMapeados->all());
        }
    }
}

    