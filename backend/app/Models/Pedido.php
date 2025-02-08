<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Pedido extends Model
{
    use HasFactory;

    protected $fillable = [
        'vendedor_id',
        'cliente_id',
        'produto_id',
        'categoria_id',
        'type',
        'total',
        'desconto',
    ];

    // Relacionamento com Produtos (via tabela pivô)
    public function produtos()
    {
        return $this->belongsToMany(Produto::class, 'pedidos_produtos')
            ->withPivot('quantity', 'selling_price')
            ->withTimestamps();
    }

    public function movimentacaoCaixa(): HasOne
    {
        return $this->hasOne(MovimentacaoCaixa::class);
    }

    // Relacionamentos corrigidos
    public function vendedor()
    {
        return $this->belongsTo(User::class, 'vendedor_id');
    }

    public function cliente()
    {
        return $this->belongsTo(Cliente::class); // Nome do modelo no singular
    }

    public function produto()
    {
        return $this->belongsTo(Produto::class);
    }

    public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'categoria_id');
    }

    protected function serializeDate(\DateTimeInterface $date)
    {
        return $date->format('d-m-Y H:i:s');
    }

    public function items()
    {
        return $this->hasMany(PedidosProduto::class);
    }
}
