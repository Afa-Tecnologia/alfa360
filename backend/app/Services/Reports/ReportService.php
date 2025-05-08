<?php

namespace App\Services\Reports;

use App\Models\Pedido;
use App\Models\PedidoPagamento;
use App\Models\Produto;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ReportService
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

        // Definir período para comparação (se não houver datas, usa mês atual)
        if (!$dataInicial || !$dataFinal) {
            $dataFinal = Carbon::now()->endOfDay();
            $dataInicial = Carbon::now()->startOfMonth();
            
            // Período anterior para comparação
            $periodoAnteriorFinal = Carbon::now()->subMonth()->endOfMonth();
            $periodoAnteriorInicial = Carbon::now()->subMonth()->startOfMonth();
        } else {
            $dataInicial = Carbon::parse($dataInicial)->startOfDay();
            $dataFinal = Carbon::parse($dataFinal)->endOfDay();
            
            // Calcula a duração do período para fazer uma comparação com período anterior equivalente
            $duracao = $dataInicial->diffInDays($dataFinal);
            $periodoAnteriorFinal = Carbon::parse($dataInicial)->subDay()->endOfDay();
            $periodoAnteriorInicial = Carbon::parse($dataInicial)->subDays($duracao + 1)->startOfDay();
        }

        // Consulta base para o período atual
        $query = Pedido::whereBetween('created_at', [$dataInicial, $dataFinal]);
        
        // Aplicar filtros adicionais se fornecidos
        if ($vendedorId) {
            $query->where('vendedor_id', $vendedorId);
        }
        
        if ($categoriaId) {
            $query->whereHas('produtos', function ($q) use ($categoriaId) {
                $q->where('produtos.categoria_id', $categoriaId);
            });
        }

        // Obter resultados do período atual
        $totalVendas = $query->count();
        $totalReceita = $query->sum('total');
        
        // Ticket médio (evitar divisão por zero)
        $ticketMedio = $totalVendas > 0 ? ($totalReceita / $totalVendas) : 0;

        // Consulta para o período anterior (para comparação)
        $queryAnterior = Pedido::whereBetween('created_at', [$periodoAnteriorInicial, $periodoAnteriorFinal]);
        
        // Aplicar os mesmos filtros ao período anterior
        if ($vendedorId) {
            $queryAnterior->where('vendedor_id', $vendedorId);
        }
        
        if ($categoriaId) {
            $queryAnterior->whereHas('produtos', function ($q) use ($categoriaId) {
                $q->where('produtos.categoria_id', $categoriaId);
            });
        }

        $totalReceitaAnterior = $queryAnterior->sum('total');
        
        // Calcular variação percentual
        $percentualVariacao = 0;
        if ($totalReceitaAnterior > 0) {
            $percentualVariacao = (($totalReceita - $totalReceitaAnterior) / $totalReceitaAnterior) * 100;
        }

        // Montar resposta
        return [
            'totalSales' => $totalVendas,
            'totalRevenue' => $totalReceita,
            'averageTicket' => $ticketMedio,
            'periodComparison' => [
                'percentChange' => $percentualVariacao,
                'previousPeriodTotal' => $totalReceitaAnterior
            ]
        ];
    }

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

        // Definir datas padrão se não fornecidas
        $dataInicial = $dataInicial 
            ? Carbon::parse($dataInicial)->startOfDay() 
            : Carbon::now()->startOfMonth();
        $dataFinal = $dataFinal 
            ? Carbon::parse($dataFinal)->endOfDay() 
            : Carbon::now()->endOfDay();

        // Obter o total de vendas no período para calcular percentuais
        $queryTotal = Pedido::whereBetween('created_at', [$dataInicial, $dataFinal]);
        if ($vendedorId) {
            $queryTotal->where('vendedor_id', $vendedorId);
        }
        $totalReceita = $queryTotal->sum('total') ?: 1; // Evitar divisão por zero

        // Consulta para vendas por categoria
        $categorias = DB::table('pedidos')
            ->join('pedidos_produtos', 'pedidos.id', '=', 'pedidos_produtos.pedido_id')
            ->join('produtos', 'pedidos_produtos.produto_id', '=', 'produtos.id')
            ->join('categorias', 'produtos.categoria_id', '=', 'categorias.id')
            ->whereBetween('pedidos.created_at', [$dataInicial, $dataFinal])
            ->when($vendedorId, function ($query) use ($vendedorId) {
                return $query->where('pedidos.vendedor_id', $vendedorId);
            })
            ->select(
                'categorias.id as categoryId',
                'categorias.name as categoryName',
                DB::raw('SUM(pedidos_produtos.quantidade) as totalSales'),
                DB::raw('SUM(pedidos_produtos.quantidade * pedidos_produtos.preco_unitario) as totalRevenue')
            )
            ->groupBy('categorias.id', 'categorias.name')
            ->orderByDesc('totalRevenue')
            ->get();

        // Calcular percentuais
        return $categorias->map(function ($categoria) use ($totalReceita) {
            $categoria->percentage = ($categoria->totalRevenue / $totalReceita) * 100;
            return $categoria;
        });
    }

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

        // Definir datas padrão se não fornecidas
        $dataInicial = $dataInicial 
            ? Carbon::parse($dataInicial)->startOfDay() 
            : Carbon::now()->startOfMonth();
        $dataFinal = $dataFinal 
            ? Carbon::parse($dataFinal)->endOfDay() 
            : Carbon::now()->endOfDay();

        // Obter total de receita para calcular percentuais
        $queryTotal = Pedido::whereBetween('created_at', [$dataInicial, $dataFinal]);
        if ($vendedorId) {
            $queryTotal->where('vendedor_id', $vendedorId);
        }
        $totalReceita = $queryTotal->sum('total') ?: 1; // Evitar divisão por zero

        // Consulta para os produtos mais vendidos
        $produtos = DB::table('pedidos')
            ->join('pedidos_produtos', 'pedidos.id', '=', 'pedidos_produtos.pedido_id')
            ->join('produtos', 'pedidos_produtos.produto_id', '=', 'produtos.id')
            ->whereBetween('pedidos.created_at', [$dataInicial, $dataFinal])
            ->when($vendedorId, function ($query) use ($vendedorId) {
                return $query->where('pedidos.vendedor_id', $vendedorId);
            })
            ->when($categoriaId, function ($query) use ($categoriaId) {
                return $query->where('produtos.categoria_id', $categoriaId);
            })
            ->select(
                'produtos.id as productId',
                'produtos.name as productName',
                DB::raw('SUM(pedidos_produtos.quantidade) as quantity'),
                DB::raw('SUM(pedidos_produtos.quantidade * pedidos_produtos.preco_unitario) as totalRevenue')
            )
            ->groupBy('produtos.id', 'produtos.name')
            ->orderByDesc('quantity')
            ->limit($limit)
            ->get();

        // Calcular percentuais
        return $produtos->map(function ($produto) use ($totalReceita) {
            $produto->percentage = ($produto->totalRevenue / $totalReceita) * 100;
            return $produto;
        });
    }

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

        // Definir datas padrão se não fornecidas
        $dataInicial = $dataInicial 
            ? Carbon::parse($dataInicial)->startOfDay() 
            : Carbon::now()->subMonths(6)->startOfMonth();
        $dataFinal = $dataFinal 
            ? Carbon::parse($dataFinal)->endOfDay() 
            : Carbon::now()->endOfDay();

        // Determinar o formato e agrupamento com base no período selecionado
        switch ($period) {
            case 'day':
                $groupFormat = '%Y-%m-%d';
                $displayFormat = 'd/m';
                break;
            case 'week':
                $groupFormat = '%Y-%W';
                $displayFormat = '\S\e\m\a\n\a W';
                break;
            case 'month':
            default:
                $groupFormat = '%Y-%m';
                $displayFormat = 'm/Y';
                break;
        }

        // Consulta para receita por período
        $receitas = DB::table('pedidos')
            ->whereBetween('created_at', [$dataInicial, $dataFinal])
            ->when($vendedorId, function ($query) use ($vendedorId) {
                return $query->where('vendedor_id', $vendedorId);
            })
            ->select(
                DB::raw("strftime('{$groupFormat}', created_at) as period"),
                DB::raw('SUM(total) as revenue')
            )
            ->groupBy(DB::raw("strftime('{$groupFormat}', created_at)"))
            ->orderBy('period')
            ->get();

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

            // Definir datas padrão se não fornecidas
            $dataInicial = $dataInicial 
                ? Carbon::parse($dataInicial)->startOfDay() 
                : Carbon::now()->startOfMonth();
            $dataFinal = $dataFinal 
                ? Carbon::parse($dataFinal)->endOfDay() 
                : Carbon::now()->endOfDay();

            // Consulta base - carregando relacionamentos necessários
            $query = Pedido::with([
                'cliente',
                'pagamentos',
                'pagamentos.metodo',
                'produtos.categoria',
                'produtos', // Carrega os produtos para acessar o pivot
            ])
            ->whereBetween('created_at', [$dataInicial, $dataFinal]);

            // Aplicar filtros adicionais
            if ($vendedorId) {
                $query->whereHas('produtos', function ($q) use ($vendedorId) {
                    $q->where('pedidos_produtos.vendedor_id', $vendedorId);
                });
            }

            if ($categoriaId) {
                $query->whereHas('produtos', function ($q) use ($categoriaId) {
                    $q->where('produtos.categoria_id', $categoriaId);
                });
            }

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

            // Definir datas padrão se não fornecidas
            $dataInicial = $dataInicial 
                ? Carbon::parse($dataInicial)->startOfDay() 
                : Carbon::now()->startOfMonth();
            $dataFinal = $dataFinal 
                ? Carbon::parse($dataFinal)->endOfDay() 
                : Carbon::now()->endOfDay();

            // Consulta base - carregando relacionamentos necessários
            $query = Pedido::with([
                'cliente',
                'pagamentos.metodo', 
                'produtos.categoria',
                'produtos',
            ])
            ->whereBetween('created_at', [$dataInicial, $dataFinal]);
            
            
            // Filtrar por status
            if ($status) {
                $query->where('status', $status);
                Log::info('Aplicando filtro de status: ' . $status);
            }
            
            // Filtrar por nome do cliente
            if ($clienteNome) {
                $query->whereHas('cliente', function($q) use ($clienteNome) {
                    $q->where('name', 'like', '%' . $clienteNome . '%')
                      ->orWhere('last_name', 'like', '%' . $clienteNome . '%');
                });
                Log::info('Aplicando filtro de cliente: ' . $clienteNome);
            }
            
            // Filtrar por forma de pagamento
            if ($formaPagamento) {
                $query->whereHas('pagamentos', function($q) use ($formaPagamento) {
                    $q->whereHas('metodo', function($mq) use ($formaPagamento) {
                        $mq->where('code', $formaPagamento);
                    });
                });
                Log::info('Aplicando filtro de forma de pagamento: ' . $formaPagamento);
            }

            // Aplicar filtros adicionais
            if ($vendedorId) {
                $query->whereHas('produtos', function ($q) use ($vendedorId) {
                    $q->where('pedidos_produtos.vendedor_id', $vendedorId);
                });
            }

            if ($categoriaId) {
                $query->whereHas('produtos', function ($q) use ($categoriaId) {
                    $q->where('produtos.categoria_id', $categoriaId);
                });
            }

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
                    'paymentMethod' => $paymentMethod // <-- Adicionado esta linha
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