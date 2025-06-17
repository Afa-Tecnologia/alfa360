<?php

namespace App\Models;

use App\Traits\TenantAware;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class Devolucao extends Model
{
    use HasFactory, TenantAware;

    protected $table = "devolucoes";
    
    protected $fillable = [
        'uuid', // Adicione para permitir preenchimento manual se necessário
        'pedido_id',
        'cliente_id',
        'estado', // Era 'estado' - padronize com o Schema
        'motivo',
        'tipo',
        'observacao',
        'data_solicitacao',
        'data_processamento',
        'valor_reembolso'
    ];

    // Casting para tipos corretos
    protected $casts = [
        'data_solicitacao' => 'datetime',
        'data_processamento' => 'datetime',
        'valor_reembolso' => 'decimal:2'
    ];

    // Gerar UUID automaticamente
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid();
            }
            
            // Status padrão se não informado
            if (empty($model->estado)) {
                $model->estado = 'pendente';
            }
        });
    }

    // Relacionamentos
    public function itens()
    {
        return $this->hasMany(DevolucaoItem::class, 'devolucao_id');
    }

    public function cliente()
    {
        return $this->belongsTo(Cliente::class, 'cliente_id');
    }

    public function pedido()
    {
        return $this->belongsTo(Pedido::class, 'pedido_id', 'id');
    }

    // Scopes úteis para consultas
    public function scopePendentes($query)
    {
        return $query->where('estado', 'pendente');
    }

    public function scopePorTipo($query, $tipo)
    {
        return $query->where('tipo', $tipo);
    }

    public function scopePorMotivo($query, $motivo)
    {
        return $query->where('motivo', $motivo);
    }
}