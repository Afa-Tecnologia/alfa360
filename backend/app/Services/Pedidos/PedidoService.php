<?php

namespace App\Services\Pedidos;

use App\Models\Pedido;
use App\Models\PedidosProduto;
use App\Models\Produto;
use App\Models\Commission;
use App\Services\Caixa\CaixaService;
use App\Services\EstoqueService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PedidoService
{
    protected $caixaService;
    protected $estoqueService;
    protected $comissionsService;

    public function __construct(CaixaService $caixaService, EstoqueService $estoqueService)
    {
        $this->caixaService = $caixaService;
        $this->estoqueService = $estoqueService;
    }

    public function create(array $data)
    {
        DB::beginTransaction();
        try {
            Log::info('Iniciando criação de pedido', ['data' => $data]);
            
            // Criando o pedido com dados iniciais
            $pedido = Pedido::create([
                'vendedor_id' => $data['vendedor_id'],
                'cliente_id' => $data['cliente_id'],
                'type' => $data['type'],
                'payment_method' => $data['payment_method'],
                'total' => 0,
                'desconto' => $data['desconto'] ?? 0,
                'status' => 'pago' // Adicionando status padrão
            ]);
            
            Log::info('Pedido base criado', ['pedido_id' => $pedido->id]);

            // Processa os produtos e calcula o total
            $total = $this->processarProdutosNoPedido($pedido, $data['produtos']);
            
            Log::info('Produtos processados', ['total' => $total]);

            // Aplicar desconto se houver
            $total = $this->aplicarDesconto($total, $data['desconto'] ?? 0);
            $pedido->update(['total' => $total]);
            
            Log::info('Total com desconto calculado', ['total_final' => $total]);

            // Verifico se o caixa está aberto
            $caixa = $this->caixaService->statusCaixa();
            
            if ($caixa) {
                Log::info('Caixa encontrado, criando movimentação', ['caixa_id' => $caixa->id]);
                $movimentacao = $this->caixaService->createMovimentacaoFromPedido($caixa, $pedido);
                Log::info('Movimentação criada com sucesso', ['movimentacao_id' => $movimentacao->id]);
            } else {
                Log::warning('Nenhum caixa aberto encontrado');
                // Não lançamos exceção para permitir criar pedidos mesmo sem caixa aberto
            }
            
            DB::commit();
            
            Log::info('Pedido criado com sucesso', ['pedido_id' => $pedido->id]);
            return $pedido;

        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Erro ao criar pedido', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw new \Exception("Erro ao criar pedido: " . $e->getMessage());
        }
    }

    private function processarProdutosEPedidos(Pedido $pedido, array $produtos, int $vendedorId)
    {
        $total = 0;

        foreach ($produtos as $produtoData) {
            $produto = Produto::find($produtoData['id']);
            if (!$produto) {
                continue; // Ignorar caso o produto não exista
            }

            $quantidade = $produtoData['quantity'];
            $precoUnitario = $produto->selling_price;

            // Criar relação com pedidos_produtos
            PedidosProduto::create([
                'pedido_id' => $pedido->id,
                'produto_id' => $produto->id,
                'quantidade' => $quantidade,
                'preco_unitario' => $precoUnitario,
            ]);

            // Criar comissão
            $comissaoValor = $precoUnitario * 0.05 * $quantidade;
            Commission::create([
                'pedido_id' => $pedido->id,
                'vendedor_id' => $vendedorId,
                'produto_id' => $produto->id,
                'valor' => round($comissaoValor, 2),
                'quantity' => $quantidade,
                'percentual' => 5,
            ]);

            $total += $precoUnitario * $quantidade;
        }

        return $total;
    }

    public function aplicarDesconto(float $total, float $desconto)
    {
        if ($desconto > 0) {
            $total -= $total * ($desconto / 100);
        }
        return round($total, 2);
    }

    public function processarProdutosNoPedido(Pedido $pedido, array $produtos)
    {
        $total = 0;
        
        foreach ($produtos as $item) {
            // Verifica se o produto existe
            $produto = Produto::findOrFail($item['produto_id']);
            
            // Verifica se existe quantidade ou quantity no item
            $quantidade = $item['quantidade'] ?? $item['quantity'] ?? 0;
            
            $subtotal = $produto->selling_price * $quantidade;
            
            // Associa o produto ao pedido
            $pedido->produtos()->attach($produto->id, [
                'quantidade' => $quantidade,
                'preco_unitario' => $produto->selling_price,
            ]);
            
            $total += $subtotal;
            
            // Reduz o estoque da variante se houver variante_id
            if (isset($item['variante_id']) && $item['variante_id']) {
                try {
                    $this->estoqueService->reduzirEstoqueVariante(
                        $item['variante_id'], 
                        $quantidade
                    );
                    $this->estoqueService->reduzirEstoqueProduto(
                        $item['produto_id'], 
                        $quantidade
                    );
                } catch (\Exception $e) {
                    Log::error("Erro ao reduzir estoque da variante {$item['variante_id']}: " . $e->getMessage());
                    // Não interrompemos o processamento, apenas logamos o erro
                }
            }
        }
        
        return $total;
    }
    
    public function processarAtualizacaoDeProdutos(Pedido $pedido, array $produtos)
    {
        // Remover todos os produtos antigos
        $pedido->produtos()->detach();
        
        return $this->processarProdutosNoPedido($pedido, $produtos);
    }
    
    public function verificarDisponibilidadeEstoqueProdutos(array $produtos)
    {
        $itensEstoque = [];
        Log::info('Verificando disponibilidade de estoque para produtos', ['count' => count($produtos)]);
        
        foreach ($produtos as $item) {
            // Verificar estoque somente para itens com variante_id
            if (isset($item['variante_id']) && !empty($item['variante_id'])) {
                // Verifica se existe quantidade ou quantity no item
                $quantidade = $item['quantidade'] ?? $item['quantity'] ?? null;
                
                if ($quantidade !== null) {
                    $itensEstoque[] = [
                        'variante_id' => $item['variante_id'],
                        'quantity' => $quantidade
                    ];
                }
            } else {
                Log::info('Item sem variante_id, ignorando verificação de estoque', ['item' => $item]);
            }
        }
        
        // Se não houver itens com variante_id, não é necessário verificar estoque
        if (empty($itensEstoque)) {
            Log::info('Nenhum item com variante_id encontrado, retornando true');
            return true;
        }
        
        Log::info('Verificando disponibilidade para itens', ['itensEstoque' => $itensEstoque]);
        
        // Verifica disponibilidade apenas para os itens que têm variante_id
        return $this->estoqueService->verificarDisponibilidadeEstoque($itensEstoque);
    }

    public function getAll()
    {
        return Pedido::with(['produtos', 'cliente' => function($query) {
            $query->select('id', 'name', 'last_name');
        }])->get();
    }

    public function getById($id)
    {
        return Pedido::with(['vendedor', 'categoria', 'produtos'])->findOrFail($id);
    }

    public function getProdutoPorCategoria($id)
    {
        return Pedido::where('categoria_id', '=', $id)->get();
    }

    public function getPedidosPorTipo($tipo)
    {
        return Pedido::where('type', '=', $tipo)->get();
    }

    public function update($id, $data)
    {
        $pedido = Pedido::find($id);

        if (!$pedido) {
            return null;
        }

        DB::beginTransaction();
        try {
            $pedido->update($data);
            $this->processarProdutosEPedidos($pedido, $data['produtos'], $data['vendedor_id'] ?? 0);
            DB::commit();

            return $pedido;
        } catch (\Exception $e) {
            DB::rollback();
            throw new \Exception("Erro ao atualizar pedido: " . $e->getMessage());
        }
    }

    public function delete($id)
    {
        $pedido = Pedido::find($id);
        if ($pedido) {
            $pedido->produtos()->detach();
            $pedido->delete();
        }
        return $pedido;
    }
}
