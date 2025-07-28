# 🚀 Guia de Deploy e Otimização

## 📋 Checklist de Deploy

### 1. Configurações Críticas (.env)

```env
# Cache e Session - MUDAR IMEDIATAMENTE
CACHE_STORE=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

# Redis
REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379

# Database
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
```

### 2. Comandos de Otimização

```bash
# Entrar no container do backend
docker exec -it backend bash

# Executar script de otimização
chmod +x optimize-production.sh
./optimize-production.sh

# Ou executar manualmente:
php artisan config:cache
php artisan route:cache
php artisan view:cache
composer install --optimize-autoloader --no-dev
```

### 3. Verificar Performance

```bash
# Ver logs de performance
docker logs backend | grep "Produto"

# Verificar uso de recursos
docker stats

# Verificar Redis
docker exec -it redis redis-cli ping
```

## 🔧 Otimizações Implementadas

### ✅ Infraestrutura

- [x] Redis adicionado para cache/session/queue
- [x] PHP otimizado (OPcache, memory_limit, etc.)
- [x] MySQL otimizado (buffer pool, query cache, etc.)
- [x] Recursos Docker ajustados para VPS

### ✅ Código

- [x] Operações em lote no ProdutoService
- [x] Queries otimizadas no EstoqueService
- [x] Logs de performance adicionados
- [x] Transações otimizadas

### ✅ Configurações

- [x] Cache driver: database → redis
- [x] Session driver: database → redis
- [x] Queue driver: sync → redis
- [x] OPcache habilitado e otimizado
- [x] Índices de performance adicionados ao banco de dados

## 📊 Resultados Esperados

- **Operações de produto:** 2-5 segundos (vs 10+ segundos)
- **Melhor responsividade** em conexões lentas
- **Menor uso de CPU/RAM**
- **Maior estabilidade** do sistema

## 🚨 Troubleshooting

### Se Redis não conectar:

```bash
# Verificar se Redis está rodando
docker ps | grep redis

# Verificar logs do Redis
docker logs redis

# Testar conexão
docker exec -it backend php artisan tinker
>>> Redis::ping()
```

### Se performance ainda estiver lenta:

```bash
# Verificar logs de performance
docker logs backend | grep "duration"

# Verificar queries lentas
docker exec -it mysql mysql -u root -p
mysql> SHOW PROCESSLIST;
mysql> SHOW STATUS LIKE 'Slow_queries';
```

## 🗄️ Índices de Performance Adicionados

### Principais Índices Implementados:

#### **Tabela `produtos`:**

- `name`, `code`, `brand` - Para buscas por texto
- `categoria_id` - Para filtros por categoria
- `selling_price` - Para ordenação por preço
- `quantity` - Para queries de estoque
- `tenant_id` - Para multitenancy
- Compostos: `produtos_search_index`, `produtos_categoria_active`

#### **Tabela `variantes`:**

- `name`, `code` - Para buscas por texto
- `produto_id` - Para relacionamentos
- `quantity`, `active` - Para queries de estoque
- `tenant_id` - Para multitenancy
- Compostos: `variantes_produto_active`, `variantes_search_index`

#### **Tabela `pedidos`:**

- `status`, `type` - Para filtros
- `cliente_id` - Para relacionamentos
- `total`, `created_at` - Para relatórios
- `tenant_id` - Para multitenancy
- Compostos: `pedidos_status_date`, `pedidos_type_date`

#### **Outras Tabelas:**

- `clientes`: Índices para busca por nome, email, CPF
- `categorias`: Índices para filtros ativos
- `commissions`: Índices para relatórios de comissão
- `users`: Índices para autenticação
- `atributos`: Índices para filtros

### **Impacto Esperado:**

- **Queries de busca:** 70-90% mais rápidas
- **Filtros por categoria:** 80-95% mais rápidos
- **Relatórios:** 60-80% mais rápidos
- **Operações de estoque:** 50-70% mais rápidas

## 📈 Monitoramento

### Logs de Performance

Os logs agora incluem:

- Tempo de execução das operações
- Timestamps precisos
- Identificação de gargalos

### Métricas Importantes

- Tempo de resposta das APIs
- Uso de CPU/RAM dos containers
- Número de queries por operação
- Cache hit/miss ratio
- Performance dos índices (EXPLAIN queries)

## 🔄 Próximos Passos

1. **Implementar monitoramento** (APM como NewRelic/Sentry)
2. **Implementar cache** para queries frequentes
3. **Configurar backups** automáticos
4. **Implementar CI/CD** para deploys automáticos
5. **Otimizar queries** com base nos logs de performance
