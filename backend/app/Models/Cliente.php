<?php

namespace App\Models;

use App\Traits\TenantAware;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cliente extends Model
{

    use HasFactory, TenantAware;

    protected $fillable = [

        'name',
        'last_name',
        'email',
        'phone',
        'cpf',
        'adress',
        'city',
        'state',
        'cep',
        'date_of_birth'
    ];

    protected function serializeDate(\DateTimeInterface $date)
    {
        return $date->format('d-m-Y H:i:s');
    }
}
