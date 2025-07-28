FROM php:8.3.21-fpm-alpine3.20

# Definir valores padrão para variáveis de ambiente
ENV APP_USER=laravel \
    APP_UID=1000 \
    APP_HOME=/home/laravel

# Instalar dependências necessárias
RUN apk update && apk add --no-cache \
    git \
    curl \
    libpng-dev \
    oniguruma-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    icu-dev \
    shadow \
    redis \
    autoconf \
    gcc \
    g++ \
    make \
    && rm -rf /var/cache/apk/*

# Instalar extensões PHP
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip intl

# Instalar Redis extension para PHP
RUN pecl install redis && docker-php-ext-enable redis

# Verificar se Redis extension foi instalada
RUN php -m | grep redis

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Criar usuário não-root com base nas variáveis de ambiente
RUN useradd -G www-data,root -u ${APP_UID} -d ${APP_HOME} ${APP_USER} && \
    mkdir -p ${APP_HOME}/.composer && \
    chown -R ${APP_USER}:${APP_USER} ${APP_HOME}

# Configurar diretório de trabalho
WORKDIR /var/www/html

# Configurar PHP otimizado para produção
COPY backend/docker/php.ini /usr/local/etc/php/conf.d/app.ini

# Copiar código da aplicação
COPY ./backend /var/www/html

# Definir permissões corretas
RUN chown -R ${APP_USER}:${APP_USER} /var/www/html && \
    chown -R ${APP_USER}:${APP_USER} /var/www/html/storage /var/www/html/bootstrap/cache

# Instalar dependências
USER ${APP_USER}
RUN composer install --no-interaction --no-dev --optimize-autoloader

# Script de otimização para produção
COPY backend/optimize-production.sh /usr/local/bin/optimize.sh
RUN chmod +x /usr/local/bin/optimize.sh

EXPOSE 9000

# Rodar o PHP-FPM
CMD ["php-fpm"]