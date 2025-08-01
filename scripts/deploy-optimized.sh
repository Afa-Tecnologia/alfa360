#!/bin/bash

echo "🚀 Deploy Otimizado - Alfa360"
echo "=============================="

# 1. Backup antes do deploy
echo "💾 Criando backup..."
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="/backups/backup-pre-deploy-$DATE.sql"
docker exec alfa360-mysql mysqldump -u root -p"$MYSQL_ROOT_PASSWORD" pdvalfa360 > "$BACKUP_FILE"
echo "✅ Backup criado: $BACKUP_FILE"

# 2. Parar containers
echo "🛑 Parando containers..."
docker compose down

# 3. Rebuild com otimizações
echo "🔨 Rebuild dos containers..."
docker compose build --no-cache backend

# 4. Subir containers
echo "⬆️ Subindo containers..."
docker compose up -d

# 5. Aguardar estabilização
echo "⏳ Aguardando estabilização..."
sleep 30

# 6. Executar otimizações Laravel
echo "⚡ Executando otimizações Laravel..."
docker exec alfa360-backend php artisan config:cache
docker exec alfa360-backend php artisan route:cache
docker exec alfa360-backend php artisan view:cache
docker exec alfa360-backend php artisan optimize

# 7. Executar migrations
echo "🗄️ Executando migrations..."
docker exec alfa360-backend php artisan migrate --force

# 8. Limpar cache Redis
echo "🧹 Limpando cache Redis..."
docker exec alfa360-redis redis-cli FLUSHALL

# 9. Verificar saúde dos serviços
echo "🏥 Verificando saúde dos serviços..."
docker compose ps

# 10. Verificar performance
echo "📊 Verificando performance..."
docker stats --no-stream

# 11. Testar cache
echo "🧪 Testando cache Redis..."
docker exec alfa360-backend php artisan tinker --execute="echo 'Redis: ' . (Cache::store('redis')->get('test') ? 'OK' : 'FAIL');"

echo "✅ Deploy otimizado concluído!"
echo "📈 Monitoramento: docker stats"
echo "📋 Logs: docker logs alfa360-backend" 