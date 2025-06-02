<?php

namespace App\JsonApi\V1\Devolucoes;

use Illuminate\Validation\Rule;
use LaravelJsonApi\Laravel\Http\Requests\ResourceRequest;
use LaravelJsonApi\Validation\Rule as ValidationRule;

class DevolucaoRequest extends ResourceRequest
{
    public function authorize(): bool
    {
        return true; // Implementar lógica de autorização específica
    }

    public function rules(): array
    {
        
        
        return [
            'motivo' => ['required', 'string', Rule::in([
                'defeito', 'garantia', 'arrependimento', 'condicional', 'outro'
            ])],
            'tipo' => ['required', 'string', Rule::in(['total', 'parcial'])],
            'estado' => [Rule::in(['pendente', 'aprovado', 'rejeitado', 'processado'])
            ],
            'observacao' => ['nullable', 'string', 'max:1000'],
            'data_solicitacao' => ['nullable', 'date'],
            'data_processamento' => ['nullable', 'date', 'after_or_equal:data_solicitacao'],
            'valor_reembolso' => ['nullable', 'numeric', 'min:0'],
            'prazo_devolucao' => ['nullable', 'date', 'after:today'],
        ];
    }

    public function relationshipRules(): array
    {
        return [
            'pedido' => ValidationRule::toOne(),
            'cliente' => ValidationRule::toOne(),
            'itens' => ValidationRule::toMany()
        ];
    }

    // Validação customizada para regras de negócio
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $this->validateBusinessRules($validator);
        });
    }

    private function validateBusinessRules($validator)
    {
        // Validar prazo de devolução por motivo
        if ($this->has('motivo') && $this->has('data_solicitacao')) {
            $this->validateReturnDeadline($validator);
        }

        // Validar valor de reembolso
        if ($this->has('valor_reembolso') && $this->has('pedido')) {
            $this->validateRefundAmount($validator);
        }
    }

    private function validateReturnDeadline($validator)
    {
        $motivo = $this->input('motivo');
        $dataSolicitacao = $this->input('data_solicitacao');
        
        $prazos = [
            'arrependimento' => 7,  // 7 dias
            'defeito' => 30,        // 30 dias
            'garantia' => 90,       // 90 dias
            'condicional' => 3,     // 3 dias
        ];

        if (isset($prazos[$motivo])) {
            // Implementar lógica de validação de prazo
        }
    }

    public function messages(): array
    {
        return [
            'motivo.required' => 'O motivo de devolução é obrigatório.',
            'motivo.in' => 'O motivo deve ser: defeito, garantia, arrependimento, condicional ou outro.',
            'tipo.required' => 'O tipo da devolução é obrigatório.',
            'tipo.in' => 'O tipo deve ser: total ou parcial.',
            'estado.in' => 'O status deve ser: pendente, aprovado, rejeitado ou processado.',
            'observacao.max' => 'A observação não pode ter mais de 1000 caracteres.',
            'data_processamento.after_or_equal' => 'A data de processamento deve ser posterior à data de solicitação.',
            'valor_reembolso.numeric' => 'O valor de reembolso deve ser um número.',
            'valor_reembolso.min' => 'O valor de reembolso deve ser maior ou igual a zero.',
            'prazo_devolucao.after' => 'O prazo de devolução deve ser no futuro.',
        ];
    }
}