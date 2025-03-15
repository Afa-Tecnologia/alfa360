<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MovimentacaoCaixa extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'caixa_id',
        'user_id',
        'pedido_id', // Novo campo
        'type',
        'value',
        'description',
        'payment_method',
        'status',
        'additional_data',
        'local'
    ];

    public function pedido(): BelongsTo
    {
        return $this->belongsTo(Pedido::class);
    }

    protected $casts = [
        'value' => 'decimal:2',
        'additional_data' => 'json'
    ];

    public function caixa(): BelongsTo
    {
        return $this->belongsTo(Caixa::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected function serializeDate(\DateTimeInterface $date)
    {
        return $date->format('d-m-Y H:i:s');
    }
}