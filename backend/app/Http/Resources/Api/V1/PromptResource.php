<?php

namespace App\Http\Resources\Api\V1;

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

        $canAccessFullContent = false;
        $isPurchased = false;

        if ($this->isFree()) {
            $canAccessFullContent = true;
        } elseif ($user) {
            if ($user->isAdmin() || $user->id === $this->author_id) {
                $canAccessFullContent = true;
            } elseif ($user->hasPurchased($this->id)) {
                $canAccessFullContent = true;
                $isPurchased = true;
            }
        }

        $isFavorited = false;
        $isSaved = false;

        if ($user) {
            $isFavorited = $this->favorites()->where('user_id', $user->id)->exists();
            $isSaved = $this->savedBy()->where('user_id', $user->id)->exists();
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
}
