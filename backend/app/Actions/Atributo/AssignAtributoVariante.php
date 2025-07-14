<?php
namespace App\Actions\Atributo;

use App\Models\Atributo;
use App\Models\Variantes;

class AssignAtributoVariante{

    public function execute(array $data, $varianteId){
        // Insere os atributos da variante
        foreach ($data as $atributo) {
           $atributo_id_existente = Atributo::where('id', $atributo['atributo_id'])->first();
           $variante = Variantes::find($varianteId);
           if($variante){
                $variante->atributos()->attach($atributo_id_existente, ["valor"=> $atributo['valor']]);
           }
        }
        
    }
}