<?php

namespace App\Models;

use App\Traits\TenantAware;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Atributo extends Model
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

    protected function serializeDate(\DateTimeInterface $date)
    {
        return $date->format('d-m-Y H:i:s');
    }

    public function variantes()
    {
    return $this->belongsToMany(Variantes::class, 'variantes_atributos')
                ->withPivot('valor')
                ->withTimestamps();
    }

    public function tiposDeNegocio()
    {
    return $this->belongsToMany(TipoDeNegocios::class, 'atributo_tipos_de_negocios');
    }

}
