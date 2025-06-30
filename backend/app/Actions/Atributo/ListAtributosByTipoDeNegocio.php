<?php

namespace App\Actions\Atributo;

use App\Models\Atributo;
use App\Models\ConfigDoNegocio;
use App\Models\Tenant;
use App\Models\TipoDeNegocios;
use Illuminate\Support\Facades\Auth;

class ListAtributosByTipoDeNegocio {

    public function execute() {
        // Busca o tenant do usuário autenticado
        $tenant = Tenant::where('id', Auth::user()->id)->first();

        // Busca a configuração do negócio associada a esse tenant
        $configDoNegocio = ConfigDoNegocio::where('tenant_id', $tenant->id)->first();
        // Agora busca o Tipo de Negócio associado
        $tipoDeNegocio = TipoDeNegocios::with('atributos')->find($configDoNegocio->tipos_de_negocios_id);

        return $tipoDeNegocio;
  
    }
}