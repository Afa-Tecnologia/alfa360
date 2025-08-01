#!/bin/bash

echo "🔍 Monitoramento de Processos PHP-FPM"
echo "======================================"

# Verificar processos PHP-FPM
echo "📊 Processos PHP-FPM ativos:"
docker exec backend ps aux | grep php-fpm | wc -l

echo ""
echo "📈 Detalhes dos processos:"
docker exec backend ps aux | grep php-fpm

echo ""
echo "💾 Uso de memória por processo:"
docker exec backend ps -eo pid,ppid,cmd,%mem,%cpu --sort=-%mem | head -10

echo ""
echo "🔄 Status do PHP-FPM:"
docker exec backend php-fpm -t

echo ""
echo "📊 Estatísticas do container:"
docker stats backend --no-stream

echo ""
echo "🔍 Logs recentes do backend:"
docker logs backend --tail 10 