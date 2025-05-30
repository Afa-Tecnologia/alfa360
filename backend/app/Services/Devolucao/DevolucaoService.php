<?php

namespace App\Services\Devolucao;

use App\Models\Devolucao;
use App\Models\DevolucaoItem;
use App\Models\PedidosProduto;
use App\Models\Pedido;
use App\Services\EstoqueService;
use App\Services\PedidoPagamento\PedidoPagamentoService;
use App\Services\Pedidos\PedidoService;
use Illuminate\Support\Str;
use Exception;
use Illuminate\Support\Facades\DB;

class DevolucaoService
{
    protected $estoqueService;
    protected $pagamentoService;
    protected $pedidoService;

    public function __construct(
        EstoqueService $estoqueService,
        PedidoPagamentoService $pagamentoService,
        PedidoService $pedidoService
    ) {
        $this->estoqueService = $estoqueService;
        $this->pagamentoService = $pagamentoService;
        $this->pedidoService = $pedidoService;
    }

    /**
     * Cria uma solicitação de devolução
     */
    public function criarDevolucao(array $data): Devolucao
    {
        return DB::transaction(function () use ($data) {
            $devolucao = Devolucao::create([
                'pedido_id' => $data['pedido_id'],
                'cliente_id' => $data['cliente_id'],
                'motivo' => $data['motivo'],
                'tipo' => $data['tipo'],
                'observacoes' => $data['observacoes'] ?? null,
                'status' => 'pendente',
                'valor_reembolso' => 0,
            ]);

            $valorTotalReembolso = 0;

            foreach ($data['itens'] as $item) {
                $pedidoProduto = PedidosProduto::findOrFail($item['pedido_produto_id']);

                if ($item['quantidade'] > $pedidoProduto->quantidade) {
                    throw new Exception('Quantidade devolvida maior do que a quantidade comprada.');
                }

                $valorItem = $pedidoProduto->valor_unitario * $item['quantidade'];

                $devolucao->itens()->create([
                    'pedido_produto_id' => $pedidoProduto->id,
                    'produto_id' => $pedidoProduto->produto_id,
                    'variante_id' => $pedidoProduto->variante_id,
                    'quantidade' => $item['quantidade'],
                    'valor_unitario' => $pedidoProduto->valor_unitario,
                    'motivo' => $item['motivo'] ?? null,
                ]);

                $valorTotalReembolso += $valorItem;
            }

            $devolucao->update([
                'valor_reembolso' => $valorTotalReembolso,
            ]);

            return $devolucao->load('itens');
        });
    }

    /**
     * Cria uma devolução com itens (padrão JSON:API ou payload estruturado)
     */
    public function createWithItens(array $attributes, array $relationships): Devolucao
    {
        return DB::transaction(function () use ($attributes, $relationships) {
            // Cria a devolução
            $devolucao = Devolucao::create([
                'motivo' => $attributes['motivo'],
                'tipo' => $attributes['tipo'],
                'observacao' => $attributes['observacao'] ?? null,
                'pedido_id' => $attributes['pedido_id'],
                'cliente_id' => $attributes['cliente_id'],
                'data_solicitacao' => $attributes['data_solicitacao'] ?? now(),
                'uuid' => (string) Str::uuid(),
            ]);

            // Cria os itens vinculados
            foreach ($relationships['itens']['data'] as $itemData) {
                $itemAttributes = $itemData['attributes'];
                $itemRelationships = $itemData['relationships'];

                DevolucaoItem::create([
                    'devolucao_id' => $devolucao->id,
                    'pedido_id'    => $devolucao->pedido_id,
                    'produto_id'   => $itemRelationships['produto']['data']['id'] ?? null,
                    'variante_id'  => $itemRelationships['variante']['data']['id'] ?? null,
                    'quantidade'   => $itemAttributes['quantidade'] ?? 1,
                    'valor_unitario' => $itemAttributes['valor_unitario'] ?? 0,
                    'valor_total'    => $itemAttributes['valor_total'] ?? 0,
                ]);
            }

            return $devolucao;
        });
    }

    /**
     * Aprovar a devolução
     */
    public function aprovarDevolucao(Devolucao $devolucao): Devolucao
    {
        $devolucao->update([
            'status' => 'aprovado',
            'data_aprovacao' => now(),
        ]);

        return $devolucao->fresh('itens');
    }

    /**
     * Rejeitar a devolução
     */
    public function rejeitarDevolucao(Devolucao $devolucao): Devolucao
    {
        $devolucao->update([
            'status' => 'reprovado',
            'data_aprovacao' => now(),
        ]);

        return $devolucao->fresh('itens');
    }

    /**
     * Processar devolução:
     * - Estornar estoque
     * - Estornar pagamento
     */
    public function processarDevolucao(Devolucao $devolucao): Devolucao
    {
        return DB::transaction(function () use ($devolucao) {
            if ($devolucao->status !== 'aprovado') {
                throw new Exception('Devolução não aprovada.');
            }

            foreach ($devolucao->itens as $item) {
                $this->estoqueService->estornarEstoque($item->variante_id, $item->quantidade);
            }

            $this->pagamentoService->estornarPagamento($devolucao->pedido_id);

            $devolucao->update([
                'status' => 'processado',
                'data_processamento' => now(),
            ]);

            return $devolucao->fresh('itens');
        });
    }
}

