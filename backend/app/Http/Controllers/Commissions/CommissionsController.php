<?php

namespace App\Http\Controllers\Commissions;

use App\Http\Controllers\Controller;
use App\Models\Commission;
use App\Services\Commissions\CommissionsService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CommissionsController extends Controller
{

    protected $commissionService;

    public function __construct(CommissionsService $commissionService)
    {
        $this->commissionService = $commissionService;
    }


    public function index()
    {
        $comissoes = $this->commissionService->getCommissionsForCurrentMonth();
        return response()->json($comissoes);
    }

    //Traz um consolidado de todas as comissões de determinado vendedor
    public function comissaoPorVendedor($id)
    {
        try {
            // $vendedorId = $request->input('vendedor_id');
            $vendedorId = $id;
            // $startDate = $request->input('start_date');
            // $endDate = $request->input('end_date');

            // Recuperando as comissões do vendedor dentro do período
            $comissoes = Commission::where('vendedor_id', $vendedorId)
                ->get();

            $totalComissao = $comissoes->sum('valor');

            return response()->json([
                'vendedor_id' => $vendedorId,
                'comissao_total' => $totalComissao,
                'comissoes' => $comissoes
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao buscar comissões',
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    //Comissão por vendedor em determinada data
    public function getCommissionsByVendedorAndDate($id, Request $request)
    {
        $dataInicial = $request->query('data_inicial');
        $dataFinal = $request->query('data_final');

        try {
            $comissoes = $this->commissionService->getCommissionsByVendedoraAndDate(
                $id,
                $dataInicial,
                $dataFinal
            );

            return response()->json($comissoes);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao buscar comissões',
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
