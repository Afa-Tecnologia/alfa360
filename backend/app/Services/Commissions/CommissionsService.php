<?php

namespace App\Services\Commissions;

use App\Http\Requests\Comissions\StoreComissionsRequest;
use App\Models\Commission;
use Illuminate\Support\Carbon;

class CommissionsService
{
    public function getAllCommissions(){
        return Commission::all();
    }

    public function create(StoreComissionsRequest $data){
        $dataValidated = $data->validated();

        return Commission::create($$dataValidated);
    }

    public function calcValueOfCommission ($productValue, $percentageCommission, $piecesQuantity){
        $comissionValue = ($productValue * $percentageCommission/100) * $piecesQuantity;
        return $comissionValue;
    }

    public function getCommissionsByVendedorAndDate($vendedorId, $dataInicial, $dataFinal){
        return Commission::where('vendedor_id', $vendedorId)
            ->whereBetween('data', [$dataInicial, $dataFinal])
            ->get();
    }

    public function getCommissionsByVendedor($vendedorId){
        return Commission::where('vendedor_id', $vendedorId)
            ->get();
    }
}
