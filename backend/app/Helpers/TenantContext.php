<?php
namespace App\Helpers;

class TenantContext
{
    protected static ?string $tenantId = null;

    public static function setTenantId(string $tenantId): void
    {
        self::$tenantId = $tenantId;
    }

    public static function getTenantId(): ?string
    {
        return self::$tenantId;
    }
}
