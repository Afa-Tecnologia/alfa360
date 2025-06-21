<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\FormataDatas;
use App\Traits\TenantAware;

class MovimentacaoCaixa extends Model
{
    use SoftDeletes, FormataDatas, TenantAware;

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
        return $this->belongsTo(Pedido::class, 'pedido_id');
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
}