<?php

use App\Http\Controllers\Api\V1\Admin\AdminDashboardController;
use App\Http\Controllers\Api\V1\Admin\AdminPromptController;
use App\Http\Controllers\Api\V1\Admin\AdminUserController;
use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\Category\CategoryController;
use App\Http\Controllers\Api\V1\Creator\CreatorPromptController;
use App\Http\Controllers\Api\V1\Creator\CreatorStudioController;
use App\Http\Controllers\Api\V1\Creator\PublicCreatorController;
use App\Http\Controllers\Api\V1\Library\LibraryController;
use App\Http\Controllers\Api\V1\Marketplace\MarketplaceController;
use App\Http\Controllers\Api\V1\Order\CheckoutController;
use App\Http\Controllers\Api\V1\Order\OrderController;
use App\Http\Controllers\Api\V1\Prompt\PromptController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — PromptStock Platform V1
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    // Health check endpoint
    Route::get('/health', function () {
        return response()->json([
            'status' => 'healthy',
            'platform' => 'PromptStock API',
            'version' => '1.0.0',
            'timestamp' => now()->toISOString(),
        ]);
    });

    // Public Categories & Discovery
    Route::get('/categories', [CategoryController::class, 'index']);

    // Public Prompts
    Route::get('/prompts', [PromptController::class, 'index']);
    Route::get('/prompts/{slug}', [PromptController::class, 'show']);
    Route::post('/prompts/{id}/copy', [PromptController::class, 'copy'])->middleware('throttle:30,1');

    // Public Creators
    Route::get('/creators', [PublicCreatorController::class, 'index']);
    Route::get('/creators/{username}', [PublicCreatorController::class, 'show']);

    // Public Marketplace Discovery
    Route::get('/marketplace', [MarketplaceController::class, 'index']);

    // Authentication Routes (Rate-limited)
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:10,1');
        Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1');

        // Protected Auth Routes
        Route::middleware('auth:sanctum')->group(function () {
            Route::get('/me', [AuthController::class, 'me']);
            Route::post('/logout', [AuthController::class, 'logout']);
        });
    });

    // Protected User Library, Interactions & Orders
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/library', [LibraryController::class, 'index']);
        Route::post('/prompts/{id}/favorite', [LibraryController::class, 'toggleFavorite']);
        Route::post('/prompts/{id}/save', [LibraryController::class, 'toggleSave']);
        Route::post('/creator/apply', [CreatorStudioController::class, 'apply']);

        // Orders & Checkout
        Route::post('/checkout', [CheckoutController::class, 'checkout']);
        Route::get('/orders', [OrderController::class, 'index']);
        Route::get('/orders/{orderNumber}', [OrderController::class, 'show']);
        Route::post('/orders/{orderNumber}/pay', [CheckoutController::class, 'pay']);
    });

    // Protected Creator Studio Routes
    Route::prefix('creator')->middleware(['auth:sanctum', 'creator'])->group(function () {
        Route::get('/dashboard', [CreatorStudioController::class, 'dashboard']);
        Route::get('/earnings', [CreatorStudioController::class, 'earnings']);
        Route::post('/withdrawals', [CreatorStudioController::class, 'requestWithdrawal']);

        // Creator Prompts Lifecycle
        Route::get('/prompts', [CreatorPromptController::class, 'index']);
        Route::post('/prompts', [CreatorPromptController::class, 'store']);
        Route::put('/prompts/{id}', [CreatorPromptController::class, 'update']);
        Route::delete('/prompts/{id}', [CreatorPromptController::class, 'destroy']);
    });

    // Protected Admin Panel Routes
    Route::prefix('admin')->middleware(['auth:sanctum', 'admin'])->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index']);

        // Prompts & Moderation
        Route::get('/prompts', [AdminPromptController::class, 'index']);
        Route::post('/prompts', [AdminPromptController::class, 'store']);
        Route::put('/prompts/{id}', [AdminPromptController::class, 'update']);
        Route::patch('/prompts/{id}/status', [AdminPromptController::class, 'updateStatus']);
        Route::patch('/prompts/{id}/featured', [AdminPromptController::class, 'toggleFeatured']);
        Route::delete('/prompts/{id}', [AdminPromptController::class, 'destroy']);

        // Users Management
        Route::get('/users', [AdminUserController::class, 'index']);
        Route::patch('/users/{id}/status', [AdminUserController::class, 'updateStatus']);
        Route::patch('/users/{id}/role', [AdminUserController::class, 'updateRole']);
    });
});
