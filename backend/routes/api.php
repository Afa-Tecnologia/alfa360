<?php

use App\Http\Controllers\Atributos\AtributosController;
use App\Http\Controllers\Produtos\ProdutoController;
use App\Http\Controllers\Auth\UserAuthController;
use App\Http\Controllers\Caixa\CaixaController;
use App\Http\Controllers\Categorias\CategoriasController;
use App\Http\Controllers\Clientes\ClientesController;
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
use App\Http\Controllers\Empresa\EmpresaController;
use App\Http\Controllers\Tenant\TenantController;
use App\Models\Tenant;
use Illuminate\Support\Facades\Auth;
use LaravelJsonApi\Laravel\Facades\JsonApiRoute;
use App\Http\Middleware\TenantResolver;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:api', TenantResolver::class);

Route::post('login', [UserAuthController::class, 'login']);
Route::post('refresh', [UserAuthController::class, 'refresh']);
Route::post('/logout-cookies', [UserAuthController::class, 'logoutNotTokenHeader']);
Route::post('logout', [UserAuthController::class, 'logout']);
Route::middleware('auth:api', TenantResolver::class)->group(function () {
    Route::post('signup', [UserAuthController::class, 'signup']);
    Route::get('me', [UserAuthController::class, 'me']);
});

Route::prefix('users')->middleware('auth:api', TenantResolver::class)->group(function () {
    Route::get('/', [UserController::class, 'index']);
    Route::get('/vendedores', [UserController::class, 'getVendedores']);
    Route::get('{id}', [UserController::class, 'show']);

    Route::post('/', [UserController::class, 'store'])->middleware('role:admin|super_admin|gerente');
    Route::put('{id}', [UserController::class, 'update'])->middleware('role:admin|super_admin|gerente');
    Route::delete('{id}', [UserController::class, 'delete'])->middleware('role:admin|super_admin|gerente');
    
});

// Rotas para tenants
Route::prefix('tenants')->middleware(['auth:api', 'role:super_admin'])->group(function () {
    Route::get('/', [TenantController::class, 'index']);
    Route::post('/', [TenantController::class, 'store']);
    Route::get('{id}', [TenantController::class, 'show']);
    Route::put('{id}', [TenantController::class, 'update']);
    Route::delete('{id}', [TenantController::class, 'delete']);
});


Route::prefix('empresas')->middleware(['auth:api', 'role:super_admin'])->group(function () {
    Route::get('/', [EmpresaController::class, 'index']);
    Route::post('/', [EmpresaController::class, 'store']);
    Route::get('{id}', [EmpresaController::class, 'show']);
    Route::put('{id}', [EmpresaController::class, 'update']);
    Route::delete('{id}', [EmpresaController::class, 'delete']);
});


Route::prefix('produtos')->middleware('auth:api', TenantResolver::class)->group(function () {
    Route::get('/', [ProdutoController::class, 'index']);
    Route::get('/search', [ProdutoController::class, 'search']);
    Route::get('{id}', [ProdutoController::class, 'show']);
    Route::get('/categoria/{id}', [ProdutoController::class, 'findByCategory']);
    Route::get('/barcode/{code}', [ProdutoController::class, 'findByBarcode']);
    Route::post('/', [ProdutoController::class, 'store']);
    Route::put('/{id}', [ProdutoController::class, 'update']);
    Route::delete('{id}', [ProdutoController::class, 'delete'])->middleware('role:admin|super_admin|gerente');
    Route::delete('/', [ProdutoController::class, 'batchDelete'])->middleware('role:admin|super_admin|gerente');
});

