<?php

namespace App\Services\Commissions;

use App\Http\Requests\Comissions\StoreComissionsRequest;
use App\Models\Commission;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class CommissionsService
{
    public function getAllCommissions(){
        return Commission::with(['pedido', 'produto', 'vendedor'])->get();
    }

    public function create(StoreComissionsRequest $data){
        $dataValidated = $data->validated();
        return Commission::create($dataValidated);
    }

    public function calcValueOfCommission ($productValue, $percentageCommission, $piecesQuantity){
        $comissionValue = ($productValue * $percentageCommission/100) * $piecesQuantity;
        return $comissionValue;
    }

    public function getCommissionsByVendedorAndDate($vendedorId, $dataInicial, $dataFinal){
        return Commission::where('vendedor_id', $vendedorId)
            ->whereBetween('created_at', [$dataInicial, $dataFinal])
            ->with(['pedido', 'produto', 'vendedor'])
            ->get();
    }

    public function getCommissionsByVendedor($vendedorId){
        // Busca todas as comissões do vendedor com relacionamentos
        $comissoes = Commission::where('vendedor_id', $vendedorId)
            ->with(['pedido', 'produto', 'vendedor'])
            ->get();

        // Calcula o total das comissões
        $totalComissoes = $comissoes->sum('valor');

        // Agrupa comissões por status
        $comissoesPorStatus = $comissoes->groupBy('status');
        
        // Calcula totais por status
        $totalPorStatus = [];
        foreach ($comissoesPorStatus as $status => $grupo) {
            $totalPorStatus[$status] = $grupo->sum('valor');
        }

        // Retorna o objeto formatado
        return [
            'vendedor' => $comissoes->first()?->vendedor,
            'comissoes' => $comissoes,
            'total_comissoes' => $totalComissoes,
            'total_por_status' => $totalPorStatus,
            'quantidade_total' => $comissoes->count()
        ];
    }
}
