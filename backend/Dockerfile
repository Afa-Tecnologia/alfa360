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
    procps \
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
COPY backend/docker/www.conf /usr/local/etc/php-fpm.d/www.conf

# Copiar scripts de inicialização
COPY backend/docker/simple-start.sh /usr/local/bin/simple-start.sh
COPY backend/optimize-performance.sh /usr/local/bin/optimize-performance.sh
COPY backend/monitor-performance.sh /usr/local/bin/monitor-performance.sh

# Dar permissões de execução aos scripts
RUN chmod +x /usr/local/bin/simple-start.sh && \
    chmod +x /usr/local/bin/optimize-performance.sh && \
    chmod +x /usr/local/bin/monitor-performance.sh

# Copiar código da aplicação
COPY ./backend /var/www/html

# Definir permissões corretas e configurações de segurança
RUN chown -R ${APP_USER}:${APP_USER} /var/www/html && \
    chown -R ${APP_USER}:${APP_USER} /var/www/html/storage /var/www/html/bootstrap/cache && \
    chmod -R 755 /var/www/html && \
    chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Remover arquivos desnecessários para segurança
RUN find /var/www/html -name "*.log" -delete && \
    find /var/www/html -name "*.tmp" -delete && \
    find /var/www/html -name ".env*" -delete

# Instalar dependências como usuário não-root
USER ${APP_USER}
RUN composer install --no-interaction --no-dev --optimize-autoloader

# Voltar para root para configurações finais
USER root

# Configurações de segurança adicionais
RUN echo "php_admin_value[disable_functions] = exec,passthru,shell_exec,system,proc_open,popen,curl_exec,curl_multi_exec,parse_ini_file,show_source" >> /usr/local/etc/php-fpm.d/www.conf && \
    echo "php_admin_value[open_basedir] = /var/www/html:/tmp" >> /usr/local/etc/php-fpm.d/www.conf

# Voltar para usuário não-root
USER ${APP_USER}

EXPOSE 9000

# Usar script simples
CMD ["/usr/local/bin/simple-start.sh"]