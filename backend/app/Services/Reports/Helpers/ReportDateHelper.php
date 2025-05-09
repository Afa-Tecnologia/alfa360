<?php

namespace App\Services\Reports\Helpers;

use Carbon\Carbon;

/**
 * Classe auxiliar para manipulação de datas em relatórios
 */
class ReportDateHelper
{
    /**
     * Processa datas de início e fim com valores padrão
     * 
     * @param string|null $dataInicial
     * @param string|null $dataFinal
     * @param bool $useMonthDefault Se verdadeiro, usa mês atual como padrão. Se falso, usa 6 meses atrás.
     * @return array Array com as datas processadas [dataInicial, dataFinal]
     */
    public static function processDateRange(?string $dataInicial, ?string $dataFinal, bool $useMonthDefault = true): array
    {
        if (!$dataInicial || !$dataFinal) {
            $dataFinal = Carbon::now()->endOfDay();
            
            if ($useMonthDefault) {
                $dataInicial = Carbon::now()->startOfMonth();
            } else {
                $dataInicial = Carbon::now()->subMonths(6)->startOfMonth();
            }
        } else {
            $dataInicial = Carbon::parse($dataInicial)->startOfDay();
            $dataFinal = Carbon::parse($dataFinal)->endOfDay();
        }
        
        return [$dataInicial, $dataFinal];
    }

    /**
     * Calcula o período anterior para comparações
     * 
     * @param Carbon $dataInicial
     * @param Carbon $dataFinal
     * @return array Array com as datas do período anterior [periodoAnteriorInicial, periodoAnteriorFinal]
     */
    public static function calculatePreviousPeriod(Carbon $dataInicial, Carbon $dataFinal): array
    {
        // Calcula a duração do período para fazer uma comparação com período anterior equivalente
        $duracao = $dataInicial->diffInDays($dataFinal);
        $periodoAnteriorFinal = Carbon::parse($dataInicial)->subDay()->endOfDay();
        $periodoAnteriorInicial = Carbon::parse($dataInicial)->subDays($duracao + 1)->startOfDay();
        
        return [$periodoAnteriorInicial, $periodoAnteriorFinal];
    }

    /**
     * Obtém o formato de data de acordo com o período
     * 
     * @param string $period
     * @return array Array com o formato para agrupamento e formato para exibição
     */
    public static function getPeriodFormat(string $period): array
    {
        switch ($period) {
            case 'day':
                return ['%Y-%m-%d', 'd/m'];
            case 'week':
                return ['%Y-%W', '\S\e\m\a\n\a W'];
            case 'month':
            default:
                return ['%Y-%m', 'm/Y'];
        }
    }
} 