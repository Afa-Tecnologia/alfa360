#!/bin/bash

echo "🔐 CONFIGURAÇÃO DE CREDENCIAIS PARA TESTE"
echo "========================================="

# Verificar se arquivo de credenciais existe
CREDS_FILE="/srv/alfa360/scripts/test-credentials.env"

if [ -f "$CREDS_FILE" ]; then
    echo "📄 Arquivo de credenciais encontrado"
    source "$CREDS_FILE"
    echo "✅ Credenciais carregadas"
else
    echo "❌ Arquivo de credenciais não encontrado"
    echo "📝 Criando arquivo de credenciais..."
    
    # Solicitar credenciais
    echo "Por favor, informe as credenciais para teste:"
    read -p "Email: " TEST_EMAIL
    read -s -p "Senha: " TEST_PASSWORD
    echo ""
    
    # Salvar credenciais
    cat > "$CREDS_FILE" << EOF
# Credenciais para teste de carga
TEST_EMAIL="$TEST_EMAIL"
TEST_PASSWORD="$TEST_PASSWORD"
EOF
    
    echo "✅ Credenciais salvas em $CREDS_FILE"
    source "$CREDS_FILE"
fi

echo ""
echo "📋 Credenciais configuradas:"
echo "   Email: $TEST_EMAIL"
echo "   Senha: ${TEST_PASSWORD:0:3}***"

echo ""
echo "🔧 Atualizando scripts com credenciais..."

# Atualizar scripts com as credenciais
sed -i "s/EMAIL=\"admin@alfa360.com\"/EMAIL=\"$TEST_EMAIL\"/g" /srv/alfa360/scripts/quick-test.sh
sed -i "s/PASSWORD=\"admin123\"/PASSWORD=\"$TEST_PASSWORD\"/g" /srv/alfa360/scripts/quick-test.sh

sed -i "s/EMAIL=\"admin@alfa360.com\"/EMAIL=\"$TEST_EMAIL\"/g" /srv/alfa360/scripts/load-test.sh
sed -i "s/PASSWORD=\"admin123\"/PASSWORD=\"$TEST_PASSWORD\"/g" /srv/alfa360/scripts/load-test.sh

echo "✅ Scripts atualizados com credenciais"
echo ""
echo "🧪 Agora você pode executar os testes:"
echo "   sudo /srv/alfa360/scripts/quick-test.sh"
echo "   sudo /srv/alfa360/scripts/load-test.sh" 