<?php

namespace App\Services\PedidoPagamento;

use App\Models\MovimentacaoCaixa;
use App\Models\Pedido;
use App\Models\PedidoPagamento;
use App\Models\PagamentoMetodo;
use App\Models\PedidosProduto;
use Illuminate\Database\DatabaseManager;
use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\Caixa;
use App\Enums\StatusEnum;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class PedidoPagamentoService
{
    protected DatabaseManager $db;

    public function __construct(DatabaseManager $db)
    {
        $this->db = $db;
    }

    /**
     * Cria e registra um pagamento para o pedido, sem integração externa.
     * @throws \InvalidArgumentException
     */
    public function create(Pedido $pedido, array $data)
    {
        $pedido = Pedido::findOrFail($pedido->id);
        if(!$pedido) {
            throw new \InvalidArgumentException("Pedido não encontrado.");
        }
        if ($pedido->status == Pedido::STATUS_CANCELLED) {
            throw new \InvalidArgumentException("Pedido cancelado.");
        }

        return $this->db->transaction(function () use ($pedido, $data) {
            $metodo = PagamentoMetodo::where('code', $data['payment_method_code'])->firstOrFail();

            $totalBruto = $pedido->total; //Já vem co o desconto no pedido
            $totalPagoAnterior = $pedido->pagamentos()
                ->where('status', PedidoPagamento::STATUS_CAPTURED)
                ->sum('total');

            $restante = $totalBruto - $totalPagoAnterior;
            if ($data['total'] > $restante) {
              throw new \InvalidArgumentException(
                "Valor excede o saldo restante: R\${$restante}");
            }

            $caixa = Caixa::where('status', StatusEnum::CAIXA_OPEN)
                ->where('user_id', Auth::id())
                ->first();

            if (!$caixa) {
                throw new \InvalidArgumentException("Não há caixa aberto para registrar o pagamento.");
            }

            $pagamento = $pedido->pagamentos()->create([
                'payment_method_id'   => $metodo->id,
                'total'              => $data['total'],
                'status'              => PedidoPagamento::STATUS_CAPTURED,
                'transaction_details' => $data['transaction_details'] ?? null,
                'paid_at'             => Carbon::now(),
            ]);

            // Atualiza status do pedido conforme total pago
            $novoTotalPago = $totalPagoAnterior + $data['total'];
            if ($novoTotalPago >= $totalBruto) {
                $pedido->status = Pedido::STATUS_PAYMENT_CONFIRMED;
            } else {
                $pedido->status = Pedido::STATUS_PARTIAL_PAYMENT;

            }
            $pedido->save();

            return $pagamento;
        });
    }

    public function getPagamentosPorPedido($pedidoId){

       return $this->db->transaction(function () use ($pedidoId) {
        $pagamentos = PedidoPagamento::where('pedido_id', $pedidoId)->get()->map(function($pagamento){
            $metodo = PagamentoMetodo::where('id', $pagamento->payment_method_id)->first();
            $pagamento->metodo = $metodo;
            return $pagamento;
        });
        return $pagamentos;
       });
    }

    public function estornarPagamento($pedidoId){
        $pagamentos = PedidoPagamento::where('pedido_id', $pedidoId)->get();
        foreach($pagamentos as $pagamento){
            $pagamento->status = PedidoPagamento::STATUS_CANCELLED; 
            $pagamento->save();
        }
    }
}