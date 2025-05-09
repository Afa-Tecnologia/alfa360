<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\Interfaces\ReportServiceInterface;
use App\Services\Interfaces\SalesSummaryServiceInterface;
use App\Services\Interfaces\CategorySalesServiceInterface;
use App\Services\Interfaces\TopProductsServiceInterface;
use App\Services\Interfaces\RevenueByPeriodServiceInterface;
use App\Services\Interfaces\OrdersReportServiceInterface;
use App\Services\Reports\ReportService;

class DiagnoseReportService extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'diagnose:report-service';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Diagnostica problemas com o serviço de relatórios';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Iniciando diagnóstico do serviço de relatórios...');
        
        try {
            $this->info('Verificando se SalesSummaryServiceInterface pode ser resolvido...');
            $salesSummaryService = app(SalesSummaryServiceInterface::class);
            $this->info('✓ SalesSummaryServiceInterface foi resolvido com sucesso: ' . get_class($salesSummaryService));
        } catch (\Exception $e) {
            $this->error('✗ Erro ao resolver SalesSummaryServiceInterface: ' . $e->getMessage());
        }
        
        try {
            $this->info('Verificando se CategorySalesServiceInterface pode ser resolvido...');
            $categorySalesService = app(CategorySalesServiceInterface::class);
            $this->info('✓ CategorySalesServiceInterface foi resolvido com sucesso: ' . get_class($categorySalesService));
        } catch (\Exception $e) {
            $this->error('✗ Erro ao resolver CategorySalesServiceInterface: ' . $e->getMessage());
        }
        
        try {
            $this->info('Verificando se TopProductsServiceInterface pode ser resolvido...');
            $topProductsService = app(TopProductsServiceInterface::class);
            $this->info('✓ TopProductsServiceInterface foi resolvido com sucesso: ' . get_class($topProductsService));
        } catch (\Exception $e) {
            $this->error('✗ Erro ao resolver TopProductsServiceInterface: ' . $e->getMessage());
        }
        
        try {
            $this->info('Verificando se RevenueByPeriodServiceInterface pode ser resolvido...');
            $revenueByPeriodService = app(RevenueByPeriodServiceInterface::class);
            $this->info('✓ RevenueByPeriodServiceInterface foi resolvido com sucesso: ' . get_class($revenueByPeriodService));
        } catch (\Exception $e) {
            $this->error('✗ Erro ao resolver RevenueByPeriodServiceInterface: ' . $e->getMessage());
        }
        
        try {
            $this->info('Verificando se OrdersReportServiceInterface pode ser resolvido...');
            $ordersReportService = app(OrdersReportServiceInterface::class);
            $this->info('✓ OrdersReportServiceInterface foi resolvido com sucesso: ' . get_class($ordersReportService));
        } catch (\Exception $e) {
            $this->error('✗ Erro ao resolver OrdersReportServiceInterface: ' . $e->getMessage());
        }
        
        try {
            $this->info('Verificando se ReportServiceInterface pode ser resolvido...');
            $reportService = app(ReportServiceInterface::class);
            $this->info('✓ ReportServiceInterface foi resolvido com sucesso: ' . get_class($reportService));
        } catch (\Exception $e) {
            $this->error('✗ Erro ao resolver ReportServiceInterface: ' . $e->getMessage());
        }
        
        try {
            $this->info('Verificando se ReportService pode ser resolvido diretamente...');
            $reportServiceDirect = app(ReportService::class);
            $this->info('✓ ReportService foi resolvido com sucesso: ' . get_class($reportServiceDirect));
        } catch (\Exception $e) {
            $this->error('✗ Erro ao resolver ReportService diretamente: ' . $e->getMessage());
        }
        
        $this->info('Diagnóstico concluído.');
    }
} 