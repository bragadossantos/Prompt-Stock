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
     * Estados de uma encomenda que ainda não foram liquidados/rejeitados e
     * portanto contam como "em aberto" para efeitos de duplicação.
     */
    private const OPEN_STATUSES = ['pending', 'awaiting_confirmation'];

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

        // Prevent creating duplicate pending/awaiting orders for the same prompt,
        // which would otherwise let a buyer submit several "payment confirmed"
        // claims for the same item and multiply the creator's credited earnings.
        $hasOpenOrder = $user->orders()
            ->whereIn('status', self::OPEN_STATUSES)
            ->whereHas('items', function ($query) use ($prompt) {
                $query->where('prompt_id', $prompt->id);
            })
            ->exists();

        if ($hasOpenOrder) {
            throw ValidationException::withMessages([
                'prompt_id' => ['Você já tem uma encomenda em aberto para este prompt. Aguarde a confirmação do pagamento.'],
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
     * O comprador declara ter efetuado o pagamento. Isto NÃO desbloqueia a
     * encomenda nem credita o criador — apenas marca a encomenda como
     * aguardando confirmação manual de um administrador (confirmPayment()).
     */
    public function markAwaitingConfirmation(Order $order): Order
    {
        if ($order->isCompleted()) {
            return $order;
        }

        if ($order->status !== 'pending') {
            throw ValidationException::withMessages([
                'status' => ['Esta encomenda já foi submetida ou processada anteriormente.'],
            ]);
        }

        return DB::transaction(function () use ($order) {
            $locked = Order::where('id', $order->id)->lockForUpdate()->firstOrFail();

            if ($locked->status !== 'pending') {
                return $locked->fresh(['items.prompt', 'user']);
            }

            $locked->update(['status' => 'awaiting_confirmation']);

            return $locked->fresh(['items.prompt', 'user']);
        });
    }

    /**
     * Confirma e liquida a encomenda, desbloqueando acesso e creditando o criador.
     * Só deve ser chamado por um administrador após verificar o pagamento fora
     * da plataforma (Multicaixa Express / transferência bancária).
     */
    public function completeOrder(Order $order): Order
    {
        if ($order->isCompleted()) {
            return $order;
        }

        return DB::transaction(function () use ($order) {
            // Lock the row for the duration of the transaction so two concurrent
            // confirmations of the same order can't both pass the status check
            // and both credit the creator's wallet.
            $locked = Order::where('id', $order->id)->lockForUpdate()->firstOrFail();

            if ($locked->isCompleted()) {
                return $locked->fresh(['items.prompt', 'user']);
            }

            $locked->update([
                'status' => 'completed',
                'paid_at' => now(),
            ]);

            $locked->loadMissing(['items.prompt', 'user']);

            foreach ($locked->items as $item) {
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
                if ($locked->user && $item->prompt_id) {
                    if (!$locked->user->savedLibraryPrompts()->where('prompt_id', $item->prompt_id)->exists()) {
                        $locked->user->savedLibraryPrompts()->attach($item->prompt_id);
                    }
                }
            }

            return $locked->fresh(['items.prompt', 'user']);
        });
    }

    /**
     * Um administrador rejeita a alegação de pagamento (comprovativo inválido,
     * pagamento não recebido, etc.).
     */
    public function rejectOrder(Order $order, ?string $reason = null): Order
    {
        if ($order->isCompleted()) {
            throw ValidationException::withMessages([
                'status' => ['Não é possível rejeitar uma encomenda já confirmada.'],
            ]);
        }

        return DB::transaction(function () use ($order, $reason) {
            $locked = Order::where('id', $order->id)->lockForUpdate()->firstOrFail();

            if ($locked->isCompleted()) {
                throw ValidationException::withMessages([
                    'status' => ['Não é possível rejeitar uma encomenda já confirmada.'],
                ]);
            }

            $locked->update([
                'status' => 'failed',
                'notes' => $reason,
            ]);

            return $locked->fresh(['items.prompt', 'user']);
        });
    }
}