Route::prefix('atributos')->middleware(['auth:api'])->group(function () {
    Route::get('/', [AtributosController::class, 'index'])->middleware('role:admin|super_admin|gerente|vendedor');
    Route::get('/por-tipo-de-negocio', [AtributosController::class, 'indexByTipoDeNegocio'])->middleware('role:admin|super_admin|gerente|vendedor');
    Route::post('/', [AtributosController::class, 'store'])->middleware('role:admin|super_admin|gerente');
    Route::get('{id}', [AtributosController::class, 'show'])->middleware('role:admin|super_admin|gerente|vendedor');
    Route::put('{id}', [AtributosController::class, 'update'])->middleware('role:admin|super_admin|gerente');
    Route::delete('{id}', [AtributosController::class, 'delete'])->middleware('role:admin|super_admin|gerente');
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
        'roles' => Auth::check() ? Auth::user()->getRoleNames() : [],
    ];
})->middleware('auth:api', TenantResolver::class, \App\Http\Middleware\TenantResolver::class);

Route::prefix('pedidos')->middleware('auth:api', TenantResolver::class)->group(function () {
    Route::get('/', [PedidosController::class, 'index']);
    Route::get('{id}', [PedidosController::class, 'show']);
    Route::get('/categoria/{id}', [PedidosController::class, 'findByCategory']);
    Route::get('/tipo/{tipo}', [PedidosController::class, 'findByType']);
    Route::post('/', [PedidosController::class, 'store'])->middleware(ComissionsMiddleware::class);
    //Admin e super admin
    Route::put('/{id}', [PedidosController::class, 'update'])->middleware(['role:admin|super_admin']);
    Route::delete('{id}', [PedidosController::class, 'delete'])->middleware(['role:admin|super_admin']);
});

Route::prefix('pagamentos')->middleware('auth:api', TenantResolver::class)->group(function () {
    Route::get('/{pedido}',[PedidoPagamentoController::class, 'getPagamentoPorPedido']);
    Route::post('/{pedido}', [PedidoPagamentoController::class, 'store']);
});

JsonApiRoute::server('v1')
    ->prefix('v1')
    ->middleware('auth:api', TenantResolver::class)
    ->resources(function ($server) {
        $server->resource('devolucoes', DevolucaoController::class)
        ->middleware(["update"=>"role:super_admin|admin",
                      "delete"=>"role:super_admin|admin",
                      "edit"=>"role:super_admin|admin",
                      "destroy"=>"role:super_admin|admin"
                    ]);
    });

Route::prefix('relatorios')->middleware(['auth:api'], TenantResolver::class)->group(function () {
    Route::get('/resumo', [RelatoriosController::class, 'getSalesSummary']);
    Route::get('/por-categoria', [RelatoriosController::class, 'getSalesByCategory'])->middleware('role:admin|super_admin');;
    Route::get('/produtos-mais-vendidos', [RelatoriosController::class, 'getTopProducts'])->middleware('role:admin|super_admin');;
    Route::get('/receita-por-periodo', [RelatoriosController::class, 'getRevenueByPeriod'])->middleware('role:admin|super_admin');;
    Route::get('/pedidos', [RelatoriosController::class, 'getOrders']);
    Route::prefix('comissoes')->group(function () {
        Route::get('/', [CommissionsController::class, 'index'])->middleware('role:admin|super_admin'); // Comissões do mês atual
        Route::get('/vendedor/{id}', [CommissionsController::class, 'getCommissionsByVendedor']);
        Route::get('/vendedor/{id}/comissoes', [CommissionsController::class, 'getCommissionsByVendedorAndDate']);
    });
});

Route::prefix('categorias')->middleware('auth:api', TenantResolver::class)->group(function () {
    Route::get('/', [CategoriasController::class, 'index']);
    Route::get('{id}', [CategoriasController::class, 'show']);
    Route::post('/', [CategoriasController::class, 'store'])->middleware('role:admin|super_admin|gerente');
    Route::put('{id}', [CategoriasController::class, 'update'])->middleware('role:admin|super_admin|gerente');
    Route::delete('{id}', [CategoriasController::class, 'delete'])->middleware('role:admin|super_admin|gerente');
});

