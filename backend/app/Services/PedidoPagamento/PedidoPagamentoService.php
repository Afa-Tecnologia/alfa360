<?php

namespace App\Services\PedidoPagamento;

use App\Models\MovimentacaoCaixa;
use App\Models\Pedido;
use App\Models\PedidoPagamento;
use App\Models\PagamentoMetodo;
use Illuminate\Database\DatabaseManager;
use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

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
        return $this->db->transaction(function () use ($pedido, $data) {
            $metodo = PagamentoMetodo::where('code', $data['payment_method_code'])->firstOrFail();

            $totalBruto = $pedido->total - $pedido->desconto;
            $totalPagoAnterior = $pedido->pagamentos()
                ->where('status', PedidoPagamento::STATUS_CAPTURED)
                ->sum('total');

            $restante = $totalBruto - $totalPagoAnterior;
            if ($data['total'] > $restante) {
              throw new \InvalidArgumentException(
                "Valor excede o saldo restante: R\${$restante}");
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
}