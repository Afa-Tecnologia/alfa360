<?php

namespace App\Models;

use App\Traits\TenantAware;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class PagamentoMetodo extends Model
{
    use TenantAware;
    protected $table = 'pagamento_metodos';
    protected $casts = ['config' => 'array'];
    protected $fillable = [
        'name',
        'code',
    ];

    public function pagamentos()
    {
        return $this->hasMany(PedidoPagamento::class, 'payment_method_id');
    }
}



// class Pedido extends Model
// {
//     protected $table = 'pedidos';

//     public function itens()
//     {
//         return $this->hasMany(PedidoItem::class);
//     }
//     public function pagamentos()
//     {
//         return $this->hasMany(PedidoPagamento::class);
//     }

  
// }
