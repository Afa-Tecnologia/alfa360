<?php
namespace App\Traits;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

trait CurrentVendedor {

    /**
     * Scope para retornar registros do vendedor autenticado
     */
    public function scopeDoVendedor($query)
    {
        $user = Auth::user();

        if ($user && $user->hasRole('vendedor')) {
            return $query->whereHas('produtos', function ($q) use ($user) {
                $q->where('vendedor_id', $user->id);
            });
        }

        return $query;
    }
}