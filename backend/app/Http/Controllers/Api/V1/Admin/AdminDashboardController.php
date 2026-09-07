<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Prompt;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class AdminDashboardController extends Controller
{
    /**
     * Métricas consolidadas para o Admin Dashboard.
     */
    public function index(): JsonResponse
    {
        // Users stats
        $totalUsers = User::count();
        $activeUsers = User::where('status', 'active')->count();
        $creatorsCount = User::where('role', 'creator')->count();
        $adminsCount = User::where('role', 'admin')->count();
        $newUsersThisMonth = User::where('created_at', '>=', now()->startOfMonth())->count();

        // Prompts stats
        $totalPrompts = Prompt::count();
        $publishedPrompts = Prompt::where('status', 'published')->count();
        $pendingPrompts = Prompt::where('status', 'pending_review')->count();
        $draftPrompts = Prompt::where('status', 'draft')->count();
        $rejectedPrompts = Prompt::where('status', 'rejected')->count();

        $freePrompts = Prompt::where('prompt_type', 'free')->count();
        $premiumPrompts = Prompt::where('prompt_type', 'premium')->count();
        $officialPrompts = Prompt::where('source_type', 'official')->count();
        $creatorPrompts = Prompt::where('source_type', 'creator')->count();

        // Engagement sums
        $totalCopies = (int) Prompt::sum('copy_count');
        $totalViews = (int) Prompt::sum('view_count');
        $totalFavorites = (int) Prompt::sum('favorite_count');

        // Top prompts
        $topPrompts = Prompt::orderByDesc('copy_count')
            ->take(5)
            ->select('id', 'uuid', 'title', 'slug', 'source_type', 'prompt_type', 'copy_count', 'view_count', 'average_rating')
            ->get();

        // Recent Prompts
        $recentPrompts = Prompt::orderByDesc('created_at')
            ->take(5)
            ->select('id', 'uuid', 'title', 'slug', 'source_type', 'status', 'created_at')
            ->get();

        // Categories summary
        $categoriesStats = Category::where('is_active', true)
            ->withCount('subcategories')
            ->take(6)
            ->get(['id', 'name', 'slug', 'icon']);

        return response()->json([
            'success' => true,
            'data' => [
                'users' => [
                    'total' => $totalUsers,
                    'active' => $activeUsers,
                    'creators' => $creatorsCount,
                    'admins' => $adminsCount,
                    'new_this_month' => $newUsersThisMonth,
                ],
                'prompts' => [
                    'total' => $totalPrompts,
                    'published' => $publishedPrompts,
                    'pending' => $pendingPrompts,
                    'draft' => $draftPrompts,
                    'rejected' => $rejectedPrompts,
                    'free' => $freePrompts,
                    'premium' => $premiumPrompts,
                    'official' => $officialPrompts,
                    'creator' => $creatorPrompts,
                ],
                'engagement' => [
                    'total_copies' => $totalCopies,
                    'total_views' => $totalViews,
                    'total_favorites' => $totalFavorites,
                ],
                'top_prompts' => $topPrompts,
                'recent_prompts' => $recentPrompts,
                'categories' => $categoriesStats,
            ],
        ]);
    }
}
