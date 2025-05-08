<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PedidosProduto extends Model
{
    // Especifique o nome da tabela, caso ela não siga a convenção do Laravel
    protected $table = 'pedidos_produtos';

    // Defina os campos que podem ser preenchidos (mass assignment)
    protected $fillable = [
        'pedido_id',
        'produto_id',
        'vendedor_id',
        'quantidade',
        'preco_unitario',
        

    ];

    // Defina a chave primária, caso não seja 'id'
    protected $primaryKey = 'id';

    // Defina os relacionamentos, se necessário
    public function pedido()
    {
        return $this->belongsTo(Pedido::class);
    }

    public function vendedor()
    {
        return $this->belongsTo(User::class, 'vendedor_id');
    }

    public function produto()
    {
        return $this->belongsTo(Produto::class);
    }

    protected function serializeDate(\DateTimeInterface $date)
    {
        return $date->format('d-m-Y H:i:s');
    }
}