Route::prefix('clientes')->middleware('auth:api', TenantResolver::class)->group(function () {
    Route::get('/', [ClientesController::class, 'index']);
    Route::get('{id}', [ClientesController::class, 'show']);
    Route::post('/', [ClientesController::class, 'store']);
    Route::put('{id}', [ClientesController::class, 'update']);
    Route::delete('{id}', [ClientesController::class, 'delete'])->middleware('role:admin|super_admin|gerente');;
});

Route::prefix('variantes')->middleware('auth:api', TenantResolver::class)->group(function () {
    Route::get('/', [VariantesController::class, 'index']);
    Route::get('{id}', [VariantesController::class, 'show']);
    Route::post('/', [VariantesController::class, 'store']);
    Route::put('{id}', [VariantesController::class, 'update']);
    Route::delete('{id}', [VariantesController::class, 'delete'])->middleware('role:admin|super_admin|gerente');;
});

Route::middleware('auth:api', TenantResolver::class)->group(function () {
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
    Route::get('/caixa/consolidado', [CaixaController::class, 'consolidado']);
    Route::get('/caixa/consolidado/pdf', [CaixaController::class, 'consolidadoPdf']);
});

Route::middleware('auth:api', TenantResolver::class)->group(function () {
    Route::get('payment-methods', [PaymentMethodController::class, 'index']);
    Route::get('payment-methods/{id}', [PaymentMethodController::class, 'show']);
    Route::post('payment-methods', [PaymentMethodController::class, 'store'])->middleware('role:admin|super_admin|gerente');;
    Route::put('payment-methods/{id}', [PaymentMethodController::class, 'update'])->middleware('role:admin|super_admin|gerente');;
    Route::delete('payment-methods/{id}', [PaymentMethodController::class, 'destroy'])->middleware('role:admin|super_admin|gerente');; 
}   
);
// Rotas para Tipos de Produtos
Route::prefix('tipos-produtos')->middleware('auth:api', TenantResolver::class)->group(function () {
    Route::get('/', [TiposDeProdutosController::class, 'index']);
    Route::get('{id}', [TiposDeProdutosController::class, 'show']);
    Route::post('/', [TiposDeProdutosController::class, 'store'])->middleware('role:admin|super_admin|gerente');;
    Route::put('{id}', [TiposDeProdutosController::class, 'update'])->middleware('role:admin|super_admin|gerente');;
    Route::delete('{id}', [TiposDeProdutosController::class, 'destroy'])->middleware('role:admin|super_admin|gerente');;
});

// Rotas para Tipos de Negócios
Route::prefix('tipos-negocios')->middleware('auth:api', TenantResolver::class)->group(function () {
    Route::get('/', [TipoDeNegociosController::class, 'index']);
    Route::get('{id}', [TipoDeNegociosController::class, 'show']);
    Route::post('/', [TipoDeNegociosController::class, 'store'])->middleware('role:admin|super_admin|gerente');;
    Route::put('{id}', [TipoDeNegociosController::class, 'update'])->middleware('role:admin|super_admin|gerente');;
    Route::delete('{id}', [TipoDeNegociosController::class, 'destroy'])->middleware('role:admin|super_admin|gerente');;
});

// Rotas para Configurações de Negócio
Route::prefix('config-negocio')->middleware('auth:api', TenantResolver::class)->group(function () {
    Route::get('/', [ConfigDoNegocioController::class, 'index']);
    Route::get('{id}', [ConfigDoNegocioController::class, 'show']);
    Route::post('/', [ConfigDoNegocioController::class, 'store'])->middleware('role:admin|super_admin|gerente');;
    Route::put('{id}', [ConfigDoNegocioController::class, 'update'])->middleware('role:admin|super_admin|gerente');;
    Route::delete('{id}', [ConfigDoNegocioController::class, 'destroy'])->middleware('role:admin|super_admin|gerente');;
});
