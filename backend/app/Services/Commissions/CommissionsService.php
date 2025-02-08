<?php

namespace App\Services\Commissions;

use App\Models\Commission;
use Illuminate\Support\Carbon;

class CommissionsService
{

    public function getCommissionsByVendedora($vendedorId)
    {

        return Commission::where('vendedor_id', '=', $vendedorId)->get();
    }

    // Método para buscar as comissões de uma vendedora em um intervalo de datas
    public function getCommissionsByVendedoraAndDate($vendedorId, $dataInicial, $dataFinal)
    {
        // Verificando se as datas são fornecidas
        if (!$dataInicial || !$dataFinal) {
            throw new \InvalidArgumentException('As datas de início e fim são necessárias.');
        }

        // Garantindo que as datas estão no formato correto (ISO 8601, ou outro padrão)
        $dataInicial = Carbon::parse($dataInicial)->startOfDay();
        $dataFinal = Carbon::parse($dataFinal)->endOfDay();

        // Consultando as comissões no intervalo de datas e para a vendedora específica
        return Commission::where('vendedor_id', '=', $vendedorId)
            ->whereBetween('created_at', [$dataInicial, $dataFinal])
            ->get();
    }

    public function getCommissionsByDate($dataInicial, $dataFinal)
    {
        // Verificando se as datas são fornecidas
        if (!$dataInicial || !$dataFinal) {
            throw new \InvalidArgumentException('As datas de início e fim são necessárias.');
        }

        // Garantindo que as datas estão no formato correto (ISO 8601, ou outro padrão)
        $dataInicial = Carbon::parse($dataInicial)->startOfDay();
        $dataFinal = Carbon::parse($dataFinal)->endOfDay();

        // Consultando as comissões no intervalo de datas
        return Commission::whereBetween('created_at', [$dataInicial, $dataFinal])->get();
    }

    public function getCommissionsForCurrentMonth()
    {
        // Obtém o início e o fim do mês atual
        $dataInicial = Carbon::now()->startOfMonth();
        $dataFinal = Carbon::now()->endOfMonth();

        // Consulta as comissões no intervalo do mês atual
        return Commission::whereBetween('created_at', [$dataInicial, $dataFinal])->get();
    }
}
