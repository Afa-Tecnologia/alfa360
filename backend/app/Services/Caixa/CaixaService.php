<?php

namespace App\Services\Caixa;

use App\Models\Caixa;
use App\Models\MovimentacaoCaixa;
use App\Models\Pedido;
use Carbon\Carbon;
use DateTime;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;

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
        ?array $additionalData = null
    ): MovimentacaoCaixa {
        if ($caixa->status !== 'open') {
            throw new \Exception('Não é possível criar movimentações em um caixa fechado.');
        }

        return DB::transaction(function () use ($caixa, $type, $value, $description, $paymentMethod, $additionalData) {
            return MovimentacaoCaixa::create([
                'caixa_id' => $caixa->id,
                'user_id' => Auth::id(),
                'type' => $type,
                'value' => $value,
                'description' => $description,
                'payment_method' => $paymentMethod,
                'status' => 'completed',
                'additional_data' => $additionalData
            ]);
        });
    }

    public function createMovimentacaoFromPedido(Caixa $caixa, Pedido $pedido): MovimentacaoCaixa
    {
        if ($caixa->status !== 'open') {
            throw new \Exception('Não é possível criar movimentações em um caixa fechado.');
        }

        return MovimentacaoCaixa::create([
            'caixa_id' => $caixa->id,
            'user_id' => Auth::id(),
            'pedido_id' => $pedido->id,
            'type' => 'entrada',
            'value' => $pedido->total,
            'description' => "Pagamento do Pedido #{$pedido->id}",
            'payment_method' => $pedido->payment_method ?? 'não informado',
            'status' => 'confirmed',
            'additional_data' => json_encode([
                'pedido_items' => $pedido->items->map(function ($item) {
                    return [
                        'produto_id' => $item->produto_id,
                        'quantity' => $item->quantity,
                        'selling_price' => $item->selling_price,
                    ];
                })->toArray()
            ])
        ]);
    }


    public function getTodasMovimentacoes()
    {
        return MovimentacaoCaixa::all();
    }

    public function generateReport(Caixa $caixa): array
    {
        $movimentacoes = $caixa->movimentacoes()
            ->where('status', 'confirmed')
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
