<?php

namespace App\Http\Controllers\Commissions;

use App\Http\Controllers\Controller;
use App\Models\Commission;
use App\Services\Commissions\CommissionsService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class CommissionsController extends Controller
{

    protected $commissionService;

    public function __construct(CommissionsService $commissionService)
    {
        $this->commissionService = $commissionService;
    }


    public function index()
    {
        try {
            $comissoes = $this->commissionService->getAllCommissions();
            return response()->json([
                'success' => true,
                'data' => $comissoes
            ]);
        } catch (\Exception $e) {
            Log::error('Erro ao buscar comissões: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erro ao buscar comissões',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getCommissionsByVendedor($vendedorId){
        try {
            $comissoes = $this->commissionService->getCommissionsByVendedor($vendedorId);
            return response()->json([
                'success' => true,
                'data' => $comissoes
            ]);
        } catch (\Exception $e) {
            Log::error('Erro ao buscar comissões do vendedor: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erro ao buscar comissões do vendedor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getCommissionsByVendedorAndDate($vendedorId, Request $request){
        try {
            $request->validate([
                'data_inicial' => 'required|date',
                'data_final' => 'required|date'
            ]);

            $comissoes = $this->commissionService->getCommissionsByVendedorAndDate(
                $vendedorId, 
                $request->data_inicial, 
                $request->data_final
            );

            return response()->json([
                'success' => true,
                'data' => [
                    'comissoes' => $comissoes,
                    'total' => $comissoes->sum('valor'),
                    'quantidade' => $comissoes->count()
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Erro ao buscar comissões do vendedor por data: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erro ao buscar comissões do vendedor por data',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    
}
