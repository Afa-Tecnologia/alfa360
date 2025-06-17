<?php

namespace App\Models;

use App\Traits\TenantAware;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permissao extends Model
{
    use HasFactory, TenantAware;

    protected $fillable = [
        'nome',
        'slug',
        'descricao',
        'ativo'
    ];

    public function perfis()
    {
        return $this->belongsToMany(Perfil::class, 'perfil_permissao');
    }
}
