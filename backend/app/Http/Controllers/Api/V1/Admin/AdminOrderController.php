<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminOrderController extends Controller
{
    /**
     * Listagem de encomendas para revisão administrativa de pagamentos.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Order::with(['items.prompt', 'user']);

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $orders = $query->orderBy('status', 'asc') // pending/awaiting_confirmation first
            ->orderByDesc('created_at')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $orders->items(),
            'pagination' => [
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'per_page' => $orders->perPage(),
                'total' => $orders->total(),
            ],
        ]);
    }

    /**
     * Confirma manualmente que o pagamento de uma encomenda foi recebido,
     * desbloqueando o acesso do comprador e creditando o criador.
     */
    public function confirm(string $orderNumber, OrderService $orderService): JsonResponse
    {
        $order = Order::where('order_number', $orderNumber)->firstOrFail();

        $order = $orderService->completeOrder($order);

        return response()->json([
            'success' => true,
            'message' => 'Pagamento confirmado. Conteúdo desbloqueado e criador creditado.',
            'data' => $order,
        ]);
    }

    /**
     * Rejeita a alegação de pagamento de uma encomenda (comprovativo
     * inválido, pagamento não recebido, etc.).
     */
    public function reject(string $orderNumber, Request $request, OrderService $orderService): JsonResponse
    {
        $request->validate([
            'reason' => 'nullable|string|max:500',
        ]);

        $order = Order::where('order_number', $orderNumber)->firstOrFail();

        $order = $orderService->rejectOrder($order, $request->input('reason'));

        return response()->json([
            'success' => true,
            'message' => 'Encomenda rejeitada.',
            'data' => $order,
        ]);
    }
}
