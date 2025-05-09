<?php

namespace App\Services\Interfaces;

/**
 * Interface para o serviço de resumo de vendas
 */
interface SalesSummaryServiceInterface
{
    /**
     * Retorna um resumo das vendas com filtros opcionais
     *
     * @param array $filters
     * @return array
     */
    public function getSalesSummary(array $filters = []);
} 