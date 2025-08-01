#!/bin/bash

echo "🚀 Otimizando Laravel para máxima performance..."

# Limpar caches
echo "📦 Limpando caches..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Otimizar autoloader
echo "⚡ Otimizando autoloader..."
composer install --optimize-autoloader --no-dev

# Cachear configurações
echo "🔧 Cacheando configurações..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# # Otimizar banco de dados
# echo "🗄️ Otimizando banco de dados..."
# php artisan migrate --force

# Ajustar permissões
echo "🔐 Ajustando permissões..."
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

# Verificar Redis
echo "🔍 Verificando Redis..."
php artisan tinker --execute="echo 'Redis: ' . (Redis::connection()->ping() ? 'OK' : 'ERRO') . PHP_EOL;"

# Verificar OPcache
echo "🔍 Verificando OPcache..."
php -r "echo 'OPcache: ' . (opcache_get_status() ? 'ATIVO' : 'INATIVO') . PHP_EOL;"

echo "✅ Otimização concluída!"
echo "📊 Para monitorar performance:"
echo "   docker compose logs backend --tail=50"
echo "   docker exec alfa360-backend ps aux | grep php-fpm" 