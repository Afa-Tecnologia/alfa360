<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Imagens extends Model
{
    use HasFactory;

    protected $fillable = [

        'variante_id',
        'url'
    ];

    public function variantes()
    {
        return $this->belongsTo(Variantes::class, 'variante_id');
    }

    protected function serializeDate(\DateTimeInterface $date)
    {
        return $date->format('d-m-Y H:i:s');
    }
}
