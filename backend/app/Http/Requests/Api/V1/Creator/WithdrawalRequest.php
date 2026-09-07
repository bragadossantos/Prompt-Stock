<?php

namespace App\Http\Requests\Api\V1\Creator;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class WithdrawalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isCreator() ?? false;
    }

    public function rules(): array
    {
        return [
            'amount' => ['required', 'numeric', 'min:5000'],
            'payment_method' => ['required', 'string', 'in:multicaixa_express,iban'],
            'account_details' => ['required', 'string', 'min:9', 'max:50'],
        ];
    }

    public function messages(): array
    {
        return [
            'amount.required' => 'O valor para levantamento é obrigatório.',
            'amount.min' => 'O valor mínimo para solicitação de levantamento é de 5.000 AOA.',
            'payment_method.required' => 'O método de pagamento é obrigatório.',
            'account_details.required' => 'Informe o número de telefone (Multicaixa Express) ou IBAN.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Erro nos dados de levantamento.',
            'errors' => $validator->errors(),
        ], 422));
    }
}
