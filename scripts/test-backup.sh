#!/bin/bash

echo "🧪 Teste de Backup e Variáveis"
echo "=============================="

# 1. Verificar se estamos no diretório correto
echo "📁 Diretório atual: $(pwd)"
echo "📄 Arquivo .env existe: $([ -f ".env" ] && echo "SIM" || echo "NÃO")"

# 2. Carregar variáveis do .env
if [ -f ".env" ]; then
    echo "📋 Carregando variáveis do .env..."
    export $(cat .env | grep -v '^#' | xargs)
    echo "✅ Variáveis carregadas"
else
    echo "❌ Arquivo .env não encontrado"
    exit 1
fi

# 3. Verificar variáveis MySQL
echo "🔍 Verificando variáveis MySQL:"
echo "MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD:0:5}***"
echo "DB_PASSWORD: ${DB_PASSWORD:0:5}***"
echo "MYSQL_DATABASE: $MYSQL_DATABASE"

# 4. Verificar containers
echo "🐳 Verificando containers:"
docker ps --format "table {{.Names}}\t{{.Status}}"

# 5. Testar conexão MySQL
echo "🗄️ Testando conexão MySQL:"
if docker exec mysql mysql -u root -p"$MYSQL_ROOT_PASSWORD" -e "SELECT 1;" > /dev/null 2>&1; then
    echo "✅ Conexão MySQL OK"
else
    echo "❌ Erro na conexão MySQL"
    exit 1
fi

# 6. Testar backup
echo "💾 Testando backup..."
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="/backups/test-backup-$DATE.sql"

docker exec mysql mysqldump -u root -p"$MYSQL_ROOT_PASSWORD" pdvalfa360 > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Backup teste criado: $BACKUP_FILE"
    echo "📊 Tamanho: $(du -h "$BACKUP_FILE" | cut -f1)"
    # Remover arquivo de teste
    rm "$BACKUP_FILE"
    echo "🗑️ Arquivo de teste removido"
else
    echo "❌ Erro ao criar backup teste"
    exit 1
fi

echo "✅ Teste concluído com sucesso!" 