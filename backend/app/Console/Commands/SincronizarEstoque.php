<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Produto;
use App\Models\Variantes;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SincronizarEstoque extends Command
{
    protected $signature = 'estoque:sincronizar';
    protected $description = 'Sincroniza o estoque de todos os produtos com base nas variantes';

    public function handle()
    {
        $this->info('Iniciando sincronização de estoque...');
        
        try {
            // Busca todos os produtos
            $produtos = Produto::all();
            $contador = 0;
            
            foreach ($produtos as $produto) {
                DB::transaction(function () use ($produto, &$contador) {
                    $totalQuantidade = Variantes::where('produto_id', $produto->id)
                        ->where('active', true)
                        ->sum('quantity');
                    
                    // Atualiza o estoque do produto
                    $produto->quantity = $totalQuantidade;
                    $produto->save();
                    
                    $contador++;
                });
            }
            
            $this->info("Estoque sincronizado com sucesso para {$contador} produtos.");
            return Command::SUCCESS;
            
        } catch (\Exception $e) {
            $this->error('Erro ao sincronizar estoque: ' . $e->getMessage());
            Log::error('Erro ao sincronizar estoque: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
} 