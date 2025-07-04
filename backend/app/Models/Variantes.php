<?php

namespace App\Models;

use App\Traits\TenantAware;
use Illuminate\Database\Eloquent\Model;

class Variantes extends Model
{
    use TenantAware;
    
        protected $fillable = [
            'produto_id', 'name', 'type', 'quantity', 'active', 'images', 'code'
        ];
    
        protected $casts = [
            'images' => 'array' 
        ];

    public function produto()
    {
        return $this->belongsTo(Produto::class, 'produto_id');
    }

    public function imagens()
    {
        return $this->hasMany(Imagens::class, 'variante_id');
    }

    public function atributos()
    {
    return $this->belongsToMany(Atributo::class, 'variantes_atributos', 'variante_id')
                ->withPivot('valor')
                ->withTimestamps();
    }


    protected function serializeDate(\DateTimeInterface $date)
    {
        return $date->format('d-m-Y H:i:s');
    }
    
    // Garantir que images seja sempre um array, mesmo se vier como string JSON
    public function getImagesAttribute($value)
    {
        if (is_string($value)) {
            return json_decode($value, true) ?: [];
        }
        
        return $value ?: [];
    }
}
