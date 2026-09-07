<?php

namespace App\Services;

use App\Models\CreatorProfile;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Prompt;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderService
{
    /**
     * Cria uma nova encomenda para um prompt.
     */
    public function createOrder(
        User $user,
        Prompt $prompt,
        string $paymentMethod = 'multicaixa_express',
        ?string $paymentPhone = null
    ): Order {
        if ($prompt->status !== 'published') {
            throw ValidationException::withMessages([
                'prompt_id' => ['Este prompt não está disponível para aquisição.'],
            ]);
        }

        if ($user->hasPurchased($prompt->id)) {
            throw ValidationException::withMessages([
                'prompt_id' => ['Você já adquiriu este prompt anteriormente.'],
            ]);
        }

        $price = (float) $prompt->price;

        // 80% repasse para o criador, 20% comissão para PromptStock
        $isCreator = $prompt->source_type === 'creator' && $prompt->author_id;
        $creatorEarnings = $isCreator ? round($price * 0.80, 2) : 0.00;
        $platformFee = $isCreator ? round($price - $creatorEarnings, 2) : $price;

        $reference = strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 9));

        return DB::transaction(function () use (
            $user,
            $prompt,
            $price,
            $paymentMethod,
            $paymentPhone,
            $reference,
            $isCreator,
            $creatorEarnings,
            $platformFee
        ) {
            $order = Order::create([
                'user_id' => $user->id,
                'subtotal' => $price,
                'tax' => 0.00,
                'discount' => 0.00,
                'total_amount' => $price,
                'currency' => $prompt->currency ?: 'AOA',
                'status' => 'pending',
                'payment_method' => $paymentMethod,
                'payment_phone' => $paymentPhone,
                'payment_reference' => $reference,
            ]);

            OrderItem::create([
                'order_id' => $order->id,
                'prompt_id' => $prompt->id,
                'creator_id' => $isCreator ? $prompt->author_id : null,
                'price' => $price,
                'currency' => $prompt->currency ?: 'AOA',
                'creator_earnings' => $creatorEarnings,
                'platform_fee' => $platformFee,
            ]);

            return $order->load(['items.prompt', 'user']);
        });
    }

    /**
     * Confirma e liquida a encomenda, desbloqueando acesso e creditando o criador.
     */
    public function completeOrder(Order $order): Order
    {
        if ($order->isCompleted()) {
            return $order;
        }

        return DB::transaction(function () use ($order) {
            $order->update([
                'status' => 'completed',
                'paid_at' => now(),
            ]);

            $order->loadMissing(['items.prompt', 'user']);

            foreach ($order->items as $item) {
                // 1. Credita a carteira do Criador (Split 80%)
                if ($item->creator_id && $item->creator_earnings > 0) {
                    $creatorProfile = CreatorProfile::firstOrCreate(
                        ['user_id' => $item->creator_id],
                        [
                            'username' => 'creator_' . $item->creator_id,
                            'available_balance' => 0,
                            'pending_balance' => 0,
                            'withdrawn_balance' => 0,
                            'total_sales_count' => 0,
                        ]
                    );

                    $creatorProfile->increment('available_balance', $item->creator_earnings);
                    $creatorProfile->increment('total_sales_count', 1);
                }

                // 2. Incrementa contador de utilizações/vendas do prompt
                if ($item->prompt) {
                    $item->prompt->increment('usage_count');
                }

                // 3. Adiciona automaticamente à biblioteca do comprador
                if ($order->user && $item->prompt_id) {
                    if (!$order->user->savedLibraryPrompts()->where('prompt_id', $item->prompt_id)->exists()) {
                        $order->user->savedLibraryPrompts()->attach($item->prompt_id);
                    }
                }
            }

            return $order->fresh(['items.prompt', 'user']);
        });
    }
}
