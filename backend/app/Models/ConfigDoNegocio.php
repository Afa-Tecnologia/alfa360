<?php

namespace App\Models;

use App\Traits\TenantAware;
use Illuminate\Database\Eloquent\Model;

class ConfigDoNegocio extends Model
{
    use TenantAware;
    protected $table = 'config_do_negocios';
    
    protected $fillable = [
        'nome',
        'logo_url',
        'tipos_de_negocios_id',
        'cnpj'
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->uuid = (string) \Illuminate\Support\Str::uuid();
        });
    }
    
    public function tiposDeNegocios()
    {
        return $this->belongsTo(TipoDeNegocios::class, 'tipos_de_negocios_id');
    }

    public function produtos()
    {
        return $this->hasMany(Produto::class);
    }
    
    
    
}
