<?php

namespace App\Services\Reports;

use App\Models\Pedido;
use App\Services\Interfaces\SalesSummaryServiceInterface;
use App\Services\Reports\Helpers\ReportDateHelper;
use App\Services\Reports\Helpers\ReportFilterHelper;
use Illuminate\Support\Facades\Log;

class SalesSummaryService implements SalesSummaryServiceInterface
{
    /**
     * Retorna um resumo das vendas com filtros opcionais
     *
     * @param array $filters
     * @return array
     */
    public function getSalesSummary(array $filters = [])
    {
        // Extrair filtros
        $dataInicial = $filters['data_inicial'] ?? null;
        $dataFinal = $filters['data_final'] ?? null;
        $vendedorId = $filters['vendedor_id'] ?? null;
        $categoriaId = $filters['categoria_id'] ?? null;

        Log::info('Gerando resumo de vendas com filtros:', [
            'dataInicial' => $dataInicial,
            'dataFinal' => $dataFinal,
            'vendedorId' => $vendedorId,
            'categoriaId' => $categoriaId
        ]);

        // Processar datas
        [$dataInicial, $dataFinal] = ReportDateHelper::processDateRange($dataInicial, $dataFinal);
        
        // Calcular período anterior para comparação
        [$periodoAnteriorInicial, $periodoAnteriorFinal] = ReportDateHelper::calculatePreviousPeriod($dataInicial, $dataFinal);

        Log::info('Buscando pedidos no período:', [
            'dataInicial' => $dataInicial->toDateTimeString(),
            'dataFinal' => $dataFinal->toDateTimeString()
        ]);

        // Consulta base para o período atual
        $query = Pedido::query();
        $query = ReportFilterHelper::applyDateFilter($query, $dataInicial, $dataFinal);
        $query = ReportFilterHelper::applyVendorFilter($query, $vendedorId);
        $query = ReportFilterHelper::applyCategoryFilter($query, $categoriaId);

        // Obter resultados do período atual
        $totalVendas = $query->count();
        $totalReceita = $query->sum('total');
        
        Log::info('Resultados período atual:', [
            'totalVendas' => $totalVendas,
            'totalReceita' => $totalReceita
        ]);
        
        // Ticket médio (evitar divisão por zero)
        $ticketMedio = $totalVendas > 0 ? ($totalReceita / $totalVendas) : 0;

        // Consulta para o período anterior (para comparação)
        $queryAnterior = Pedido::query();
        $queryAnterior = ReportFilterHelper::applyDateFilter($queryAnterior, $periodoAnteriorInicial, $periodoAnteriorFinal);
        $queryAnterior = ReportFilterHelper::applyVendorFilter($queryAnterior, $vendedorId);
        $queryAnterior = ReportFilterHelper::applyCategoryFilter($queryAnterior, $categoriaId);
        
        $totalReceitaAnterior = $queryAnterior->sum('total');
        
        Log::info('Resultados período anterior:', [
            'totalReceitaAnterior' => $totalReceitaAnterior
        ]);
        
        // Calcular variação percentual
        $percentualVariacao = 0;
        if ($totalReceitaAnterior > 0) {
            $percentualVariacao = (($totalReceita - $totalReceitaAnterior) / $totalReceitaAnterior) * 100;
        }

        // Montar resposta
        $resultado = [
            'totalSales' => $totalVendas,
            'totalRevenue' => $totalReceita,
            'averageTicket' => $ticketMedio,
            'periodComparison' => [
                'percentChange' => $percentualVariacao,
                'previousPeriodTotal' => $totalReceitaAnterior
            ]
        ];
        
        Log::info('Resumo de vendas gerado:', $resultado);
        
        return $resultado;
    }
} 