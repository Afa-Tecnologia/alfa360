<?php

namespace App\Actions\Empresa; 

use App\Models\Empresa;
use Exception;

class UpdateEmpresa {

    public function execute(Empresa $empresa, array $data): Empresa
    {
        
        if(Empresa::where($empresa)){
            $empresa->update($data);
            return $empresa;
        } else {
            throw new Exception('Empresa não encontrada', 404);
        }
    }
}