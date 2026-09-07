<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    /**
     * Listagem paginada de utilizadores da plataforma.
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::query();

        if ($search = $request->input('q')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($role = $request->input('role')) {
            $query->where('role', $role);
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $users = $query->orderByDesc('created_at')->paginate(20);

        return response()->json([
            'success' => true,
            'data' => UserResource::collection($users),
            'pagination' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ],
        ]);
    }

    /**
     * Atualizar status do utilizador (active, suspended).
     */
    public function updateStatus(int $id, Request $request): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:active,suspended,pending',
        ]);

        $user = User::findOrFail($id);

        // Prevent self-suspension of the main admin
        if ($user->id === $request->user()->id && $request->input('status') === 'suspended') {
            return response()->json([
                'success' => false,
                'message' => 'Não é permitido suspender a própria conta de administrador.',
            ], 422);
        }

        $user->status = $request->input('status');
        $user->save();

        return response()->json([
            'success' => true,
            'message' => "Status do utilizador {$user->name} alterado para {$user->status}.",
            'data' => new UserResource($user),
        ]);
    }

    /**
     * Atualizar papel do utilizador (user, creator, admin).
     */
    public function updateRole(int $id, Request $request): JsonResponse
    {
        $request->validate([
            'role' => 'required|in:user,creator,admin',
        ]);

        $user = User::findOrFail($id);

        $user->role = $request->input('role');
        $user->save();

        return response()->json([
            'success' => true,
            'message' => "Papel do utilizador {$user->name} alterado para {$user->role}.",
            'data' => new UserResource($user),
        ]);
    }
}
