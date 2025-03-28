<?php

namespace App\Services\Caixa;

use App\Models\Caixa;
use App\Models\MovimentacaoCaixa;
use App\Models\Pedido;
use Carbon\Carbon;
use DateTime;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class CaixaService
{
    public function openCaixa(float $saldoInicial, ?string $observation = null): Caixa
    {
        $existingOpenCaixa = Caixa::where('user_id', Auth::id())
            ->where('status', 'open')
            ->first();

        if ($existingOpenCaixa) {
            throw new \Exception('Já existe um caixa aberto para este usuário.');
        }

        return DB::transaction(function () use ($saldoInicial, $observation) {
            return Caixa::create([
                'user_id' => Auth::id(),
                'saldo_inicial' => $saldoInicial,
                'open_date' => Carbon::now(),
                'status' => 'open',
                'observation' => $observation
            ]);
        });
    }

    public function statusCaixa(): ?Caixa
    {
        return Caixa::where('user_id', Auth::id())
            ->where('status', 'open')
            ->first();
    }
    public function closeCaixa(Caixa $caixa, ?string $observation = null): Caixa
    {
        if ($caixa->status !== 'open') {
            throw new \Exception('Este caixa já está fechado.');
        }

        return DB::transaction(function () use ($caixa, $observation) {
            $saldoFinal = $caixa->calculateCurrentBalance();

            $caixa->update([
                'saldo_final' => $saldoFinal,
                'close_date' => Carbon::now(),
                'status' => 'closed',
                'observation' => $observation ? $caixa->observation . "\n" . $observation : $caixa->observation
            ]);

            return $caixa;
        });
    }

    public function createMovimentacao(
        Caixa $caixa,
        string $type,
        float $value,
        string $description,
        ?string $paymentMethod = null,
        ?array $additionalData = null,
        ?string $local = null
    ): MovimentacaoCaixa {
        if ($caixa->status !== 'open') {
            throw new \Exception('Não é possível criar movimentações em um caixa fechado.');
        }

        return DB::transaction(function () use ($caixa, $type, $value, $description, $paymentMethod, $additionalData, $local) {
            return MovimentacaoCaixa::create([
                'caixa_id' => $caixa->id,
                'user_id' => Auth::id(),
                'type' => $type,
                'value' => $value,
                'description' => $description,
                'payment_method' => $paymentMethod,
                'status' => 'completed',
                'additional_data' => $additionalData,
                'local'=> $local
            ]);
        });
    }

    public function createMovimentacaoFromPedido(Caixa $caixa, Pedido $pedido): MovimentacaoCaixa
    {
        if ($caixa->status !== 'open') {
            throw new \Exception('Não é possível criar movimentações em um caixa fechado.');
        }

        // Garantir que os produtos estão carregados
        if (!$pedido->relationLoaded('produtos')) {
            $pedido->load(['produtos' => function($query) {
                $query->with('variants');
            }]);
        }

        // Preparar os dados adicionais de maneira segura
        $additionalData = [];
        if ($pedido->produtos && $pedido->produtos->count() > 0) {
            $additionalData = [
                'pedido_items' => $pedido->produtos->map(function ($item) {
                    // Obter a variante com segurança
                    $varianteId = null;
                    if (isset($item->variants) && !empty($item->variants) && $item->variants->isNotEmpty()) {
                        $varianteId = $item->variants->first()->id ?? null;
                    }
                    
                    return [
                        'produto_id' => $item->id,
                        'variante_id' => $varianteId,
                        'quantity' => $item->pivot->quantidade ?? 0,
                        'selling_price' => $item->pivot->preco_unitario ?? 0,
                    ];
                })->toArray()
            ];
        }

        try {
            return MovimentacaoCaixa::create([
                'caixa_id' => $caixa->id,
                'user_id' => Auth::id(),
                'pedido_id' => $pedido->id,
                'type' => 'entrada',
                'value' => $pedido->total,
                'description' => "Pagamento do Pedido #{$pedido->id}",
                'payment_method' => $pedido->payment_method ?? 'PIX',
                'status' => $pedido->status ?? 'completed',
                'local' => $pedido->local ?? 'loja',
                'additional_data' => json_encode($additionalData)
            ]);
        } catch (\Exception $e) {
            Log::error('Erro ao criar movimentação de caixa: ' . $e->getMessage());
            throw $e;
        }
    }


    public function getTodasMovimentacoes()
    {
        return MovimentacaoCaixa::all();
    }

    public function generateReport(Caixa $caixa): array
    {
        $movimentacoes = $caixa->movimentacoes()
            ->where('status', 'completed')
            ->get();

        $entradas = $movimentacoes->where('type', 'entrada')->sum('value');
        $saidas = $movimentacoes->where('type', 'saida')->sum('value');

        $byPaymentMethod = $movimentacoes
            ->where('type', 'entrada')
            ->groupBy('payment_method')
            ->map(fn($group) => $group->sum('value'));

        return [
            'saldo_inicial' => $caixa->saldo_inicial,
            'saldo_final' => $caixa->saldo_final ?? $caixa->calculateCurrentBalance(),
            'total_entradas' => $entradas,
            'total_saidas' => $saidas,
            'por_forma_pagamento' => $byPaymentMethod,
            'status' => $caixa->status,
            'open_date' => $caixa->open_date,
            'close_date' => $caixa->close_date,
        ];
    }
}
