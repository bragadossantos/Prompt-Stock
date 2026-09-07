"use client";

import React, { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { User, UserRole } from "@/types/auth";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/Button";
import {
  Users,
  Search,
  Shield,
  UserCheck,
  UserX,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface UsersApiResponse {
  success: boolean;
  data: User[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export default function AdminUsersPage() {
  const { user: currentAdmin } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("q", search);
      if (roleFilter) params.set("role", roleFilter);
      if (statusFilter) params.set("status", statusFilter);

      const res = await apiClient<UsersApiResponse>(`/admin/users?${params.toString()}`);
      if (res.success && res.data) {
        setUsers(res.data);
      }
    } catch (err) {
      console.error("Erro ao carregar usuários:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadUsers();
    }, 200);
    return () => clearTimeout(timer);
  }, [search, roleFilter, statusFilter]);

  const handleUpdateStatus = async (targetUser: User, newStatus: "active" | "suspended") => {
    if (targetUser.uuid === currentAdmin?.uuid) {
      alert("Você não pode suspender a sua própria conta de administrador.");
      return;
    }

    try {
      const res = await apiClient<{ success: boolean; data: User; message: string }>(
        `/admin/users/${targetUser.uuid ? targetUser.uuid : (targetUser as any).id}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (res.success) {
        setUsers((prev) =>
          prev.map((u) => (u.uuid === targetUser.uuid ? { ...u, status: newStatus } : u))
        );
        showFeedback(`Status do usuário ${targetUser.name} alterado para ${newStatus}.`);
      }
    } catch (err: any) {
      alert(err.message || "Falha ao alterar status do usuário.");
    }
  };

  const handleUpdateRole = async (targetUser: User, newRole: UserRole) => {
    try {
      const res = await apiClient<{ success: boolean; data: User; message: string }>(
        `/admin/users/${(targetUser as any).id || targetUser.uuid}/role`,
        {
          method: "PATCH",
          body: JSON.stringify({ role: newRole }),
        }
      );

      if (res.success) {
        setUsers((prev) =>
          prev.map((u) => (u.uuid === targetUser.uuid ? { ...u, role: newRole } : u))
        );
        showFeedback(`Papel de ${targetUser.name} alterado para ${newRole}.`);
      }
    } catch (err: any) {
      alert(err.message || "Falha ao alterar papel do usuário.");
    }
  };

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Gestão de Utilizadores
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Controle de contas, suspensão e concessão de papéis de Criador ou Administrador.
        </p>
      </div>

      {feedbackMessage && (
        <div className="p-3 rounded-xl bg-accent-emerald/10 border border-accent-emerald/30 text-xs text-accent-emerald flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Filter Row */}
      <div className="glass p-4 rounded-2xl border border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface border border-surface-border rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {["", "user", "creator", "admin"].map((r) => {
            const label =
              r === ""
                ? "Todos os Papéis"
                : r === "user"
                ? "Utilizadores"
                : r === "creator"
                ? "Criadores"
                : "Administradores";

            return (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  roleFilter === r
                    ? "bg-brand-600 text-white shadow-glow"
                    : "bg-surface hover:bg-surface-hover text-slate-400 hover:text-white border border-surface-border"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Users Table */}
      <div className="glass rounded-2xl border border-surface-border overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-7 h-7 animate-spin text-brand-500" />
            <p className="text-xs">Carregando utilizadores...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            Nenhum utilizador encontrado para a pesquisa informada.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-surface/80 uppercase text-[11px] font-bold text-slate-400 border-b border-surface-border">
                <tr>
                  <th className="px-5 py-3.5">Nome / E-mail</th>
                  <th className="px-4 py-3.5">Papel</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Data de Registo</th>
                  <th className="px-4 py-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/50">
                {users.map((u) => {
                  const isCurrentAdmin = u.uuid === currentAdmin?.uuid;

                  return (
                    <tr key={u.uuid} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>{u.name}</span>
                          {isCurrentAdmin && (
                            <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded font-mono">
                              Você
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          {u.email}
                        </div>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <select
                          value={u.role}
                          disabled={isCurrentAdmin}
                          onChange={(e) => handleUpdateRole(u, e.target.value as UserRole)}
                          className="bg-surface border border-surface-border text-slate-200 rounded-lg px-2 py-1 text-[11px] font-semibold focus:outline-none focus:border-brand-500 disabled:opacity-50"
                        >
                          <option value="user">Utilizador</option>
                          <option value="creator">Criador</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {u.status === "active" ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/20 font-bold text-[10px]">
                            Ativo
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-bold text-[10px]">
                            Suspenso
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-500 text-[11px]">
                        {new Date(u.created_at).toLocaleDateString("pt-AO")}
                      </td>

                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        {!isCurrentAdmin ? (
                          u.status === "active" ? (
                            <button
                              onClick={() => handleUpdateStatus(u, "suspended")}
                              className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-semibold text-[11px] transition-all"
                            >
                              Suspender
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUpdateStatus(u, "active")}
                              className="px-2.5 py-1 rounded-lg bg-accent-emerald/10 hover:bg-accent-emerald/20 text-accent-emerald border border-accent-emerald/30 font-semibold text-[11px] transition-all"
                            >
                              Reativar
                            </button>
                          )
                        ) : (
                          <span className="text-slate-600 text-[11px]">Protegido</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
