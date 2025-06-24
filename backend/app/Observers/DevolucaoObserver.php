<?php

namespace App\Observers;

use App\Models\Devolucao;
use App\Models\Pedido;
use App\Models\PedidosProduto;
use App\Produtos\Produto;
use App\Services\Devolucao\DevolucaoService;
use App\Services\EstoqueService;
use App\Services\Pedidos\EstoqueHelper;
use Illuminate\Contracts\Events\ShouldHandleEventsAfterCommit;

class DevolucaoObserver implements ShouldHandleEventsAfterCommit
{
    protected $devolucaoService;

    public function __construct(DevolucaoService $devolucaoService)
    {
       $this->devolucaoService = $devolucaoService;
    }

    public function updated(Devolucao $devolucao){
        if ($devolucao->estado === 'aprovado') {
            $this->devolucaoService->processarDevolucao($devolucao);
        }
    
    }
}