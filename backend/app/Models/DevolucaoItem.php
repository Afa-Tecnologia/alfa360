<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class DevolucaoItem extends Model
{
    protected $table = 'devolucao_itens';
    protected $fillable = [
        'uuid',
        'devolucao_id',
        'produto_id',
        'pedido_id',
        'variante_id',
        'quantidade',
        'valor_unitario',
        'valor_total'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid();
            }
        });
    }

    public function devolucao()
    {
        return $this->belongsTo(Devolucao::class, 'devolucao_id');
    }

    public function produto()
    {
        return $this->belongsTo(Produto::class, 'produto_id');
    }

    public function pedido() {
        return $this->belongsTo(Pedido::class, 'pedido_id');
    }

    public function variante()
    {
        return $this->belongsTo(Variantes::class, 'variante_id');
    }

}
