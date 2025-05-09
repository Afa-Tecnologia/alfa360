<?php

namespace App\Services\Reports;

use App\Models\Pedido;
use App\Models\User;
use App\Services\Interfaces\OrdersReportServiceInterface;
use App\Services\Reports\Helpers\ReportDateHelper;
use App\Services\Reports\Helpers\ReportFilterHelper;
use Illuminate\Support\Facades\Log;

class OrdersReportService implements OrdersReportServiceInterface
{
    /**
     * Retorna os pedidos com filtros e paginação
     *
     * @param array $filters
     * @return array
     */
    public function getOrders(array $filters = [])
    {
        try {
            // Extrair filtros
            $dataInicial = $filters['data_inicial'] ?? null;
            $dataFinal = $filters['data_final'] ?? null;
            $vendedorId = $filters['vendedor_id'] ?? null;
            $categoriaId = $filters['categoria_id'] ?? null;
            $page = $filters['page'] ?? 1;
            $limit = $filters['limit'] ?? 10;

            // Processar datas
            [$dataInicial, $dataFinal] = ReportDateHelper::processDateRange($dataInicial, $dataFinal);

            // Consulta base - carregando relacionamentos necessários
            $query = Pedido::with([
                'cliente',
                'pagamentos',
                'pagamentos.metodo',
                'produtos.categoria',
                'produtos', // Carrega os produtos para acessar o pivot
            ]);
            
            $query = ReportFilterHelper::applyDateFilter($query, $dataInicial, $dataFinal);
            $query = ReportFilterHelper::applyVendorFilter($query, $vendedorId);
            $query = ReportFilterHelper::applyCategoryFilter($query, $categoriaId);

            // Obter total de registros
            $totalItems = $query->count();
            $totalPages = ceil($totalItems / $limit);

            // Aplicar paginação
            $orders = $query->orderBy('created_at', 'desc')
                ->skip(($page - 1) * $limit)
                ->take($limit)
                ->get();

            // Carregar os vendedores necessários em uma única consulta separada
            $vendedorIds = [];
            foreach ($orders as $order) {
                foreach ($order->produtos as $produto) {
                    $vendedorIds[] = $produto->pivot->vendedor_id;
                }
            }
            $vendedorIds = array_unique($vendedorIds);
            
            // Carregar os vendedores necessários
            $vendedores = User::whereIn('id', $vendedorIds)->select('id', 'name')->get()->keyBy('id');

            // Transformar os dados para o formato esperado pelo frontend
            $transformedOrders = $orders->map(function ($order) use ($vendedores) {
                // Pegar o primeiro vendedor do primeiro produto (ou poderia listar todos)
                $firstProduto = $order->produtos->first();
                $vendedorId = $firstProduto ? $firstProduto->pivot->vendedor_id : null;
                $vendedorName = ($vendedorId && isset($vendedores[$vendedorId])) 
                    ? $vendedores[$vendedorId]->name 
                    : 'Vendedor não informado';
                // Obter o método de pagamento do primeiro pagamento (se existir)
                $paymentMethod = 'Não informado';
                if ($order->pagamentos->isNotEmpty() && $order->pagamentos->first()->metodo) {
                    $paymentMethod = $order->pagamentos->first()->metodo->name;
                }
                return [
                    'id' => $order->id,
                    'createdAt' => $order->created_at->toISOString(),
                    'customerName' => $order->cliente->name ?? 'Cliente não informado',
                    'total' => $order->total,
                    'status' => $order->status,
                    'vendorId' => $vendedorId,
                    'vendorName' => $vendedorName,
                    'paymentMethod' => $paymentMethod
                ];
            });

            return [
                'data' => $transformedOrders,
                'totalPages' => $totalPages,
                'currentPage' => (int)$page,
                'totalItems' => $totalItems
            ];
        } catch (\Exception $e) {
            Log::error('Erro ao buscar pedidos: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Retorna os pedidos com filtros adicionais e paginação
     *
     * @param array $filters
     * @return array
     */
    public function getOrdersWithFilters(array $filters = [])
    {
        try {
            // Extrair filtros
            $dataInicial = $filters['data_inicial'] ?? null;
            $dataFinal = $filters['data_final'] ?? null;
            $vendedorId = $filters['vendedor_id'] ?? null;
            $categoriaId = $filters['categoria_id'] ?? null;
            $status = $filters['status'] ?? null;
            $clienteNome = $filters['cliente_nome'] ?? null;
            $formaPagamento = $filters['forma_pagamento'] ?? null;
            $page = $filters['page'] ?? 1;
            $limit = $filters['limit'] ?? 10;

            // Processar datas
            [$dataInicial, $dataFinal] = ReportDateHelper::processDateRange($dataInicial, $dataFinal);

            // Consulta base - carregando relacionamentos necessários
            $query = Pedido::with([
                'cliente',
                'pagamentos.metodo', 
                'produtos.categoria',
                'produtos',
            ]);
            
            $query = ReportFilterHelper::applyDateFilter($query, $dataInicial, $dataFinal);
            $query = ReportFilterHelper::applyStatusFilter($query, $status);
            $query = ReportFilterHelper::applyCustomerFilter($query, $clienteNome);
            $query = ReportFilterHelper::applyPaymentMethodFilter($query, $formaPagamento);
            $query = ReportFilterHelper::applyVendorFilter($query, $vendedorId);
            $query = ReportFilterHelper::applyCategoryFilter($query, $categoriaId);

            // Obter total de registros
            $totalItems = $query->count();
            $totalPages = ceil($totalItems / $limit);

            // Aplicar paginação
            $orders = $query->orderBy('created_at', 'desc')
                ->skip(($page - 1) * $limit)
                ->take($limit)
                ->get();

            // Carregar os vendedores necessários em uma única consulta separada
            $vendedorIds = [];
            foreach ($orders as $order) {
                foreach ($order->produtos as $produto) {
                    $vendedorIds[] = $produto->pivot->vendedor_id;
                }
            }
            $vendedorIds = array_unique($vendedorIds);
            
            // Carregar os vendedores necessários
            $vendedores = User::whereIn('id', $vendedorIds)->select('id', 'name')->get()->keyBy('id');

            // Transformar os dados para o formato esperado pelo frontend
            $transformedOrders = $orders->map(function ($order) use ($vendedores) {
                // Pegar o primeiro vendedor do primeiro produto (ou poderia listar todos)
                $firstProduto = $order->produtos->first();
                $vendedorId = $firstProduto ? $firstProduto->pivot->vendedor_id : null;
                $vendedorName = ($vendedorId && isset($vendedores[$vendedorId])) 
                    ? $vendedores[$vendedorId]->name 
                    : 'Vendedor não informado';
                
                // Obter o método de pagamento do primeiro pagamento (se existir)
                $paymentMethod = 'Não informado';
                if ($order->pagamentos->isNotEmpty() && $order->pagamentos->first()->metodo) {
                    $paymentMethod = $order->pagamentos->first()->metodo->name;
                }
                
                return [
                    'id' => $order->id,
                    'createdAt' => $order->created_at->toISOString(),
                    'customerName' => $order->cliente->name ?? 'Cliente não informado',
                    'total' => $order->total,
                    'status' => $order->status,
                    'vendorId' => $vendedorId,
                    'vendorName' => $vendedorName,
                    'paymentMethod' => $paymentMethod
                ];
            });

            return [
                'data' => $transformedOrders,
                'totalPages' => $totalPages,
                'currentPage' => (int)$page,
                'totalItems' => $totalItems
            ];
        } catch (\Exception $e) {
            Log::error('Erro ao buscar pedidos com filtros: ' . $e->getMessage());
            throw $e;
        }
    }
} 