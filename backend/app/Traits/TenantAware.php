<?php
namespace App\Traits;

use App\Models\Tenant;
use App\Models\Scopes\TenantScope;
use Illuminate\Database\Eloquent\Model;

trait TenantAware
{
    /**
     * Boot do trait - adiciona scope automático
     */
    protected static function bootTenantAware()
    {
        // Adiciona o scope global - TODA query vai ter tenant_id automático
        static::addGlobalScope(new TenantScope);
        
        // Ao criar, adiciona tenant_id automático
        static::creating(function (Model $model) {
            if (Tenant::current() && !$model->tenant_id) {
                $model->tenant_id = Tenant::current()->id;
            }
        });
    }

    /**
     * Relacionamento com tenant
     */
    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    /**
     * Scope para remover filtro de tenant (quando necessário)
     */
    public function scopeWithoutTenant($query)
    {
        return $query->withoutGlobalScope(TenantScope::class);
    }

    /**
     * Scope para tenant específico
     */
    public function scopeForTenant($query, $tenantId)
    {
        return $query->withoutGlobalScope(TenantScope::class)
                    ->where('tenant_id', $tenantId);
    }
}