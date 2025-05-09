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
    public function openCaixa(float $saldoInicial, ?string $observation = null)
    {
        $existingOpenCaixa = Caixa::where('user_id', Auth::id())
            ->with(['user:id,name'])
            ->where('status', Caixa::STATUS_OPEN)
            ->first();

        if ($existingOpenCaixa) {
            throw new \Exception('Já existe um caixa aberto para este usuário.');
        }

        return DB::transaction(function () use ($saldoInicial, $observation) {
            return Caixa::create([
                'user_id' => Auth::id(),
                'saldo_inicial' => $saldoInicial,
                'open_date' => Carbon::now(),
                'status' => Caixa::STATUS_OPEN,
                'observation' => $observation
            ]);
        });
    }

    public function statusCaixa()
    {
        $caixa = Caixa::where('user_id', Auth::id())
            ->with('user:id,name')
            ->where('status', Caixa::STATUS_OPEN)
            ->first();

        return $caixa;
    }
    public function closeCaixa(Caixa $caixa, ?string $observation = null): Caixa
    {
        if ($caixa->status !== Caixa::STATUS_OPEN) {
            throw new \Exception('Este caixa já está fechado.');
        }

        return DB::transaction(function () use ($caixa, $observation) {
            $saldoFinal = $caixa->calculateCurrentBalance();

            $caixa->update([
                'saldo_final' => $saldoFinal,
                'close_date' => Carbon::now(),
                'status' => Caixa::STATUS_CLOSED,
                'observation' => $observation ? $caixa->observation . "\n" . $observation : $caixa->observation
            ]);

            return $caixa;
        });
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

    /**
     * Retorna o histórico de caixas com filtros opcionais
     *
     * @param array $filters Filtros para a consulta (data_inicio, data_fim, user_id, status)
     * @param int $perPage Quantidade de registros por página
     * @return \Illuminate\Pagination\LengthAwarePaginator
     */
    public function getHistorico(array $filters = [], int $perPage = 15)
    {
        $query = Caixa::with(['user:id,name,email', 'movimentacoes' => function ($query) {
            $query->select('id', 'caixa_id', 'type', 'value')
                  ->where('status', 'completed');
        }])
        ->select('id', 'user_id', 'saldo_inicial', 'saldo_final', 'open_date', 'close_date', 'status', 'created_at');
        
        // Aplicar filtros de data de abertura
        if (!empty($filters['data_inicio'])) {
            $query->whereDate('open_date', '>=', $filters['data_inicio']);
        }
        
        if (!empty($filters['data_fim'])) {
            $query->whereDate('open_date', '<=', $filters['data_fim']);
        }
        
        // Filtrar por usuário
        if (!empty($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }
        
        // Filtrar por status (aberto/fechado)
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        
        // Ordenar por data de abertura (mais recentes primeiro)
        $query->orderBy('open_date', 'desc');
        
        // Paginar resultados
        $caixas = $query->paginate($perPage);
        
        // Calcular valores totais para cada caixa
        $caixas->getCollection()->transform(function ($caixa) {
            $entradas = $caixa->movimentacoes->where('type', 'entrada')->sum('value');
            $saidas = $caixa->movimentacoes->where('type', 'saida')->sum('value');
            
            $caixa->total_movimentacoes = $caixa->movimentacoes->count();
            $caixa->total_entradas = $entradas;
            $caixa->total_saidas = $saidas;
            $caixa->saldo_calculado = $caixa->status === 'open' 
                ? ($caixa->saldo_inicial + $entradas - $saidas)
                : $caixa->saldo_final;
                
            // Remover a coleção de movimentações para reduzir o tamanho da resposta
            unset($caixa->movimentacoes);
            
            return $caixa;
        });
        
        return $caixas;
    }

    /**
     * Retorna um relatório consolidado de todos os caixas em um período específico
     *
     * @param array $filters Filtros para a consulta (data_inicio, data_fim)
     * @return array
     */
    public function getConsolidado(array $filters = []): array
    {
        // Preparar a query base para buscar caixas no período especificado
        $query = Caixa::with(['user:id,name,email', 'movimentacoes' => function ($query) {
            $query->where('status', 'completed');
        }]);
        
        // Aplicar filtros de data
        if (!empty($filters['data_inicio'])) {
            $query->whereDate('open_date', '>=', $filters['data_inicio']);
        } else {
            // Se não foi especificada data inicial, usar data atual
            $query->whereDate('open_date', '>=', now()->startOfDay());
        }
        
        if (!empty($filters['data_fim'])) {
            $query->whereDate('open_date', '<=', $filters['data_fim']);
        } else {
            // Se não foi especificada data final, usar data atual
            $query->whereDate('open_date', '<=', now()->endOfDay());
        }
        
        // Buscar todos os caixas do período
        $caixas = $query->get();
        
        // Preparar dados do consolidado
        $totalCaixas = $caixas->count();
        $caixasAbertos = $caixas->where('status', 'open')->count();
        $caixasFechados = $caixas->where('status', 'closed')->count();
        
        // Valores financeiros consolidados
        $saldoInicial = $caixas->sum('saldo_inicial');
        $saldoFinal = $caixas->where('status', 'closed')->sum('saldo_final');
        
        // Calcular totais por usuário
        $porUsuario = $caixas->groupBy('user_id')
            ->map(function ($caixasUsuario, $userId) {
                $user = $caixasUsuario->first()->user;
                $totalEntradas = 0;
                $totalSaidas = 0;
                
                foreach ($caixasUsuario as $caixa) {
                    $entradas = $caixa->movimentacoes->where('type', 'entrada')->sum('value');
                    $saidas = $caixa->movimentacoes->where('type', 'saida')->sum('value');
                    $totalEntradas += $entradas;
                    $totalSaidas += $saidas;
                }
                
                return [
                    'usuario' => [
                        'id' => $user->id,
                        'nome' => $user->name,
                    ],
                    'total_caixas' => $caixasUsuario->count(),
                    'total_entradas' => $totalEntradas,
                    'total_saidas' => $totalSaidas,
                    'saldo' => $totalEntradas - $totalSaidas,
                ];
            })
            ->values();
        
        // Calcular totais por método de pagamento
        $todasMovimentacoes = $caixas->pluck('movimentacoes')->flatten();
        $entradasPorMetodo = $todasMovimentacoes
            ->where('type', 'entrada')
            ->groupBy('payment_method')
            ->map(function ($grupo, $metodo) {
                return [
                    'metodo' => $metodo ?? 'Não informado',
                    'valor' => $grupo->sum('value')
                ];
            })
            ->values();
        
        // Calcular totais de entradas e saídas
        $totalEntradas = $todasMovimentacoes->where('type', 'entrada')->sum('value');
        $totalSaidas = $todasMovimentacoes->where('type', 'saida')->sum('value');
        
        return [
            'periodo' => [
                'inicio' => $filters['data_inicio'] ?? now()->format('Y-m-d'),
                'fim' => $filters['data_fim'] ?? now()->format('Y-m-d'),
            ],
            'totais' => [
                'caixas' => $totalCaixas,
                'caixas_abertos' => $caixasAbertos,
                'caixas_fechados' => $caixasFechados,
                'saldo_inicial' => $saldoInicial,
                'saldo_final' => $saldoFinal,
                'total_entradas' => $totalEntradas,
                'total_saidas' => $totalSaidas,
                'saldo_liquido' => $totalEntradas - $totalSaidas,
            ],
            'por_usuario' => $porUsuario,
            'entradas_por_metodo' => $entradasPorMetodo,
        ];
    }
}
