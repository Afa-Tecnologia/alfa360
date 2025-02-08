# Imagem oficial do PHP com extensões necessárias
FROM php:8.4.3-fpm

# Instalação de dependências essenciais
RUN apt-get update && apt-get install -y \
    libsqlite3-dev \
    zip \
    unzip \
    git \
    curl \
    && docker-php-ext-install pdo pdo_sqlite \
    && rm -rf /var/lib/apt/lists/*

# Instalar Composer (semelhante ao que você já fez)
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Definir o diretório de trabalho
WORKDIR /var/www

# Copiar apenas os arquivos composer.json e composer.lock
# Isso aproveita o cache do Docker para não reinstalar dependências sempre que o código mudar
COPY composer.json composer.lock ./

# Instalar as dependências do Laravel
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Copiar o restante do código da aplicação
COPY . .

# Ajustar permissões dos diretórios necessários para Laravel
RUN chmod -R 775 /var/www/storage /var/www/bootstrap/cache && \
    chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache /var/www/database

# Expor a porta do servidor
EXPOSE 8000

# Comando para iniciar o servidor Laravel
CMD php artisan serve --host=0.0.0.0 --port=8000
