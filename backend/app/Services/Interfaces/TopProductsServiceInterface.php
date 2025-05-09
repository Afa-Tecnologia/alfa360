<?php

namespace App\Services\Interfaces;

/**
 * Interface para o serviço de produtos mais vendidos
 */
interface TopProductsServiceInterface
{
    /**
     * Retorna os produtos mais vendidos com filtros opcionais
     *
     * @param array $filters
     * @param int $limit
     * @return \Illuminate\Support\Collection
     */
    public function getTopProducts(array $filters = [], int $limit = 10);
} 