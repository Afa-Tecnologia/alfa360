<?php

namespace App\Services\Pedidos;

use App\Models\Pedido;
use App\Models\PedidosProduto;
use App\Models\Produto;
use App\Models\Commission;
use App\Services\Caixa\CaixaService;
use Illuminate\Support\Facades\DB;

class PedidoService
{
    protected $caixaService;

    public function __construct(CaixaService $caixaService)
    {
        $this->caixaService = $caixaService;
    }

    public function create(array $data)
    {
        DB::beginTransaction();
        try {
            // Criando o pedido com dados iniciais
            $pedido = Pedido::create([
                'vendedor_id' => $data['vendedor_id'],
                'cliente_id' => $data['cliente_id'],
                'categoria_id' => $data['categoria_id'],
                'type' => $data['type'],
                'total' => 0,
                'desconto' => $data['desconto'] ?? 0,
            ]);

            $total = $this->processarProdutosEPedidos($pedido, $data['produto_id'], $data['vendedor_id']);

            // Aplicar desconto se houver
            $total = $this->aplicarDesconto($total, $data['desconto'] ?? 0);

            $pedido->update(['total' => round($total, 2)]);


            //Verifico se o caixa está aberto
            $caixa = $this->caixaService->statusCaixa();

            if ($caixa) {
                $this->caixaService->createMovimentacaoFromPedido($caixa, $pedido);
            } else {
                throw new \Exception("Não há caixa aberto para registrar movimentação.");
            }

            DB::commit();

            return $pedido;

        } catch (\Exception $e) {
            DB::rollback();
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
                'quantity' => $quantidade,
                'selling_price' => $precoUnitario,
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

    private function aplicarDesconto(float $total, float $desconto)
    {
        if ($desconto > 0) {
            $total -= $total * ($desconto / 100);
        }
        return $total;
    }

    public function getAll()
    {
        return Pedido::with('produtos')->get();
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
