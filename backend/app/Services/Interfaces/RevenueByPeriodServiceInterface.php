<?php

namespace App\Services\Interfaces;

/**
 * Interface para o serviço de receita por período
 */
interface RevenueByPeriodServiceInterface
{
    /**
     * Retorna a receita por período (dia, semana, mês)
     *
     * @param array $filters
     * @param string $period
     * @return \Illuminate\Support\Collection
     */
    public function getRevenueByPeriod(array $filters = [], string $period = 'month');
} 