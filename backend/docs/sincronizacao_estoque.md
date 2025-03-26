# Documentação: Sistema de Sincronização de Estoque

## 1. Introdução e Visão Geral

### 1.1 Problema resolvido

O sistema precisa manter o estoque de produtos sincronizado com o estoque de suas variantes. Cada produto pode ter múltiplas variantes (por exemplo, diferentes tamanhos, cores, etc.), e o estoque total do produto deve refletir a soma das quantidades disponíveis em suas variantes ativas.

### 1.2 Solução implementada

Criamos um sistema onde:

1. O estoque de variantes é o "fonte da verdade" para o estoque real
2. O estoque do produto principal é automaticamente atualizado sempre que houver alteração em suas variantes
3. Transações de venda reduzem o estoque das variantes e o produto é atualizado automaticamente
4. Cancelamentos de vendas estornam o estoque das variantes e o produto é atualizado automaticamente

## 2. Explicação sobre Observers no Laravel

### 2.1 O que são Observers?

**Observers** no Laravel são classes que permitem "observar" eventos específicos que ocorrem em modelos Eloquent. Eles fornecem uma maneira limpa e organizada de agrupar manipuladores de eventos para um determinado modelo.

Simplificando, um Observer fica "observando" determinados eventos que acontecem com um modelo (como criação, atualização, exclusão) e executa código quando esses eventos ocorrem, sem que você precise adicionar esse código em cada lugar que manipula o modelo.

### 2.2 Por que usar Observers?

**Benefícios dos Observers:**

1. **Separação de responsabilidades**: Mantém o código relacionado a eventos em um local centralizado
2. **Redução de duplicação**: Evita repetir o mesmo código em diferentes partes da aplicação
3. **Manutenção simplificada**: Facilita encontrar e modificar o comportamento relacionado a eventos
4. **Código mais limpo**: Evita sobrecarregar os controladores com lógica de negócios

### 2.3 Como funcionam os Observers no Laravel

O Laravel implementa o padrão de projeto **Observer** e o integra com o seu ORM Eloquent. Quando ocorrem eventos de ciclo de vida do modelo (como criação, atualização, exclusão), o Laravel automaticamente chama os métodos correspondentes no Observer registrado.

**Ciclo de funcionamento:**

1. Um modelo Eloquent passa por um evento (ex: save, update, delete)
2. O Laravel verifica se há um Observer registrado para esse modelo
3. Se existir, o método correspondente no Observer é chamado (created, updated, deleted, etc.)
4. O código dentro desse método é executado

### 2.4 Métodos disponíveis em um Observer

Os principais métodos que podem ser implementados em um Observer são:

-   `retrieved`: Quando um modelo existente é recuperado do banco de dados
-   `creating`: Antes de um novo modelo ser salvo pela primeira vez
-   `created`: Após um novo modelo ser salvo pela primeira vez
-   `updating`: Antes de um modelo existente ser salvo
-   `updated`: Após um modelo existente ser salvo
-   `saving`: Antes de um modelo ser salvo (tanto na criação quanto na atualização)
-   `saved`: Após um modelo ser salvo (tanto na criação quanto na atualização)
-   `deleting`: Antes de um modelo ser excluído
-   `deleted`: Após um modelo ser excluído
-   `restoring`: Antes de um modelo soft-deleted ser restaurado
-   `restored`: Após um modelo soft-deleted ser restaurado
-   `forceDeleted`: Quando um modelo soft-deleted é excluído permanentemente

## 3. Implementação da Solução

### 3.1 Componentes Principais

1. **VariantesObserver**: Observer responsável por recalcular o estoque do produto quando uma variante é modificada
2. **EstoqueService**: Serviço centralizado para operações de estoque
3. **EstoqueInsuficienteException**: Exceção personalizada para tratamento de erros de estoque
4. **SincronizarEstoque**: Comando Artisan para sincronização manual de estoque
5. **PedidosController**: Controller adaptado para usar o serviço de estoque

### 3.2 Detalhamento do VariantesObserver

