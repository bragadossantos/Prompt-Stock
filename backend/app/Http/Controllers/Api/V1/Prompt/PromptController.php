<?php

namespace App\Http\Controllers\Api\V1\Prompt;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\PromptResource;
use App\Models\Prompt;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PromptController extends Controller
{
    /**
     * Listagem pública de prompts com filtros e paginação.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Prompt::published()
            ->with(['category', 'subCategory', 'author', 'tags', 'results']);

        // Search text
        if ($search = $request->input('q')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('short_description', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('tags', function ($tq) use ($search) {
                      $tq->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Filter Category
        if ($category = $request->input('category')) {
            $query->whereHas('category', function ($q) use ($category) {
                if (is_numeric($category)) {
                    $q->where('id', $category);
                } else {
                    $q->where('slug', $category);
                }
            });
        }

        // Filter Source Type (official, creator)
        if ($sourceType = $request->input('source_type')) {
            $query->where('source_type', $sourceType);
        }

        // Filter Prompt Type (free, premium, package)
        if ($promptType = $request->input('prompt_type')) {
            $query->where('prompt_type', $promptType);
        }

        // Filter AI Tool
        if ($aiTool = $request->input('ai_tool')) {
            $query->where('ai_tool', $aiTool);
        }

        // Sorting
        $sort = $request->input('sort', 'newest');
        match ($sort) {
            'popular' => $query->orderByDesc('copy_count')->orderByDesc('view_count'),
            'rating' => $query->orderByDesc('average_rating')->orderByDesc('reviews_count'),
            'price_asc' => $query->orderBy('price'),
            'price_desc' => $query->orderByDesc('price'),
            default => $query->orderByDesc('published_at')->orderByDesc('created_at'),
        };

        $perPage = min((int) $request->input('per_page', 12), 50);
        $prompts = $query->paginate($perPage);

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
     * Detalhes do prompt por slug.
     */
    public function show(string $slug, Request $request): JsonResponse
    {
        $prompt = Prompt::published()
            ->where('slug', $slug)
            ->with(['category', 'subCategory', 'author', 'tags', 'results'])
            ->firstOrFail();

        // Increment view count safely
        $prompt->increment('view_count');

        return response()->json([
            'success' => true,
            'data' => new PromptResource($prompt),
        ]);
    }

    /**
     * Evento de cópia de prompt (Copy Prompt).
     */
    public function copy(int $id, Request $request): JsonResponse
    {
        $prompt = Prompt::published()->findOrFail($id);

        // Increment copy and usage counters atomically
        $prompt->increment('copy_count');
        $prompt->increment('usage_count');

        return response()->json([
            'success' => true,
            'message' => 'Evento de cópia registado com sucesso.',
            'data' => [
                'copy_count' => (int) $prompt->copy_count,
                'usage_count' => (int) $prompt->usage_count,
            ],
        ]);
    }
}
