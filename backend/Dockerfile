FROM php:8.3.21-fpm-alpine3.20

# Instalar dependências e limpar cache apt para reduzir tamanho da imagem
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    libicu-dev \
    && apt-get upgrade -y \
    && apt-get autoremove -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Instalar extensões PHP
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip intl

# Instalar e habilitar Redis
RUN pecl install redis && docker-php-ext-enable redis

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Criar usuário não-root
RUN useradd -G www-data,root -u 1000 -d /home/laravel laravel
RUN mkdir -p /home/laravel/.composer && \
    chown -R laravel:laravel /home/laravel

# Configurar diretório de trabalho
WORKDIR /var/www/html

# Configurar PHP para produção
COPY backend/docker/php.ini /usr/local/etc/php/conf.d/app.ini

# Copiar código da aplicação
COPY --chown=laravel:laravel ./backend /var/www/html

# Instalar dependências
RUN composer install --no-interaction --no-dev --optimize-autoloader

# Definir permissões corretas
RUN chown -R laravel:laravel /var/www/html/storage /var/www/html/bootstrap/cache

USER laravel

EXPOSE 9000

CMD ["php-fpm"]
