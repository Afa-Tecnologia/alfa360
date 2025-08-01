#!/bin/bash

echo "🔍 Monitoramento de Processos PHP-FPM"
echo "======================================"

# Verificar processos PHP-FPM
echo "📊 Processos PHP-FPM ativos:"
docker exec alfa360-backend ps aux | grep php-fpm | wc -l

echo ""
echo "📈 Detalhes dos processos:"
docker exec alfa360-backend ps aux | grep php-fpm

echo ""
echo "💾 Uso de memória por processo:"
docker exec alfa360-backend ps -eo pid,ppid,cmd,%mem,%cpu --sort=-%mem | head -10

echo ""
echo "🔄 Status do PHP-FPM:"
docker exec alfa360-backend php-fpm -t

echo ""
echo "📊 Estatísticas do container:"
docker stats alfa360-backend --no-stream

echo ""
echo "🔍 Logs recentes do backend:"
docker logs alfa360-backend --tail 10 