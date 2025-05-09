<?php
namespace App\Observers;

use App\Models\Caixa;
use App\Models\Commission;
use App\Models\Pedido;
use App\Models\PedidosProduto;
use App\Services\Caixa\CaixaService;
use App\Services\Caixa\MovimentacaoCaixaService;
use App\Services\Commissions\CommissionsService;
use Illuminate\Contracts\Events\ShouldHandleEventsAfterCommit;
use Illuminate\Support\Facades\Log;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PedidoObserver implements ShouldHandleEventsAfterCommit
{
    protected $movimentacaoCaixaService;
    protected $caixaService;
    protected $commissionService;

    public function __construct(
        MovimentacaoCaixaService $movimentacaoCaixaService, 
        CaixaService $caixaService, 
        CommissionsService $commissionService
    ) {
        $this->movimentacaoCaixaService = $movimentacaoCaixaService;
        $this->caixaService = $caixaService;
        $this->commissionService = $commissionService;
    }

    public function created(Pedido $pedido)
    {
        // Removemos a movimentação do caixa aqui, pois será feita pelo PedidoPagamentoObserver
        $this->processarComissoes($pedido);
    }

    public function updated(Pedido $pedido)
    {
        if ($pedido->isDirty('status') && $pedido->status == Pedido::STATUS_PAYMENT_CONFIRMED) {
            $this->processarComissoes($pedido);
        }
    }

    private function processarComissoes(Pedido $pedido)
    {
        try {
            $produtosPedido = $pedido->produtos()->with('produto')->get();
            foreach ($produtosPedido as $produto) {
                $comissao = $this->commissionService->calcValueOfCommission(
                    $produto->produto->valor,
                    $produto->produto->comissao,
                    $produto->quantidade
                );
                
                Commission::create([
                    'pedido_id' => $pedido->id,
                    'produto_id' => $produto->id,
                    'vendedor_id' => $pedido->vendedor_id,
                    'valor' => $comissao,
                    'status' => Commission::STATUS_PENDING,
                ]);
            }
            
            Log::info('Comissões processadas com sucesso', [
                'pedido_id' => $pedido->id
            ]);
        } catch (Exception $e) {
            Log::error('Erro ao processar comissões', [
                'pedido_id' => $pedido->id,
                'error' => $e->getMessage()
            ]);
        }
    }
}