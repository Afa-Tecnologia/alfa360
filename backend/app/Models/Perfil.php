<?php

namespace App\Models;

use App\Traits\TenantAware;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Perfil extends Model
{
    use HasFactory, TenantAware;

    protected $fillable = [
        'nome',
        'slug',
        'descricao',
        'ativo',
        'permissoes_id'
    ];

    public function permissoes()
    {
        return $this->belongsToMany(Permissao::class, 'perfil_permissao');
    }
}
