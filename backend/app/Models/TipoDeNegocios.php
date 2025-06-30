<?php

namespace App\Models;

use App\Traits\TenantAware;
use Illuminate\Database\Eloquent\Model;

class TipoDeNegocios extends Model
{
    protected $table = 'tipos_de_negocios';
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

    public function atributos()
    {
    return $this->belongsToMany(Atributo::class, 'atributo_tipos_de_negocios');
    }

}
