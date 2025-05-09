<?php

namespace App\Services\Caixa;

use App\Services\Caixa\CaixaService;
use App\Models\Caixa;
use App\Models\MovimentacaoCaixa;
use App\Models\Pedido;
use App\Models\PedidoPagamento;
use App\Enums\StatusEnum;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Exception;

class MovimentacaoCaixaService {

    protected $caixaService;

    public function __construct(CaixaService $caixaService){
        $this->caixaService = $caixaService;
    }   
    
    public function createMovimentacao(
        Caixa $caixa,
        string $type,
        float $value,
        string $description,
        ?string $paymentMethod = null,
        ?array $additionalData = null,
        ?string $local = null
    ): MovimentacaoCaixa {
        if (!$caixa || !$caixa->id) {
            throw new Exception('Caixa inválido ou não fornecido.');
        }

        if ($caixa->status !== StatusEnum::CAIXA_OPEN) {
            throw new Exception('Não é possível criar movimentações em um caixa fechado.');
        }

        return DB::transaction(function () use ($caixa, $type, $value, $description, $paymentMethod, $additionalData, $local) {
            try {
                $movimentacao = MovimentacaoCaixa::create([
                    'caixa_id' => $caixa->id,
                    'user_id' => Auth::id(),
                    'type' => $type,
                    'value' => $value,
                    'description' => $description,
                    'payment_method' => $paymentMethod,
                    'status' => StatusEnum::MOVIMENTACAO_COMPLETED,
                    'additional_data' => $additionalData,
                    'local' => $local
                ]);

                if (!$movimentacao) {
                    throw new Exception('Falha ao criar movimentação no caixa.');
                }

                Log::info('Movimentação criada com sucesso', [
                    'caixa_id' => $caixa->id,
                    'movimentacao_id' => $movimentacao->id,
                    'type' => $type,
                    'value' => $value
                ]);

                return $movimentacao;
            } catch (Exception $e) {
                Log::error('Erro ao criar movimentação', [
                    'caixa_id' => $caixa->id,
                    'error' => $e->getMessage()
                ]);
                throw $e;
            }
        });
    }

    public function createMovimentacaoFromPedido(Caixa $caixa, Pedido $pedido): MovimentacaoCaixa
    {
        if ($caixa->status !== 'aberto') {
            throw new \Exception('Não é possível criar movimentações em um caixa fechado.');
        }

        // Garantir que os produtos estão carregados
        if (!$pedido->relationLoaded('produtos')) {
            $pedido->load(['produtos' => function($query) {
                $query->with('variants');
            }]);
        }

        // Preparar os dados adicionais de maneira segura
        $additionalData = [];
        if ($pedido->produtos && $pedido->produtos->count() > 0) {
            $additionalData = [
                'pedido_items' => $pedido->produtos->map(function ($item) {
                    // Obter a variante com segurança
                    $varianteId = null;
                    if (isset($item->variants) && !empty($item->variants) && $item->variants->isNotEmpty()) {
                        $varianteId = $item->variants->first()->id ?? null;
                    }
                    
                    return [
                        'produto_id' => $item->id,
                        'variante_id' => $varianteId,
                        'quantity' => $item->pivot->quantidade ?? 0,
                        'selling_price' => $item->pivot->preco_unitario ?? 0,
                    ];
                })->toArray()
            ];
        }

        try {
            return MovimentacaoCaixa::create([
                'caixa_id' => $caixa->id,
                'user_id' => Auth::id(),
                'pedido_id' => $pedido->id,
                'type' => 'entrada',
                'value' => $pedido->total,
                'description' => "Pagamento do Pedido #{$pedido->id}",
                'payment_method' => $pedido->payment_method ?? 'PIX',
                'status' => $this->mapPedidoStatusToMovimentacaoStatus($pedido->status),
                'local' => $pedido->local ?? 'loja',
                'additional_data' => json_encode($additionalData)
            ]);
        } catch (\Exception $e) {
            Log::error('Erro ao criar movimentação de caixa: ' . $e->getMessage());
            throw $e;
        }
    }

    //Solução de contorno
    //Os status devem está em uma constante ou entidade propria
    private function mapPedidoStatusToMovimentacaoStatus($pedidoStatus)
    {
        $statusMap = [
            'PENDING' => 'pending',
            'PAYMENT_CONFIRMED' => 'completed',
            'PARTIAL_PAYMENT' => 'pending',
            'CONDITIONAL' => 'pending',
            'ORDERED' => 'pending',
            'CANCELLED' => 'canceled'
        ];

        return $statusMap[$pedidoStatus] ?? 'pending';
    }

    public function getTodasMovimentacoes()
    {
        // Buscar apenas o caixa aberto do usuário atual
        $caixaAtual = $this->caixaService->statusCaixa();
        
        // Se existir um caixa aberto, retorna apenas as movimentações desse caixa
        if ($caixaAtual) {
            return $caixaAtual->movimentacoes()
                ->with(['user:id,name', 'pedido:id,cliente_id,total'])
                ->orderBy('created_at', 'desc')
                ->get();
        }
        
        // Se não existir um caixa aberto, retorna uma coleção vazia
        return collect([]);
    }

    public function registrarMovimentacaoDePagamentoNoCaixa(Pedido $pedido, PedidoPagamento $pagamentoDoPedido, Caixa $caixa){
        try {
            return MovimentacaoCaixa::create([
                'caixa_id' => $caixa->id,
                'user_id' => Auth::id(),
                'pedido_id' => $pedido->id,
                'type' => 'entrada',
                'value' => $pedido->total,
                'description' => "Pagamento do Pedido #{$pedido->id}",
                'payment_method' => $pedido->payment_method ?? 'PIX',
                'status' => $pedido->status ?? 'completed',
                'local' => $pedido->local ?? 'loja',
            ]);
        } catch (\Exception $e) {
            Log::error('Erro ao criar movimentação de caixa: ' . $e->getMessage());
            throw $e;
        }
    }

}