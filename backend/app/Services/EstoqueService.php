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
     * Verifica a disponibilidade de estoque para os itens informados
     *
     * @param array $itensEstoque Array de itens com variante_id e quantity
     * @return bool
     */
    public function verificarDisponibilidadeEstoque(array $itensEstoque)
    {
        Log::info('Verificando disponibilidade de estoque para: ', $itensEstoque);
        
        foreach ($itensEstoque as $item) {
            if (!isset($item['variante_id']) || !isset($item['quantity'])) {
                Log::error('Item com dados incompletos: ', $item);
                return false;
            }
            
            $variante = Variantes::find($item['variante_id']);
            
            if (!$variante) {
                Log::error('Variante não encontrada: ' . $item['variante_id']);
                return false;
            }
            
            if ($variante->quantity < $item['quantity']) {
                Log::error("Estoque insuficiente para variante {$variante->id}: disponível {$variante->quantity}, solicitado {$item['quantity']}");
                return false;
            }
        }
        
        Log::info('Estoque disponível para todos os itens');
        return true;
    }
    
    /**
     * Reduz o estoque de uma variante
     *
     * @param int $varianteId
     * @param int $quantidade
     * @return bool
     */
    public function reduzirEstoqueVariante($varianteId, $quantidade)
    {
        Log::info("Reduzindo estoque da variante {$varianteId} em {$quantidade} unidades");
        
        $variante = Variantes::find($varianteId);
        
        if (!$variante) {
            Log::error('Variante não encontrada: ' . $varianteId);
            throw new EstoqueInsuficienteException("Variante com ID {$varianteId} não encontrada");
        }
        
        if ($variante->quantity < $quantidade) {
            Log::error("Estoque insuficiente para variante {$variante->id}: disponível {$variante->quantity}, solicitado {$quantidade}");
            throw new EstoqueInsuficienteException("Estoque insuficiente para o produto {$variante->name}");
        }
        
        $variante->quantity -= $quantidade;
        $variante->save();
        Log::info("Estoque reduzido. Novo estoque: {$variante->quantity}");
        return true;
    }

    public function reduzirEstoqueProduto($produtoId, $quantidade)
    {
       $produto = Produto::find($produtoId);

       if ($produto->quantity < $quantidade) {
        Log::error("Estoque insuficiente para produto {$produto->id}: disponível {$produto->quantity}, solicitado {$quantidade}");
        throw new EstoqueInsuficienteException("Estoque insuficiente para o produto {$produto->name}");
    }
       $produto->quantity -= $quantidade;
       $produto->save();
       
       Log::info("Estoque reduzido. Novo estoque: {$produto->quantity}");
       return true;
    }
    
    /**
     * Estorna o estoque das variantes
     *
     * @param array $itensEstoque Array de itens com variante_id e quantity
     * @return bool
     */
    public function estornarEstoque(array $itensEstoque)
    {
        Log::info('Estornando estoque para: ', $itensEstoque);
        
        foreach ($itensEstoque as $item) {
            if (!isset($item['variante_id']) || !isset($item['quantity'])) {
                Log::error('Item com dados incompletos para estorno: ', $item);
                continue;
            }
            
            $variante = Variantes::find($item['variante_id']);
            
            if (!$variante) {
                Log::error('Variante não encontrada para estorno: ' . $item['variante_id']);
                continue;
            }
            
            $variante->quantity += $item['quantity'];
            $variante->save();
            
            Log::info("Estoque estornado para variante {$variante->id}. Novo estoque: {$variante->quantity}");
        }
        
        return true;
    }

    /**
     * Processa a venda de produtos, atualizando o estoque das variantes
     *
     * @param Pedido $pedido
     * @param array $itens Array com ['variante_id' => int, 'quantidade' => int]
     * @throws EstoqueInsuficienteException
     */
    public function processarVenda(Pedido $pedido, array $itens)
    {
        DB::transaction(function () use ($pedido, $itens) {
            foreach ($itens as $item) {
                $this->reduzirEstoqueVariante($item['variante_id'], $item['quantidade']);
            }
            
            // Adicional: Registrar a venda no histórico se necessário
            // $this->registrarHistoricoVenda($pedido, $itens);
        });
    }

    /**
     * Atualiza a quantidade total de estoque do produto baseado na soma
     * das quantidades de suas variantes ativas.
     */
    public function atualizarEstoqueProduto($produtoId): void
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