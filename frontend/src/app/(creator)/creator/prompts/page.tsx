"use client";

import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import {
  FileCode2,
  PlusCircle,
  Eye,
  Copy,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { apiClient } from "@/lib/api-client";
import { Prompt } from "@/types/prompt";

export default function CreatorPromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchPrompts = async () => {
    try {
      setIsLoading(true);
      const url = statusFilter !== "all" ? `/creator/prompts?status=${statusFilter}` : "/creator/prompts";
      const res = await apiClient<{ success: boolean; data: Prompt[] }>(url);
      if (res.success && res.data) {
        setPrompts(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, [statusFilter]);

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja remover este prompt?")) return;
    try {
      setDeletingId(id);
      await apiClient(`/creator/prompts/${id}`, { method: "DELETE" });
      setPrompts(prompts.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message || "Erro ao excluir prompt.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredPrompts = prompts.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.ai_tool.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Meus Prompts</h1>
          <p className="text-xs text-slate-400">
            Gerencie o ciclo de vida dos seus prompts, acompanhe revisões e o desempenho público.
          </p>
        </div>
        <NextLink href="/creator/prompts/create">
          <Button variant="primary" size="sm" className="gap-2 shadow-glow">
            <PlusCircle className="w-4 h-4" />
            <span>Submeter Novo Prompt</span>
          </Button>
        </NextLink>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 glass p-4 rounded-2xl border border-surface-border">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: "all", label: "Todos" },
            { id: "published", label: "Publicados" },
            { id: "pending_review", label: "Em Revisão" },
            { id: "draft", label: "Rascunhos" },
            { id: "rejected", label: "Rejeitados" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? "bg-brand-600 text-white shadow-glow"
                  : "text-slate-400 hover:text-white hover:bg-surface-hover"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filtrar por título ou ferramenta..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface/80 border border-surface-border rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {/* Prompts List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
          <p className="text-xs text-slate-400">Carregando os seus prompts...</p>
        </div>
      ) : filteredPrompts.length === 0 ? (
        <div className="glass rounded-3xl border border-surface-border p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-surface border border-surface-border flex items-center justify-center text-slate-500 mx-auto">
            <FileCode2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Nenhum prompt encontrado</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              Você ainda não tem nenhum prompt nesta categoria ou o termo de pesquisa não retornou resultados.
            </p>
          </div>
          <NextLink href="/creator/prompts/create">
            <Button variant="primary" size="sm">
              Criar Primeiro Prompt
            </Button>
          </NextLink>
        </div>
      ) : (
        <div className="glass rounded-3xl border border-surface-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface/90 border-b border-surface-border text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Prompt</th>
                  <th className="py-3 px-4 font-semibold">Ferramenta</th>
                  <th className="py-3 px-4 font-semibold">Tipo / Preço</th>
                  <th className="py-3 px-4 font-semibold">Estado</th>
                  <th className="py-3 px-4 font-semibold">Métricas</th>
                  <th className="py-3 px-4 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/50">
                {filteredPrompts.map((p) => {
                  const isPublished = p.status === "published";
                  const isPending = p.status === "pending_review";
                  const isDraft = p.status === "draft";
                  const isRejected = p.status === "rejected";

                  return (
                    <tr key={p.id} className="hover:bg-surface-hover/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white truncate max-w-xs">{p.title}</div>
                        <div className="text-[10px] text-slate-500 truncate max-w-xs">
                          {p.short_description || p.category?.name}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-lg bg-surface border border-surface-border text-[11px] font-medium text-slate-300">
                          {p.ai_tool}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {p.prompt_type === "free" ? (
                          <span className="text-emerald-400 font-semibold">Gratuito</span>
                        ) : (
                          <span className="text-amber-400 font-bold">
                            {p.price.toLocaleString("pt-AO")} {p.currency || "AOA"}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {isPublished && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" /> Publicado
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                            <Clock className="w-3 h-3" /> Em Revisão
                          </span>
                        )}
                        {isDraft && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-400 border border-slate-500/30">
                            Rascunho
                          </span>
                        )}
                        {isRejected && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                            <AlertCircle className="w-3 h-3" /> Rejeitado
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3 text-slate-400">
                          <span className="flex items-center gap-1 text-[11px]" title="Visualizações">
                            <Eye className="w-3 h-3 text-slate-500" />
                            {p.metrics?.view_count || 0}
                          </span>
                          <span className="flex items-center gap-1 text-[11px]" title="Cópias">
                            <Copy className="w-3 h-3 text-slate-500" />
                            {p.metrics?.copy_count || 0}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isPublished && (
                            <NextLink
                              href={`/prompts/${p.slug}`}
                              target="_blank"
                              className="px-2.5 py-1 rounded-lg bg-surface border border-surface-border text-slate-300 hover:text-white hover:border-brand-500 transition-all text-[11px]"
                            >
                              Ver na Loja
                            </NextLink>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(p.id)}
                            isLoading={deletingId === p.id}
                            className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 p-1.5 h-auto"
                            title="Eliminar Prompt"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
