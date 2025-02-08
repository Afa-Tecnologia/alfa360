<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProdutoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'purchase_price' => 'required|numeric|min:0',
            'selling_price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'categoria_id' => 'nullable|exists:categorias,id'
        ];
    }

    /**
     * Custom messages for validation errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'O campo nome é obrigatório.',
            'description.required' => 'O campo descrição é obrigatório.',
            'purchase_price.required' => 'O campo preço de compra é obrigatório.',
            'purchase_price.numeric' => 'O preço de compra deve ser um número.',
            'selling_price.required' => 'O campo preço de venda é obrigatório.',
            'selling_price.numeric' => 'O preço de venda deve ser um número.',
            'quantity.required' => 'O campo quantidade é obrigatório.',
            'quantity.integer' => 'A quantidade deve ser um número inteiro.',
            'category.string' => 'A categoria deve ser um texto.',
            'category.max' => 'A categoria deve ter no máximo 255 caracteres.',
        ];
    }
}
