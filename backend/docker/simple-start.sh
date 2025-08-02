#!/bin/sh

# Função para limpar processos órfãos
cleanup_processes() {
    echo "🧹 Limpando processos órfãos..."
    pkill -f "php artisan" || true
    pkill -f "queue:work" || true
}

# Função para monitorar CPU
monitor_cpu() {
    while true; do
        CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
        if [ "$CPU_USAGE" -gt 80 ]; then
            echo "⚠️ CPU alto detectado: ${CPU_USAGE}%"
            cleanup_processes
        fi
        sleep 30
    done
}

# Limpar processos existentes
cleanup_processes

# Inicializar Laravel
echo "🚀 Inicializando Laravel..."
php artisan config:cache
php artisan route:cache

# Iniciar monitoramento de CPU em background
monitor_cpu &

# Iniciar queue worker com configurações otimizadas
echo "🔄 Iniciando queue worker..."
php artisan queue:work --daemon --tries=3 --timeout=300 --sleep=3 --max-time=3600 &

# Aguardar um pouco para o worker inicializar
sleep 5

# Iniciar PHP-FPM
echo "🚀 Iniciando PHP-FPM..."
exec php-fpm 