<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class Plano extends Model
{
    use HasFactory;

    protected $fillable = [
        'nome',
        'descricao',
        'preco',
        'duracao',
        'status',
    ];
    
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->slug = Str::slug($model->nome);
            $model->uuid = Str::slug($model->uuid ?? (string) \Illuminate\Support\Str::uuid());
        });
    }


    public function empresas()
    {
        return $this->hasMany(Empresa::class);
    }

    public function faturas()
    {
        return $this->hasMany(Fatura::class);
    }
    
}
