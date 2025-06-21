<?php

use App\Http\Controllers\Produtos\ProdutoController;
use App\Http\Controllers\Auth\UserAuthController;
use App\Http\Controllers\Caixa\CaixaController;
use App\Http\Controllers\Categorias\CategoriasController;
use App\Http\Controllers\Clientes\ClientesController;
use App\Http\Controllers\Imagem\ImagemController;
use App\Http\Controllers\Pedidos\PedidosController;
use App\Http\Controllers\PedidoPagamento\PedidoPagamentoController;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\Variantes\VariantesController;
use Illuminate\Http\Request;    
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Commissions\CommissionsController;
use App\Http\Controllers\Relatorios\RelatoriosController;
use App\Http\Middleware\ComissionsMiddleware;
use App\Http\Controllers\PaymentMethods\PaymentMethodController;
use App\Http\Controllers\TiposDeProdutos\TiposDeProdutosController;
use App\Http\Controllers\TipoDeNegocios\TipoDeNegociosController;
use App\Http\Controllers\ConfigDoNegocio\ConfigDoNegocioController;
use App\Http\Controllers\Devolucao\DevolucaoController;
use App\Http\Controllers\DevolucaoItem\DevolucaoItemController;
use App\Models\Tenant;
use Illuminate\Support\Facades\Auth;
use LaravelJsonApi\Laravel\Facades\JsonApiRoute;
use LaravelJsonApi\Laravel\Http\Controllers\JsonApiController;
use App\Http\Middleware\TenantResolver;

// use App\Http\Controllers\API\EmployeeExpenseController;
// Rotas para Devolucões

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('jwt.auth', TenantResolver::class);

Route::post('signup', [UserAuthController::class, 'signup']);
Route::post('login', [UserAuthController::class, 'login']);
Route::post('refresh', [UserAuthController::class, 'refresh']);
Route::post('/logout-cookies', [UserAuthController::class, 'logoutNotTokenHeader']);
Route::middleware('jwt.auth', TenantResolver::class)->group(function () {
    Route::post('logout', [UserAuthController::class, 'logout']);
    Route::get('me', [UserAuthController::class, 'me']);
});

Route::prefix('users')->middleware('jwt.auth', TenantResolver::class)->group(function () {
    Route::get('/', [UserController::class, 'index']);
    Route::get('/vendedores', [UserController::class, 'getVendedores']);
    Route::get('{id}', [UserController::class, 'show']);
    Route::post('/', [UserController::class, 'store']);
    Route::put('{id}', [UserController::class, 'update']);
    Route::delete('{id}', [UserController::class, 'delete']);
    
});

Route::prefix('produtos')->middleware('jwt.auth', TenantResolver::class, TenantResolver::class)->group(function () {
    Route::get('/', [ProdutoController::class, 'index']);
    Route::get('{id}', [ProdutoController::class, 'show']);
    Route::get('/categoria/{id}', [ProdutoController::class, 'findByCategory']);
    Route::get('/barcode/{code}', [ProdutoController::class, 'findByBarcode']);
    Route::post('/', [ProdutoController::class, 'store']);
    Route::put('/{id}', [ProdutoController::class, 'update']);
    Route::delete('{id}', [ProdutoController::class, 'delete']);
    Route::delete('/', [ProdutoController::class, 'batchDelete']);
});

// Crie uma rota de teste temporária:
Route::get('/debug-tenant', function() {
    return [
        'authenticated' => Auth::check(),
        'user_id' => Auth::id(),
        'user_tenant_id' => Auth::user()->tenant_id ?? null,
        'current_tenant_id' => Tenant::current() ? Tenant::current()->id : null,
        'produtos_sem_scope' => \App\Models\Produto::withoutGlobalScopes()->count(),
        'produtos_com_scope' => \App\Models\Produto::count(),
        'sql_query' => \App\Models\Produto::toSql(),
    ];
})->middleware('jwt.auth', TenantResolver::class, \App\Http\Middleware\TenantResolver::class);

Route::prefix('pedidos')->middleware('jwt.auth', TenantResolver::class)->group(function () {
    Route::get('/', [PedidosController::class, 'index']);
 
    Route::get('{id}', [PedidosController::class, 'show']);
    Route::get('/categoria/{id}', [PedidosController::class, 'findByCategory']);
    Route::get('/tipo/{tipo}', [PedidosController::class, 'findByType']);
    Route::post('/', [PedidosController::class, 'store'])->middleware(ComissionsMiddleware::class);
    Route::put('/{id}', [PedidosController::class, 'update']);
    Route::delete('{id}', [PedidosController::class, 'delete']);
});

Route::prefix('pagamentos')->middleware('jwt.auth', TenantResolver::class)->group(function () {
    Route::get('/{pedido}',[PedidoPagamentoController::class, 'getPagamentoPorPedido']);
    Route::post('/{pedido}', [PedidoPagamentoController::class, 'store']);
});

JsonApiRoute::server('v1')
    ->prefix('v1')
    ->middleware('jwt.auth', TenantResolver::class)
    ->resources(function ($server) {
        $server->resource('devolucoes', DevolucaoController::class);
    });



Route::prefix('relatorios')->middleware('jwt.auth', TenantResolver::class)->group(function () {
    Route::get('/resumo', [RelatoriosController::class, 'getSalesSummary']);
    Route::get('/por-categoria', [RelatoriosController::class, 'getSalesByCategory']);
    Route::get('/produtos-mais-vendidos', [RelatoriosController::class, 'getTopProducts']);
    Route::get('/receita-por-periodo', [RelatoriosController::class, 'getRevenueByPeriod']);
    Route::get('/pedidos', [RelatoriosController::class, 'getOrders']);
    Route::prefix('comissoes')->group(function () {
        Route::get('/', [CommissionsController::class, 'index']); // Comissões do mês atual
        Route::get('/vendedor/{id}', [CommissionsController::class, 'getCommissionsByVendedor']);
        Route::get('/vendedor/{id}/comissoes', [CommissionsController::class, 'getCommissionsByVendedorAndDate']);
    });
});

