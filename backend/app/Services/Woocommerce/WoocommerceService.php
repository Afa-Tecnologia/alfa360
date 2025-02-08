<?php

namespace App\Services\Woocommerce;

use Exception;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use GuzzleHttp\Psr7\Request;
use GuzzleHttp\Psr7\Response;
use Illuminate\Http\Client\Response as ClientResponse;
use Illuminate\Support\Facades\DB;

class WoocommerceService
{
    protected $client;

    public function __construct()
    {
        $this->client = new Client([
            'base_uri' => 'https://lightpink-dove-983708.hostingersite.com/wp-json/wc/v3/',
            'auth' => ['ck_ec7bbe2beb9fd1d5446df5d74c8bd26d2ff157af', 'cs_194f0afc83b79d539f3c4b6476670e22d9d9853f'],
            'headers' => ['Content-Type' => 'application/json']
        ]);
    }

    /**
     * Categorias
     */
    public function createCategory(array $data)
    {
        try {
            $categoriaWoocommerce = $this->request('POST', 'products/categories', $data);

            if (!empty($categoriaWoocommerce) && isset($categoriaWoocommerce['id'])) {
                DB::table('woocommerce_sync')->insert([
                    'pdv_id' => $data['pdv_id'],
                    'woocommerce_id' => $categoriaWoocommerce['id'], // Acessando como array
                    'entity_type' => 'category',
                ]);
            }

            return response()->json(['woocommerce' => $categoriaWoocommerce]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'message' => 'Não conseguiu criar no woocommerce',
                'trace' => $e->getTraceAsString()
            ]);
        }
    }

    public function updateCategory(int $categoryId, array $data)
    {
        return $this->request('PUT', "products/categories/{$categoryId}", $data);
    }

    public function deleteCategory(int $woocommerceCategoryId)
    {
        return $this->request('DELETE', "products/categories/{$woocommerceCategoryId}", ['force' => true]);
    }

    /**
     * Produtos
     */

    /**
     * Cria um Produto no WooCommerce
     */
    public function createProduct(array $data)
    {
        try {
            $productoWoocommerce = $this->request('POST', 'products/categories', $data);

            if (!empty($productoWoocommerce) && isset($productoWoocommerce['id'])) {
                DB::table('woocommerce_sync')->insert([
                    'pdv_id' => $data['pdv_id'],
                    'woocommerce_id' => $productoWoocommerce['id'], // Acessando como array
                    'entity_type' => 'product',
                ]);
            }

            return response()->json(['woocommerce' => $productoWoocommerce]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'message' => 'Não conseguiu criar o produto no woocommerce',
                'trace' => $e->getTraceAsString()
            ]);
        }
        // return $this->request('POST', 'products', $data);
    }

    /**
     * Atualiza um Produto
     */
    public function updateProduct(int $productId, array $data)
    {
        return $this->request('PUT', "products/{$productId}", $data);
    }

    /**
     * Deleta um Produto
     */
    public function deleteProduct(int $productId)
    {
        return $this->request('DELETE', "products/{$productId}", ['force' => true]);
    }

    // Método genérico para requisições
    private function request(string $method, string $uri, array $data = [])
    {
        try {
            $response = $this->client->request($method, $uri, ['json' => $data]);
            return json_decode($response->getBody(), true);
        } catch (RequestException $e) {
            return [
                'error' => true,
                'message' => $e->getMessage()
            ];
        }
    }
}
