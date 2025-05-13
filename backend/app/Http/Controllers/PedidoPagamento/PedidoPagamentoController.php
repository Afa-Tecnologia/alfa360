<?php

namespace App\Http\Controllers\PedidoPagamento;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\PedidoPagamento\StorePedidoPagamentoRequest;
use App\Http\Resources\PedidoPagamentoResource;
use App\Models\Pedido;
use App\Services\PedidoPagamento\PedidoPagamentoService;
use Illuminate\Http\JsonResponse;
use App\Models\PedidoPagamento;

class PedidoPagamentoController extends Controller
{
    protected PedidoPagamentoService $pagamentosDoPedidoService;

    public function __construct(PedidoPagamentoService $pagamentosDoPedidoService)
    {
        $this->pagamentosDoPedidoService = $pagamentosDoPedidoService;
    }

    /**
     * Registra um pagamento de forma síncrona, sem gateway externo.
     */
    public function store(StorePedidoPagamentoRequest $request, Pedido $pedido)
    {
        try{
            $data = $request->validated();
            $result = $this->pagamentosDoPedidoService->create($pedido, $data);
            
            return response()->json([
                'message' => 'Pagamento registrado com sucesso',
                'data' => $result
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao registrar pagamento',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    public function getPagamentoPorPedido($pedidoId){
        $data = $this->pagamentosDoPedidoService->getPagamentosPorPedido($pedidoId);
        
        return response()->json($data);
    }
}