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
        $comissoes = $this->commissionService->getAllCommissions();
        return response()->json($comissoes);
    }

    public function getCommissionsByVendedor($vendedorId){
        $comissoes = $this->commissionService->getCommissionsByVendedor($vendedorId);
        return response()->json($comissoes);
    }

    public function getCommissionsByVendedorAndDate($vendedorId, $dataInicial, $dataFinal){
        $comissoes = $this->commissionService->getCommissionsByVendedorAndDate($vendedorId, $dataInicial, $dataFinal);
        return response()->json($comissoes);
    }
    
    
}
