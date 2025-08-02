#!/bin/bash

# Script de auto-restart inteligente para backend
# Autor: Claude Sonnet 4
# Data: 2025-01-20

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
LOG_FILE="/tmp/smart_restart.log"
MAX_CPU_PERCENT=80
MAX_MEMORY_PERCENT=85
CHECK_INTERVAL=300  # 5 minutos
MAX_RESTARTS_PER_HOUR=3
RESTART_COOLDOWN=3600  # 1 hora

# Função para log
log_message() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] $message" | tee -a "$LOG_FILE"
}

# Função para verificar se deve reiniciar
should_restart() {
    local cpu_usage=$(docker stats backend --no-stream --format "{{.CPUPerc}}" | sed 's/%//')
    local memory_usage=$(docker stats backend --no-stream --format "{{.MemPerc}}" | sed 's/%//')
    
    # Verificar se container está rodando
    if ! docker ps | grep -q "backend"; then
        log_message "❌ Container backend não está rodando - REINICIANDO"
        return 0
    fi
    
    # Verificar CPU
    if (( $(echo "$cpu_usage > $MAX_CPU_PERCENT" | bc -l) )); then
        log_message "⚠️  CPU alto: ${cpu_usage}% - Acima de ${MAX_CPU_PERCENT}%"
        return 0
    fi
    
    # Verificar memória
    if (( $(echo "$memory_usage > $MAX_MEMORY_PERCENT" | bc -l) )); then
        log_message "⚠️  Memória alta: ${memory_usage}% - Acima de ${MAX_MEMORY_PERCENT}%"
        return 0
    fi
    
    # Verificar processos órfãos
    local orphan_processes=$(ps aux | grep php | grep -v grep | awk '$3 > 20 {count++} END {print count+0}')
    if [ "$orphan_processes" -gt 3 ]; then
        log_message "⚠️  Processos órfãos detectados: $orphan_processes"
        return 0
    fi
    
    # Verificar se API está respondendo
    if ! curl -s --max-time 10 https://alfa360.alfatecnologia.tech/api/login > /dev/null; then
        log_message "❌ API não está respondendo - REINICIANDO"
        return 0
    fi
    
    return 1
}

# Função para verificar limite de reinicializações
check_restart_limit() {
    local current_time=$(date +%s)
    local one_hour_ago=$((current_time - 3600))
    
    # Contar reinicializações na última hora
    local restart_count=$(grep "🔄 REINICIANDO" "$LOG_FILE" 2>/dev/null | \
        awk -v cutoff="$one_hour_ago" '
        {
            # Extrair timestamp e converter para epoch
            timestamp = $1 " " $2
            cmd = "date -d \"" timestamp "\" +%s"
            cmd | getline epoch
            close(cmd)
            if (epoch > cutoff) count++
        }
        END {print count+0}'
    )
    
    if [ "$restart_count" -ge "$MAX_RESTARTS_PER_HOUR" ]; then
        log_message "🚫 Limite de reinicializações atingido: $restart_count/$MAX_RESTARTS_PER_HOUR"
        return 1
    fi
    
    return 0
}

# Função para reiniciar backend
restart_backend() {
    log_message "🔄 REINICIANDO BACKEND..."
    
    # Capturar snapshot antes do restart
    {
        echo "=== SNAPSHOT ANTES DO RESTART ==="
        echo "Data: $(date)"
        echo "CPU: $(docker stats backend --no-stream --format '{{.CPUPerc}}')"
        echo "Memória: $(docker stats backend --no-stream --format '{{.MemPerc}}')"
        echo "Processos PHP: $(ps aux | grep php | grep -v grep | wc -l)"
        echo ""
    } >> "$LOG_FILE"
    
    # Reiniciar backend
    docker-compose restart backend
    
    # Aguardar estabilização
    log_message "⏳ Aguardando 60 segundos para estabilização..."
    sleep 60
    
    # Verificar se reiniciou com sucesso
    if docker ps | grep -q "backend"; then
        log_message "✅ Backend reiniciado com sucesso"
        
        # Capturar snapshot após restart
        {
            echo "=== SNAPSHOT APÓS RESTART ==="
            echo "Data: $(date)"
            echo "CPU: $(docker stats backend --no-stream --format '{{.CPUPerc}}')"
            echo "Memória: $(docker stats backend --no-stream --format '{{.MemPerc}}')"
            echo "Processos PHP: $(ps aux | grep php | grep -v grep | wc -l)"
            echo ""
        } >> "$LOG_FILE"
    else
        log_message "❌ Falha ao reiniciar backend"
    fi
}

