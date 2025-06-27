<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Empresa extends Model
{
    use HasFactory;

    protected $fillable = [
        'nome',
        'cnpj',
        'endereco',
        'cidade',
        'razao_social',
        'nome_fantasia',
        'estado',
        'cep',
        'telefone',
        'email',
        'status',
        'plano_id',
        'logo',
        'dominio',
        'trial_expira_em',
        'assinatura_expira_em'

    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->slug = \Illuminate\Support\Str::slug($model->nome);
            $model->uuid = \Illuminate\Support\Str::uuid()->toString();
        });
    }


    public function usuarios()
    {
        return $this->hasMany(Usuario::class);
    }

    public function faturas()
    {
        return $this->hasMany(Fatura::class);
    }

    public function permissoes()
    {
        return $this->hasMany(Permissao::class);
    }

    public function perfis()
    {
        return $this->hasMany(Perfil::class);
    }

    public function owner()
    {
        return $this->belongsTo(Usuario::class, 'owner_id');
    }

    
    public function plano()
    {
        return $this->belongsTo(Plano::class);
    }
    

}
