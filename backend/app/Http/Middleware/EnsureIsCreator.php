<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureIsCreator
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user || (!$user->isCreator() && !$user->isAdmin())) {
            return response()->json([
                'success' => false,
                'message' => 'Acesso restrito ao Creator Studio. Torne-se um criador aprovado para publicar prompts.',
            ], 403);
        }

        return $next($request);
    }
}
