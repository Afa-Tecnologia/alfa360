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
                    $this->registrarMovimentacaoDePagamentoNoCaixa($pagamento);
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
            if ($pagamento->isDirty('status') && 
                $pagamento->status === StatusEnum::PAYMENT_CAPTURED) {
                DB::transaction(function () use ($pagamento) {
                    $this->registrarMovimentacaoDePagamentoNoCaixa($pagamento);
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
    
    private function registrarMovimentacaoDePagamentoNoCaixa(PedidoPagamento $pagamento)
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
            
            Log::info('Movimentação de pagamento registrada com sucesso', [
                'pedido_id' => $pedido->id,
                'pagamento_id' => $pagamento->id,
                'caixa_id' => $caixa->id,
                'movimentacao_id' => $movimentacao->id
            ]);
            
            return $movimentacao;
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
}