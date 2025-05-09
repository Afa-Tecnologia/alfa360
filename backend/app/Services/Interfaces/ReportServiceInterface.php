<?php

namespace App\Services\Interfaces;

/**
 * Interface principal para o serviço de relatórios
 */
interface ReportServiceInterface
{
    /**
     * Retorna um resumo das vendas com filtros opcionais
     *
     * @param array $filters
     * @return array
     */
    public function getSalesSummary(array $filters = []);

    /**
     * Retorna vendas por categoria com filtros opcionais
     *
     * @param array $filters
     * @return \Illuminate\Support\Collection
     */
    public function getSalesByCategory(array $filters = []);

    /**
     * Retorna os produtos mais vendidos com filtros opcionais
     *
     * @param array $filters
     * @param int $limit
     * @return \Illuminate\Support\Collection
     */
    public function getTopProducts(array $filters = [], int $limit = 10);

    /**
     * Retorna a receita por período (dia, semana, mês)
     *
     * @param array $filters
     * @param string $period
     * @return \Illuminate\Support\Collection
     */
    public function getRevenueByPeriod(array $filters = [], string $period = 'month');

    /**
     * Retorna os pedidos com filtros e paginação
     *
     * @param array $filters
     * @return array
     */
    public function getOrders(array $filters = []);

    /**
     * Retorna os pedidos com filtros adicionais e paginação
     *
     * @param array $filters
     * @return array
     */
    public function getOrdersWithFilters(array $filters = []);
} 