<?php

namespace App\Http\Controllers\Api\V1\Order;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Order\CheckoutRequest;
use App\Models\Order;
use App\Models\Prompt;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CheckoutController extends Controller
{
    /**
     * Inicia o processo de checkout e gera a encomenda.
     */
    public function checkout(CheckoutRequest $request, OrderService $orderService): JsonResponse
    {
        $user = $request->user();
        $prompt = Prompt::published()->findOrFail($request->validated('prompt_id'));

        $order = $orderService->createOrder(
            $user,
            $prompt,
            $request->validated('payment_method'),
            $request->validated('payment_phone')
        );

        $instructions = [];
        if ($order->payment_method === 'multicaixa_express') {
            $instructions = [
                'type' => 'multicaixa_express',
                'title' => 'Pagamento Multicaixa Express',
                'message' => 'Enviámos uma notificação de pagamento para o telemóvel ' . $order->payment_phone . '. Por favor, confirme a transação no seu aplicativo Multicaixa Express.',
                'phone' => $order->payment_phone,
                'amount' => (float) $order->total_amount,
                'currency' => $order->currency,
            ];
        } else {
            $instructions = [
                'type' => 'bank_transfer',
                'title' => 'Transferência Bancária / Multicaixa',
                'message' => 'Efetue a transferência ou depósito para o IBAN oficial da PromptStock e envie o comprovativo.',
                'iban' => 'AO06.0040.0000.1234.5678.9012.3',
                'bank_name' => 'Banco Angolano de Investimentos (BAI)',
                'beneficiary' => 'PromptStock Angola Lda',
                'reference' => $order->payment_reference,
                'amount' => (float) $order->total_amount,
                'currency' => $order->currency,
            ];
        }

        return response()->json([
            'success' => true,
            'message' => 'Encomenda registada com sucesso.',
            'data' => [
                'order' => [
                    'order_number' => $order->order_number,
                    'uuid' => $order->uuid,
                    'total_amount' => (float) $order->total_amount,
                    'currency' => $order->currency,
                    'status' => $order->status,
                    'payment_method' => $order->payment_method,
                    'payment_reference' => $order->payment_reference,
                    'prompt' => [
                        'id' => $prompt->id,
                        'title' => $prompt->title,
                        'slug' => $prompt->slug,
                        'ai_tool' => $prompt->ai_tool,
                    ],
                ],
                'payment_instructions' => $instructions,
            ],
        ], 201);
    }

    /**
     * Confirmação / Simulação de pagamento.
     */
    public function pay(string $orderNumber, Request $request, OrderService $orderService): JsonResponse
    {
        $user = $request->user();

        $order = Order::where('order_number', $orderNumber)
            ->where(function ($query) use ($user) {
                if (!$user->isAdmin()) {
                    $query->where('user_id', $user->id);
                }
            })
            ->firstOrFail();

        $order = $orderService->completeOrder($order);

        return response()->json([
            'success' => true,
            'message' => 'Pagamento liquidado e conteúdo desbloqueado com sucesso!',
            'data' => [
                'order_number' => $order->order_number,
                'status' => $order->status,
                'paid_at' => $order->paid_at->toIso8601String(),
                'prompt_slug' => $order->items->first()?->prompt?->slug,
            ],
        ]);
    }
}
