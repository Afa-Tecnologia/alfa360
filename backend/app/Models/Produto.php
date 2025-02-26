<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Produto extends Model
{
    protected $fillable = [
        'name',
        'description',
        'purchase_price',
        'selling_price',
        'quantity',
        'categoria_id',
        'type',
        'brand', 
        'code'
    ];


    /**
     * Relação com pedidos (tabela de junção pedidos_produtos).
     */
    public function pedidos()
    {
        return $this->belongsToMany(Pedido::class, 'pedidos_produtos')
            ->withPivot('quantity', 'selling_price')
            ->withTimestamps();
    }

    /**
     * Relação com a categoria do produto.
     */
    public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'categoria_id');
    }

    /**
     * Relação com as variantes dos produtos um produto tem muitas variantes
     */
    public function variants()
    {
        return $this->hasMany(Variantes::class, 'produto_id');
    }

    public function comissao()
    {
        return $this->hasOne(Commission::class, 'produto_id');
    }

    protected function serializeDate(\DateTimeInterface $date)
    {
        return $date->format('d-m-Y H:i:s');
    }
}
