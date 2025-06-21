<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fatura extends Model
{
    use HasFactory;

    protected $fillable = [
        'numero',
        'status',
        'valor',
        'desconto',
        'valor_final',
        'data_emissao',
        'data_vencimento',
        'data_pagamento',
        'forma_pagamento',
        'link_boleto',
        'codigo_pix',
        'id_transacao',
        'observacoes',
    ];

    public function empresa()
    {
        return $this->belongsTo(Empresa::class);
    }

    public function assinatura()
    {
        return $this->belongsTo(Assinatura::class);
    }

    
    
    
    
}
