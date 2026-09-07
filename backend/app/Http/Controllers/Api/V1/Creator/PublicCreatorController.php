<?php

namespace App\Http\Controllers\Api\V1\Creator;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\PromptResource;
use App\Models\CreatorProfile;
use App\Models\Prompt;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicCreatorController extends Controller
{
    /**
     * Listagem pública de criadores da comunidade.
     */
    public function index(Request $request): JsonResponse
    {
        $profiles = CreatorProfile::with('user')
            ->whereHas('user', function ($q) {
                $q->where('status', 'active');
            })
            ->get()
            ->map(function ($profile) {
                $user = $profile->user;
                $publishedPromptsCount = Prompt::published()->where('author_id', $user->id)->count();
                $avgRating = Prompt::published()->where('author_id', $user->id)->avg('average_rating') ?: 0;

                return [
                    'username' => $profile->username,
                    'name' => $user->name,
                    'headline' => $profile->headline,
                    'bio' => $profile->bio,
                    'avatar_url' => $user->avatar_url,
                    'cover_image_url' => $profile->cover_image_url,
                    'is_verified' => $profile->is_verified,
                    'published_prompts_count' => $publishedPromptsCount,
                    'average_rating' => round((float) $avgRating, 2),
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $profiles,
        ]);
    }

    /**
     * Perfil público de um criador com seus prompts publicados.
     */
    public function show(string $username, Request $request): JsonResponse
    {
        $profile = CreatorProfile::with('user')
            ->where('username', $username)
            ->firstOrFail();

        $user = $profile->user;

        $prompts = Prompt::published()
            ->where('author_id', $user->id)
            ->with(['category', 'tags', 'results'])
            ->orderByDesc('copy_count')
            ->get();

        $totalCopies = (int) $prompts->sum('copy_count');
        $avgRating = $prompts->avg('average_rating') ?: 0;

        return response()->json([
            'success' => true,
            'data' => [
                'creator' => [
                    'username' => $profile->username,
                    'name' => $user->name,
                    'headline' => $profile->headline,
                    'bio' => $profile->bio,
                    'avatar_url' => $user->avatar_url,
                    'cover_image_url' => $profile->cover_image_url,
                    'is_verified' => $profile->is_verified,
                    'social_links' => $profile->social_links,
                    'total_prompts' => $prompts->count(),
                    'total_copies' => $totalCopies,
                    'average_rating' => round((float) $avgRating, 2),
                    'member_since' => $user->created_at->format('M Y'),
                ],
                'prompts' => PromptResource::collection($prompts),
            ],
        ]);
    }
}
