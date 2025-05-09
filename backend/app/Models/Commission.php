<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Commission extends Model
{
    protected $fillable = [
        'pedido_id',
        'vendedor_id',
        'produto_id',
        'valor',
        'quantity',
        'percentual',
        'status'
    ];

    const STATUS_PENDING = 'PENDENTE';
    const STATUS_PAID = 'PAGO';
    const STATUS_CANCELLED = 'CANCELADO';

    public function pedido()
    {
        return $this->belongsTo(Pedido::class);
    }

    public function vendedor()
    {
        return $this->belongsTo(User::class, 'vendedor_id');
    }

    public function produto()
    {
        return $this->belongsTo(Produto::class, 'produto_id');
    }

    protected function serializeDate(\DateTimeInterface $date)
    {
        return $date->format('d-m-Y H:i:s');
    }
}
