-- Script para verificar performance dos índices
-- Execute no MySQL para analisar a performance das queries

-- 1. Verificar índices existentes
SHOW INDEX FROM produtos;
SHOW INDEX FROM variantes;
SHOW INDEX FROM pedidos;
SHOW INDEX FROM clientes;

-- 2. Analisar queries lentas
SHOW PROCESSLIST;

-- 3. Verificar estatísticas de queries lentas
SHOW STATUS LIKE 'Slow_queries';
SHOW STATUS LIKE 'Questions';
SHOW STATUS LIKE 'Uptime';

-- 4. Testar performance de queries específicas (EXPLAIN)
EXPLAIN SELECT * FROM produtos WHERE name LIKE '%teste%' OR code LIKE '%teste%' OR brand LIKE '%teste%';

EXPLAIN SELECT * FROM produtos WHERE categoria_id = 1 AND active = 1;

EXPLAIN SELECT p.*, v.name as variant_name 
FROM produtos p 
LEFT JOIN variantes v ON p.id = v.produto_id 
WHERE v.active = 1;

EXPLAIN SELECT * FROM pedidos WHERE status = 'PENDING' AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY);

-- 5. Verificar uso de índices
SELECT 
    TABLE_NAME,
    INDEX_NAME,
    CARDINALITY,
    SUB_PART,
    PACKED,
    NULLABLE,
    INDEX_TYPE
FROM information_schema.STATISTICS 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME IN ('produtos', 'variantes', 'pedidos', 'clientes')
ORDER BY TABLE_NAME, INDEX_NAME;

-- 6. Verificar fragmentação de tabelas
SELECT 
    TABLE_NAME,
    TABLE_ROWS,
    DATA_LENGTH,
    INDEX_LENGTH,
    (DATA_LENGTH + INDEX_LENGTH) as TOTAL_SIZE
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME IN ('produtos', 'variantes', 'pedidos', 'clientes');

-- 7. Otimizar tabelas (execute se necessário)
-- OPTIMIZE TABLE produtos;
-- OPTIMIZE TABLE variantes;
-- OPTIMIZE TABLE pedidos;
-- OPTIMIZE TABLE clientes;

-- 8. Verificar configurações do MySQL
SHOW VARIABLES LIKE 'innodb_buffer_pool_size';
SHOW VARIABLES LIKE 'query_cache_size';
SHOW VARIABLES LIKE 'slow_query_log';
SHOW VARIABLES LIKE 'long_query_time'; 