<?php

namespace App\Http\Requests\Api\V1\Admin;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdatePromptRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'short_description' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'required', 'string'],
            'prompt_preview' => ['sometimes', 'required', 'string'],
            'prompt_content' => ['sometimes', 'required', 'string'],
            'category_id' => ['sometimes', 'required', 'exists:categories,id'],
            'sub_category_id' => ['nullable', 'exists:subcategories,id'],
            'prompt_type' => ['sometimes', 'required', 'in:free,premium,package,subscription'],
            'ai_tool' => ['sometimes', 'required', 'string', 'max:100'],
            'ai_model' => ['nullable', 'string', 'max:100'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'max:10'],
            'status' => ['nullable', 'in:draft,pending_review,approved,published,rejected,archived'],
            'is_featured' => ['nullable', 'boolean'],
            'cover_image_url' => ['nullable', 'string', 'url'],
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Erro de validação ao atualizar o prompt.',
            'errors' => $validator->errors(),
        ], 422));
    }
}
