<?php

namespace App\Http\Controllers\Api\V1\Order;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Lista de encomendas do utilizador autenticado.
     */
    public function index(Request $request): JsonResponse
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->with(['items.prompt'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

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
     * Detalhes de uma encomenda por order_number.
     */
    public function show(string $orderNumber, Request $request): JsonResponse
    {
        $user = $request->user();

        $order = Order::where('order_number', $orderNumber)
            ->where(function ($query) use ($user) {
                if (!$user->isAdmin()) {
                    $query->where('user_id', $user->id);
                }
            })
            ->with(['items.prompt'])
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $order,
        ]);
    }
}
