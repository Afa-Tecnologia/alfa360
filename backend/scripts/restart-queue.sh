#!/bin/bash

echo "🔄 Reiniciando Queue Worker..."

# Verificar se o queue worker está rodando
if docker exec backend ps aux | grep -q "queue:work"; then
    echo "🛑 Parando queue worker atual..."
    docker exec backend pkill -f "queue:work"
    sleep 2
fi

# Verificar se foi parado
if docker exec backend ps aux | grep -q "queue:work"; then
    echo "⚠️ Forçando parada do queue worker..."
    docker exec backend pkill -9 -f "queue:work"
    sleep 1
fi

# Iniciar novo queue worker
echo "🚀 Iniciando novo queue worker..."
docker exec backend php artisan queue:work --daemon --tries=3 --timeout=300 --sleep=3 --max-time=3600 &

# Aguardar inicialização
sleep 3

# Verificar se está rodando
if docker exec backend ps aux | grep -q "queue:work"; then
    echo "✅ Queue worker reiniciado com sucesso!"
    QUEUE_PID=$(docker exec backend pgrep -f "queue:work")
    echo "PID: $QUEUE_PID"
else
    echo "❌ Falha ao reiniciar queue worker"
    exit 1
fi

echo "✅ Processo concluído!" 