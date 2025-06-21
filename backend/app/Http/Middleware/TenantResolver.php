<?php

namespace App\Http\Middleware;

use App\Models\Tenant;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TenantResolver
{
    public function handle(Request $request, Closure $next)
    {

        if (Auth::check()) {
            $tenantId = Auth::user()->tenant_id;
            $tenant = Tenant::where('id', $tenantId)
                            ->where('active', true)
                            ->first();

        if (!$tenant) {
            abort(403, 'Tenant não encontrado ou inativo.');
        }

        Tenant::setCurrent($tenant);
        } else {
            abort(401, 'Usuário não autenticado');
        }

        return $next($request);

       
    }
}