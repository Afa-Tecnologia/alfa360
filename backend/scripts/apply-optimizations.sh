#!/bin/bash

echo "🚀 Aplicando otimizações de performance..."

# Limpar caches
echo "🧹 Limpando caches..."
docker compose exec backend php artisan cache:clear || true
docker compose exec backend php artisan config:clear || true
docker compose exec backend php artisan route:clear || true
docker compose exec backend php artisan view:clear || true

# Parar o container
echo "🛑 Parando container backend..."
docker compose stop backend


# Reconstruir container com otimizações
echo "🔨 Reconstruindo container..."
docker compose build backend

# Iniciar container
echo "🚀 Iniciando container..."
docker compose up -d backend

# Aguardar inicialização
echo "⏳ Aguardando inicialização..."
sleep 30

# Verificar se está funcionando
echo "🔍 Verificando status..."
docker compose ps backend

# Aplicar otimizações do Laravel
echo "⚡ Aplicando otimizações do Laravel..."
docker compose exec backend php artisan config:cache
docker compose exec backend php artisan route:cache
docker compose exec backend php artisan view:cache

# Verificar performance
echo "📊 Verificando performance..."
docker compose exec backend /usr/local/bin/monitor-performance.sh

echo "✅ Otimizações aplicadas com sucesso!"
echo "📋 Para monitorar: ./backend/scripts/monitor-cpu.sh" 