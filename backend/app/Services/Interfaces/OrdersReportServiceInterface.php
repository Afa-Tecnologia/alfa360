<?php

namespace App\Services\Interfaces;

/**
 * Interface para o serviço de relatórios de pedidos
 */
interface OrdersReportServiceInterface
{
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