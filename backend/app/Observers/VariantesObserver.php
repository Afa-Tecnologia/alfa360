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
        // Recalcula se quantity ou active foram alterados
        if ($variante->wasChanged('quantity') || $variante->wasChanged('active')) {
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