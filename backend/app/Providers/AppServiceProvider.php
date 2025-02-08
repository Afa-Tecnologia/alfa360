<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Carbon;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        
        Carbon::setLocale(config('app.locale')); // Define o locale
        setlocale(LC_TIME, 'pt_BR.UTF-8'); // Para funções nativas do PHP
    }
    
}
