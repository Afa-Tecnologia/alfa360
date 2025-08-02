#!/bin/bash

echo "🧪 Testando container do backend..."

# Verificar se o container está rodando
if docker ps | grep -q backend; then
    echo "✅ Container backend está rodando"
else
    echo "❌ Container backend não está rodando"
    exit 1
fi

# Verificar logs do container
echo "📋 Últimos logs do container:"
docker logs backend --tail=20

# Verificar se o script de inicialização existe
echo "🔍 Verificando script de inicialização:"
docker exec backend ls -la /usr/local/bin/simple-start.sh

# Verificar se o PHP-FPM está rodando
echo "🔍 Verificando processos PHP:"
docker exec backend ps aux | grep php

# Verificar se o queue worker está rodando
echo "🔍 Verificando queue worker:"
docker exec backend ps aux | grep "queue:work"

echo "✅ Teste concluído!" 