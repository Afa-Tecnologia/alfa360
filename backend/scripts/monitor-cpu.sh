#!/bin/bash

echo "🔍 Monitorando CPU do container backend..."

# Verificar uso de CPU
CPU_USAGE=$(docker exec backend top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)

echo "📊 Uso atual de CPU: ${CPU_USAGE}%"

# Converter para número inteiro para comparação
CPU_INT=$(echo $CPU_USAGE | cut -d'.' -f1)

# Se CPU estiver alto, limpar processos
if [ "$CPU_INT" -gt 80 ]; then
    echo "⚠️ CPU alto detectado! Limpando processos..."
    
    # Matar processos PHP com alto uso de CPU
    docker exec backend pkill -f "php artisan" || true
    docker exec backend pkill -f "queue:work" || true
    
    # Reiniciar queue worker
    docker exec backend php artisan queue:work --daemon --tries=3 --timeout=300 --sleep=3 --max-time=3600 &
    
    echo "✅ Processos limpos e queue worker reiniciado"
else
    echo "✅ CPU está em níveis normais"
fi

# Verificar processos com alto uso de CPU
echo "🔍 Processos com alto uso de CPU:"
docker exec backend ps aux | grep php | awk '$3 > 10 {print $3 "% CPU - " $11}' || echo "Nenhum processo com alto uso de CPU"

# Verificar memória
echo "🔍 Uso de memória:"
docker exec backend free -h

# Verificar logs de erro
echo "🔍 Últimos erros:"
docker logs backend --tail=10 | grep -i error || echo "Nenhum erro encontrado"

echo "✅ Monitoramento concluído" 