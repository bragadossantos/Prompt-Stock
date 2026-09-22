<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsActive
{
    /**
     * Bloqueia o acesso de utilizadores suspensos/inativos mesmo que o
     * respetivo token Sanctum ainda não tenha sido revogado.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->status !== 'active') {
            return response()->json([
                'success' => false,
                'message' => 'Sua conta está suspensa. Entre em contacto com o suporte da PromptStock.',
            ], 403);
        }

        return $next($request);
    }
}
