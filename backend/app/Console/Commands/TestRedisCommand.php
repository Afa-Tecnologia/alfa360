<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redis;
use Exception;

class TestRedisCommand extends Command
{
    protected $signature = 'redis:test {--detailed : Show detailed information}';
    protected $description = 'Test Redis connection and functionality';

    public function handle()
    {
        $this->info('🔄 Testando conexão Redis...');
        $this->newLine();

        $tests = [
            'Conexão Básica' => [$this, 'testBasicConnection'],
            'Cache Laravel' => [$this, 'testLaravelCache'],
            'Redis Direto' => [$this, 'testDirectRedis'],
            'Cache com Tags' => [$this, 'testCacheTags'],
            'Performance' => [$this, 'testPerformance'],
        ];

        $results = [];
        
        foreach ($tests as $testName => $testMethod) {
            $this->info("Testing: {$testName}");
            
            try {
                $result = call_user_func($testMethod);
                $results[$testName] = $result;
                $this->line("✅ {$testName}: <info>PASSOU</info>");
                
                if ($this->option('detailed') && is_array($result)) {
                    foreach ($result as $key => $value) {
                        $this->line("   → {$key}: {$value}");
                    }
                }
            } catch (Exception $e) {
                $results[$testName] = false;
                $this->line("❌ {$testName}: <error>FALHOU</error>");
                $this->line("   Erro: " . $e->getMessage());
            }
            
            $this->newLine();
        }

        $this->displaySummary($results);
        
        if ($this->option('detailed')) {
            $this->displayDetailedInfo();
        }

        return Command::SUCCESS;
    }

    private function testBasicConnection()
    {
        $redis = Redis::connection();
        $response = $redis->ping();
        
        if ($response !== true && $response !== 'PONG') {
            throw new Exception('Redis ping failed');
        }
        
        return [
            'Status' => 'Conectado',
            'Response' => is_bool($response) ? 'PONG' : $response
        ];
    }

    private function testLaravelCache()
    {
        $key = 'test_laravel_cache_' . time();
        $value = 'Laravel Cache Working!';
        
        // Teste put/get
        Cache::put($key, $value, 60);
        $retrieved = Cache::get($key);
        
        if ($retrieved !== $value) {
            throw new Exception('Cache put/get failed');
        }
        
        // Teste remember
        $rememberKey = 'test_remember_' . time();
        $rememberValue = Cache::remember($rememberKey, 60, function () {
            return 'Remember Working!';
        });
        
        // Limpar testes
        Cache::forget($key);
        Cache::forget($rememberKey);
        
        return [
            'Put/Get' => 'OK',
            'Remember' => 'OK',
            'Driver' => config('cache.default')
        ];
    }

    private function testDirectRedis()
    {
        $redis = Redis::connection();
        $key = 'test_direct_redis_' . time();
        $value = 'Direct Redis Working!';
        
        // Teste set/get
        $redis->set($key, $value);
        $retrieved = $redis->get($key);
        
        if ($retrieved !== $value) {
            throw new Exception('Direct Redis set/get failed');
        }
        
        // Teste com TTL
        $redis->setex($key . '_ttl', 60, $value);
        $ttl = $redis->ttl($key . '_ttl');
        
        // Limpar testes
        $redis->del([$key, $key . '_ttl']);
        
        return [
            'Set/Get' => 'OK',
            'TTL' => $ttl > 0 ? 'OK' : 'FAIL',
            'Client' => config('database.redis.client')
        ];
    }

    private function testCacheTags()
    {
        if (!$this->supportsTags()) {
            return ['Status' => 'Driver não suporta tags'];
        }

        $key = 'test_tags_' . time();
        $value = 'Tagged Cache Working!';
        $tags = ['test', 'produtos'];
        
        // Teste cache com tags
        Cache::tags($tags)->put($key, $value, 60);
        $retrieved = Cache::tags($tags)->get($key);
        
        if ($retrieved !== $value) {
            throw new Exception('Tagged cache failed');
        }
        
        // Teste flush tags
        Cache::tags(['test'])->flush();
        $afterFlush = Cache::tags($tags)->get($key);
        
        if ($afterFlush !== null) {
            throw new Exception('Tag flush failed');
        }
        
        return [
            'Tags Put/Get' => 'OK',
            'Tags Flush' => 'OK',
            'Supported' => 'YES'
        ];
    }

    private function testPerformance()
    {
        $iterations = 100;
        $keys = [];
        
        // Teste de escrita
        $writeStart = microtime(true);
        for ($i = 0; $i < $iterations; $i++) {
            $key = "perf_test_{$i}_" . time();
            $keys[] = $key;
            Cache::put($key, "Value {$i}", 60);
        }
        $writeTime = (microtime(true) - $writeStart) * 1000;
        
        // Teste de leitura
        $readStart = microtime(true);
        foreach ($keys as $key) {
            Cache::get($key);
        }
        $readTime = (microtime(true) - $readStart) * 1000;
        
        // Limpar testes
        foreach ($keys as $key) {
            Cache::forget($key);
        }
        
        return [
            'Write Time' => round($writeTime, 2) . 'ms',
            'Read Time' => round($readTime, 2) . 'ms',
            'Avg Write' => round($writeTime / $iterations, 2) . 'ms',
            'Avg Read' => round($readTime / $iterations, 2) . 'ms'
        ];
    }

    private function supportsTags(): bool
    {
        $driver = config('cache.default');
        return in_array($driver, ['redis', 'memcached', 'dynamodb']);
    }

    private function displaySummary(array $results)
    {
        $passed = count(array_filter($results));
        $total = count($results);
        
        $this->newLine();
        $this->info('📊 RESUMO DOS TESTES');
        $this->line("Passou: {$passed}/{$total}");
        
        if ($passed === $total) {
            $this->line('<info>🎉 Todos os testes passaram! Redis está funcionando perfeitamente.</info>');
        } else {
            $this->line('<error>⚠️  Alguns testes falharam. Verifique a configuração.</error>');
        }
    }

    private function displayDetailedInfo()
    {
        $this->newLine();
        $this->info('🔍 INFORMAÇÕES DETALHADAS');
        
        try {
            $redis = Redis::connection();
            
            // Info do servidor
            $info = $redis->info();
            $this->line("Redis Version: " . ($info['redis_version'] ?? 'N/A'));
            $this->line("Used Memory: " . ($info['used_memory_human'] ?? 'N/A'));
            $this->line("Connected Clients: " . ($info['connected_clients'] ?? 'N/A'));
            $this->line("Total Commands: " . ($info['total_commands_processed'] ?? 'N/A'));
            
            // Configuração Laravel
            $this->newLine();
            $this->line("Cache Driver: " . config('cache.default'));
            $this->line("Redis Client: " . config('database.redis.client'));
            $this->line("Redis Host: " . config('database.redis.default.host'));
            $this->line("Redis Port: " . config('database.redis.default.port'));
            $this->line("Redis DB: " . config('database.redis.default.database'));
            
            // Chaves existentes
            $keys = $redis->keys('*');
            $this->line("Total Keys: " . count($keys));
            
            if ($this->option('detailed') && count($keys) > 0) {
                $this->newLine();
                $this->line("Algumas chaves existentes:");
                foreach (array_slice($keys, 0, 10) as $key) {
                    $this->line("  → {$key}");
                }
                if (count($keys) > 10) {
                    $this->line("  ... e mais " . (count($keys) - 10) . " chaves");
                }
            }
            
        } catch (Exception $e) {
            $this->error("Erro ao obter informações detalhadas: " . $e->getMessage());
        }
    }
}