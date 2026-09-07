<?php

namespace App\Http\Controllers\Api\V1\Creator;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Creator\SubmitPromptRequest;
use App\Http\Resources\Api\V1\PromptResource;
use App\Models\Prompt;
use App\Models\PromptResult;
use App\Models\Tag;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CreatorPromptController extends Controller
{
    /**
     * Listagem dos prompts criados pelo utilizador autenticado.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $prompts = Prompt::where('author_id', $user->id)
            ->with(['category', 'tags', 'results'])
            ->orderByDesc('created_at')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => PromptResource::collection($prompts),
            'pagination' => [
                'current_page' => $prompts->currentPage(),
                'last_page' => $prompts->lastPage(),
                'per_page' => $prompts->perPage(),
                'total' => $prompts->total(),
            ],
        ]);
    }

    /**
     * Criar e submeter novo prompt como criador.
     */
    public function store(SubmitPromptRequest $request): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        $submitForReview = $request->boolean('submit_for_review', true);
        $status = $submitForReview ? 'pending_review' : 'draft';

        $prompt = Prompt::create([
            'uuid' => (string) Str::uuid(),
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']) . '-' . Str::random(6),
            'short_description' => $validated['short_description'],
            'description' => $validated['description'],
            'prompt_preview' => $validated['prompt_preview'],
            'prompt_content' => $validated['prompt_content'],
            'category_id' => $validated['category_id'],
            'sub_category_id' => $validated['sub_category_id'] ?? null,
            'author_id' => $user->id,
            'source_type' => 'creator',
            'prompt_type' => $validated['prompt_type'],
            'ai_tool' => $validated['ai_tool'],
            'ai_model' => $validated['ai_model'] ?? null,
            'price' => $validated['prompt_type'] === 'premium' ? ($validated['price'] ?? 0) : 0,
            'currency' => $validated['currency'] ?? 'AOA',
            'status' => $status,
            'is_featured' => false,
        ]);

        if (!empty($validated['tags'])) {
            $tagIds = [];
            foreach ($validated['tags'] as $tagName) {
                $tag = Tag::firstOrCreate(['slug' => Str::slug($tagName)], ['name' => $tagName]);
                $tagIds[] = $tag->id;
            }
            $prompt->tags()->sync($tagIds);
        }

        if (!empty($validated['result_text'])) {
            PromptResult::create([
                'prompt_id' => $prompt->id,
                'result_text' => $validated['result_text'],
                'ai_tool' => $validated['ai_tool'],
                'ai_model' => $validated['ai_model'] ?? null,
            ]);
        }

        $message = $status === 'pending_review'
            ? 'Prompt submetido com sucesso! Nossa equipa irá revisar para aprovação.'
            : 'Prompt salvo como rascunho.';

        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => new PromptResource($prompt->load(['category', 'tags', 'results'])),
        ], 201);
    }

    /**
     * Atualizar prompt próprio.
     */
    public function update(int $id, SubmitPromptRequest $request): JsonResponse
    {
        $user = $request->user();
        $prompt = Prompt::where('author_id', $user->id)->findOrFail($id);

        $validated = $request->validated();
        $submitForReview = $request->boolean('submit_for_review', true);

        // Ao editar, requer nova aprovação se foi modificado
        $status = $submitForReview ? 'pending_review' : 'draft';

        $prompt->update([
            'title' => $validated['title'],
            'short_description' => $validated['short_description'],
            'description' => $validated['description'],
            'prompt_preview' => $validated['prompt_preview'],
            'prompt_content' => $validated['prompt_content'],
            'category_id' => $validated['category_id'],
            'sub_category_id' => $validated['sub_category_id'] ?? null,
            'prompt_type' => $validated['prompt_type'],
            'ai_tool' => $validated['ai_tool'],
            'ai_model' => $validated['ai_model'] ?? null,
            'price' => $validated['prompt_type'] === 'premium' ? ($validated['price'] ?? 0) : 0,
            'status' => $status,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Prompt atualizado com sucesso.',
            'data' => new PromptResource($prompt->fresh(['category', 'tags', 'results'])),
        ]);
    }

    /**
     * Excluir prompt próprio.
     */
    public function destroy(int $id, Request $request): JsonResponse
    {
        $user = $request->user();
        $prompt = Prompt::where('author_id', $user->id)->findOrFail($id);

        $prompt->delete();

        return response()->json([
            'success' => true,
            'message' => 'Prompt removido com sucesso.',
        ]);
    }
}
