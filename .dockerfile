# Imagem oficial do PHP com extensões necessárias
FROM php:8.4.3-fpm

# Instalação de extensões essenciais
RUN apt-get update && apt-get install -y \
    libsqlite3-dev \
    zip \
    unzip \
    git \
    curl \
    && docker-php-ext-install pdo pdo_sqlite

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Definir o diretório de trabalho
WORKDIR /var/www

# Copiar o código do Laravel
COPY . .

# Instalar as dependências do Laravel
RUN composer install --no-dev --optimize-autoloader

# Permissões corretas para SQLite
RUN chmod -R 775 /var/www/database && \
    chown -R www-data:www-data /var/www/database

# Expor a porta do servidor
EXPOSE 8000

# Comando para iniciar o servidor
CMD php artisan serve --host=0.0.0.0 --port=8000
