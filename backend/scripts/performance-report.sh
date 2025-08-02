#!/bin/bash

echo "📊 Relatório de Performance do Backend"
echo "======================================"

# Verificar se o container está rodando
if ! docker ps | grep -q backend; then
    echo "❌ Container backend não está rodando"
    exit 1
fi

echo ""
echo "🔍 Status do Container:"
docker ps | grep backend

echo ""
echo "📊 Uso de Recursos:"
CPU_USAGE=$(docker exec backend top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
echo "CPU: ${CPU_USAGE}%"

MEMORY_USAGE=$(docker exec backend free | grep Mem | awk '{printf "%.1f", $3/$2 * 100.0}')
echo "Memória: ${MEMORY_USAGE}%"

echo ""
echo "🔍 Processos PHP Ativos:"
docker exec backend ps aux | grep php | grep -v grep | wc -l | xargs echo "Total de processos PHP:"

echo ""
echo "🔍 Top 5 Processos por CPU:"
docker exec backend ps aux | grep php | sort -k3 -nr | head -5 | awk '{print $3 "% CPU - " $11}'

echo ""
echo "🔍 Queue Worker Status:"
if docker exec backend ps aux | grep -q "queue:work"; then
    echo "✅ Queue worker está rodando"
    QUEUE_PID=$(docker exec backend pgrep -f "queue:work")
    echo "PID: $QUEUE_PID"
else
    echo "❌ Queue worker não está rodando"
fi

echo ""
echo "🔍 PHP-FPM Status:"
if docker exec backend ps aux | grep -q "php-fpm"; then
    echo "✅ PHP-FPM está rodando"
    FPM_PIDS=$(docker exec backend pgrep -f "php-fpm")
    echo "PIDs: $FPM_PIDS"
else
    echo "❌ PHP-FPM não está rodando"
fi

echo ""
echo "🔍 Últimos Logs de Erro:"
docker logs backend --tail=5 | grep -i error || echo "Nenhum erro encontrado"

echo ""
echo "🔍 Status do Redis:"
docker exec backend php -r "try { Redis::connect('redis', 6379); echo '✅ Redis conectado'; } catch(Exception \$e) { echo '❌ Redis não conectado: ' . \$e->getMessage(); }"

echo ""
echo "🔍 Status do OPcache:"
docker exec backend php -r "if (opcache_get_status()) { echo '✅ OPcache ativo'; } else { echo '❌ OPcache inativo'; }"

echo ""
echo "======================================"
echo "✅ Relatório concluído!" 