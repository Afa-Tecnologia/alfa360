<?php

namespace App\Services\Reports;

use App\Services\Interfaces\RevenueByPeriodServiceInterface;
use App\Services\Reports\Helpers\ReportDateHelper;
use App\Services\Reports\Helpers\ReportFilterHelper;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RevenueByPeriodService implements RevenueByPeriodServiceInterface
{
    /**
     * Retorna a receita por período (dia, semana, mês)
     *
     * @param array $filters
     * @param string $period
     * @return \Illuminate\Support\Collection
     */
    public function getRevenueByPeriod(array $filters = [], string $period = 'month')
    {
        // Extrair filtros
        $dataInicial = $filters['data_inicial'] ?? null;
        $dataFinal = $filters['data_final'] ?? null;
        $vendedorId = $filters['vendedor_id'] ?? null;

        Log::info('Gerando relatório de receita por período com filtros:', [
            'dataInicial' => $dataInicial,
            'dataFinal' => $dataFinal,
            'vendedorId' => $vendedorId,
            'period' => $period
        ]);

        // Processar datas - para receita por período usamos os últimos 6 meses como padrão
        [$dataInicial, $dataFinal] = ReportDateHelper::processDateRange($dataInicial, $dataFinal, false);

        // Determinar o formato e agrupamento com base no período selecionado
        [$groupFormat, $displayFormat] = ReportDateHelper::getPeriodFormat($period);

        // Se tiver vendedor_id, precisamos de uma abordagem diferente
        if ($vendedorId) {
            // Primeiro encontre todos os pedidos com produtos vendidos por este vendedor
            $pedidoIds = ReportFilterHelper::getPedidoIdsByVendor($dataInicial, $dataFinal, $vendedorId);
                
            Log::info('Pedidos encontrados para o vendedor:', ['pedidoIds' => count($pedidoIds)]);
            
            // Agora buscamos a receita por período para esses pedidos
            if ($pedidoIds->isEmpty()) {
                return collect(); // Retorna uma coleção vazia se não houver pedidos
            }
            
            $receitas = DB::table('pedidos')
                ->whereIn('id', $pedidoIds)
                ->select(
                    DB::raw("DATE_FORMAT(created_at, '{$groupFormat}') as period"),
                    DB::raw('SUM(total) as revenue')
                )
                ->groupBy(DB::raw("DATE_FORMAT(created_at, '{$groupFormat}')"))
                ->orderBy('period')
                ->get();
        } else {
            // Consulta normal para todos os pedidos sem filtro de vendedor
            $receitas = DB::table('pedidos')
                ->whereBetween('created_at', [$dataInicial, $dataFinal])
                ->select(
                    DB::raw("DATE_FORMAT(created_at, '{$groupFormat}') as period"),
                    DB::raw('SUM(total) as revenue')
                )
                ->groupBy(DB::raw("DATE_FORMAT(created_at, '{$groupFormat}')"))
                ->orderBy('period')
                ->get();
        }
        
        Log::info('Relatório de receita por período gerado com sucesso:', ['receitas' => count($receitas)]);

        // Formatar os resultados
        if ($period === 'week') {
            // Para semanas, precisamos de tratamento especial para exibir corretamente
            return $receitas->map(function ($item) {
                list($year, $week) = explode('-', $item->period);
                $item->period = "Semana {$week}, {$year}";
                return $item;
            });
        } else {
            return $receitas->map(function ($item) use ($period, $displayFormat) {
                $date = $period === 'day' 
                    ? Carbon::createFromFormat('Y-m-d', $item->period) 
                    : Carbon::createFromFormat('Y-m', $item->period);
                $item->period = $date->format($displayFormat);
                return $item;
            });
        }
    }
} 