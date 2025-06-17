<?php
namespace App\Models\Scopes;

use App\Models\Tenant;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class TenantScope implements Scope
{
    /**
     * Aplica o scope automaticamente em TODAS as queries
     */
    public function apply(Builder $builder, Model $model)
    {
        if (Tenant::current()) {
            $builder->where($model->getTable() . '.tenant_id', Tenant::current()->id);
        }
    }
}