#!/bin/bash

# Inicializar o Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Iniciar queue worker em background
php artisan queue:work --daemon --tries=3 --timeout=300 &

# Iniciar PHP-FPM
php-fpm 