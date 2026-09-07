<?php

namespace App\Http\Controllers\Api\V1\Library;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\PromptResource;
use App\Models\Favorite;
use App\Models\Prompt;
use App\Models\SavedPrompt;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LibraryController extends Controller
{
    /**
     * Retorna a biblioteca do utilizador autenticado (prompts guardados e favoritos).
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $savedPrompts = $user->savedLibraryPrompts()
            ->with(['category', 'author', 'tags', 'results'])
            ->orderByDesc('saved_prompts.created_at')
            ->get();

        $favoritePrompts = $user->favoritePrompts()
            ->with(['category', 'author', 'tags', 'results'])
            ->orderByDesc('favorites.created_at')
            ->get();

        $purchasedPromptIds = $user->orders()
            ->where('status', 'completed')
            ->with('items')
            ->get()
            ->pluck('items')
            ->flatten()
            ->pluck('prompt_id')
            ->unique();

        $purchasedPrompts = Prompt::whereIn('id', $purchasedPromptIds)
            ->with(['category', 'author', 'tags', 'results'])
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'purchased' => PromptResource::collection($purchasedPrompts),
                'saved' => PromptResource::collection($savedPrompts),
                'favorites' => PromptResource::collection($favoritePrompts),
            ],
        ]);
    }

    /**
     * Alternar favorito (Toggle Favorite).
     */
    public function toggleFavorite(int $promptId, Request $request): JsonResponse
    {
        $user = $request->user();
        $prompt = Prompt::published()->findOrFail($promptId);

        $existing = Favorite::where('user_id', $user->id)
            ->where('prompt_id', $prompt->id)
            ->first();

        if ($existing) {
            $existing->delete();
            $prompt->decrement('favorite_count');
            $isFavorited = false;
            $message = 'Prompt removido dos favoritos.';
        } else {
            Favorite::create([
                'user_id' => $user->id,
                'prompt_id' => $prompt->id,
            ]);
            $prompt->increment('favorite_count');
            $isFavorited = true;
            $message = 'Prompt adicionado aos favoritos com sucesso!';
        }

        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => [
                'is_favorited' => $isFavorited,
                'favorite_count' => (int) $prompt->favorite_count,
            ],
        ]);
    }

    /**
     * Alternar guardar na biblioteca (Toggle Save).
     */
    public function toggleSave(int $promptId, Request $request): JsonResponse
    {
        $user = $request->user();
        $prompt = Prompt::published()->findOrFail($promptId);

        $existing = SavedPrompt::where('user_id', $user->id)
            ->where('prompt_id', $prompt->id)
            ->first();

        if ($existing) {
            $existing->delete();
            $isSaved = false;
            $message = 'Prompt removido da sua biblioteca.';
        } else {
            SavedPrompt::create([
                'user_id' => $user->id,
                'prompt_id' => $prompt->id,
            ]);
            $isSaved = true;
            $message = 'Prompt salvo na sua biblioteca!';
        }

        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => [
                'is_saved' => $isSaved,
            ],
        ]);
    }
}
