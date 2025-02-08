<?php

namespace App\Http\Controllers\Caixa;

use App\Http\Controllers\Controller;
use App\Models\Caixa;
use App\Models\MovimentacaoCaixa;
use App\Models\Pedido;
use App\Services\Caixa\CaixaService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CaixaController extends Controller
{
    protected $caixaService;


    public function __construct(CaixaService $caixaService)
    {
        $this->caixaService = $caixaService;

    }

    public function open(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'saldo_inicial' => 'required|numeric|min:0',
            'observation' => 'nullable|string'
        ]);

        $caixa = $this->caixaService->openCaixa(
            $validated['saldo_inicial'],
            $validated['observation'] ?? null
        );

        return response()->json($caixa, 201);
    }

    public function status(): JsonResponse
    {
        $caixa = $this->caixaService->statusCaixa();

        if (!$caixa) {
            return response()->json(['message' => 'Nenhum caixa aberto.']);
        }

        return response()->json([
            'id' => $caixa->id,
            'saldo_inicial' => $caixa->saldo_inicial,
            'open_date' => $caixa->open_date,
            'status' => $caixa->status,
        ]);
    }

    public function close(Caixa $caixa, Request $request): JsonResponse
    {
        $validated = $request->validate([
            'observation' => 'nullable|string'
        ]);

        $caixa = $this->caixaService->closeCaixa(
            $caixa,
            $validated['observation'] ?? null
        );

        return response()->json($caixa);
    }
    
    public function movimentacoes(){
        $movimentacoes = $this->caixaService->getTodasMovimentacoes();
        return response()->json($movimentacoes);
    }

    public function createMovimentacao(Caixa $caixa, Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'required|in:entrada,saida',
            'value' => 'required|numeric|min:0.01',
            'description' => 'required|string|max:200',
            'payment_method' => 'nullable|string',
            'additional_data' => 'nullable|array'
        ]);

        $movimentacao = $this->caixaService->createMovimentacao(
            $caixa,
            $validated['type'],
            $validated['value'],
            $validated['description'],
            $validated['payment_method'] ?? null,
            $validated['additional_data'] ?? null
        );

        return response()->json($movimentacao, 201);
    }

    public function createMovimentacaoFromPedido(Request $request, Caixa $caixa, Pedido $pedido): JsonResponse
    {
        $movimentacao = $this->caixaService->createMovimentacaoFromPedido($caixa, $pedido);
        return response()->json($movimentacao, 201);
    }

    public function report(Caixa $caixa): JsonResponse
    {
        $report = $this->caixaService->generateReport($caixa);
        return response()->json($report);
    }
}
