<?php

namespace App\Services\Reports;

use App\Models\Pedido;
use App\Services\Interfaces\CategorySalesServiceInterface;
use App\Services\Reports\Helpers\ReportDateHelper;
use App\Services\Reports\Helpers\ReportFilterHelper;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CategorySalesService implements CategorySalesServiceInterface
{
    /**
     * Retorna vendas por categoria com filtros opcionais
     *
     * @param array $filters
     * @return \Illuminate\Support\Collection
     */
    public function getSalesByCategory(array $filters = [])
    {
        // Extrair filtros
        $dataInicial = $filters['data_inicial'] ?? null;
        $dataFinal = $filters['data_final'] ?? null;
        $vendedorId = $filters['vendedor_id'] ?? null;

        Log::info('Gerando relatório de vendas por categoria com filtros:', [
            'dataInicial' => $dataInicial,
            'dataFinal' => $dataFinal,
            'vendedorId' => $vendedorId
        ]);

        // Processar datas
        [$dataInicial, $dataFinal] = ReportDateHelper::processDateRange($dataInicial, $dataFinal);

        // Obter o total de vendas no período para calcular percentuais
        $query = Pedido::query();
        $query = ReportFilterHelper::applyDateFilter($query, $dataInicial, $dataFinal);
        $query = ReportFilterHelper::applyVendorFilter($query, $vendedorId);
        
        $totalReceita = $query->sum('total') ?: 1; // Evitar divisão por zero

        // Consulta para vendas por categoria - CORRIGIDO PARA USAR pedidos_produtos.vendedor_id
        $query = DB::table('pedidos')
            ->join('pedidos_produtos', 'pedidos.id', '=', 'pedidos_produtos.pedido_id')
            ->join('produtos', 'pedidos_produtos.produto_id', '=', 'produtos.id')
            ->join('categorias', 'produtos.categoria_id', '=', 'categorias.id')
            ->whereBetween('pedidos.created_at', [$dataInicial, $dataFinal]);
            
        // Aplicar filtro de vendedor se fornecido
        if ($vendedorId) {
            $query->where('pedidos_produtos.vendedor_id', $vendedorId);
            Log::info('Aplicando filtro de vendedor na tabela pedidos_produtos:', ['vendedorId' => $vendedorId]);
        }
            
        $categorias = $query->select(
                'categorias.id as categoryId',
                'categorias.name as categoryName',
                DB::raw('SUM(pedidos_produtos.quantidade) as totalSales'),
                DB::raw('SUM(pedidos_produtos.quantidade * pedidos_produtos.preco_unitario) as totalRevenue')
            )
            ->groupBy('categorias.id', 'categorias.name')
            ->orderByDesc('totalRevenue')
            ->get();

        Log::info('Relatório de vendas por categoria gerado com sucesso:', ['categorias' => count($categorias)]);

        // Calcular percentuais
        return $categorias->map(function ($categoria) use ($totalReceita) {
            $categoria->percentage = ($categoria->totalRevenue / $totalReceita) * 100;
            return $categoria;
        });
    }
} 