<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConfigDoNegocio extends Model
{
    protected $table = 'config_do_negocios';
    
    protected $fillable = [
        'nome',
        'logo_url',
        'tipo_de_negocio_id',
        'cnpj'
    ];

    public function tipoDeNegocio()
    {
        return $this->belongsTo(TipoDeNegocios::class, 'tipo_de_negocio_id');
    }

    public function produtos()
    {
        return $this->hasMany(Produto::class);
    }
    
    
    
}
