<?php

namespace App\Http\Requests\Api\V1\Order;

use Illuminate\Foundation\Http\FormRequest;

class CheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'prompt_id' => ['required', 'integer', 'exists:prompts,id'],
            'payment_method' => ['required', 'string', 'in:multicaixa_express,bank_transfer,test_gateway'],
            'payment_phone' => ['required_if:payment_method,multicaixa_express', 'nullable', 'string', 'max:20'],
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'prompt_id.required' => 'O prompt a adquirir é obrigatório.',
            'prompt_id.exists' => 'O prompt selecionado não existe.',
            'payment_method.required' => 'Selecione um método de pagamento válido.',
            'payment_method.in' => 'O método de pagamento deve ser Multicaixa Express ou Transferência Bancária.',
            'payment_phone.required_if' => 'O número de telefone Multicaixa Express é obrigatório para este método.',
        ];
    }
}
