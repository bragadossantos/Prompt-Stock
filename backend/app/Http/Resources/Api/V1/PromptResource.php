<?php

namespace App\Http\Resources\Api\V1;

use App\Models\Favorite;
use App\Models\OrderItem;
use App\Models\SavedPrompt;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PromptResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user = $request->user('sanctum') ?? $request->user();

        $interactions = $user ? $this->userInteractions($request, $user) : null;

        $canAccessFullContent = false;
        $isPurchased = false;

        if ($this->isFree()) {
            $canAccessFullContent = true;
        } elseif ($user) {
            if ($user->isAdmin() || $user->id === $this->author_id) {
                $canAccessFullContent = true;
            } elseif (in_array($this->id, $interactions['purchased'], true)) {
                $canAccessFullContent = true;
                $isPurchased = true;
            }
        }

        $isFavorited = false;
        $isSaved = false;

        if ($user) {
            $isFavorited = in_array($this->id, $interactions['favorited'], true);
            $isSaved = in_array($this->id, $interactions['saved'], true);
        }

        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'title' => $this->title,
            'slug' => $this->slug,
            'short_description' => $this->short_description,
            'description' => $this->description,
            'prompt_preview' => $this->prompt_preview,
            'prompt_content' => $canAccessFullContent ? $this->prompt_content : null,
            'is_locked' => !$canAccessFullContent,
            'source_type' => $this->source_type,
            'prompt_type' => $this->prompt_type,
            'ai_tool' => $this->ai_tool,
            'ai_model' => $this->ai_model,
            'price' => (float) $this->price,
            'currency' => $this->currency,
            'status' => $this->status,
            'is_featured' => $this->is_featured,
            'cover_image_url' => $this->cover_image_url,
            'metrics' => [
                'view_count' => (int) $this->view_count,
                'copy_count' => (int) $this->copy_count,
                'usage_count' => (int) $this->usage_count,
                'favorite_count' => (int) $this->favorite_count,
                'average_rating' => (float) $this->average_rating,
                'reviews_count' => (int) $this->reviews_count,
            ],
            'user_interactions' => [
                'is_favorited' => $isFavorited,
                'is_saved' => $isSaved,
                'is_purchased' => $isPurchased,
            ],
            'category' => $this->category ? [
                'id' => $this->category->id,
                'name' => $this->category->name,
                'slug' => $this->category->slug,
            ] : null,
            'sub_category' => $this->subCategory ? [
                'id' => $this->subCategory->id,
                'name' => $this->subCategory->name,
                'slug' => $this->subCategory->slug,
            ] : null,
            'author' => $this->author ? [
                'name' => $this->source_type === 'official' ? 'PromptStock Official' : $this->author->name,
                'role' => $this->author->role,
                'avatar_url' => $this->author->avatar_url,
            ] : [
                'name' => 'PromptStock Official',
                'role' => 'admin',
                'avatar_url' => null,
            ],
            'results' => $this->results->map(function ($res) {
                return [
                    'id' => $res->id,
                    'result_text' => $res->result_text,
                    'result_image_url' => $res->result_image_url,
                    'ai_tool' => $res->ai_tool,
                    'ai_model' => $res->ai_model,
                    'notes' => $res->notes,
                ];
            }),
            'tags' => $this->tags->map(fn($t) => ['id' => $t->id, 'name' => $t->name, 'slug' => $t->slug]),
            'published_at' => $this->published_at?->toISOString(),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }

    /**
     * Resolve (and cache for the lifetime of the current request) the sets of
     * prompt IDs the given user has favorited, saved and purchased.
     *
     * Without this, each PromptResource instance issued its own
     * favorites()/savedBy()/hasPurchased() relation queries, causing up to 3
     * extra queries per prompt on every listing page (an N+1 problem). The
     * cache is stored on the request's attribute bag so it is computed at
     * most once per request regardless of how many resources are built, and
     * is naturally scoped/garbage-collected with the request itself (no
     * shared static state that could leak between requests or tests).
     *
     * @return array{favorited: array<int, int>, saved: array<int, int>, purchased: array<int, int>}
     */
    protected function userInteractions(Request $request, $user): array
    {
        $cacheKey = '_prompt_resource_user_interactions';

        $cached = $request->attributes->get($cacheKey);

        if (is_array($cached) && ($cached['user_id'] ?? null) === $user->id) {
            return $cached;
        }

        $cached = [
            'user_id' => $user->id,
            'favorited' => Favorite::where('user_id', $user->id)->pluck('prompt_id')->all(),
            'saved' => SavedPrompt::where('user_id', $user->id)->pluck('prompt_id')->all(),
            'purchased' => OrderItem::whereHas('order', function ($query) use ($user) {
                $query->where('user_id', $user->id)->where('status', 'completed');
            })->pluck('prompt_id')->all(),
        ];

        $request->attributes->set($cacheKey, $cached);

        return $cached;
    }
}
