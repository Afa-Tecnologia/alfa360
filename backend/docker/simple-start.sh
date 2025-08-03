#!/bin/sh

# Função para limpar processos órfãos
cleanup_processes() {
    echo "🧹 Limpando processos órfãos..."
    pkill -f "php artisan" || true
    pkill -f "queue:work" || true
}

# Limpar processos existentes
cleanup_processes

# Inicializar Laravel
echo "🚀 Inicializando Laravel..."
php artisan config:cache
php artisan route:cache

# Iniciar queue worker com configurações otimizadas
echo "🔄 Iniciando queue worker..."
php artisan queue:work --daemon --tries=3 --timeout=300 --sleep=3 --max-time=3600 &

# Aguardar um pouco para o worker inicializar
sleep 5

# Iniciar PHP-FPM
echo "🚀 Iniciando PHP-FPM..."
exec php-fpm 