```php
<?php
namespace App\Observers;

use App\Models\Variantes;
use App\Models\Produto;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class VariantesObserver
{
    /**
     * Handle the Variantes "created" event.
     */
    public function created(Variantes $variante): void
    {
        $this->atualizarEstoqueProduto($variante->produto_id);
    }

    /**
     * Handle the Variantes "updated" event.
     */
    public function updated(Variantes $variante): void
    {
        // Apenas se o quantity foi alterado
        if ($variante->isDirty('quantity')) {
            $this->atualizarEstoqueProduto($variante->produto_id);
        }
    }

    /**
     * Handle the Variantes "deleted" event.
     */
    public function deleted(Variantes $variante): void
    {
        $this->atualizarEstoqueProduto($variante->produto_id);
    }

    /**
     * Atualiza a quantidade total de estoque do produto baseado na soma
     * das quantidades de suas variantes ativas.
     */
    private function atualizarEstoqueProduto($produtoId): void
    {
        try {
            DB::transaction(function () use ($produtoId) {
                $totalQuantidade = Variantes::where('produto_id', $produtoId)
                    ->where('active', true)
                    ->sum('quantity');

                Produto::where('id', $produtoId)->update([
                    'quantity' => $totalQuantidade
                ]);
            });
        } catch (\Exception $e) {
            Log::error('Erro ao atualizar estoque do produto: ' . $e->getMessage());
        }
    }
}
```

#### Explicação detalhada:

1. **created(Variantes $variante)**: Chamado após a criação de uma nova variante

    - Recalcula o estoque total do produto associado

2. **updated(Variantes $variante)**: Chamado após a atualização de uma variante

    - Verifica se o campo `quantity` foi alterado usando `isDirty()`
    - Se foi alterado, recalcula o estoque do produto

3. **deleted(Variantes $variante)**: Chamado após a exclusão de uma variante

    - Recalcula o estoque do produto para refletir a remoção da variante

4. **atualizarEstoqueProduto($produtoId)**: Método privado auxiliar
    - Soma a quantidade de todas as variantes ativas do produto
    - Atualiza o campo `quantity` do produto com esse valor total
    - Usa transação de banco de dados para garantir consistência
    - Captura e registra qualquer erro no processo

### 3.3 Detalhamento do EstoqueService

```php
<?php
namespace App\Services;

use App\Exceptions\EstoqueInsuficienteException;
use App\Models\Variantes;
use App\Models\Produto;
use App\Models\Pedido;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EstoqueService
{
    /**
     * Reduz o estoque da variante ao processar um pedido
     */
    public function reduzirEstoqueVariante($varianteId, $quantidade)
    {
        DB::transaction(function () use ($varianteId, $quantidade) {
            // Bloqueio otimista usando o for update
            $variante = Variantes::where('id', $varianteId)
                ->lockForUpdate()
                ->first();

            if (!$variante) {
                throw new \Exception("Variante não encontrada");
            }

            if ($variante->quantity < $quantidade) {
                throw new EstoqueInsuficienteException(
                    "Estoque insuficiente para a variante {$variante->name}. Disponível: {$variante->quantity}, Solicitado: {$quantidade}"
                );
            }

            $variante->quantity -= $quantidade;
            $variante->save();
        });
    }

    /**
     * Processa a venda de produtos, atualizando o estoque das variantes
     */
    public function processarVenda(Pedido $pedido, array $itens)
    {
        DB::transaction(function () use ($pedido, $itens) {
            foreach ($itens as $item) {
                $this->reduzirEstoqueVariante($item['variante_id'], $item['quantidade']);
            }
        });
    }

    /**
     * Estorna o estoque em caso de cancelamento/devolução
     */
    public function estornarEstoque(array $itens)
    {
        DB::transaction(function () use ($itens) {
            foreach ($itens as $item) {
                try {
                    $variante = Variantes::findOrFail($item['variante_id']);
                    $variante->quantity += $item['quantidade'];
                    $variante->save();
                } catch (\Exception $e) {
                    Log::error('Erro ao estornar estoque: ' . $e->getMessage());
                }
            }
        });
    }

    /**
     * Verifica se há estoque suficiente para todas as variantes
     */
    public function verificarDisponibilidadeEstoque(array $itens): bool
    {
        foreach ($itens as $item) {
            $variante = Variantes::find($item['variante_id']);
            if (!$variante || $variante->quantity < $item['quantidade']) {
                return false;
            }
        }
        return true;
    }
}
```

#### Explicação detalhada:

1. **reduzirEstoqueVariante($varianteId, $quantidade)**:

    - Usa `lockForUpdate()` para evitar problemas de concorrência
    - Verifica se há estoque suficiente
    - Reduz o estoque da variante
    - Ao salvar, o Observer será acionado automaticamente para atualizar o produto

2. **processarVenda(Pedido $pedido, array $itens)**:

    - Processa vários itens em uma única transação
    - Chama `reduzirEstoqueVariante()` para cada item

3. **estornarEstoque(array $itens)**:

    - Aumenta o estoque das variantes em caso de cancelamento
    - Processa tudo em uma transação para garantir consistência

