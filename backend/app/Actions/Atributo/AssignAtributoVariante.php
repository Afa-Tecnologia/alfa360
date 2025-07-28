<?php
namespace App\Actions\Atributo;

use App\Models\Atributo;
use App\Models\Variantes;
use Illuminate\Support\Facades\DB;

class AssignAtributoVariante{

    public function execute(array $data, $varianteId){
        if (empty($data)) {
            return;
        }

        $variante = Variantes::find($varianteId);
        if (!$variante) {
            return;
        }

        // Preparar dados para insert em lote
        $pivotData = [];
        foreach ($data as $atributo) {
            $pivotData[] = [
                'variante_id' => $varianteId,
                'atributo_id' => $atributo['atributo_id'],
                'valor' => $atributo['valor']
            ];
        }

        // Insert em lote se houver dados
        if (!empty($pivotData)) {
            DB::table('variantes_atributos')->insert($pivotData);
        }
    }
}