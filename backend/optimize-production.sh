#!/bin/bash

echo "🚀 Otimizando Laravel para produção..."

# Limpar caches antigos
echo "📦 Limpando caches..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Otimizar autoloader
echo "⚡ Otimizando autoloader..."
composer install --optimize-autoloader --no-dev

# Executar migrations (incluindo índices de performance)
echo "🗄️ Executando migrations..."
php artisan migrate --force

# Cache de configuração
echo "🔧 Cacheando configurações..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Verificar permissões
echo "🔐 Ajustando permissões..."
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

echo "✅ Otimização concluída!"
echo "📊 Para verificar performance, monitore os logs:"
echo "   tail -f storage/logs/laravel.log" 