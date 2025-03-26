<?php
namespace App\Services\Pedidos;

use App\Models\Variantes;
use App\Services\EstoqueService;

class EstoqueHelper
{
    protected $estoqueService;
    
    public function __construct(EstoqueService $estoqueService)
    {
        $this->estoqueService = $estoqueService;
    }
    
    /**
     * Verifica a disponibilidade de estoque para os produtos
     * 
     * @param array $produtos
     * @return bool
     */
    public function verificarEstoqueProdutos(array $produtos)
    {
        $itensEstoque = $this->extrairItensEstoque($produtos);
        
        if (empty($itensEstoque)) {
            return true;
        }
        
        return $this->estoqueService->verificarDisponibilidadeEstoque($itensEstoque);
    }
    
    /**
     * Extrai os itens de estoque de uma lista de produtos
     * 
     * @param array $produtos
     * @return array
     */
    public function extrairItensEstoque(array $produtos)
    {
        $itensEstoque = [];
        foreach ($produtos as $item) {
            if (isset($item['variante_id'])) {
                // Verifica se existe quantidade ou quantity no item
                $quantidade = $item['quantidade'] ?? $item['quantity'] ?? null;
                
                if ($quantidade !== null) {
                    $itensEstoque[] = [
                        'variante_id' => $item['variante_id'],
                        'quantity' => $quantidade
                    ];
                }
            }
        }
        return $itensEstoque;
    }
    
    /**
     * Prepara itens para estorno de estoque baseado nos produtos de um pedido
     * 
     * @param array $produtos
     * @return array
     */
    public function prepararItensParaEstorno($produtos)
    {
        $itensEstornar = [];
        foreach ($produtos as $produtoAtual) {
            $pivotData = $produtoAtual->pivot;
            
            // Procurar variante associada ao produto
            $variante = Variantes::where('produto_id', $produtoAtual->id)->first();
            if ($variante) {
                $itensEstornar[] = [
                    'variante_id' => $variante->id,
                    'quantity' => $pivotData->quantity
                ];
            }
        }
        return $itensEstornar;
    }
    
    /**
     * Estorna o estoque dos itens
     * 
     * @param array $itens
     * @return void
     */
    public function estornarEstoqueItens(array $itens)
    {
        if (!empty($itens)) {
            $this->estoqueService->estornarEstoque($itens);
        }
    }
} 