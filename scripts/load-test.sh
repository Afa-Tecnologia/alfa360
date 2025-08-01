#!/bin/bash

echo "🧪 TESTE DE CARGA - ALFA360 API"
echo "================================"

# Configurações do teste
BASE_URL="https://alfa360.alfatecnologia.tech/api"
CONCURRENT_USERS=10
REQUESTS_PER_USER=50
TOTAL_REQUESTS=$((CONCURRENT_USERS * REQUESTS_PER_USER))

# Configurações de autenticação
EMAIL="admin@alfa360.com"
PASSWORD="admin123"
TOKEN=""

# Função para obter token
get_token() {
    echo "🔐 Obtendo token de autenticação..."
    
    response=$(curl -s -w "%{http_code}" \
        -X POST "$BASE_URL/login" \
        -H "Content-Type: application/json" \
        -H "Accept: application/json" \
        -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
    
    http_code=$(echo "$response" | tail -1)
    response_body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" = "200" ]; then
        TOKEN=$(echo "$response_body" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
        echo "✅ Token obtido: ${TOKEN:0:20}..."
    else
        echo "❌ Erro ao obter token. HTTP: $http_code"
        echo "Response: $response_body"
        exit 1
    fi
}

# Função para fazer request e medir tempo
make_request() {
    local endpoint=$1
    local start_time=$(date +%s.%N)
    
    response=$(curl -s -w "%{http_code}|%{time_total}|%{time_connect}|%{time_starttransfer}" \
        -o /dev/null \
        "$BASE_URL$endpoint" \
        -H "Content-Type: application/json" \
        -H "Accept: application/json" \
        -H "Authorization: Bearer $TOKEN")
    
    local end_time=$(date +%s.%N)
    local duration=$(echo "$end_time - $start_time" | bc)
    
    echo "$response|$duration"
}

# Função para testar endpoint específico
test_endpoint() {
    local endpoint=$1
    local test_name=$2
    
    echo ""
    echo "🎯 Testando: $test_name ($endpoint)"
    echo "📊 Configuração: $CONCURRENT_USERS usuários, $REQUESTS_PER_USER requests cada"
    echo "📈 Total: $TOTAL_REQUESTS requests"
    echo "⏱️ Iniciando em: $(date)"
    
    # Array para armazenar resultados
    declare -a response_times
    declare -a http_codes
    local success_count=0
    local error_count=0
    local total_time=0
    
    # Executar requests
    for ((i=1; i<=TOTAL_REQUESTS; i++)); do
        result=$(make_request "$endpoint")
        
        # Parse resultado
        http_code=$(echo "$result" | cut -d'|' -f1)
        time_total=$(echo "$result" | cut -d'|' -f2)
        time_connect=$(echo "$result" | cut -d'|' -f3)
        time_starttransfer=$(echo "$result" | cut -d'|' -f4)
        duration=$(echo "$result" | cut -d'|' -f5)
        
        # Armazenar resultados
        response_times+=("$time_total")
        http_codes+=("$http_code")
        total_time=$(echo "$total_time + $time_total" | bc)
        
        # Contar sucessos/erros
        if [ "$http_code" = "200" ]; then
            ((success_count++))
        else
            ((error_count++))
        fi
        
        # Progresso
        if ((i % 10 == 0)); then
            echo "📊 Progresso: $i/$TOTAL_REQUESTS (${success_count} sucessos, ${error_count} erros)"
        fi
    done
    
    # Calcular estatísticas
    echo ""
    echo "📊 RESULTADOS - $test_name"
    echo "========================"
    echo "✅ Sucessos: $success_count"
    echo "❌ Erros: $error_count"
    echo "📈 Taxa de Sucesso: $(echo "scale=2; $success_count * 100 / $TOTAL_REQUESTS" | bc)%"
    
    # Calcular tempos médios
    avg_time=$(echo "scale=3; $total_time / $TOTAL_REQUESTS" | bc)
    echo "⏱️ Tempo Médio: ${avg_time}s"
    
    # Encontrar min/max
    min_time=$(printf '%s\n' "${response_times[@]}" | sort -n | head -1)
    max_time=$(printf '%s\n' "${response_times[@]}" | sort -n | tail -1)
    echo "⚡ Tempo Mínimo: ${min_time}s"
    echo "🐌 Tempo Máximo: ${max_time}s"
    
    # Percentis
    sorted_times=($(printf '%s\n' "${response_times[@]}" | sort -n))
    p50_idx=$((TOTAL_REQUESTS * 50 / 100))
    p95_idx=$((TOTAL_REQUESTS * 95 / 100))
    p99_idx=$((TOTAL_REQUESTS * 99 / 100))
    
    p50_time=${sorted_times[$p50_idx]}
    p95_time=${sorted_times[$p95_idx]}
    p99_time=${sorted_times[$p99_idx]}
    
    echo "📊 P50: ${p50_time}s"
    echo "📊 P95: ${p95_time}s"
    echo "📊 P99: ${p99_time}s"
    
    echo "⏱️ Finalizado em: $(date)"
    echo ""
}

# Função para monitorar recursos durante teste
monitor_resources() {
    echo "📊 MONITORAMENTO DE RECURSOS"
    echo "============================"
    
    # CPU e Memory antes
    echo "🔍 Antes do teste:"
    docker stats --no-stream
    
    # Monitorar durante teste
    echo ""
    echo "📈 Durante teste (a cada 10s):"
    for i in {1..6}; do
        echo "⏰ $(date '+%H:%M:%S'):"
        docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"
        sleep 10
    done
    
    # CPU e Memory depois
    echo ""
    echo "🔍 Depois do teste:"
    docker stats --no-stream
}

# Função principal
main() {
    echo "🚀 Iniciando teste de carga..."
    echo "📋 Configuração:"
    echo "   - URL Base: $BASE_URL"
    echo "   - Usuários Concorrentes: $CONCURRENT_USERS"
    echo "   - Requests por Usuário: $REQUESTS_PER_USER"
    echo "   - Total de Requests: $TOTAL_REQUESTS"
    echo ""
    
    # Obter token de autenticação
    get_token
    
    # Verificar se a API está acessível
    echo "🔍 Verificando conectividade..."
    if curl -s -o /dev/null -w "%{http_code}" \
        -H "Authorization: Bearer $TOKEN" \
        "$BASE_URL/produtos" | grep -q "200"; then
        echo "✅ API acessível"
    else
        echo "❌ API não acessível"
        exit 1
    fi
    
    # Monitorar recursos em background
    monitor_resources &
    MONITOR_PID=$!
    
    # Aguardar um pouco
    sleep 5
    
    # Teste 1: Lista de produtos
    test_endpoint "/produtos" "Lista de Produtos"
    
    # Teste 2: Produto específico
    test_endpoint "/produtos/1" "Produto Específico"
    
    # Teste 3: Categorias
    test_endpoint "/categorias" "Lista de Categorias"
    
    # Teste 4: Clientes
    test_endpoint "/clientes" "Lista de Clientes"
    
    # Aguardar monitoramento terminar
    wait $MONITOR_PID
    
    echo "✅ Teste de carga concluído!"
    echo "📊 Verificar logs: docker logs backend --tail 50"
}

# Executar teste
main 