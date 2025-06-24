<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tenant extends Model
{
    protected $fillable = [
        'nome', 'subdominio', 'database', 'active', 
        'plano_id', 'assinatura_expira_em'
    ];

    protected $casts = [
        'active' => 'boolean',
        'assinatura_expira_em' => 'datetime'
    ];


    // Singleton para tenant atual
    private static $current = null;

    protected static function boot()
    {
        parent::boot();

        // Garante que o tenant_id seja gerado automaticamente ao criar um novo modelo
        static::creating(function ($model) {
            $model->tenant_id = (string) \Illuminate\Support\Str::uuid(); 
        });
    }

    public static function current(): ?self
    {
        return self::$current;
    }

    public static function setCurrent(?self $tenant): void
    {
        self::$current = $tenant;
    }

    // Relacionamentos
    public function produtos(): HasMany
    {
        return $this->hasMany(Produto::class);
    }

    public function pedidos(): HasMany
    {
        return $this->hasMany(Pedido::class);
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function perfis(): HasMany
    {
        return $this->hasMany(Perfil::class);
    }
    public function permissoes(): HasMany
    {
        return $this->hasMany(Permissao::class);
    }

    public function caixas(): HasMany
    {
        return $this->hasMany(Caixa::class);
    }

    public function movimentacaoCaixas(): HasMany
    {
        return $this->hasMany(MovimentacaoCaixa::class);
    }

    public function clientes(): HasMany
    {
        return $this->hasMany(Cliente::class);
    }

    public function categorias(): HasMany
    {
        return $this->hasMany(Categoria::class);
    }

    public function tipoDeProduto(): HasMany{
        return $this->hasMany(TiposDeProdutos::class);
    }

    public function pagamentoMetodos(): HasMany
    {
        return $this->hasMany(PaymentMethod::class);
    }

    public function pedidoPagamentos(): HasMany
    {
        return $this->hasMany(PedidoPagamento::class);
    }

    public function commissions(): HasMany
    {
        return $this->hasMany(Commission::class);
    }

    public function tipoDeNegocios(): HasMany
    {
        return $this->hasMany(TipoDeNegocios::class);
    }
    public function configDoNegocios(): HasMany
    {
        return $this->hasMany(ConfigDoNegocio::class);
    }
    public function devolucoes(): HasMany
    {
        return $this->hasMany(Devolucao::class);
    }
    public function devolucaoItens(): HasMany
    {
        return $this->hasMany(DevolucaoItem::class);
    }
    

}