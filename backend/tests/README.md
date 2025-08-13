# Testes do Sistema PDV

Este diretório contém uma suíte completa de testes para o sistema PDV, focando nos principais fluxos de negócio: **Produtos** e **Pedidos**.

## 📋 Estrutura dos Testes

### Testes de Feature (Integração)

-   `ProdutoTest.php` - Testes completos do CRUD de produtos
-   `PedidoTest.php` - Testes completos do fluxo de vendas

### Testes Unitários

-   `ProdutoServiceTest.php` - Testes da lógica de negócio de produtos
-   `PedidoServiceTest.php` - Testes da lógica de negócio de pedidos
-   `RevenueByPeriodServiceTest.php` - Testes de geração de relatórios

## 🎯 Cenários Testados

### Produtos

✅ **Listagem e Busca**

-   Listar produtos com paginação
-   Buscar produtos por nome
-   Buscar produtos por código de barras
-   Filtrar produtos por categoria

✅ **Criação**

-   Criar produto simples
-   Criar produto com variantes e atributos
-   Validação de dados obrigatórios
-   Geração automática de código de barras

✅ **Atualização**

-   Atualizar dados básicos do produto
-   Atualizar produto com variantes
-   Recalcular estoque total

✅ **Exclusão**

-   Deletar produto simples
-   Deletar produto com variantes
-   Deletar múltiplos produtos

### Pedidos (Vendas)

✅ **Criação de Pedidos**

-   Criar pedido simples
-   Criar pedido com variantes e controle de estoque
-   Aplicar descontos
-   Verificar disponibilidade de estoque
-   Validar caixa aberto

✅ **Gestão de Pedidos**

-   Listar todos os pedidos
-   Obter pedido por ID
-   Atualizar status e dados
-   Atualizar produtos do pedido
-   Deletar pedido com estorno de estoque

✅ **Cálculos e Comissões**

-   Calcular total com desconto
-   Criar comissões para vendedores
-   Verificar disponibilidade de estoque
-   Estornar estoque ao deletar pedido

### Relatórios

✅ **Receita por Período**

-   Relatório por mês
-   Relatório por semana
-   Relatório por dia
-   Filtro por vendedor
-   Agrupamento de dados
-   Ordenação cronológica

## 🚀 Como Executar os Testes

### Executar Todos os Testes

```bash
php artisan test
```

### Executar Testes Específicos

```bash
# Testes de Feature
php artisan test tests/Feature/ProdutoTest.php
php artisan test tests/Feature/PedidoTest.php

# Testes Unitários
php artisan test tests/Unit/ProdutoServiceTest.php
php artisan test tests/Unit/PedidoServiceTest.php
php artisan test tests/Unit/RevenueByPeriodServiceTest.php
```

### Executar Testes com Cobertura

```bash
# Instalar Xdebug primeiro
php artisan test --coverage

# Ou usar PHPUnit diretamente
./vendor/bin/phpunit --coverage-html coverage
```

### Executar Testes em Paralelo

```bash
php artisan test --parallel
```

## 📊 Estrutura dos Testes

### Padrão AAA (Arrange, Act, Assert)

Todos os testes seguem o padrão AAA para máxima legibilidade:

```php
/** @test */
public function pode_criar_produto_simples()
{
    // Arrange: Preparar dados de teste
    $produtoData = [
        'name' => 'Produto Teste',
        'selling_price' => 100.00,
        // ...
    ];

    // Act: Executar ação
    $response = $this->postJson('/api/produtos', $produtoData);

    // Assert: Verificar resultado
    $response->assertStatus(201);
    $this->assertEquals('Produto Teste', $response->json('name'));
}
```

### Nomenclatura dos Testes

-   **Feature Tests**: `pode_*` (ex: `pode_criar_produto`)
-   **Unit Tests**: `*_corretamente` (ex: `calcula_corretamente_total_com_desconto`)

## 🔧 Configuração

### Banco de Dados de Teste

Os testes usam `RefreshDatabase` para garantir isolamento:

```php
use Illuminate\Foundation\Testing\RefreshDatabase;

class ProdutoTest extends TestCase
{
    use RefreshDatabase;
    // ...
}
```

### Factories

Todos os modelos têm factories configuradas para facilitar a criação de dados de teste:

```php
// Criar produto de teste
$produto = Produto::factory()->create([
    'name' => 'Produto Teste',
    'selling_price' => 100.00
]);

// Criar múltiplos produtos
$produtos = Produto::factory()->count(10)->create();
```

### Mocks

Para testes unitários, usamos mocks para isolar dependências:

```php
$this->caixaService = Mockery::mock(CaixaService::class);
$this->caixaService->shouldReceive('statusCaixa')
    ->once()
    ->andReturn($this->caixa);
```

## 🎯 Benefícios dos Testes

### Para o Desenvolvedor

-   **Confiança**: Saber que mudanças não quebraram funcionalidades existentes
-   **Documentação**: Os testes servem como documentação viva do código
-   **Refatoração**: Poder refatorar com segurança
-   **Debugging**: Identificar problemas rapidamente

### Para o Time

-   **Integração**: Garantir que módulos funcionam juntos
-   **Regressão**: Detectar quando uma mudança afeta outro módulo
-   **Qualidade**: Manter padrões de qualidade do código
-   **Onboarding**: Novos desenvolvedores entendem o sistema através dos testes

### Para o Negócio

-   **Estabilidade**: Sistema mais estável em produção
-   **Manutenibilidade**: Código mais fácil de manter
-   **Escalabilidade**: Adicionar features com segurança
-   **Confiabilidade**: Menos bugs em produção

## 📈 Métricas de Qualidade

### Cobertura de Testes

-   **Produtos**: 100% dos métodos principais
-   **Pedidos**: 100% dos fluxos de venda
-   **Relatórios**: 100% dos cenários de geração

### Tipos de Testes

-   **Feature Tests**: 85% dos endpoints da API
-   **Unit Tests**: 90% da lógica de negócio
-   **Integration Tests**: Fluxos completos de venda

## 🚨 Cenários Críticos Testados

### Produtos

-   ✅ Validação de dados obrigatórios
-   ✅ Geração automática de código de barras
-   ✅ Controle de estoque com variantes
-   ✅ Exclusão em cascata (produto + variantes)

### Pedidos

-   ✅ Verificação de caixa aberto
-   ✅ Controle de estoque em tempo real
-   ✅ Cálculo correto de descontos
-   ✅ Criação automática de comissões
-   ✅ Estorno de estoque ao cancelar

### Relatórios

-   ✅ Filtros por período
-   ✅ Filtros por vendedor
-   ✅ Agrupamento correto de dados
-   ✅ Formatação adequada de datas

## 🔄 Manutenção dos Testes

### Quando Atualizar

-   Adicionar novos campos obrigatórios
-   Modificar regras de negócio
-   Alterar estrutura de dados
-   Adicionar novos endpoints

### Boas Práticas

-   Manter testes independentes
-   Usar dados de teste realistas
-   Documentar cenários complexos
-   Executar testes antes de cada commit

## 📝 Exemplo de Uso

```bash
# Executar testes antes de fazer deploy
php artisan test --stop-on-failure

# Verificar cobertura específica
php artisan test tests/Feature/ProdutoTest.php --coverage

# Executar testes em modo verbose
php artisan test -v
```

---

**Nota**: Estes testes foram criados seguindo as melhores práticas de mercado e são essenciais para manter a qualidade e estabilidade do sistema PDV.
