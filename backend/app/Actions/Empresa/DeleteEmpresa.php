<?php 

namespace App\Actions\Empresa; 

use App\Models\Empresa;
use Exception;

class DeleteEmpresa {

    public function execute(Empresa $empresa)
    {
        if(Empresa::where($empresa)){
            Empresa::destroy($empresa);
            return response()->json(['code'=>'success','message'=>'Deletado com sucesso!'], 200); 
        } else {
            throw new Exception('Empresa não encontrada', 404);
        }
    }
}