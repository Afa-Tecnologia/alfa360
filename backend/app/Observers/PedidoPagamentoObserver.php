<?php
// app/Observers/PedidoPagamentoObserver.php
namespace App\Observers;

use App\Models\Caixa;
use App\Models\PagamentoMetodo;
use App\Models\Pedido;
use App\Models\PedidoPagamento;
use App\Models\MovimentacaoCaixa;
use App\Services\Caixa\MovimentacaoCaixaService;
use App\Enums\StatusEnum;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class PedidoPagamentoObserver
{
    protected $movimentacaoCaixaService;
    
    public function __construct(MovimentacaoCaixaService $movimentacaoCaixaService)
    {
        $this->movimentacaoCaixaService = $movimentacaoCaixaService;
    }
    
    public function created(PedidoPagamento $pagamento)
    {
        try {
            if ($pagamento->status === StatusEnum::PAYMENT_CAPTURED) {
                DB::transaction(function () use ($pagamento) {
                    $this->registrarMovimentacaoDePagamentoNoCaixa($pagamento, $pagamento->status);
                });
            }
        } catch (Exception $e) {
            Log::error('Erro ao registrar movimentação de pagamento criado', [
                'pagamento_id' => $pagamento->id,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }
    
    public function updated(PedidoPagamento $pagamento)
    {
        try {
            // Verifica se o status foi alterado para PAYMENT_CAPTURED
            if ($pagamento->isDirty('status') && 
                $pagamento->status === StatusEnum::PAYMENT_CAPTURED) {
                DB::transaction(function () use ($pagamento) {
                    $this->registrarMovimentacaoDePagamentoNoCaixa($pagamento, $pagamento->status);
                });
            }
            // Verifica se o status foi alterado para PAYMENT_CANCELLED
            if ($pagamento->isDirty('status') && 
                $pagamento->status === StatusEnum::PAYMENT_CANCELLED) {
                DB::transaction(function () use ($pagamento) {
                    $this->registrarMovimentacaoDePagamentoNoCaixa($pagamento, $pagamento->status);
                });
            }
        } catch (Exception $e) {
            Log::error('Erro ao registrar movimentação de pagamento atualizado', [
                'pagamento_id' => $pagamento->id,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }
    
    private function registrarMovimentacaoDePagamentoNoCaixa(PedidoPagamento $pagamento, $status)
    {
        $pedido = Pedido::findOrFail($pagamento->pedido_id);
        
        $caixa = Caixa::where('status', StatusEnum::CAIXA_OPEN)
            ->where('user_id', Auth::id())
            ->first();
            
        if (!$caixa) {
            Log::error('Caixa não encontrado ou não está aberto', [
                'user_id' => Auth::id(),
                'pedido_id' => $pedido->id,
                'pagamento_id' => $pagamento->id
            ]);
            throw new Exception('Caixa não encontrado ou não está aberto para o usuário atual.');
        }
        
        try {
            if($status === StatusEnum::PAYMENT_CAPTURED){
                $this->registrarEntradaNoCaixa($pagamento, $caixa, $pedido);
            }
            if($status === StatusEnum::PAYMENT_CANCELLED){
                $this->registrarSaidaNoCaixa($pagamento, $caixa, $pedido);
            }
            
            Log::info('Movimentação de pagamento registrada com sucesso', [
                'pedido_id' => $pedido->id,
                'pagamento_id' => $pagamento->id,
                'caixa_id' => $caixa->id,
            ]);
            
        } catch (Exception $e) {
            Log::error('Erro ao criar movimentação de caixa', [
                'pedido_id' => $pedido->id,
                'pagamento_id' => $pagamento->id,
                'caixa_id' => $caixa->id,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }
    //Da entrada no caixa quando o pagamento é confirmado (capturado)
    private function registrarEntradaNoCaixa(PedidoPagamento $pagamento, Caixa $caixa, Pedido $pedido){
        $movimentacao = MovimentacaoCaixa::create([
            'caixa_id' => $caixa->id,
            'user_id' => Auth::id(),
            'pedido_id' => $pedido->id,
            'type' => 'entrada',
            'value' => $pagamento->total,
            'description' => 'Pagamento do pedido #' . $pedido->id,
            'payment_method' => $pagamento->metodo->code ?? 'MONEY',
            'status' => StatusEnum::MOVIMENTACAO_COMPLETED,
            'local' => $pedido->type ?? 'loja',
            'additional_data' => [
                'pedido_id' => $pedido->id,
                'pagamento_id' => $pagamento->id,
                'payment_method_id' => $pagamento->payment_method_id
            ]
        ]);
        if (!$movimentacao) {
            throw new Exception('Falha ao criar movimentação no caixa');
        }
        return $movimentacao;
    }

    //Da saida no caixa quando o pagamento é cancelado
    private function registrarSaidaNoCaixa(PedidoPagamento $pagamento, Caixa $caixa, Pedido $pedido){
        $movimentacao = MovimentacaoCaixa::create([
            'caixa_id' => $caixa->id,
            'user_id' => Auth::id(),
            'pedido_id' => $pedido->id,
            'type' => 'saida',
            'value' => $pagamento->total,
            'description' => 'Estorno do pagamento do pedido #' . $pedido->id,
            'payment_method' => $pagamento->metodo->code ?? 'MONEY',
            'status' => StatusEnum::MOVIMENTACAO_ESTORNADO,
            'local' => $pedido->type ?? 'loja',
            'additional_data' => [
                'pedido_id' => $pedido->id,
                'pagamento_id' => $pagamento->id,
                'payment_method_id' => $pagamento->payment_method_id
            ]
        ]);
        if (!$movimentacao) {
            throw new Exception('Falha ao criar movimentação no caixa');
        }
        return $movimentacao;
    }

}