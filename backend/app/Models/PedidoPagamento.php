<?php
namespace App\Models;

use App\Traits\TenantAware;
use Illuminate\Database\Eloquent\Model;

class PedidoPagamento extends Model
{
    use TenantAware;
    
    const STATUS_PENDING = 'PENDING';
    const STATUS_AUTHORIZED = 'AUTHORIZED';
    const STATUS_CAPTURED = 'CAPTURED';
    const STATUS_CANCELLED = 'CANCELLED';
    const STATUS_REFUNDED = 'REFUNDED';

    protected $table = 'pedido_pagamentos';
    protected $dates = ['paid_at'];
    
    protected $fillable = [
        'pedido_id',
        'payment_method_id',
        'total',
        'status',
        'transaction_details'
    ];
    protected $casts = [ 
        'total' => 'decimal:2',
        'transaction_details' => 'array'
    ];
   

    public function pedido()
    {
        return $this->belongsTo(Pedido::class);
    }
    public function metodo()
    {
        return $this->belongsTo(PagamentoMetodo::class, 'payment_method_id');
    }

    // Exemplo de helper para sinalizar quitação total/parcial
    public function isCaptured(): bool
    {
        return $this->status === 'CAPTURED';
    }
}