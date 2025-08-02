<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class PerformanceOptimizer
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        // Verificar se a resposta está em cache
        $cacheKey = 'response_' . md5($request->fullUrl() . $request->getContent());
        
        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        // Limitar tempo de execução
        set_time_limit(30);
        
        // Definir limite de memória
        ini_set('memory_limit', '128M');

        $response = $next($request);

        // Cachear resposta para GET requests
        if ($request->isMethod('GET') && $response->getStatusCode() === 200) {
            Cache::put($cacheKey, $response, 300); // 5 minutos
        }

        // Log de performance se demorar muito
        $executionTime = microtime(true) - LARAVEL_START;
        if ($executionTime > 1.0) {
            Log::channel('performance')->warning('Request lento detectado', [
                'url' => $request->fullUrl(),
                'method' => $request->method(),
                'execution_time' => $executionTime,
                'memory_usage' => memory_get_usage(true)
            ]);
        }

        return $response;
    }
} 