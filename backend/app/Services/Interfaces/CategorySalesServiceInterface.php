<?php

namespace App\Services\Interfaces;

/**
 * Interface para o serviço de vendas por categoria
 */
interface CategorySalesServiceInterface
{
    /**
     * Retorna vendas por categoria com filtros opcionais
     *
     * @param array $filters
     * @return \Illuminate\Support\Collection
     */
    public function getSalesByCategory(array $filters = []);
} 