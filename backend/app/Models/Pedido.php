<?php

namespace App\Models;

use App\Traits\TenantAware;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Pedido extends Model
{
    use HasFactory, TenantAware;

    const STATUS_PENDING = 'PENDING';
    const STATUS_PROCESSING = 'PROCESSING';
    const STATUS_PAYMENT_CONFIRMED = 'PAYMENT_CONFIRMED';
    const STATUS_PARTIAL_PAYMENT = 'PARTIAL_PAYMENT';
    const STATUS_CONDITIONAL = 'CONDITIONAL';
    const STATUS_ORDERED = 'ORDERED';
    const STATUS_CANCELLED = 'CANCELLED';

    protected $fillable = [
        'cliente_id',
        'produto_id',
        'type',
        'total',
        'subtotal',
        'desconto',
        'status',
    ];

    // Relacionamento com Produtos (via tabela pivô)
    public function produtos()
    {
        return $this->belongsToMany(Produto::class, 'pedidos_produtos')
            ->withPivot('quantidade', 'preco_unitario', 'vendedor_id')
            ->withTimestamps();
    }

    // public function variantes()
    // {
    //     return $this->hasMany(Variantes::class, 'produto_id');
    // }

    public function movimentacaoCaixa(): HasOne
    {
        return $this->hasOne(MovimentacaoCaixa::class);
    }

    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
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
    
    public function pagamentos()
    {
        return $this->hasMany(PedidoPagamento::class);
    }

    //Metodo para trazer informações dos vendedores
    public function getVendedoresIdsAttribute()
    {
        return $this->produtos->pluck('pivot.vendedor_id')->unique()->values();
    }
    
    public function vendedor()
    {
        return $this->belongsTo(User::class, 'vendedor_id');
    }

      // Total pago até o momento
      public function getTotalPagoAttribute(): float
      {
          return $this->pagamentos()
              ->where('status','CAPTURED')
              ->sum('amount');
      }
  
      // Indica se já está 100% pago
    public function getIsPaidAttribute(): bool
    {
        return $this->total_pago >= ($this->total - $this->desconto);
    }
}
