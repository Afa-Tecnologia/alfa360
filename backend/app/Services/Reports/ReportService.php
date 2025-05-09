<?php

namespace App\Services\Reports;

use App\Services\Interfaces\ReportServiceInterface;
use App\Services\Interfaces\SalesSummaryServiceInterface;
use App\Services\Interfaces\CategorySalesServiceInterface;
use App\Services\Interfaces\TopProductsServiceInterface;
use App\Services\Interfaces\RevenueByPeriodServiceInterface;
use App\Services\Interfaces\OrdersReportServiceInterface;

/**
 * Classe principal de serviço de relatórios que atua como fachada para os serviços específicos
 */
class ReportService implements ReportServiceInterface
{
    protected $salesSummaryService;
    protected $categorySalesService;
    protected $topProductsService;
    protected $revenueByPeriodService;
    protected $ordersReportService;

    /**
     * Inicializa o serviço com todas as dependências
     */
    public function __construct(
        SalesSummaryServiceInterface $salesSummaryService,
        CategorySalesServiceInterface $categorySalesService,
        TopProductsServiceInterface $topProductsService,
        RevenueByPeriodServiceInterface $revenueByPeriodService,
        OrdersReportServiceInterface $ordersReportService
    ) {
        $this->salesSummaryService = $salesSummaryService;
        $this->categorySalesService = $categorySalesService;
        $this->topProductsService = $topProductsService;
        $this->revenueByPeriodService = $revenueByPeriodService;
        $this->ordersReportService = $ordersReportService;
    }

    /**
     * Retorna um resumo das vendas com filtros opcionais
     *
     * @param array $filters
     * @return array
     */
    public function getSalesSummary(array $filters = [])
    {
        return $this->salesSummaryService->getSalesSummary($filters);
    }

    /**
     * Retorna vendas por categoria com filtros opcionais
     *
     * @param array $filters
     * @return \Illuminate\Support\Collection
     */
    public function getSalesByCategory(array $filters = [])
    {
        return $this->categorySalesService->getSalesByCategory($filters);
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
        return $this->topProductsService->getTopProducts($filters, $limit);
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
        return $this->revenueByPeriodService->getRevenueByPeriod($filters, $period);
    }

    /**
     * Retorna os pedidos com filtros e paginação
     *
     * @param array $filters
     * @return array
     */
    public function getOrders(array $filters = [])
    {
        return $this->ordersReportService->getOrders($filters);
    }

    /**
     * Retorna os pedidos com filtros adicionais e paginação
     *
     * @param array $filters
     * @return array
     */
    public function getOrdersWithFilters(array $filters = [])
    {
        return $this->ordersReportService->getOrdersWithFilters($filters);
    }
} 