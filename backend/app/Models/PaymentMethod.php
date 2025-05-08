<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    use HasFactory;

    protected $table = 'pagamento_metodos';

    protected $fillable = [
        'name',
        'code',
    ];

    protected $casts = [
        'config' => 'array',
    ];
} 