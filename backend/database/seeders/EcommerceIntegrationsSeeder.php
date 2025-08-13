<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EcommerceIntegration;

class EcommerceIntegrationsSeeder extends Seeder
{
    public function run()
    {
        // Exemplo para tenant 1
        EcommerceIntegration::create([
            'tenant_id' => 2,
            'platform' => 'woocommerce',
            'url' => 'https://lightpink-dove-983708.hostingersite.com',
            'key' => 'ck_e20f93be0ed06651139adef4e6286f7978a777e5',
            'secret' => 'cs_6e4e3a2263a0cd3426bb66ede849f2c3da6b73fc',
            'active' => true,
        ]);
        // // Exemplo para tenant 2
        // EcommerceIntegration::create([
        //     'tenant_id' => 2,
        //     'platform' => 'woocommerce',
        //     'url' => 'https://loja2.exemplo.com',
        //     'key' => 'ck_tenant2_key',
        //     'secret' => 'cs_tenant2_secret',
        //     'active' => true,
        // ]);
    }
} 