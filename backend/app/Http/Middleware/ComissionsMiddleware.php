<?php

namespace App\Http\Middleware;

use App\Models\Commission;
use App\Models\Produto;
use App\Services\Commissions\CommissionsService;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ComissionsMiddleware
{
    protected $commissionService;

    public function __construct(CommissionsService $commissionService)
    {
        Log::info('ComissionsMiddleware construído');
        $this->commissionService = $commissionService;
    }
    

    public function handle(Request $request, Closure $next)
    {
        Log::info('Iniciando ComissionsMiddleware');
        
        // Executa o próximo middleware/controller primeiro
        $response = $next($request);
        
        Log::info('Pedido criado, processando comissões');
        
        // Verifica se a resposta é um JsonResponse
        if (!($response instanceof \Illuminate\Http\JsonResponse)) {
            Log::error('Resposta não é um JsonResponse');
            return $response;
        }
        
        // Obtém os dados da resposta
        $responseData = $response->getData();
        
        // Verifica se há dados e se contém o objeto pedido
        if (!$responseData || !isset($responseData->pedido)) {
            Log::error('Resposta não contém objeto pedido', ['response' => $responseData]);
            return $response;
        }
        
        $pedido = $responseData->pedido;
        
        Log::info('Dados do pedido:', ['pedido' => $pedido]);
        
        // Verifique se os dados do pedido foram passados corretamente
        if ($request->has('produtos') && is_array($request->produtos)) {
            Log::info('Produtos encontrados:', ['produtos' => $request->produtos]);
            
            // Iterar sobre os produtos e calcular a comissão para cada um
            foreach ($request->produtos as $produto) {
                // Verifique se temos o produto e a quantidade
                if (isset($produto['produto_id'], $produto['quantidade'])) {
                    Log::info('Processando produto:', ['produto' => $produto]);
                    
                    // Obter os dados do produto
                    $productValue = $this->getProductValue($produto['produto_id']);  // Pegue o valor do produto
                    $percentageCommission = config('commissions.default_percentage', 5);  // Obtém o percentual padrão da configuração com fallback para 5
                    $piecesQuantity = $produto['quantidade'];  // Quantidade de peças

                    Log::info('Valores calculados:', [
                        'productValue' => $productValue,
                        'percentageCommission' => $percentageCommission,
                        'piecesQuantity' => $piecesQuantity
                    ]);

                    // Calcular o valor da comissão
                    $commissionValue = $this->commissionService->calcValueOfCommission($productValue, $percentageCommission, $piecesQuantity);

                    Log::info('Valor da comissão calculado:', ['commissionValue' => $commissionValue]);

                    try {
                        // Criar a comissão para cada produto
                        $commission = Commission::create([
                            'pedido_id' => $pedido->id,  // ID do pedido
                            'vendedor_id' => $request->vendedor_id,  // ID do vendedor
                            'produto_id' => $produto['produto_id'],  // ID do produto
                            'valor' => $commissionValue,
                            'quantity' => $piecesQuantity,
                            'percentual' => $percentageCommission,
                            'status' => 'pendente',  // Status da comissão
                        ]);
                        
                        Log::info('Comissão criada com sucesso:', ['commission' => $commission]);
                    } catch (\Exception $e) {
                        Log::error('Erro ao criar comissão:', [
                            'error' => $e->getMessage(),
                            'trace' => $e->getTraceAsString()
                        ]);
                    }
                }
            }
        }

        return $response;
    }

    // Função para buscar o valor do produto 
    protected function getProductValue($produto_id)
    {
        return Produto::findOrFail($produto_id)->selling_price; 
    }
}