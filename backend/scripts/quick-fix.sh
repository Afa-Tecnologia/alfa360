#!/bin/bash

echo "🔧 Aplicando correções rápidas..."

# Verificar se o container está rodando
if ! docker ps | grep -q backend; then
    echo "❌ Container backend não está rodando"
    exit 1
fi

echo "🧹 Limpando caches..."
docker exec backend php artisan cache:clear
docker exec backend php artisan config:clear
docker exec backend php artisan route:clear
docker exec backend php artisan view:clear

echo "⚡ Aplicando otimizações..."
docker exec backend php artisan config:cache
docker exec backend php artisan route:cache
docker exec backend php artisan view:cache

echo "🔄 Reiniciando queue worker..."
./backend/scripts/restart-queue.sh

echo "📊 Verificando performance..."
./backend/scripts/performance-report.sh

echo "✅ Correções aplicadas com sucesso!"
echo ""
echo "📋 Para monitorar continuamente:"
echo "   watch -n 30 './backend/scripts/monitor-cpu.sh'" 