4. **verificarDisponibilidadeEstoque(array $itens)**:
    - Verifica se todas as variantes têm estoque suficiente
    - Retorna true/false para indicar disponibilidade

### 3.4 Uso do Observer no AppServiceProvider

```php
<?php
namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Carbon;
use App\Models\Variantes;
use App\Observers\VariantesObserver;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Carbon::setLocale(config('app.locale'));
        setlocale(LC_TIME, 'pt_BR.UTF-8');

        // Registra o observer para sincronização automática de estoque
        Variantes::observe(VariantesObserver::class);
    }
}
```

#### Explicação detalhada:

-   O método `boot()` do AppServiceProvider é chamado quando o aplicativo está inicializando
-   A linha `Variantes::observe(VariantesObserver::class)` registra o Observer para o modelo Variantes
-   Isso diz ao Laravel para chamar os métodos do VariantesObserver sempre que eventos ocorrerem no modelo Variantes

## 4. Fluxo de Funcionamento

### 4.1 Sincronização por Observer

1. Uma variante é criada, atualizada ou excluída
2. O Observer detecta o evento e recalcula o estoque total do produto
3. O produto é atualizado automaticamente

### 4.2 Fluxo de Venda

1. Cliente adiciona produtos ao carrinho
2. Sistema verifica disponibilidade de estoque via `verificarDisponibilidadeEstoque()`
3. Pedido é confirmado e o sistema inicia uma transação
4. Para cada item, o estoque da variante é reduzido via `reduzirEstoqueVariante()`
5. O Observer é acionado automaticamente e atualiza o estoque do produto principal
6. A transação é confirmada
7. O cliente recebe confirmação do pedido

### 4.3 Fluxo de Cancelamento

1. Pedido é cancelado ou modificado
2. Sistema inicia transação para estorno
3. Para cada item, o estoque da variante é aumentado via `estornarEstoque()`
4. O Observer é acionado automaticamente e atualiza o estoque do produto principal
5. A transação é confirmada

## 5. Diagrama de Sequência

```
[Cliente] -> [PedidoController]: Cria pedido
[PedidoController] -> [EstoqueService]: Verifica estoque
[EstoqueService] -> [PedidoController]: Confirma disponibilidade
[PedidoController] -> [BD]: Cria pedido (transação)
[PedidoController] -> [EstoqueService]: Reduz estoque
[EstoqueService] -> [Variante]: Atualiza quantidade
[Variante] -> [VariantesObserver]: Dispara evento updated
[VariantesObserver] -> [Produto]: Atualiza estoque total
[PedidoController] -> [Cliente]: Confirma pedido
```

## 6. Vantagens da Solução

1. **Separação de responsabilidades**: Cada componente tem um papel específico
2. **Manutenção simplificada**: Lógica de sincronização centralizada no Observer
3. **Consistência dos dados**: Transações garantem que os dados permanecerão consistentes
4. **Escalabilidade**: Fácil adicionar novos comportamentos sem alterar o código existente
5. **Prevenção de bugs**: Validações de estoque evitam vendas de produtos indisponíveis
6. **Automatização**: Sincronização ocorre automaticamente sem intervenção manual

## 7. Como Testar a Solução

### 7.1 Testes Manuais

1. **Criar/Atualizar Variante**:

    - Crie uma nova variante para um produto
    - Verifique se o estoque do produto foi atualizado
    - Altere a quantidade da variante
    - Verifique se o estoque do produto reflete a alteração

2. **Processar Venda**:

    - Crie um pedido com uma variante
    - Verifique se o estoque da variante foi reduzido
    - Verifique se o estoque do produto foi atualizado

3. **Cancelar Venda**:
    - Cancele um pedido existente
    - Verifique se o estoque da variante foi estornado
    - Verifique se o estoque do produto foi atualizado

### 7.2 Comando de Sincronização

Para garantir que todos os produtos estejam sincronizados:

```bash
php artisan estoque:sincronizar
```

Este comando recalcula o estoque de todos os produtos com base nas suas variantes.

## 8. Conclusão

A implementação do sistema de sincronização automática de estoque usando Observers no Laravel traz várias vantagens em termos de organização, manutenção e confiabilidade. Os Observers permitem centralizar a lógica de sincronização e garantir que ela seja aplicada consistentemente em toda a aplicação, independentemente de onde as alterações nas variantes sejam feitas.

Essa solução elimina a necessidade de código duplicado e reduz a possibilidade de erros humanos, garantindo que o estoque dos produtos esteja sempre correto e refletindo a quantidade real disponível nas variantes.
