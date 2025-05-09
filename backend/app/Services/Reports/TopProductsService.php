<?php

namespace App\Services\Reports;

use App\Models\Pedido;
use App\Services\Interfaces\TopProductsServiceInterface;
use App\Services\Reports\Helpers\ReportDateHelper;
use App\Services\Reports\Helpers\ReportFilterHelper;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TopProductsService implements TopProductsServiceInterface
{
    /**
     * Retorna os produtos mais vendidos com filtros opcionais
     *
     * @param array $filters
     * @param int $limit
     * @return \Illuminate\Support\Collection
     */
    public function getTopProducts(array $filters = [], int $limit = 10)
    {
        // Extrair filtros
        $dataInicial = $filters['data_inicial'] ?? null;
        $dataFinal = $filters['data_final'] ?? null;
        $vendedorId = $filters['vendedor_id'] ?? null;
        $categoriaId = $filters['categoria_id'] ?? null;

        Log::info('Gerando relatório de produtos mais vendidos com filtros:', [
            'dataInicial' => $dataInicial,
            'dataFinal' => $dataFinal,
            'vendedorId' => $vendedorId,
            'categoriaId' => $categoriaId,
            'limit' => $limit
        ]);

        // Processar datas
        [$dataInicial, $dataFinal] = ReportDateHelper::processDateRange($dataInicial, $dataFinal);

        // Obter total de receita para calcular percentuais
        $query = Pedido::query();
        $query = ReportFilterHelper::applyDateFilter($query, $dataInicial, $dataFinal);
        $query = ReportFilterHelper::applyVendorFilter($query, $vendedorId);
        
        $totalReceita = $query->sum('total') ?: 1; // Evitar divisão por zero

        // Consulta para os produtos mais vendidos
        $query = DB::table('pedidos')
            ->join('pedidos_produtos', 'pedidos.id', '=', 'pedidos_produtos.pedido_id')
            ->join('produtos', 'pedidos_produtos.produto_id', '=', 'produtos.id')
            ->whereBetween('pedidos.created_at', [$dataInicial, $dataFinal]);
            
        // Aplicar filtros adicionais
        if ($vendedorId) {
            $query->where('pedidos_produtos.vendedor_id', $vendedorId);
            Log::info('Aplicando filtro de vendedor na tabela pedidos_produtos:', ['vendedorId' => $vendedorId]);
        }
        
        if ($categoriaId) {
            $query->where('produtos.categoria_id', $categoriaId);
            Log::info('Aplicando filtro de categoria:', ['categoriaId' => $categoriaId]);
        }
            
        $produtos = $query->select(
                'produtos.id as productId',
                'produtos.name as productName',
                DB::raw('SUM(pedidos_produtos.quantidade) as quantity'),
                DB::raw('SUM(pedidos_produtos.quantidade * pedidos_produtos.preco_unitario) as totalRevenue')
            )
            ->groupBy('produtos.id', 'produtos.name')
            ->orderByDesc('quantity')
            ->limit($limit)
            ->get();

        Log::info('Relatório de produtos mais vendidos gerado com sucesso:', ['produtos' => count($produtos)]);

        // Calcular percentuais
        return $produtos->map(function ($produto) use ($totalReceita) {
            $produto->percentage = ($produto->totalRevenue / $totalReceita) * 100;
            return $produto;
        });
    }
} 