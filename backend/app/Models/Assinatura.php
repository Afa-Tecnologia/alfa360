<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Assinatura extends Model
{
    use HasFactory;

    protected $fillable = [
        'empresa_id',
        'plano_id',
        'status',
        'inicio_em',
        'expira_em',
        'cancelada_em',
        'ultimo_pagamento',
        'valor',
        'forma_pagamento',
        'gateway_pagamento',
        'id_transacao_gateway',
        'renovacao_automatica',
        'motivo_cancelamento',
        'max_usuarios_override',
        'configuracoes_personalizadas',
    ];

    public function empresa()
    {
        return $this->belongsTo(Empresa::class);
    }

    public function plano()
    {
        return $this->belongsTo(Plano::class);
    }

    public function faturas()
    {
        return $this->hasMany(Fatura::class);
    }
    

    

}
