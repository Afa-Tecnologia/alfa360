<?php

namespace App\Models;

use App\Traits\TenantAware;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    use TenantAware;

    protected $table = 'pagamento_metodos';

    protected $fillable = [
        'name',
        'code',
        'tenant_id'

    ];

    protected $casts = [
        'config' => 'array',
    ];

    
} 