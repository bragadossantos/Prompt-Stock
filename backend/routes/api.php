<?php

use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\Category\CategoryController;
use App\Http\Controllers\Api\V1\Library\LibraryController;
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

    // Protected User Library & Interactions
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/library', [LibraryController::class, 'index']);
        Route::post('/prompts/{id}/favorite', [LibraryController::class, 'toggleFavorite']);
        Route::post('/prompts/{id}/save', [LibraryController::class, 'toggleSave']);
    });
});
