<?php

namespace App\Traits;

use Illuminate\Support\Facades\Cache;

trait ServiceCacheable
{
    protected int $cacheTime = 300; // padrão: 5 minutos

    protected function getCacheKey(string $prefix, $identifier): string
    {
        return "{$prefix}:" . (is_array($identifier) ? md5(json_encode($identifier)) : $identifier);
    }

    protected function cacheRemember(string $key, callable $callback)
    {
        return Cache::remember($key, $this->cacheTime, $callback);
    }

    protected function cacheForget(string $key)
    {
        Cache::forget($key);
    }
}
