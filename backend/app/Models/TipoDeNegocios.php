<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoDeNegocios extends Model
{
    protected $fillable = [
        'nome',
        'descricao',
        'ativo'
    ];

    public function configDoNegocio()
    {
        return $this->hasOne(ConfigDoNegocio::class);
    }

    public function produtos()
    {
        return $this->hasMany(Produto::class);
    }
}
