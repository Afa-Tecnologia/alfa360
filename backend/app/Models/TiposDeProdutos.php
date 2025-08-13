<?php

namespace App\Models;

use App\Traits\TenantAware;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TiposDeProdutos extends Model
{
    use HasFactory, TenantAware;
    protected $table = 'tipo_de_produto';
    
    protected $fillable = [
        'nome',
        'descricao',
        'ativo'
    ];

    /**
     * Relação com produtos
     */
    public function produtos()
    {
        return $this->hasMany(Produto::class, 'tipo_de_produto_id');
    }
}
