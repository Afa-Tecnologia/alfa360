<?php

namespace App\Services\Reports\Helpers;

use App\Models\Pedido;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Log;

/**
 * Classe auxiliar para manipulação de filtros em relatórios
 */
class ReportFilterHelper
{
    /**
     * Aplica filtros de data a uma consulta
     * 
     * @param Builder $query
     * @param \Carbon\Carbon $dataInicial
     * @param \Carbon\Carbon $dataFinal
     * @return Builder
     */
    public static function applyDateFilter(Builder $query, $dataInicial, $dataFinal): Builder
    {
        return $query->whereBetween('created_at', [$dataInicial, $dataFinal]);
    }

    /**
     * Aplica filtro de vendedor a uma consulta
     * 
     * @param Builder $query
     * @param int|null $vendedorId
     * @return Builder
     */
    public static function applyVendorFilter(Builder $query, ?int $vendedorId): Builder
    {
        if ($vendedorId) {
            Log::info('Aplicando filtro de vendedor:', ['vendedorId' => $vendedorId]);
            return $query->whereHas('produtos', function ($q) use ($vendedorId) {
                $q->where('pedidos_produtos.vendedor_id', $vendedorId);
            });
        }
        
        return $query;
    }

    /**
     * Aplica filtro de categoria a uma consulta
     * 
     * @param Builder $query
     * @param int|null $categoriaId
     * @return Builder
     */
    public static function applyCategoryFilter(Builder $query, ?int $categoriaId): Builder
    {
        if ($categoriaId) {
            Log::info('Aplicando filtro de categoria:', ['categoriaId' => $categoriaId]);
            return $query->whereHas('produtos', function ($q) use ($categoriaId) {
                $q->where('produtos.categoria_id', $categoriaId);
            });
        }
        
        return $query;
    }
    
    /**
     * Aplica filtro de status a uma consulta
     * 
     * @param Builder $query
     * @param string|null $status
     * @return Builder
     */
    public static function applyStatusFilter(Builder $query, ?string $status): Builder
    {
        if ($status) {
            Log::info('Aplicando filtro de status:', ['status' => $status]);
            return $query->where('status', $status);
        }
        
        return $query;
    }
    
    /**
     * Aplica filtro de cliente a uma consulta
     * 
     * @param Builder $query
     * @param string|null $clienteNome
     * @return Builder
     */
    public static function applyCustomerFilter(Builder $query, ?string $clienteNome): Builder
    {
        if ($clienteNome) {
            Log::info('Aplicando filtro de cliente:', ['clienteNome' => $clienteNome]);
            return $query->whereHas('cliente', function($q) use ($clienteNome) {
                $q->where('name', 'like', '%' . $clienteNome . '%')
                  ->orWhere('last_name', 'like', '%' . $clienteNome . '%');
            });
        }
        
        return $query;
    }
    
    /**
     * Aplica filtro de forma de pagamento a uma consulta
     * 
     * @param Builder $query
     * @param string|null $formaPagamento
     * @return Builder
     */
    public static function applyPaymentMethodFilter(Builder $query, ?string $formaPagamento): Builder
    {
        if ($formaPagamento) {
            Log::info('Aplicando filtro de forma de pagamento:', ['formaPagamento' => $formaPagamento]);
            return $query->whereHas('pagamentos', function($q) use ($formaPagamento) {
                $q->whereHas('metodo', function($mq) use ($formaPagamento) {
                    $mq->where('code', $formaPagamento);
                });
            });
        }
        
        return $query;
    }
    
    /**
     * Aplica todos os filtros comuns a uma consulta
     * 
     * @param Builder $query
     * @param array $filters
     * @return Builder
     */
    public static function applyCommonFilters(Builder $query, array $filters): Builder
    {
        // Extrair filtros
        $dataInicial = $filters['data_inicial'] ?? null;
        $dataFinal = $filters['data_final'] ?? null;
        $vendedorId = $filters['vendedor_id'] ?? null;
        $categoriaId = $filters['categoria_id'] ?? null;
        
        // Processar datas
        [$dataInicial, $dataFinal] = ReportDateHelper::processDateRange($dataInicial, $dataFinal);
        
        // Aplicar filtros
        $query = self::applyDateFilter($query, $dataInicial, $dataFinal);
        $query = self::applyVendorFilter($query, $vendedorId);
        $query = self::applyCategoryFilter($query, $categoriaId);
        
        return $query;
    }
    
    /**
     * Obtém os IDs de pedidos filtrados por vendedor
     * 
     * @param \Carbon\Carbon $dataInicial
     * @param \Carbon\Carbon $dataFinal
     * @param int|null $vendedorId
     * @return \Illuminate\Support\Collection
     */
    public static function getPedidoIdsByVendor($dataInicial, $dataFinal, ?int $vendedorId)
    {
        if (!$vendedorId) {
            return collect();
        }
        
        return \Illuminate\Support\Facades\DB::table('pedidos')
            ->join('pedidos_produtos', 'pedidos.id', '=', 'pedidos_produtos.pedido_id')
            ->where('pedidos_produtos.vendedor_id', $vendedorId)
            ->whereBetween('pedidos.created_at', [$dataInicial, $dataFinal])
            ->select('pedidos.id')
            ->distinct()
            ->pluck('id');
    }
} 