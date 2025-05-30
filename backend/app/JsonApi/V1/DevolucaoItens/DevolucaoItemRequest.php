<?php

namespace App\JsonApi\V1\DevolucaoItens;

use Illuminate\Validation\Rule;
use LaravelJsonApi\Laravel\Http\Requests\ResourceRequest;
use LaravelJsonApi\Validation\Rule as JsonApiRule;

class DevolucaoItemRequest extends ResourceRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules for the resource.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'quantidade' => ['required', 'numeric', 'min:1'],
            'motivo' => ['nullable', 'string'],
            'valor_unitario' => ['nullable', 'numeric', 'min:0'],
        ];
    }

    /**
     * Get the validation rules for the resource relationships.
     *
     * @return array
     */
    public function relationshipRules(): array
    {
        return [
            'devolucao' => JsonApiRule::toOne('devolucoes'),
            'pedido' => JsonApiRule::toOne('pedidos'),
        ];
    }

    public function includePaths(): array
    {
        return ['itens', 'pedido', 'cliente'];
    }


    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'quantidade.required' => 'A quantidade é obrigatória.',
            'quantidade.numeric' => 'A quantidade deve ser um número.',
            'quantidade.min' => 'A quantidade deve ser pelo menos 1.',
            'valor_unitario.numeric' => 'O valor unitário deve ser um número.',
            'valor_unitario.min' => 'O valor unitário deve ser maior ou igual a zero.',
        ];
    }
}