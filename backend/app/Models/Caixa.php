<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\FormataDatas;

class Caixa extends Model
{
    use SoftDeletes, FormataDatas;

    protected $fillable = [
        'user_id',
        'saldo_inicial',
        'saldo_final',
        'open_date',
        'close_date',
        'status',
        'observation'
    ];

    protected $casts = [
        'saldo_inicial' => 'decimal:2',
        'saldo_final' => 'decimal:2',
        'open_date' => 'datetime',
        'close_date' => 'datetime'
    ];

    const STATUS_OPEN = 'aberto';
    const STATUS_CLOSED = 'fechado';
    const STATUS_CANCELLED = 'cancelado';
    const STATUS_PENDING = 'pendente';
    const STATUS_CONFIRMED = 'confirmado';
    const STATUS_INACTIVE = 'inativo';
    const STATUS_ACTIVE = 'ativo';

    public function movimentacoes(): HasMany
    {
        return $this->hasMany(MovimentacaoCaixa::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function calculateCurrentBalance(): float
    {
        $entradas = $this->movimentacoes()
            ->where('status', self::STATUS_CONFIRMED)
            ->where('type', )
            ->sum('value');

        $saidas = $this->movimentacoes()
            ->where('status', self::STATUS_CONFIRMED)
            ->where('type', 'saida')
            ->sum('value');

        return $this->saldo_inicial + $entradas - $saidas;
    }
}