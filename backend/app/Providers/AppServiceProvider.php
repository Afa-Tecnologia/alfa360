<?php

namespace App\Providers;

use App\Models\Pedido;
use App\Models\PedidoPagamento;
use App\Observers\PedidoObserver;
use App\Observers\PedidoPagamentoObserver;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Carbon;
use App\Services\Interfaces\EmployeeExpenseServiceInterface;
use App\Services\EmployeeExpenseService;
use App\Repositories\Interfaces\EmployeeExpenseRepositoryInterface;
use App\Repositories\EmployeeExpenseRepository;
use App\Services\Interfaces\ReportServiceInterface;
use App\Services\Interfaces\SalesSummaryServiceInterface;
use App\Services\Interfaces\CategorySalesServiceInterface;
use App\Services\Interfaces\TopProductsServiceInterface;
use App\Services\Interfaces\RevenueByPeriodServiceInterface;
use App\Services\Interfaces\OrdersReportServiceInterface;
use App\Services\Reports\ReportService;
use App\Services\Reports\SalesSummaryService;
use App\Services\Reports\CategorySalesService;
use App\Services\Reports\TopProductsService;
use App\Services\Reports\RevenueByPeriodService;
use App\Services\Reports\OrdersReportService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Registra as interfaces e implementações para o módulo de despesas de funcionários
        $this->app->bind(EmployeeExpenseRepositoryInterface::class, EmployeeExpenseRepository::class);
        $this->app->bind(EmployeeExpenseServiceInterface::class, EmployeeExpenseService::class);

        // Registrar os serviços de relatórios individuais
        $this->app->bind(SalesSummaryServiceInterface::class, SalesSummaryService::class);
        $this->app->bind(CategorySalesServiceInterface::class, CategorySalesService::class);
        $this->app->bind(TopProductsServiceInterface::class, TopProductsService::class);
        $this->app->bind(RevenueByPeriodServiceInterface::class, RevenueByPeriodService::class);
        $this->app->bind(OrdersReportServiceInterface::class, OrdersReportService::class);
        
        // Registrar ReportService no container manualmente com todas as dependências
        $this->app->bind(ReportService::class, function ($app) {
            return new ReportService(
                $app->make(SalesSummaryService::class),
                $app->make(CategorySalesService::class),
                $app->make(TopProductsService::class),
                $app->make(RevenueByPeriodService::class),
                $app->make(OrdersReportService::class)
            );
        });
        
        // Registrar a interface principal (para compatibilidade futura)
        $this->app->bind(ReportServiceInterface::class, ReportService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {   
        //Observador de pedido
        Pedido::observe(PedidoObserver::class);
        PedidoPagamento::observe(PedidoPagamentoObserver::class);
        Carbon::setLocale(config('app.locale')); // Define o locale
        setlocale(LC_TIME, 'pt_BR.UTF-8'); // Para funções nativas do PHP
    }
}