# Função para limpeza de cache
cleanup_cache() {
    log_message "🧹 Executando limpeza de cache..."
    
    # Limpar cache do Laravel
    docker exec backend php artisan cache:clear 2>/dev/null || true
    docker exec backend php artisan config:clear 2>/dev/null || true
    docker exec backend php artisan route:clear 2>/dev/null || true
    docker exec backend php artisan view:clear 2>/dev/null || true
    
    # Limpar cache do sistema
    docker exec backend rm -rf /tmp/* 2>/dev/null || true
    
    log_message "✅ Cache limpo"
}

# Função para monitoramento contínuo
monitor_continuous() {
    log_message "🚀 Iniciando monitoramento inteligente..."
    log_message "Configurações: CPU_MAX=${MAX_CPU_PERCENT}%, MEM_MAX=${MAX_MEMORY_PERCENT}%, CHECK_INTERVAL=${CHECK_INTERVAL}s"
    
    while true; do
        # Verificar se deve reiniciar
        if should_restart; then
            # Verificar limite de reinicializações
            if check_restart_limit; then
                restart_backend
                cleanup_cache
            else
                log_message "🚫 Aguardando cooldown antes de reiniciar novamente..."
            fi
        else
            log_message "✅ Sistema estável - CPU: $(docker stats backend --no-stream --format '{{.CPUPerc}}' 2>/dev/null || echo 'N/A'), MEM: $(docker stats backend --no-stream --format '{{.MemPerc}}' 2>/dev/null || echo 'N/A')"
        fi
        
        # Aguardar próximo check
        sleep "$CHECK_INTERVAL"
    done
}

# Função para modo de teste único
test_mode() {
    log_message "🧪 MODO TESTE - Verificação única"
    
    echo -e "${BLUE}📊 STATUS ATUAL:${NC}"
    echo "CPU: $(docker stats backend --no-stream --format '{{.CPUPerc}}' 2>/dev/null || echo 'N/A')"
    echo "Memória: $(docker stats backend --no-stream --format '{{.MemPerc}}' 2>/dev/null || echo 'N/A')"
    echo "Processos PHP: $(ps aux | grep php | grep -v grep | wc -l)"
    
    if should_restart; then
        echo -e "${YELLOW}⚠️  Sistema precisa de reinicialização${NC}"
        if check_restart_limit; then
            echo -e "${GREEN}✅ Limite de reinicializações OK${NC}"
            restart_backend
        else
            echo -e "${RED}❌ Limite de reinicializações excedido${NC}"
        fi
    else
        echo -e "${GREEN}✅ Sistema estável${NC}"
    fi
}

# Função para mostrar logs
show_logs() {
    echo -e "${BLUE}📋 ÚLTIMOS LOGS:${NC}"
    tail -20 "$LOG_FILE" 2>/dev/null || echo "Nenhum log encontrado"
}

# Função para mostrar estatísticas
show_stats() {
    echo -e "${BLUE}📈 ESTATÍSTICAS:${NC}"
    
    local total_restarts=$(grep -c "🔄 REINICIANDO" "$LOG_FILE" 2>/dev/null || echo "0")
    local today_restarts=$(grep "$(date '+%Y-%m-%d')" "$LOG_FILE" | grep -c "🔄 REINICIANDO" || echo "0")
    
    echo "Total de reinicializações: $total_restarts"
    echo "Reinicializações hoje: $today_restarts"
    echo "Última reinicialização: $(grep "🔄 REINICIANDO" "$LOG_FILE" | tail -1 | awk '{print $1 " " $2}' || echo 'Nunca')"
}

# Menu principal
echo -e "${BLUE}🤖 MONITORAMENTO INTELIGENTE DO BACKEND${NC}"
echo "=============================================="
echo "1. Iniciar monitoramento contínuo"
echo "2. Teste único"
echo "3. Mostrar logs"
echo "4. Mostrar estatísticas"
echo "5. Limpar logs"
echo "6. Configurar parâmetros"

read -p "Digite sua opção (1-6): " choice

case $choice in
    1)
        echo -e "${YELLOW}⚠️  Pressione Ctrl+C para parar o monitoramento${NC}"
        monitor_continuous
        ;;
    2)
        test_mode
        ;;
    3)
        show_logs
        ;;
    4)
        show_stats
        ;;
    5)
        echo "" > "$LOG_FILE"
        echo -e "${GREEN}✅ Logs limpos${NC}"
        ;;
    6)
        echo -e "${BLUE}⚙️  CONFIGURAÇÕES ATUAIS:${NC}"
        echo "CPU_MAX: ${MAX_CPU_PERCENT}%"
        echo "MEM_MAX: ${MAX_MEMORY_PERCENT}%"
        echo "CHECK_INTERVAL: ${CHECK_INTERVAL}s"
        echo "MAX_RESTARTS_PER_HOUR: ${MAX_RESTARTS_PER_HOUR}"
        echo ""
        echo "Para alterar, edite as variáveis no início do script"
        ;;
    *)
        echo -e "${RED}Opção inválida!${NC}"
        exit 1
        ;;
esac

echo -e "\n${GREEN}✅ Operação concluída!${NC}" 