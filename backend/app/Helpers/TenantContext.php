<?php
namespace App\Helpers;

class TenantContext
{
    protected static ?string $id = null;

    public static function setTenantId(string $id): void
    {
        self::$id = $id;
    }

    public static function getTenantId(): ?string
    {
        return self::$id;
    }
}
