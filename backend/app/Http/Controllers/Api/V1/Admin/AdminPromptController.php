<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\CreateOfficialPromptRequest;
use App\Http\Requests\Api\V1\Admin\UpdatePromptRequest;
use App\Http\Resources\Api\V1\PromptResource;
use App\Models\Prompt;
use App\Models\PromptResult;
use App\Models\Tag;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminPromptController extends Controller
{
    /**
     * Listagem de todos os prompts para o painel administrativo.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Prompt::with(['category', 'author', 'tags']);

        if ($search = $request->input('q')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('short_description', 'like', "%{$search}%");
            });
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($sourceType = $request->input('source_type')) {
            $query->where('source_type', $sourceType);
        }

        if ($promptType = $request->input('prompt_type')) {
            $query->where('prompt_type', $promptType);
        }

        $prompts = $query->orderByDesc('created_at')->paginate(20);

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
     * Criar prompt oficial da plataforma (PromptStock Official).
     */
    public function store(CreateOfficialPromptRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $admin = $request->user();

        $status = $validated['status'] ?? 'published';

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
            'author_id' => $admin->id,
            'source_type' => 'official',
            'prompt_type' => $validated['prompt_type'],
            'ai_tool' => $validated['ai_tool'],
            'ai_model' => $validated['ai_model'] ?? null,
            'price' => $validated['price'] ?? 0.00,
            'currency' => $validated['currency'] ?? 'AOA',
            'status' => $status,
            'is_featured' => $validated['is_featured'] ?? false,
            'cover_image_url' => $validated['cover_image_url'] ?? null,
            'published_at' => $status === 'published' ? now() : null,
        ]);

        // Tags
        if (!empty($validated['tags'])) {
            $tagIds = [];
            foreach ($validated['tags'] as $tagName) {
                $tag = Tag::firstOrCreate(
                    ['slug' => Str::slug($tagName)],
                    ['name' => $tagName]
                );
                $tagIds[] = $tag->id;
            }
            $prompt->tags()->sync($tagIds);
        }

        // Demo result
        if (!empty($validated['result_text'])) {
            PromptResult::create([
                'prompt_id' => $prompt->id,
                'result_text' => $validated['result_text'],
                'ai_tool' => $validated['ai_tool'],
                'ai_model' => $validated['ai_model'] ?? null,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Prompt oficial criado com sucesso!',
            'data' => new PromptResource($prompt->load(['category', 'author', 'tags', 'results'])),
        ], 201);
    }

    /**
     * Atualizar dados de um prompt.
     */
    public function update(int $id, UpdatePromptRequest $request): JsonResponse
    {
        $prompt = Prompt::findOrFail($id);
        $validated = $request->validated();

        $prompt->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Prompt atualizado com sucesso.',
            'data' => new PromptResource($prompt->fresh(['category', 'author', 'tags', 'results'])),
        ]);
    }

    /**
     * Alternar status de destaque (Featured).
     */
    public function toggleFeatured(int $id): JsonResponse
    {
        $prompt = Prompt::findOrFail($id);
        $prompt->is_featured = !$prompt->is_featured;
        $prompt->save();

        return response()->json([
            'success' => true,
            'message' => $prompt->is_featured ? 'Prompt destacado com sucesso.' : 'Destaque removido.',
            'data' => [
                'is_featured' => $prompt->is_featured,
            ],
        ]);
    }

    /**
     * Atualizar status de moderação do prompt.
     */
    public function updateStatus(int $id, Request $request): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:draft,pending_review,approved,published,rejected,archived',
        ]);

        $prompt = Prompt::findOrFail($id);
        $newStatus = $request->input('status');

        $prompt->status = $newStatus;
        if ($newStatus === 'published' && !$prompt->published_at) {
            $prompt->published_at = now();
        }
        $prompt->save();

        return response()->json([
            'success' => true,
            'message' => "Status do prompt atualizado para {$newStatus}.",
            'data' => [
                'status' => $prompt->status,
            ],
        ]);
    }

    /**
     * Soft delete do prompt.
     */
    public function destroy(int $id): JsonResponse
    {
        $prompt = Prompt::findOrFail($id);
        $prompt->delete();

        return response()->json([
            'success' => true,
            'message' => 'Prompt excluído com sucesso.',
        ]);
    }
}