Route::prefix('categorias')->middleware('jwt.auth', TenantResolver::class)->group(function () {
    Route::get('/', [CategoriasController::class, 'index']);
    Route::get('{id}', [CategoriasController::class, 'show']);
    Route::post('/', [CategoriasController::class, 'store']);
    Route::put('{id}', [CategoriasController::class, 'update']);
    Route::delete('{id}', [CategoriasController::class, 'delete']);
});

Route::prefix('clientes')->middleware('jwt.auth', TenantResolver::class)->group(function () {
    Route::get('/', [ClientesController::class, 'index']);
    Route::get('{id}', [ClientesController::class, 'show']);
    Route::post('/', [ClientesController::class, 'store']);
    Route::put('{id}', [ClientesController::class, 'update']);
    Route::delete('{id}', [ClientesController::class, 'delete']);
});

Route::prefix('variantes')->middleware('jwt.auth', TenantResolver::class)->group(function () {
    Route::get('/', [VariantesController::class, 'index']);
    Route::get('{id}', [VariantesController::class, 'show']);
    Route::post('/', [VariantesController::class, 'store']);
    Route::put('{id}', [VariantesController::class, 'update']);
    Route::delete('{id}', [VariantesController::class, 'delete']);
});

Route::middleware('jwt.auth', TenantResolver::class)->group(function () {
    Route::post('/caixa/open', [CaixaController::class, 'open']);
    Route::get('/caixa/status', [CaixaController::class, 'status']);
    Route::get('/caixa/movimentacoes', [CaixaController::class, 'movimentacoes']);
    Route::post('/caixa/{caixa}/close', [CaixaController::class, 'close']);
    Route::post('/caixa/{caixa}/movimentacao', [CaixaController::class, 'createMovimentacao']);
    Route::get('/caixa/{caixa}/report', [CaixaController::class, 'report']);
    Route::post('/caixa/{caixa}/pedido/{pedido}/movimentacao', [CaixaController::class, 'createMovimentacaoFromPedido']);
    Route::get('/caixa/historico', [CaixaController::class, 'historico']);
    Route::get('/caixa/{caixa}/detalhes', [CaixaController::class, 'detalhes']);
    Route::get('/caixa/{caixa}/movimentacoes', [CaixaController::class, 'getMovimentacoesByCaixa']);
    //Para gerar relatório pdf
    Route::get('/caixa/consolidado', [CaixaController::class, 'consolidado']);
    Route::get('/caixa/consolidado/pdf', [CaixaController::class, 'consolidadoPdf']);
});

Route::middleware('jwt.auth', TenantResolver::class)->group(function () {
    Route::get('payment-methods', [PaymentMethodController::class, 'index']);
    Route::get('payment-methods/{id}', [PaymentMethodController::class, 'show']);
    Route::post('payment-methods', [PaymentMethodController::class, 'store']);
    Route::put('payment-methods/{id}', [PaymentMethodController::class, 'update']);
    Route::delete('payment-methods/{id}', [PaymentMethodController::class, 'destroy']); 
}   
);

// Route::apiResource('payment-methods', PaymentMethodController::class)->middleware('jwt.auth', TenantResolver::class);

// Rotas para Tipos de Produtos
Route::prefix('tipos-produtos')->middleware('jwt.auth', TenantResolver::class)->group(function () {
    Route::get('/', [TiposDeProdutosController::class, 'index']);
    Route::get('{id}', [TiposDeProdutosController::class, 'show']);
    Route::post('/', [TiposDeProdutosController::class, 'store']);
    Route::put('{id}', [TiposDeProdutosController::class, 'update']);
    Route::delete('{id}', [TiposDeProdutosController::class, 'destroy']);
});

// Rotas para Tipos de Negócios
Route::prefix('tipos-negocios')->middleware('jwt.auth', TenantResolver::class)->group(function () {
    Route::get('/', [TipoDeNegociosController::class, 'index']);
    Route::get('{id}', [TipoDeNegociosController::class, 'show']);
    Route::post('/', [TipoDeNegociosController::class, 'store']);
    Route::put('{id}', [TipoDeNegociosController::class, 'update']);
    Route::delete('{id}', [TipoDeNegociosController::class, 'destroy']);
});

// Rotas para Configurações de Negócio
Route::prefix('config-negocio')->middleware('jwt.auth', TenantResolver::class)->group(function () {
    Route::get('/', [ConfigDoNegocioController::class, 'index']);
    Route::get('{id}', [ConfigDoNegocioController::class, 'show']);
    Route::post('/', [ConfigDoNegocioController::class, 'store']);
    Route::put('{id}', [ConfigDoNegocioController::class, 'update']);
    Route::delete('{id}', [ConfigDoNegocioController::class, 'destroy']);
});

// Route::middleware(['jwt.auth', TenantResolver::class])->group(function () {
//     Route::prefix('despesas')->group(function () {
//         Route::get('/', [EmployeeExpenseController::class, 'index']);
//         Route::get('/summary', [EmployeeExpenseController::class, 'summary']);
//         Route::get('/funcionario/{id}', [EmployeeExpenseController::class, 'byEmployee']);
//         Route::post('/', [EmployeeExpenseController::class, 'store']);
//         Route::put('/{id}', [EmployeeExpenseController::class, 'update']);
//         Route::delete('/{id}', [EmployeeExpenseController::class, 'destroy']);
//     });
// });