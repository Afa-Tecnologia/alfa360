<?php

namespace App\Http\Controllers\Pedidos;

use App\Exceptions\CaixaFechadoException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Pedidos\StorePedidoRequest;
use App\Http\Requests\Pedidos\UpdatePedidoRequest;
use App\Models\Pedido;
use App\Models\Produto;
use App\Models\Variantes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;
use App\Services\Pedidos\Pedidos;
use App\Services\Pedidos\PedidoService;
use App\Services\EstoqueService;
use App\Exceptions\EstoqueInsuficienteException;
use Exception;
use App\Services\Pedidos\EstoqueHelper;
use App\Services\ApiResponseService;
use App\Services\Caixa\CaixaService;
use Carbon\Carbon;
use App\Services\Reports\ReportService;

class PedidosController extends Controller
{
    protected $pedidoService;
    protected $estoqueService;
    protected $estoqueHelper;
    protected $reportService;
    protected $caixaService;

    public function __construct(
        PedidoService $pedidoService, 
        EstoqueService $estoqueService,
        EstoqueHelper $estoqueHelper,
        ReportService $reportService,
        CaixaService $caixaService
    )
    {
        $this->pedidoService = $pedidoService;
        $this->estoqueService = $estoqueService;
        $this->estoqueHelper = $estoqueHelper;
        $this->reportService = $reportService;
        $this->caixaService = $caixaService;
        
    }

    // Método para obter todos os pedidos
    public function index()
    {
        $pedidos = $this->pedidoService->getAll();
        return ApiResponseService::json($pedidos);
    }

