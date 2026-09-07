"use client";

import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import {
  Wallet,
  TrendingUp,
  FileCode2,
  Copy,
  Eye,
  PlusCircle,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { apiClient } from "@/lib/api-client";
import { CreatorDashboardData } from "@/types/creator";

export default function CreatorDashboardPage() {
  const [data, setData] = useState<CreatorDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient<{ success: boolean; data: CreatorDashboardData }>("/creator/dashboard");
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err: any) {
      setError(err.message || "Erro ao carregar os dados do painel do criador.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
        <p className="text-xs text-slate-400">Carregando métricas do criador...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
        {error || "Não foi possível carregar os dados do estúdio."}
      </div>
    );
  }

  const { metrics, recent_prompts, recent_withdrawals, profile } = data;

  const statCards = [
    {
      title: "Saldo Disponível",
      value: `${metrics.available_balance.toLocaleString("pt-AO")} ${metrics.currency}`,
      subtitle: `Pendente: ${metrics.pending_balance.toLocaleString("pt-AO")} ${metrics.currency}`,
      icon: Wallet,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      title: "Ganhos Totais",
      value: `${metrics.total_earnings.toLocaleString("pt-AO")} ${metrics.currency}`,
      subtitle: `${metrics.total_sales} vendas realizadas`,
      icon: TrendingUp,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      title: "Prompts Criados",
      value: metrics.total_prompts,
      subtitle: `${metrics.published_prompts} ativos • ${metrics.pending_prompts} em análise`,
      icon: FileCode2,
      color: "text-brand-400",
      bg: "bg-brand-500/10",
      border: "border-brand-500/20",
    },
    {
      title: "Impacto Global",
      value: metrics.total_copies.toLocaleString(),
      subtitle: `${metrics.total_views.toLocaleString()} visualizações`,
      icon: Copy,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass p-6 rounded-3xl border border-surface-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Creator Studio</span>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Olá, {profile?.username ? `@${profile.username}` : "Criador"}
            </h1>
            {profile?.is_verified && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/20 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3 text-accent-cyan" />
                Verificado
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Aqui está o desempenho dos seus prompts e o controlo das suas receitas em tempo real.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <NextLink href="/creator/earnings">
            <Button variant="outline" size="sm" className="gap-2">
              <Wallet className="w-4 h-4" />
              <span>Levantar Saldo</span>
            </Button>
          </NextLink>
          <NextLink href="/creator/prompts/create">
            <Button variant="primary" size="sm" className="gap-2 shadow-glow">
              <PlusCircle className="w-4 h-4" />
              <span>Submeter Prompt</span>
            </Button>
          </NextLink>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className={`p-5 rounded-2xl glass border ${card.border} flex flex-col justify-between hover:border-slate-700 transition-all`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-400">{card.title}</span>
                <div className={`p-2 rounded-xl ${card.bg} ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-white tracking-tight">{card.value}</div>
                <div className="text-[11px] text-slate-400 mt-1">{card.subtitle}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Prompts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-3xl border border-surface-border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Prompts Recentes</h2>
              <p className="text-xs text-slate-400">Estado de submissão e visualizações dos seus prompts.</p>
            </div>
            <NextLink
              href="/creator/prompts"
              className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
            >
              <span>Ver todos</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </NextLink>
          </div>

          {recent_prompts.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              Você ainda não submeteu nenhum prompt.{" "}
              <NextLink href="/creator/prompts/create" className="text-brand-400 underline">
                Crie o seu primeiro prompt agora!
              </NextLink>
            </div>
          ) : (
            <div className="divide-y divide-surface-border/50">
              {recent_prompts.map((p) => {
                const isPublished = p.status === "published";
                const isPending = p.status === "pending_review";
                const isDraft = p.status === "draft";
                const isRejected = p.status === "rejected";

                return (
                  <div key={p.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white truncate">{p.title}</div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span className="px-1.5 py-0.5 rounded bg-surface border border-surface-border text-slate-300">
                          {p.ai_tool}
                        </span>
                        <span>•</span>
                        <span>{p.prompt_type === "free" ? "Gratuito" : `${p.price.toLocaleString("pt-AO")} AOA`}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3 text-slate-500" /> {p.metrics?.view_count || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Copy className="w-3 h-3 text-slate-500" /> {p.metrics?.copy_count || 0}
                        </span>
                      </div>
                    </div>

                    <div>
                      {isPublished && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" /> Aprovado
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          <Clock className="w-3 h-3" /> Em Revisão
                        </span>
                      )}
                      {isDraft && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-400 border border-slate-500/30">
                          Rascunho
                        </span>
                      )}
                      {isRejected && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                          <AlertCircle className="w-3 h-3" /> Rejeitado
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Withdrawals Section */}
        <div className="glass rounded-3xl border border-surface-border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Levantamentos</h2>
              <p className="text-xs text-slate-400">Histórico de transferências.</p>
            </div>
            <NextLink
              href="/creator/earnings"
              className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
            >
              <span>Gerir</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </NextLink>
          </div>

          {recent_withdrawals.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              Nenhum levantamento solicitado até ao momento.
            </div>
          ) : (
            <div className="divide-y divide-surface-border/50">
              {recent_withdrawals.map((w) => (
                <div key={w.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-white">
                      {w.amount.toLocaleString("pt-AO")} {w.currency}
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase">
                      {w.payment_method === "multicaixa_express" ? "Express" : "IBAN"} • {w.account_details}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      w.status === "completed"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        : w.status === "pending"
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                    }`}
                  >
                    {w.status === "pending" ? "Pendente" : w.status === "completed" ? "Concluído" : w.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
