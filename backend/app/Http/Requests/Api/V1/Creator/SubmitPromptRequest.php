<?php

namespace App\Http\Requests\Api\V1\Creator;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class SubmitPromptRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isCreator() ?? false;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'short_description' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'prompt_preview' => ['required', 'string'],
            'prompt_content' => ['required', 'string'],
            'category_id' => ['required', 'exists:categories,id'],
            'sub_category_id' => ['nullable', 'exists:subcategories,id'],
            'prompt_type' => ['required', 'in:free,premium,package,subscription'],
            'ai_tool' => ['required', 'string', 'max:100'],
            'ai_model' => ['nullable', 'string', 'max:100'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'max:10'],
            'submit_for_review' => ['nullable', 'boolean'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:50'],
            'result_text' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'O título do prompt é obrigatório.',
            'short_description.required' => 'A descrição curta é obrigatória.',
            'description.required' => 'A descrição completa é obrigatória.',
            'prompt_preview.required' => 'A prévia pública é obrigatória.',
            'prompt_content.required' => 'O texto integral do prompt é obrigatório.',
            'category_id.required' => 'A categoria é obrigatória.',
            'category_id.exists' => 'A categoria selecionada é inválida.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Erro de validação ao submeter o prompt.',
            'errors' => $validator->errors(),
        ], 422));
    }
}
