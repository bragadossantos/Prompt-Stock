<?php

namespace App\Http\Requests\Api\V1\Admin;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class CreateOfficialPromptRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
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
            'status' => ['nullable', 'in:draft,pending_review,approved,published,rejected,archived'],
            'is_featured' => ['nullable', 'boolean'],
            'cover_image_url' => ['nullable', 'string', 'url'],
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
            'prompt_preview.required' => 'O texto de prévia do prompt é obrigatório.',
            'prompt_content.required' => 'O conteúdo completo do prompt é obrigatório.',
            'category_id.required' => 'A categoria é obrigatória.',
            'category_id.exists' => 'A categoria selecionada é inválida.',
            'prompt_type.required' => 'O tipo de prompt (free ou premium) é obrigatório.',
            'ai_tool.required' => 'A ferramenta de IA recomendada é obrigatória.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Erro de validação ao criar o prompt oficial.',
            'errors' => $validator->errors(),
        ], 422));
    }
}
