#!/bin/bash

echo "🔍 Monitorando Performance do Laravel..."

# Verificar processos PHP
echo "📊 Processos PHP ativos:"
ps aux | grep php | grep -v grep

echo ""
echo "📊 Uso de CPU por processo PHP:"
ps aux | grep php | grep -v grep | awk '{print $3, $11}' | sort -nr

echo ""
echo "📊 Uso de Memória por processo PHP:"
ps aux | grep php | grep -v grep | awk '{print $4, $11}' | sort -nr

echo ""
echo "🔍 Verificando Jobs em Queue:"
php artisan queue:monitor

echo ""
echo "🔍 Jobs pendentes:"
php artisan queue:work --once --timeout=1 2>/dev/null || echo "Nenhum job pendente"

echo ""
echo "🔍 Verificando Redis:"
php artisan tinker --execute="echo 'Redis Memory: ' . Redis::info()['used_memory_human'] . PHP_EOL;"

echo ""
echo "🔍 Verificando OPcache:"
php -r "if (opcache_get_status()) { \$status = opcache_get_status(); echo 'OPcache Memory: ' . number_format(\$status['memory_usage']['used_memory'] / 1024 / 1024, 2) . 'MB' . PHP_EOL; } else { echo 'OPcache não está ativo' . PHP_EOL; }"

echo ""
echo "🔍 Logs de erro recentes:"
tail -n 10 storage/logs/laravel.log 2>/dev/null || echo "Nenhum log encontrado" 