    // Método para criar pedidos
    public function store(StorePedidoRequest $request)
    {
        //Precisa verificar se tem algum caixa aberto
        $caixa = $this->caixaService->statusCaixa();
        if (!$caixa) {
            return response()->json([
                "error"=> "BadRequestError",
                "code"=> "400",
                "message"=> "É necessário abrir um caixa antes de realizar venda"
            ], 400);
        }
        
        try {
            
            $dataValidated = $request->validated();
            
            Log::info('Dados validados para criação de pedido:', ['data' => $dataValidated]);
            
            // Verifica disponibilidade de estoque para os produtos
            if (!$this->pedidoService->verificarDisponibilidadeEstoqueProdutos($dataValidated['produtos'])) {
                return response()->json([
                    'error' => true,
                    'message' => 'Estoque insuficiente para um ou mais produtos.'
                ], 422);
            }
            
            try {
                // Usa o serviço para criar o pedido
                Log::info('Iniciando criação do pedido via serviço');
                $pedido = $this->pedidoService->create($dataValidated);
                
                // Carregar os relacionamentos
                $pedido->load('produtos');
                
                
                return response()->json([
                    'message' => 'Pedido criado com sucesso!',
                    'pedido' => $pedido
                ], 201);
            } catch (\Exception $e) {
                Log::error('Erro ao criar pedido via serviço: ' . $e->getMessage());
                
                // Se falhar o serviço, usa a transação direta como fallback
                return DB::transaction(function () use ($dataValidated) {
                    // Criando pedido
                    $pedido = Pedido::create([
                        'cliente_id' => $dataValidated['cliente_id'],
                        'type' => $dataValidated['type'],
                        'desconto' => $dataValidated['desconto'] ?? 0,
                        'status' => $dataValidated['status'],
                        'total' => 0,
                    ]);
                    
                    // Processa os produtos e calcula o total
                    $total = $this->pedidoService->processarProdutosNoPedido($pedido, $dataValidated['produtos']);
                    
                    // Aplica o desconto usando o service
                    $total = $this->pedidoService->aplicarDesconto($total, $dataValidated['desconto'] ?? 0);
                    $pedido->update(['total' => $total]);
            
                    // Carregar os relacionamentos
                    $pedido->load('produtos');
                    
                    // Usar formato que o middleware espera
                    return response()->json([
                        'message' => 'Pedido criado com sucesso!',
                        'pedido' => $pedido
                    ], 201);
                });
            }
            
        } catch (EstoqueInsuficienteException $e) {
            Log::error('Erro de estoque: ' . $e->getMessage());
            
            return response()->json([
                'error' => true,
                'message' => $e->getMessage(),
            ], (int)$e->getCode() ?: 422);
            
        } catch (CaixaFechadoException $e) {
            return response()->json([
                'error' => true,
                'message' => $e->getMessage()
            ], $e->getCode());
        } catch (\Exception $e) {
            Log::error('Erro ao criar pedido: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            
            return response()->json([
                'error' => 'Erro ao criar pedido',
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // Método para obter um produto por ID
    public function show($id)
    {

        $pedido = $this->pedidoService->getById($id);

        
        // // Inclui os produtos associados ao pedido
        // $pedido->load('produtos'); // Garantir que os produtos sejam carregados com o pedido

        return $pedido;
    }

    // Método para obter um produto pelo nome
    public function findByCategory($id)
    {
        $pedidos = $this->pedidoService->getProdutoPorCategoria($id);
        if (!$pedidos) {
            return response()->json(
                ['error' => 'O parâmetro "id" é obrigatório ou categoria inexistente'],
                Response::HTTP_BAD_REQUEST
            );
        }

        return ApiResponseService::json($pedidos);
    }

    // Método para obter um pedidos por tipo
    public function findByType($tipo)
    {
        $pedidos = $this->pedidoService->getPedidosPorTipo($tipo);
        if (!$pedidos) {
            return response()->json(
                ['error' => 'O parâmetro "tipo" é obrigatório ou categoria inexistente'],
                Response::HTTP_BAD_REQUEST
            );
        }

        return ApiResponseService::json($pedidos);
    }

    public function update(UpdatePedidoRequest $request, $id)
    {
        try {
            $dataValidated = $request->validated();
            Log::info('Atualizando pedido ID: ' . $id);
            Log::info('Dados validados: ', $dataValidated);
            
            // Carregar o pedido existente com seus produtos
            $pedido = Pedido::with('produtos')->findOrFail($id);
            
            // Se estiver alterando produtos, verificar estoque primeiro
            if (isset($dataValidated['produtos'])) {
                if (!$this->pedidoService->verificarDisponibilidadeEstoqueProdutos($dataValidated['produtos'])) {
                    return response()->json([
                        'error' => true,
                        'message' => 'Estoque insuficiente para um ou mais produtos.'
                    ], 422);
                }
            }
            
            // Garantindo que payment_method esteja em maiúsculas se estiver presente
            if (isset($dataValidated['payment_method'])) {
                $dataValidated['payment_method'] = strtoupper($dataValidated['payment_method']);
            }
            
            return DB::transaction(function () use ($pedido, $dataValidated, $id) {
                // Atualização e estorno tratados no service
                $pedido = $this->pedidoService->update($id, $dataValidated);

                return ApiResponseService::json([
                    'message' => 'Pedido atualizado com sucesso',
                    'pedido' => $pedido->load('produtos')
                ], 200);
            });
        } catch (EstoqueInsuficienteException $e) {
            Log::error('Erro de estoque: ' . $e->getMessage());
            
            return response()->json([
                'error' => true,
                'message' => $e->getMessage(),
            ], (int)$e->getCode() ?: 422);
        } catch (\Exception $e) {
            Log::error('Erro ao atualizar pedido: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            
            return response()->json([
                'error' => 'Erro ao atualizar pedido',
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // Método para deletar um pedido
    public function delete(string $id)
    {
        try {
            // Carregar o pedido com seus produtos
            $pedido = Pedido::with('produtos')->find($id);
            
            if (!$pedido) {
                return response()->json(
                    ['error' => 'Pedido não encontrado'],
                    Response::HTTP_NOT_FOUND
                );
            }
            
            return DB::transaction(function () use ($id) {
                // Exclusão e estorno tratados no service
                $this->pedidoService->delete($id);

                return ApiResponseService::json(
                    ['message' => 'Pedido deletado com sucesso e estoque restaurado'],
                    Response::HTTP_OK
                );
            });
        } catch (\Exception $e) {
            Log::error('Erro ao deletar pedido: ' . $e->getMessage());
            return response()->json(
                ['error' => 'Erro ao deletar pedido: ' . $e->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    public function verificarEstoque(Request $request)
    {
        $data = $request->validate([
            'produtos' => 'required|array'
        ]);
        $disponivel = $this->pedidoService->verificarDisponibilidadeEstoqueProdutos($data['produtos']);
        return response()->json(['disponivel' => $disponivel]);
    }
}

