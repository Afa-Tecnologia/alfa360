#!/bin/bash

# Script de Monitoramento em Tempo Real - Alfa360
# Executar via cron: */5 * * * * /path/to/monitor.sh

LOG_FILE="/var/log/alfa360-monitor.log"
ALERT_LOG="/var/log/alfa360-alerts.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

# Configurações de alerta
MAX_CPU=80
MAX_MEMORY=85
MAX_PHP_PROCESSES=25
MIN_PHP_PROCESSES=3

echo "[$DATE] 📊 Iniciando monitoramento..." >> $LOG_FILE

# 1. Verificar containers
cd /path/to/alfa360  # Ajustar para o caminho correto

# Verificar se containers estão rodando
RUNNING_CONTAINERS=$(docker compose ps --format "{{.Name}}" | wc -l)
EXPECTED_CONTAINERS=6  # backend, frontend, mysql, redis, nginx, certbot

if [ $RUNNING_CONTAINERS -lt $EXPECTED_CONTAINERS ]; then
    echo "[$DATE] 🚨 ALERTA: Containers parados! ($RUNNING_CONTAINERS/$EXPECTED_CONTAINERS)" | tee -a $ALERT_LOG
    docker compose ps >> $ALERT_LOG
fi

# 2. Verificar uso de CPU e Memória
CPU_USAGE=$(docker stats --no-stream --format "{{.CPUPerc}}" alfa360-backend | sed 's/%//')
MEMORY_USAGE=$(docker stats --no-stream --format "{{.MemPerc}}" alfa360-backend | sed 's/%//')

if (( $(echo "$CPU_USAGE > $MAX_CPU" | bc -l) )); then
    echo "[$DATE] 🚨 ALERTA: CPU alta! $CPU_USAGE%" | tee -a $ALERT_LOG
fi

if (( $(echo "$MEMORY_USAGE > $MAX_MEMORY" | bc -l) )); then
    echo "[$DATE] 🚨 ALERTA: Memória alta! $MEMORY_USAGE%" | tee -a $ALERT_LOG
fi

# 3. Verificar processos PHP-FPM
PHP_PROCESSES=$(docker exec alfa360-backend ps aux | grep php-fpm | wc -l)

if [ $PHP_PROCESSES -gt $MAX_PHP_PROCESSES ]; then
    echo "[$DATE] 🚨 ALERTA: Muitos processos PHP! $PHP_PROCESSES" | tee -a $ALERT_LOG
elif [ $PHP_PROCESSES -lt $MIN_PHP_PROCESSES ]; then
    echo "[$DATE] ⚠️ ALERTA: Poucos processos PHP! $PHP_PROCESSES" | tee -a $ALERT_LOG
fi

# 4. Verificar Redis
REDIS_STATUS=$(docker exec alfa360-redis redis-cli -a "$REDIS_PASSWORD" ping 2>/dev/null || echo "ERROR")
if [ "$REDIS_STATUS" != "PONG" ]; then
    echo "[$DATE] 🚨 ALERTA: Redis não responde!" | tee -a $ALERT_LOG
fi

# 5. Verificar MySQL
MYSQL_STATUS=$(docker exec alfa360-mysql mysqladmin ping -h localhost -u root -p"$MYSQL_ROOT_PASSWORD" 2>/dev/null || echo "ERROR")
if [ "$MYSQL_STATUS" != "mysqld is alive" ]; then
    echo "[$DATE] 🚨 ALERTA: MySQL não responde!" | tee -a $ALERT_LOG
fi

# 6. Verificar logs de erro
ERROR_COUNT=$(docker compose logs backend --tail=100 | grep -i "error\|fatal\|exception" | wc -l)
if [ $ERROR_COUNT -gt 10 ]; then
    echo "[$DATE] ⚠️ ALERTA: Muitos erros nos logs! $ERROR_COUNT" | tee -a $ALERT_LOG
fi

echo "[$DATE] ✅ Monitoramento concluído" >> $LOG_FILE 