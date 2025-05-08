<?php

namespace App\Services\Pedidos;

use App\Exceptions\CaixaFechadoException;
use App\Models\Pedido;
use App\Models\PedidosProduto;
use App\Models\Produto;
use App\Models\Commission;
use App\Services\Caixa\CaixaService;
use App\Services\Caixa\MovimentacaoCaixaService;
use App\Services\EstoqueService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PedidoService
{
    protected $caixaService;
    protected $movimentacaoCaixaService;
    protected $estoqueService;
    protected $comissionsService;

    public function __construct(CaixaService $caixaService, MovimentacaoCaixaService $movimentacaoCaixaService, EstoqueService $estoqueService)
    {
        $this->caixaService = $caixaService;
        $this->movimentacaoCaixaService = $movimentacaoCaixaService;
        $this->estoqueService = $estoqueService;
    }

    public function create(array $data)
    {
        DB::beginTransaction();
        try {
            //Precisa verificar se tem algum caixa aberto
            $caixa = $this->caixaService->statusCaixa();
            if (!$caixa) {
                throw new CaixaFechadoException();
            }
            
            // Criando o pedido com dados iniciais
            $pedido = Pedido::create([
                'cliente_id' => $data['cliente_id'],
                'type' => $data['type'],
                'total' => 0,
                'desconto' => $data['desconto'] ?? 0,
                'status' => $data['status'] ?? 'PENDING',
            ]);

            $total = $this->processarProdutosNoPedido($pedido, $data['produtos']);

            // Aplicar desconto se houver
            $total = $this->aplicarDesconto($total, $data['desconto'] ?? 0);
            $pedido->update(['total' => $total]);
            
            DB::commit();
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
            $vendedor = $produtoData['vendedor_id'];
            // Criar relação com pedidos_produtos
            PedidosProduto::create([
                'pedido_id' => $pedido->id,
                'produto_id' => $produto->id,
                'vendedor_id'=> $vendedor,
                'quantidade' => $quantidade,
                'preco_unitario' => $precoUnitario,
            ]);

            // Criar comissão
            $comissaoValor = $precoUnitario * 0.05 * $quantidade;
            Commission::create([
                'pedido_id' => $pedido->id,
                'vendedor_id' => $vendedor,
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
    
        foreach ($produtos as $produtoData) {
            $produto = Produto::find($produtoData['produto_id']);
            if (!$produto) {
                continue; // Ignorar caso o produto não exista
            }
    
            $quantidade = $produtoData['quantidade'];
            $precoUnitario = $produto->selling_price;
            
            // Certifique-se de que vendedor_id está sendo passado
            $vendedorId = $produtoData['vendedor_id'] ?? null;
            
            // Criar relação com pedidos_produtos
            PedidosProduto::create([
                'pedido_id' => $pedido->id,
                'produto_id' => $produto->id,
                'vendedor_id' => $vendedorId, // Adicione o vendedor_id aqui
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
        return Pedido::with(['produtos','pagamentos', 'cliente' => function($query) {
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
