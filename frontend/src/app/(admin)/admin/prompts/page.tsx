"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { Prompt, PromptsResponse } from "@/types/prompt";
import { Button } from "@/components/ui/Button";
import {
  FileText,
  PlusCircle,
  Search,
  Star,
  Trash2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Archive,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function AdminPromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const loadPrompts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("q", search);
      if (statusFilter) params.set("status", statusFilter);

      const res = await apiClient<PromptsResponse>(`/admin/prompts?${params.toString()}`);
      if (res.success && res.data) {
        setPrompts(res.data);
      }
    } catch (err) {
      console.error("Erro ao carregar prompts do admin:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadPrompts();
    }, 200);
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  const handleToggleFeatured = async (promptId: number) => {
    try {
      const res = await apiClient<{ success: boolean; data: { is_featured: boolean } }>(
        `/admin/prompts/${promptId}/featured`,
        { method: "PATCH" }
      );
      if (res.success) {
        setPrompts((prev) =>
          prev.map((p) =>
            p.id === promptId ? { ...p, is_featured: res.data.is_featured } : p
          )
        );
        showNotification(res.data.is_featured ? "Prompt adicionado aos destaques." : "Destaque removido.");
      }
    } catch (err) {
      console.error("Erro ao alternar destaque:", err);
    }
  };

  const handleUpdateStatus = async (promptId: number, newStatus: string) => {
    try {
      const res = await apiClient<{ success: boolean; data: { status: string } }>(
        `/admin/prompts/${promptId}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ status: newStatus }),
        }
      );
      if (res.success) {
        setPrompts((prev) =>
          prev.map((p) =>
            p.id === promptId ? { ...p, status: res.data.status } : p
          )
        );
        showNotification(`Status alterado para ${newStatus}.`);
      }
    } catch (err) {
      console.error("Erro ao alterar status:", err);
    }
  };

  const handleDelete = async (promptId: number, title: string) => {
    if (!confirm(`Tem certeza que deseja excluir o prompt "${title}"?`)) return;

    try {
      const res = await apiClient<{ success: boolean }>(`/admin/prompts/${promptId}`, {
        method: "DELETE",
      });
      if (res.success) {
        setPrompts((prev) => prev.filter((p) => p.id !== promptId));
        showNotification("Prompt excluído com sucesso.");
      }
    } catch (err) {
      console.error("Erro ao excluir prompt:", err);
    }
  };

  const showNotification = (msg: string) => {
    setActionSuccessMessage(msg);
    setTimeout(() => setActionSuccessMessage(null), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Gestão & Curadoria de Prompts
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Modere prompts da comunidade, aprove submissões e crie conteúdo oficial da PromptStock.
          </p>
        </div>

        <Link href="/admin/prompts/create">
          <Button variant="primary" size="md" className="shadow-glow">
            <PlusCircle className="w-4 h-4 mr-2" />
            Criar Prompt Oficial
          </Button>
        </Link>
      </div>

      {/* Action Notification */}
      {actionSuccessMessage && (
        <div className="p-3 rounded-xl bg-accent-emerald/10 border border-accent-emerald/30 text-xs text-accent-emerald flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Filter Row */}
      <div className="glass p-4 rounded-2xl border border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por título..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface border border-surface-border rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {["", "published", "pending_review", "draft", "rejected", "archived"].map((st) => {
            const label =
              st === ""
                ? "Todos"
                : st === "published"
                ? "Publicados"
                : st === "pending_review"
                ? "Pendentes"
                : st === "draft"
                ? "Rascunhos"
                : st === "rejected"
                ? "Rejeitados"
                : "Arquivados";

            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  statusFilter === st
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

      {/* Prompts Table */}
      <div className="glass rounded-2xl border border-surface-border overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-7 h-7 animate-spin text-brand-500" />
            <p className="text-xs">Carregando prompts...</p>
          </div>
        ) : prompts.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            Nenhum prompt encontrado para os critérios selecionados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-surface/80 uppercase text-[11px] font-bold text-slate-400 border-b border-surface-border">
                <tr>
                  <th className="px-5 py-3.5">Prompt</th>
                  <th className="px-4 py-3.5">Origem</th>
                  <th className="px-4 py-3.5">Tipo / Preço</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Destaque</th>
                  <th className="px-4 py-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/50">
                {prompts.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5 max-w-xs">
                      <div className="font-bold text-white truncate">{p.title}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {p.ai_tool} {p.ai_model && `• ${p.ai_model}`}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {p.source_type === "official" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-600/20 text-brand-300 font-semibold text-[10px]">
                          <ShieldCheck className="w-3 h-3" />
                          Official
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">
                          Criador: {p.author.name.split(" ")[0]}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {p.prompt_type === "free" ? (
                        <span className="text-accent-emerald font-bold text-[11px]">Grátis</span>
                      ) : (
                        <span className="text-amber-300 font-bold text-[11px]">
                          {p.price.toLocaleString("pt-AO")} {p.currency}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <select
                        value={p.status}
                        onChange={(e) => handleUpdateStatus(p.id, e.target.value)}
                        className="bg-surface border border-surface-border text-slate-200 rounded-lg px-2 py-1 text-[11px] font-semibold focus:outline-none focus:border-brand-500"
                      >
                        <option value="published">Publicado</option>
                        <option value="pending_review">Pendente</option>
                        <option value="draft">Rascunho</option>
                        <option value="rejected">Rejeitado</option>
                        <option value="archived">Arquivado</option>
                      </select>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleFeatured(p.id)}
                        className={`p-1.5 rounded-lg transition-all ${
                          p.is_featured
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                            : "bg-surface text-slate-500 hover:text-slate-300 border border-surface-border"
                        }`}
                        title={p.is_featured ? "Remover destaque" : "Destacar na home"}
                      >
                        <Star className={`w-3.5 h-3.5 ${p.is_featured ? "fill-amber-400" : ""}`} />
                      </button>
                    </td>

                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/prompts/${p.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-surface hover:bg-surface-hover text-slate-300 hover:text-white border border-surface-border"
                          title="Visualizar na loja"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id, p.title)}
                          className="p-1.5 rounded-lg bg-surface hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-surface-border transition-colors"
                          title="Excluir prompt"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
