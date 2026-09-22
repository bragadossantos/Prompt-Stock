<?php

namespace App\Http\Controllers\Api\V1\Library;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\PromptResource;
use App\Models\Favorite;
use App\Models\Prompt;
use App\Models\SavedPrompt;
use Illuminate\Database\QueryException;
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

        // Intentionally not scoped to published(): a user must always be able
        // to remove an existing favorite, even after the prompt has since
        // been unpublished/archived/rejected by an admin. Only *adding* a
        // new favorite below is restricted to published prompts.
        $prompt = Prompt::findOrFail($promptId);

        $existing = Favorite::where('user_id', $user->id)
            ->where('prompt_id', $prompt->id)
            ->first();

        if ($existing) {
            $existing->delete();
            $prompt->decrement('favorite_count');
            $isFavorited = false;
            $message = 'Prompt removido dos favoritos.';
        } elseif ($prompt->status !== 'published') {
            return response()->json([
                'success' => false,
                'message' => 'Este prompt não está disponível para ser adicionado aos favoritos.',
            ], 422);
        } else {
            try {
                Favorite::create([
                    'user_id' => $user->id,
                    'prompt_id' => $prompt->id,
                ]);
                $prompt->increment('favorite_count');
            } catch (QueryException $e) {
                if (!$this->isDuplicateKeyException($e)) {
                    throw $e;
                }

                // A concurrent request already created this favorite (unique
                // constraint on user_id+prompt_id). We're already in the
                // favorited state, so treat this as a success.
                $prompt->refresh();
            }

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

        // Intentionally not scoped to published(): a user must always be able
        // to remove an existing saved prompt, even after the prompt has
        // since been unpublished/archived/rejected by an admin. Only
        // *adding* a new saved entry below is restricted to published
        // prompts.
        $prompt = Prompt::findOrFail($promptId);

        $existing = SavedPrompt::where('user_id', $user->id)
            ->where('prompt_id', $prompt->id)
            ->first();

        if ($existing) {
            $existing->delete();
            $isSaved = false;
            $message = 'Prompt removido da sua biblioteca.';
        } elseif ($prompt->status !== 'published') {
            return response()->json([
                'success' => false,
                'message' => 'Este prompt não está disponível para ser guardado.',
            ], 422);
        } else {
            try {
                SavedPrompt::create([
                    'user_id' => $user->id,
                    'prompt_id' => $prompt->id,
                ]);
            } catch (QueryException $e) {
                if (!$this->isDuplicateKeyException($e)) {
                    throw $e;
                }

                // A concurrent request already created this saved entry
                // (unique constraint on user_id+prompt_id). We're already in
                // the saved state, so treat this as a success.
            }

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

    /**
     * Determine whether a QueryException was caused by a duplicate-key
     * (unique constraint) violation, e.g. two near-simultaneous toggle
     * requests both attempting to create the same favorite/saved row.
     */
    private function isDuplicateKeyException(QueryException $e): bool
    {
        // 23000: SQL integrity constraint violation (MySQL/SQLite).
        // 23505: unique_violation (PostgreSQL).
        return in_array($e->getCode(), ['23000', '23505'], true);
    }
}
