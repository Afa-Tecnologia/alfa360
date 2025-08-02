#!/bin/sh

# Inicializar Laravel
php artisan config:cache
php artisan route:cache

# Iniciar queue worker
php artisan queue:work --daemon --tries=3 --timeout=300 &

# Iniciar PHP-FPM
exec php-fpm 