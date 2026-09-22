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
     * Identificado por UUID (não pelo id incremental) para evitar enumeração
     * e para corresponder ao identificador exposto pela UserResource.
     */
    public function updateStatus(string $uuid, Request $request): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:active,suspended,pending',
        ]);

        $user = User::where('uuid', $uuid)->firstOrFail();

        // Prevent self-suspension of the acting admin
        if ($user->id === $request->user()->id && $request->input('status') === 'suspended') {
            return response()->json([
                'success' => false,
                'message' => 'Não é permitido suspender a própria conta de administrador.',
            ], 422);
        }

        $user->status = $request->input('status');
        $user->save();

        // Defense in depth: revoke any active sessions immediately, since a
        // suspended user's existing Sanctum token would otherwise keep working.
        if ($user->status === 'suspended') {
            $user->tokens()->delete();
        }

        return response()->json([
            'success' => true,
            'message' => "Status do utilizador {$user->name} alterado para {$user->status}.",
            'data' => new UserResource($user),
        ]);
    }

    /**
     * Atualizar papel do utilizador (user, creator, admin).
     * Identificado por UUID pelo mesmo motivo de updateStatus().
     */
    public function updateRole(string $uuid, Request $request): JsonResponse
    {
        $request->validate([
            'role' => 'required|in:user,creator,admin',
        ]);

        $user = User::where('uuid', $uuid)->firstOrFail();
        $newRole = $request->input('role');

        // Prevent an admin from demoting their own account (e.g. via a
        // compromised/leaked token), which could lock them out permanently.
        if ($user->id === $request->user()->id && $newRole !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Não é permitido alterar o próprio papel de administrador.',
            ], 422);
        }

        // Prevent demoting the last remaining active admin of the platform.
        if ($user->role === 'admin' && $newRole !== 'admin') {
            $remainingAdmins = User::where('role', 'admin')
                ->where('status', 'active')
                ->where('id', '!=', $user->id)
                ->count();

            if ($remainingAdmins === 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Não é possível remover o último administrador ativo da plataforma.',
                ], 422);
            }
        }

        $user->role = $newRole;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => "Papel do utilizador {$user->name} alterado para {$user->role}.",
            'data' => new UserResource($user),
        ]);
    }
}
