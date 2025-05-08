<?php
namespace App\Observers;

use App\Models\Caixa;
use App\Models\Pedido;
use App\Services\Caixa\CaixaService;
use App\Services\Caixa\MovimentacaoCaixaService;
use Illuminate\Contracts\Events\ShouldHandleEventsAfterCommit;
use Illuminate\Support\Facades\Log;

class PedidoObserver implements ShouldHandleEventsAfterCommit
{
    protected $movimentacaoCaixaService;
    protected $caixaService;
    
    public function __construct(MovimentacaoCaixaService $movimentacaoCaixaService, CaixaService $caixaService)
    {
        $this->movimentacaoCaixaService = $movimentacaoCaixaService;
        $this->caixaService = $caixaService;
    }

    public function created(Pedido $pedido)
    {
        $caixa = $this->caixaService->statusCaixa();
        if (!$caixa) {
            Log::warning('Tentativa de criar movimentação para pedido #' . $pedido->id . ' sem caixa aberto');
            return;
        }
        
        $this->registrarMovimentacaoDePedido($caixa, $pedido);
    }

    private function registrarMovimentacaoDePedido(Caixa $caixa, Pedido $pedido)
    {
        try {
            $this->movimentacaoCaixaService->createMovimentacaoFromPedido($caixa, $pedido);
            Log::info('Movimentação registrada com sucesso para o pedido #' . $pedido->id);
        } catch (\Exception $e) {
            Log::error('Erro ao registrar movimentação para o pedido #' . $pedido->id . ': ' . $e->getMessage());
        }
    }
}