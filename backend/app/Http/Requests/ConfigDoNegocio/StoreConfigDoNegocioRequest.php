<?php

namespace App\Http\Requests\ConfigDoNegocio;

use Illuminate\Foundation\Http\FormRequest;

class StoreConfigDoNegocioRequest extends FormRequest
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
            'nome' => 'required|string|max:100',
            'logo_url' => 'nullable|string|max:255',
            'tipo_de_negocio_id' => 'required|exists:tipo_de_negocio,id',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'nome.required' => 'O campo nome é obrigatório.',
            'nome.string' => 'O campo nome deve ser uma string.',
            'nome.max' => 'O campo nome deve ter no máximo 100 caracteres.',
            'logo_url.string' => 'O campo logo_url deve ser uma string.',
            'logo_url.max' => 'O campo logo_url deve ter no máximo 255 caracteres.',
            'tipo_de_negocio_id.required' => 'O campo tipo de negócio é obrigatório.',
            'tipo_de_negocio_id.exists' => 'O tipo de negócio selecionado não existe.',
        ];
    }
} 