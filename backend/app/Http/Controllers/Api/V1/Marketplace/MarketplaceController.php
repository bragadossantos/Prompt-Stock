<?php

namespace App\Http\Controllers\Api\V1\Marketplace;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\PromptResource;
use App\Models\Category;
use App\Models\Prompt;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MarketplaceController extends Controller
{
    /**
     * Catálogo Marketplace com filtros avançados.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Prompt::published()
            ->with(['category', 'subCategory', 'author', 'tags', 'results']);

        // Filtro por tipo (padrão é tudo ou apenas premium)
        if ($request->has('prompt_type')) {
            $query->where('prompt_type', $request->query('prompt_type'));
        }

        // Filtro por categoria
        if ($request->has('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->query('category'));
            });
        }

        // Filtro por ferramenta de IA
        if ($request->has('ai_tool')) {
            $query->where('ai_tool', $request->query('ai_tool'));
        }

        // Filtro por faixa de preço
        if ($request->filled('min_price')) {
            $query->where('price', '>=', (float) $request->query('min_price'));
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', (float) $request->query('max_price'));
        }

        // Busca textual
        if ($request->filled('search')) {
            $term = '%' . $request->query('search') . '%';
            $query->where(function ($q) use ($term) {
                $q->where('title', 'like', $term)
                  ->orWhere('short_description', 'like', $term)
                  ->orWhere('description', 'like', $term);
            });
        }

        // Ordenação
        $sort = $request->query('sort', 'popular');
        switch ($sort) {
            case 'newest':
                $query->orderBy('published_at', 'desc')->orderBy('created_at', 'desc');
                break;
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'rating':
                $query->orderBy('average_rating', 'desc');
                break;
            case 'popular':
            default:
                $query->orderBy('usage_count', 'desc')->orderBy('view_count', 'desc');
                break;
        }

        $perPage = min((int) $request->query('per_page', 12), 50);
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
}
