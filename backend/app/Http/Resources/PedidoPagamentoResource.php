<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PedidoPagamentoResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'                  => $this->id,
            'pedido_id'           => $this->pedido_id,
            'payment_method'      => [
                'id'   => $this->metodo->id,
                'code' => $this->metodo->code,
                'name' => $this->metodo->name,
            ],
            'total'              => (float) $this->total,
            'status'              => $this->status,
            'paid_at'             => optional($this->paid_at)->toIso8601String(),
            'transaction_details' => $this->transaction_details,
            'created_at'          => $this->created_at->toIso8601String(),
            'updated_at'          => $this->updated_at->toIso8601String(),
        ];
    }
}
