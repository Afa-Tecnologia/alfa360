<?php

namespace App\Providers;

use App\Models\Pedido;
use App\Observers\PedidoObserver;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Carbon;
use App\Services\Interfaces\EmployeeExpenseServiceInterface;
use App\Services\EmployeeExpenseService;
use App\Repositories\Interfaces\EmployeeExpenseRepositoryInterface;
use App\Repositories\EmployeeExpenseRepository;

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
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {   
        //Observador de pedido
        Pedido::observe(PedidoObserver::class);
        Carbon::setLocale(config('app.locale')); // Define o locale
        setlocale(LC_TIME, 'pt_BR.UTF-8'); // Para funções nativas do PHP
    }
    
}
