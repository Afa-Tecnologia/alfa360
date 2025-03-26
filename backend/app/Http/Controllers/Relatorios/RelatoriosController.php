<?php

namespace App\Http\Controllers\Relatorios;

use App\Http\Controllers\Controller;
use App\Services\Reports\ReportService;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
class RelatoriosController extends Controller
{
    protected $reportService;
    public function __construct(ReportService $reportService) {
        $this->reportService = $reportService;
    }
    
    
    /**
     * Retorna um resumo das vendas com filtros opcionais
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getSalesSummary(Request $request)
    {
        try {
            $filters = [
                'data_inicial' => $request->query('data_inicial'),
                'data_final' => $request->query('data_final'),
                'vendedor_id' => $request->query('vendedor_id'),
                'categoria_id' => $request->query('categoria_id')
            ];
            
            $summary = $this->reportService->getSalesSummary($filters);
            
            return response()->json($summary);
        } catch (\Exception $e) {
            return response()->json([
                'error' => true,
                'message' => 'Erro ao gerar resumo de vendas: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Retorna vendas por categoria com filtros opcionais
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getSalesByCategory(Request $request)
    {
        try {
            $filters = [
                'data_inicial' => $request->query('data_inicial'),
                'data_final' => $request->query('data_final'),
                'vendedor_id' => $request->query('vendedor_id')
            ];
            
            $categorySales = $this->reportService->getSalesByCategory($filters);
            
            return response()->json($categorySales);
        } catch (\Exception $e) {
            Log::error('Erro ao buscar vendas por categoria: ' . $e->getMessage());
            return response()->json([
                'error' => true,
                'message' => 'Erro ao buscar vendas por categoria: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Retorna os produtos mais vendidos com filtros opcionais
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getTopProducts(Request $request)
    {
        try {
            $filters = [
                'data_inicial' => $request->query('data_inicial'),
                'data_final' => $request->query('data_final'),
                'vendedor_id' => $request->query('vendedor_id'),
                'categoria_id' => $request->query('categoria_id')
            ];
            
            $limit = $request->query('limit', 10);
            
            $topProducts = $this->reportService->getTopProducts($filters, $limit);
            
            return response()->json($topProducts);
        } catch (\Exception $e) {
            Log::error('Erro ao buscar produtos mais vendidos: ' . $e->getMessage());
            return response()->json([
                'error' => true,
                'message' => 'Erro ao buscar produtos mais vendidos: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Retorna a receita por período (dia, semana, mês)
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getRevenueByPeriod(Request $request)
    {
        try {
            $filters = [
                'data_inicial' => $request->query('data_inicial'),
                'data_final' => $request->query('data_final'),
                'vendedor_id' => $request->query('vendedor_id')
            ];
            
            $period = $request->query('period', 'month');
            
            $revenue = $this->reportService->getRevenueByPeriod($filters, $period);
            
            return response()->json($revenue);
        } catch (\Exception $e) {
            Log::error('Erro ao buscar receita por período: ' . $e->getMessage());
            return response()->json([
                'error' => true,
                'message' => 'Erro ao buscar receita por período: ' . $e->getMessage()
            ], 500);
        }
    }

}
