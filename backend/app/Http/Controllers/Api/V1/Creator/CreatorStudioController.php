<?php

namespace App\Http\Controllers\Api\V1\Creator;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Creator\WithdrawalRequest;
use App\Models\CreatorProfile;
use App\Models\CreatorWithdrawal;
use App\Models\Prompt;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CreatorStudioController extends Controller
{
    /**
     * Métricas consolidadas do Creator Studio do utilizador autenticado.
     */
    public function dashboard(Request $request): JsonResponse
    {
        $user = $request->user();

        $profile = CreatorProfile::firstOrCreate(
            ['user_id' => $user->id],
            [
                'username' => Str::slug($user->name) . '-' . Str::random(4),
                'headline' => 'Criador de Conteúdo e Prompts de IA',
                'available_balance' => 0.00,
                'pending_balance' => 0.00,
                'withdrawn_balance' => 0.00,
            ]
        );

        $promptsQuery = Prompt::where('author_id', $user->id);

        $totalPrompts = (clone $promptsQuery)->count();
        $publishedPrompts = (clone $promptsQuery)->where('status', 'published')->count();
        $pendingPrompts = (clone $promptsQuery)->where('status', 'pending_review')->count();
        $draftPrompts = (clone $promptsQuery)->where('status', 'draft')->count();

        $totalCopies = (int) (clone $promptsQuery)->sum('copy_count');
        $totalViews = (int) (clone $promptsQuery)->sum('view_count');
        $avgRating = (float) (clone $promptsQuery)->where('status', 'published')->avg('average_rating') ?: 0.00;

        $topPrompts = (clone $promptsQuery)
            ->where('status', 'published')
            ->orderByDesc('copy_count')
            ->take(5)
            ->get(['id', 'title', 'slug', 'prompt_type', 'copy_count', 'view_count', 'average_rating']);

        return response()->json([
            'success' => true,
            'data' => [
                'profile' => $profile,
                'stats' => [
                    'total_prompts' => $totalPrompts,
                    'published_prompts' => $publishedPrompts,
                    'pending_prompts' => $pendingPrompts,
                    'draft_prompts' => $draftPrompts,
                    'total_copies' => $totalCopies,
                    'total_views' => $totalViews,
                    'average_rating' => round($avgRating, 2),
                ],
                'financial' => [
                    'available_balance' => (float) $profile->available_balance,
                    'pending_balance' => (float) $profile->pending_balance,
                    'withdrawn_balance' => (float) $profile->withdrawn_balance,
                    'total_sales' => (int) $profile->total_sales_count,
                    'currency' => 'AOA',
                ],
                'top_prompts' => $topPrompts,
            ],
        ]);
    }

    /**
     * Utilizador registado solicita tornar-se criador.
     */
    public function apply(Request $request): JsonResponse
    {
        $user = $request->user();

        $user->role = 'creator';
        $user->save();

        $profile = CreatorProfile::firstOrCreate(
            ['user_id' => $user->id],
            [
                'username' => Str::slug($user->name) . '-' . Str::random(4),
                'headline' => 'Criador da Comunidade PromptStock',
                'bio' => $request->input('bio', 'Apaixonado por IA e engenharia de prompts.'),
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Parabéns! Sua conta agora possui acesso de Criador ao Creator Studio.',
            'data' => [
                'user' => $user,
                'profile' => $profile,
            ],
        ]);
    }

    /**
     * Visão financeira e extrato de levantamentos.
     */
    public function earnings(Request $request): JsonResponse
    {
        $user = $request->user();
        $profile = $user->creatorProfile;

        $withdrawals = CreatorWithdrawal::where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'balance' => [
                    'available' => (float) ($profile?->available_balance ?? 0),
                    'pending' => (float) ($profile?->pending_balance ?? 0),
                    'withdrawn' => (float) ($profile?->withdrawn_balance ?? 0),
                    'currency' => 'AOA',
                ],
                'withdrawals' => $withdrawals,
            ],
        ]);
    }

    /**
     * Solicitar levantamento de saldo.
     */
    public function requestWithdrawal(WithdrawalRequest $request): JsonResponse
    {
        $user = $request->user();
        $profile = $user->creatorProfile;
        $amount = (float) $request->validated('amount');

        if (!$profile || (float) $profile->available_balance < $amount) {
            return response()->json([
                'success' => false,
                'message' => 'Saldo disponível insuficiente para realizar este levantamento.',
            ], 422);
        }

        // Deduz do saldo disponível e move para pendente
        $profile->available_balance -= $amount;
        $profile->pending_balance += $amount;
        $profile->save();

        $withdrawal = CreatorWithdrawal::create([
            'user_id' => $user->id,
            'amount' => $amount,
            'currency' => 'AOA',
            'payment_method' => $request->validated('payment_method'),
            'account_details' => $request->validated('account_details'),
            'status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Solicitação de levantamento enviada com sucesso! Aguarde a revisão administrativa.',
            'data' => $withdrawal,
        ], 201);
    }
}
