#!/bin/sh

# Função para aguardar serviços
wait_for_service() {
    echo "Aguardando $1..."
    while ! nc -z $1 $2; do
        sleep 1
    done
    echo "$1 está pronto!"
}

# Aguardar Redis se necessário
if [ "$WAIT_FOR_REDIS" = "true" ]; then
    wait_for_service redis 6379
fi

# Aguardar MySQL se necessário
if [ "$WAIT_FOR_MYSQL" = "true" ]; then
    wait_for_service mysql 3306
fi

# Inicializar Laravel apenas se necessário
if [ ! -f bootstrap/cache/config.php ]; then
    echo "Cacheando configurações..."
    php artisan config:cache
fi

if [ ! -f bootstrap/cache/routes.php ]; then
    echo "Cacheando rotas..."
    php artisan route:cache
fi

# Iniciar queue worker em background
echo "Iniciando queue worker..."
php artisan queue:work --daemon --tries=3 --timeout=300 &

# Aguardar um pouco para o worker inicializar
sleep 3

# Iniciar PHP-FPM
echo "Iniciando PHP-FPM..."
exec php-fpm 