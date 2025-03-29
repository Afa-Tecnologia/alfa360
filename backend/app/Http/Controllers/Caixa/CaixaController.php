<?php

namespace App\Http\Controllers\Caixa;

use App\Http\Controllers\Controller;
use App\Models\Caixa;
use App\Models\MovimentacaoCaixa;
use App\Models\Pedido;
use App\Services\Caixa\CaixaService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Barryvdh\DomPDF\Facade\Pdf;

class CaixaController extends Controller
{
    protected $caixaService;


    public function __construct(CaixaService $caixaService)
    {
        $this->caixaService = $caixaService;

    }

    public function open(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'saldo_inicial' => 'required|numeric|min:0',
            'observation' => 'nullable|string',
            'user_id' => 'required|exists:users,id'
        ]);

        try {
            $caixa = $this->caixaService->openCaixa(
                $validated['saldo_inicial'],
                $validated['observation'] ?? null,
                $validated['user_id']
            );

            return response()->json($caixa, 201);
        
        } catch (\Exception $e) {
            return response()->json([
                'error' => true,
                'message' => $e->getMessage(),
                'code' => 400
            ], 400);
    }
}

    public function status()
    {
        $caixa = $this->caixaService->statusCaixa();

        if (!$caixa) {
            return response()->json(['message' => 'Nenhum caixa aberto.']);
        }

        return response()->json($caixa);
    }

    public function close(Caixa $caixa, Request $request): JsonResponse
    {
        $validated = $request->validate([
            'observation' => 'nullable|string'
        ]);

        $caixa = $this->caixaService->closeCaixa(
            $caixa,
            $validated['observation'] ?? null
        );

        return response()->json($caixa);
    }
    
    public function movimentacoes(){
        $movimentacoes = $this->caixaService->getTodasMovimentacoes();
        return response()->json($movimentacoes);
    }

    public function getMovimentacoesByCaixa(Caixa $caixa){
        $movimentacoes = $caixa->movimentacoes()
            ->with(['user:id,name', 'pedido:id,cliente_id,vendedor_id,total,payment_method'])
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($movimentacoes);
    }

    public function createMovimentacao(Caixa $caixa, Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'required|in:entrada,saida',
            'value' => 'required|numeric|min:0.01',
            'description' => 'required|string|max:200',
            'payment_method' => 'nullable|string',
            'additional_data' => 'nullable|array',
            'local'=> 'required|in:loja,ecommerce'
        ]);

        $movimentacao = $this->caixaService->createMovimentacao(
            $caixa,
            $validated['type'],
            $validated['value'],
            $validated['description'],
            $validated['payment_method'] ?? null,
            $validated['additional_data'] ?? null,
            $validated['local'] ?? null
        );

        return response()->json($movimentacao, 201);
    }

    public function createMovimentacaoFromPedido(Request $request, Caixa $caixa, Pedido $pedido): JsonResponse
    {
        $movimentacao = $this->caixaService->createMovimentacaoFromPedido($caixa, $pedido);
        return response()->json($movimentacao, 201);
    }

    public function report(Caixa $caixa): JsonResponse
    {
        $report = $this->caixaService->generateReport($caixa);
        return response()->json($report);
    }

    /**
     * Retorna o histórico de caixas com filtros opcionais
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function historico(Request $request): JsonResponse
    {
        // Validação dos parâmetros
        $request->validate([
            'data_inicio' => 'nullable|date',
            'data_fim' => 'nullable|date',
            'user_id' => 'nullable|exists:users,id',
            'status' => 'nullable|in:open,closed',
            'per_page' => 'nullable|integer|min:5|max:100',
        ]);

        // Extrair filtros do request
        $filters = $request->only(['data_inicio', 'data_fim', 'user_id', 'status']);
        $perPage = $request->input('per_page', 15);

        try {
            // Obter o histórico de caixas
            $historico = $this->caixaService->getHistorico($filters, $perPage);
            
            return response()->json([
                'data' => $historico->items(),
                'meta' => [
                    'current_page' => $historico->currentPage(),
                    'from' => $historico->firstItem(),
                    'last_page' => $historico->lastPage(),
                    'per_page' => $historico->perPage(),
                    'to' => $historico->lastItem(),
                    'total' => $historico->total(),
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Erro ao buscar histórico de caixas: ' . $e->getMessage());
            return response()->json([
                'error' => 'Erro ao buscar histórico de caixas',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Retorna os detalhes de um caixa específico, incluindo suas movimentações
     *
     * @param Caixa $caixa
     * @return JsonResponse
     */
    public function detalhes(Caixa $caixa): JsonResponse
    {
        try {
            // Carrega o caixa com relacionamentos
            $caixa->load([
                'user:id,name,email',
                'movimentacoes' => function ($query) {
                    $query->with([
                        'user:id,name',
                        'pedido:id,cliente_id,vendedor_id,total,payment_method',
                        'pedido.cliente:id,name,last_name'
                    ]);
                    $query->orderBy('created_at', 'desc');
                }
            ]);
            
            // Gera o relatório para este caixa
            $report = $this->caixaService->generateReport($caixa);
            
            return response()->json([
                'caixa' => $caixa,
                'report' => $report
            ]);
            
        } catch (\Exception $e) {
            Log::error('Erro ao buscar detalhes do caixa: ' . $e->getMessage());
            return response()->json([
                'error' => 'Erro ao buscar detalhes do caixa',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Retorna o consolidado de todos os caixas em um período específico
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function consolidado(Request $request): JsonResponse
    {
        // Validação dos parâmetros
        $request->validate([
            'data_inicio' => 'nullable|date',
            'data_fim' => 'nullable|date',
        ]);

        // Extrair filtros do request
        $filters = $request->only(['data_inicio', 'data_fim']);

        try {
            // Obter o consolidado de caixas
            $consolidado = $this->caixaService->getConsolidado($filters);
            
            return response()->json($consolidado);
        } catch (\Exception $e) {
            Log::error('Erro ao gerar consolidado de caixas: ' . $e->getMessage());
            return response()->json([
                'error' => 'Erro ao gerar consolidado de caixas',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Gera um PDF com o relatório consolidado de caixas
     * 
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function consolidadoPdf(Request $request)
    {
        // Validação dos parâmetros
        $request->validate([
            'data_inicio' => 'nullable|date',
            'data_fim' => 'nullable|date',
        ]);

        // Extrair filtros do request
        $filters = $request->only(['data_inicio', 'data_fim']);

        try {
            // Obter o consolidado de caixas
            $consolidado = $this->caixaService->getConsolidado($filters);
            
            // Formatação de período para exibição no PDF
            $periodo = 'Hoje';
            if (!empty($filters['data_inicio']) && !empty($filters['data_fim'])) {
                $dataInicio = \Carbon\Carbon::parse($filters['data_inicio'])->format('d/m/Y');
                $dataFim = \Carbon\Carbon::parse($filters['data_fim'])->format('d/m/Y');
                $periodo = $dataInicio . ' até ' . $dataFim;
            }
            
            // Adaptar o formato dos dados para o template
            $dadosAdaptados = [
                'totais' => [
                    'total_vendas' => $consolidado['totais']['total_entradas'] ?? 0, // Vendas = Entradas
                    'total_entradas' => $consolidado['totais']['total_entradas'] ?? 0,
                    'total_saidas' => $consolidado['totais']['total_saidas'] ?? 0,
                    'saldo_final' => $consolidado['totais']['saldo_liquido'] ?? 0,
                ],
                'vendas_por_metodo' => [],
                'entradas_por_tipo' => [],
                'saidas_por_tipo' => []
            ];
            
            // Converter entradas por método para o formato esperado pelo template
            if (isset($consolidado['entradas_por_metodo'])) {
                foreach ($consolidado['entradas_por_metodo'] as $entrada) {
                    $metodo = $entrada['metodo'] ?? 'Não informado';
                    $dadosAdaptados['vendas_por_metodo'][$metodo] = $entrada['valor'] ?? 0;
                }
            }
            
            // Se houver caixas, incluir detalhes de cada um
            if (isset($consolidado['por_usuario']) && !empty($consolidado['por_usuario'])) {
                $dadosAdaptados['caixas'] = [];
                
                foreach ($consolidado['por_usuario'] as $usuario) {
                    $dadosAdaptados['caixas'][] = [
                        'open_date' => $consolidado['periodo']['inicio'] ?? now()->format('Y-m-d'),
                        'user_name' => $usuario['usuario']['nome'] ?? 'Usuário Desconhecido',
                        'saldo_inicial' => 0, // Não temos esse dado por usuário no consolidado
                        'total_entradas' => $usuario['total_entradas'] ?? 0,
                        'total_saidas' => $usuario['total_saidas'] ?? 0,
                        'saldo_final' => $usuario['saldo'] ?? 0,
                    ];
                }
            }
            
            // Categorias fictícias para entradas por tipo (poderíamos melhorar isso)
            $dadosAdaptados['entradas_por_tipo'] = [
                'Vendas' => $dadosAdaptados['totais']['total_entradas'],
                'Outros' => 0 // Poderia ser mais detalhado com dados reais
            ];
            
            // Categorias fictícias para saídas por tipo (poderíamos melhorar isso)
            $dadosAdaptados['saidas_por_tipo'] = [
                'Despesas' => $dadosAdaptados['totais']['total_saidas'],
                'Outros' => 0 // Poderia ser mais detalhado com dados reais
            ];
            
            // Gerar PDF usando o DomPDF
            $pdf = Pdf::loadView('pdfs.consolidado_caixa', [
                'consolidado' => $dadosAdaptados,
                'periodo' => $periodo,
                'data_emissao' => now()->format('d/m/Y H:i'),
            ]);
            
            // Configurar o PDF
            $pdf->setPaper('a4', 'portrait');
            
            // Nome do arquivo para download
            $fileName = 'LesAmis_RelatorioConsolidado_' . now()->format('Y-m-d') . '.pdf';
            
            // Retornar o PDF como download
            return $pdf->download($fileName);
            
        } catch (\Exception $e) {
            Log::error('Erro ao gerar PDF do consolidado de caixas: ' . $e->getMessage());
            return response()->json([
                'error' => 'Erro ao gerar PDF do consolidado de caixas',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
