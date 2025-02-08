<?php


namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;

class SyncProductToWooCommerce implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $backoff = 60; // Segundos entre tentativas

    public function __construct(
        public $product,
        public $variant = null
    ) {}

    public function handle()
    {
        $woocommerceData = $this->mapProductData();
        
        $response = Http::withBasicAuth(
            config('services.woocommerce.key'),
            config('services.woocommerce.secret')
        )->post(config('services.woocommerce.url').'/wp-json/wc/v3/products', $woocommerceData);

        if ($response->failed()) {
            throw new \Exception("Falha na sincronização: ".$response->body());
        }

        $this->product->update([
            'external_id' => $response->json()['id'],
            'synced_at' => now()
        ]);
    }

    private function mapProductData(): array
    {
        return [
            'name' => $this->product->name,
            'type' => 'variable',
            'regular_price' => (string) $this->product->selling_price,
            'description' => $this->product->description,
            'sku' => $this->variant?->sku,
            'attributes' => [
                [
                    'name' => 'Cor',
                    'options' => [$this->variant?->color]
                ]
            ]
        ];
    }
}