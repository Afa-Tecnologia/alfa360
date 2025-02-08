<?php

use App\Http\Controllers\Produtos\ProdutoController;
use App\Http\Controllers\Auth\UserAuthController;
use App\Http\Controllers\Caixa\CaixaController;
use App\Http\Controllers\Categorias\CategoriasController;
use App\Http\Controllers\Clientes\ClientesController;
use App\Http\Controllers\Imagem\ImagemController;
use App\Http\Controllers\Pedidos\PedidosController;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\Variantes\VariantesController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Commissions\CommissionsController;
use Illuminate\Support\Facades\Http;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('signup', [UserAuthController::class, 'signup']);
Route::post('login', [UserAuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('logout', [UserAuthController::class, 'logout']);

Route::prefix('users2')->group(function () {
    Route::get('/', [UserController::class, 'index']);
    Route::get('{id}', [UserController::class, 'show']);
    Route::post('/', [UserController::class, 'store']);
    Route::put('{id}', [UserController::class, 'update']);
    Route::delete('{id}', [UserController::class, 'delete']);
});

Route::prefix('produtos')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [ProdutoController::class, 'index']);
    Route::get('{id}', [ProdutoController::class, 'show']);
    Route::get('/categoria/{id}', [ProdutoController::class, 'findByCategory']);
    Route::post('/', [ProdutoController::class, 'store']);
    Route::put('/{id}', [ProdutoController::class, 'update']);
    Route::delete('{id}', [ProdutoController::class, 'delete']);
});

Route::prefix('pedidos')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [PedidosController::class, 'index']);
    Route::get('{id}', [PedidosController::class, 'show']);
    Route::get('/categoria/{id}', [PedidosController::class, 'findByCategory']);
    Route::get('/tipo/{tipo}', [PedidosController::class, 'findByType']);
    Route::post('/', [PedidosController::class, 'store']);
    Route::put('/{id}', [PedidosController::class, 'update']);
    Route::delete('{id}', [PedidosController::class, 'delete']);
});

Route::prefix('comissoes')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [CommissionsController::class, 'index']); // Comissões do mês atual
    Route::get('/vendedor/{id}', [CommissionsController::class, 'comissaoPorVendedor']); // Consolidado por vendedora
    Route::get('/vendedor/{id}/comissoes', [CommissionsController::class, 'getCommissionsByVendedorAndDate']);
});

Route::prefix('categorias')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [CategoriasController::class, 'index']);
    Route::get('{id}', [CategoriasController::class, 'show']);
    Route::post('/', [CategoriasController::class, 'store']);
    Route::put('{id}', [CategoriasController::class, 'update']);
    Route::delete('{id}', [CategoriasController::class, 'delete']);
});

Route::prefix('clientes')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [ClientesController::class, 'index']);
    Route::get('{id}', [ClientesController::class, 'show']);
    Route::post('/', [ClientesController::class, 'store']);
    Route::put('{id}', [ClientesController::class, 'update']);
    Route::delete('{id}', [ClientesController::class, 'delete']);
});

Route::prefix('variantes')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [VariantesController::class, 'index']);
    Route::get('{id}', [VariantesController::class, 'show']);
    Route::post('/', [VariantesController::class, 'store']);
    Route::put('{id}', [VariantesController::class, 'update']);
    Route::delete('{id}', [VariantesController::class, 'delete']);
});

Route::prefix('imagens')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [ImagemController::class, 'index']);
    Route::get('{id}', [ImagemController::class, 'show']);
    Route::post('/', [ImagemController::class, 'store']);
    Route::put('{id}', [ImagemController::class, 'update']);
    Route::delete('{id}', [ImagemController::class, 'delete']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/caixa/open', [CaixaController::class, 'open']);
    Route::get('/caixa/status', [CaixaController::class, 'status']);
    Route::get('/caixa/movimentacoes', [CaixaController::class, 'movimentacoes']);
    Route::post('/caixa/{caixa}/close', [CaixaController::class, 'close']);
    Route::post('/caixa/{caixa}/movimentacao', [CaixaController::class, 'createMovimentacao']);
    Route::get('/caixa/{caixa}/report', [CaixaController::class, 'report']);
    Route::post('/caixa/{caixa}/pedido/{pedido}/movimentacao', [CaixaController::class, 'createMovimentacaoFromPedido']);
});

Route::get('/test', function () {
    return response()->json(['message' => 'API Funcionando!']);
});

Route::get('/woocommerce', function() {
    $response = Http::withBasicAuth(
        config('services.woocommerce.key'),
        config('services.woocommerce.secret')
    )->get(config('services.woocommerce.url').'/wp-json/wc/v3/products');

    return $response->json();
});

Route::options('/{any}', function () {
    return response('', 200)
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
})->where('any', '.*');


