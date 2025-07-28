#!/bin/bash

echo "🚀 Otimizando Laravel para desenvolvimento..."

# Limpar caches antigos
echo "📦 Limpando caches..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Otimizar autoloader (incluindo dependências de desenvolvimento)
echo "⚡ Otimizando autoloader..."
composer install --optimize-autoloader

# Executar migrations (incluindo índices de performance)
echo "🗄️ Executando migrations..."
php artisan migrate --force

# Cache de configuração (apenas para desenvolvimento)
echo "🔧 Cacheando configurações..."
php artisan config:cache

# Verificar permissões
echo "🔐 Ajustando permissões..."
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

# Verificar conexão com Redis
echo "🔍 Verificando Redis..."
if php artisan tinker --execute="Redis::ping()" 2>/dev/null; then
    echo "✅ Redis conectado com sucesso!"
else
    echo "⚠️ Redis não está conectado. Verifique a configuração."
fi

# Verificar conexão com MySQL
echo "🔍 Verificando MySQL..."
if php artisan tinker --execute="DB::connection()->getPdo()" 2>/dev/null; then
    echo "✅ MySQL conectado com sucesso!"
else
    echo "⚠️ MySQL não está conectado. Verifique a configuração."
fi

echo "✅ Otimização de desenvolvimento concluída!"
echo "📊 Para verificar performance, monitore os logs:"
echo "   tail -f storage/logs/laravel.log"
echo "🔧 Para desenvolvimento, você pode usar:"
echo "   php artisan serve --host=0.0.0.0 --port=8000" 