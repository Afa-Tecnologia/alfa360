<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Variantes extends Model
{
    
        protected $fillable = [
            'produto_id', 'name', 'type', 'color', 'size', 'quantity', 'active', 'images'
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


    protected function serializeDate(\DateTimeInterface $date)
    {
        return $date->format('d-m-Y H:i:s');
    }
}
