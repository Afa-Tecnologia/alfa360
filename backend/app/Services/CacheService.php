<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class CacheService
{
    private const DEFAULT_TTL = 3600; // 1 hora
    private const SHORT_TTL = 300;    // 5 minutos
    private const LONG_TTL = 86400;   // 24 horas

    /**
     * Cache com TTL otimizado
     */
    public static function remember(string $key, $callback, int $ttl = null): mixed
    {
        $ttl = $ttl ?? self::DEFAULT_TTL;
        
        return Cache::tags(['api'])->remember($key, $ttl, function () use ($callback, $key) {
            $start = microtime(true);
            $result = $callback();
            $time = (microtime(true) - $start) * 1000;
            
            Log::info("Cache miss for key: {$key}", ['execution_time_ms' => $time]);
            
            return $result;
        });
    }

    /**
     * Cache para produtos (TTL curto)
     */
    public static function rememberProduct(string $key, $callback): mixed
    {
        return self::remember($key, $callback, self::SHORT_TTL);
    }

    /**
     * Cache para categorias (TTL longo)
     */
    public static function rememberCategory(string $key, $callback): mixed
    {
        return self::remember($key, $callback, self::LONG_TTL);
    }

    /**
     * Invalidar cache por tag
     */
    public static function flush(string $tag = 'api'): void
    {
        Cache::tags($tag)->flush();
        Log::info("Cache flushed for tag: {$tag}");
    }

    /**
     * Invalidar cache de produtos
     */
    public static function flushProducts(): void
    {
        Cache::tags(['products'])->flush();
        Log::info("Products cache flushed");
    }

    /**
     * Verificar status do Redis
     */
    public static function isHealthy(): bool
    {
        try {
            Cache::store('redis')->get('health_check');
            return true;
        } catch (\Exception $e) {
            Log::error("Redis health check failed", ['error' => $e->getMessage()]);
            return false;
        }
    }
} 