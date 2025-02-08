<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Caixa extends Model
{
    use SoftDeletes;

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

    public function movimentacoes(): HasMany
    {
        return $this->hasMany(MovimentacaoCaixa::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function calculateCurrentBalance(): float
    {
        $entradas = $this->movimentacoes()
            ->where('status', 'confirmed')
            ->where('type', 'entrada')
            ->sum('value');

        $saidas = $this->movimentacoes()
            ->where('status', 'confirmed')
            ->where('type', 'saida')
            ->sum('value');

        return $this->saldo_inicial + $entradas - $saidas;
    }

    protected function serializeDate(\DateTimeInterface $date)
    {
        return $date->format('d-m-Y H:i:s');
    }

}