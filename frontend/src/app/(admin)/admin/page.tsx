"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import {
  Users,
  FileText,
  Copy,
  Eye,
  Heart,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface DashboardData {
  users: {
    total: number;
    active: number;
    creators: number;
    admins: number;
    new_this_month: number;
  };
  prompts: {
    total: number;
    published: number;
    pending: number;
    draft: number;
    rejected: number;
    free: number;
    premium: number;
    official: number;
    creator: number;
  };
  engagement: {
    total_copies: number;
    total_views: number;
    total_favorites: number;
  };
  top_prompts: Array<{
    id: number;
    title: string;
    slug: string;
    source_type: string;
    prompt_type: string;
    copy_count: number;
    view_count: number;
    average_rating: number;
  }>;
  recent_prompts: Array<{
    id: number;
    title: string;
    slug: string;
    source_type: string;
    status: string;
    created_at: string;
  }>;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await apiClient<{ success: boolean; data: DashboardData }>(
          "/admin/dashboard"
        );
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error("Falha ao carregar métricas administrativas:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
        <p className="text-xs">Carregando métricas da plataforma...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Dashboard Administrativo
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Visão consolidada em tempo real de utilizadores, catálogo e engajamento da PromptStock.
          </p>
        </div>

        <Link href="/admin/prompts/create">
          <Button variant="primary" size="md" className="shadow-glow">
            <PlusCircle className="w-4 h-4 mr-2" />
            Criar Prompt Oficial
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Users */}
        <div className="glass p-5 rounded-2xl border border-surface-border">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Utilizadores</span>
            <Users className="w-4 h-4 text-brand-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {data?.users.total.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
            <span className="text-accent-emerald font-semibold">
              {data?.users.active} ativos
            </span>
            <span>•</span>
            <span className="text-accent-cyan font-semibold">
              {data?.users.creators} criadores
            </span>
          </div>
        </div>

        {/* Total Prompts */}
        <div className="glass p-5 rounded-2xl border border-surface-border">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Prompts</span>
            <FileText className="w-4 h-4 text-accent-cyan" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {data?.prompts.total.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
            <span className="text-accent-emerald font-semibold">
              {data?.prompts.published} publicados
            </span>
            <span>•</span>
            <span className="text-amber-400 font-semibold">
              {data?.prompts.premium} premium
            </span>
          </div>
        </div>

        {/* Total Copies */}
        <div className="glass p-5 rounded-2xl border border-surface-border">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Cópias Realizadas</span>
            <Copy className="w-4 h-4 text-accent-emerald" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {data?.engagement.total_copies.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Utilizações ativas registradas
          </div>
        </div>

        {/* Visualizações */}
        <div className="glass p-5 rounded-2xl border border-surface-border">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Visualizações</span>
            <Eye className="w-4 h-4 text-accent-violet" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {data?.engagement.total_views.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Acessos aos detalhes de prompts
          </div>
        </div>
      </div>

      {/* Two Column Layout: Top Prompts & Recent Additions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Prompts */}
        <div className="glass p-6 rounded-3xl border border-surface-border space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent-emerald" />
              Prompts Mais Utilizados
            </h2>
            <Link
              href="/admin/prompts"
              className="text-xs font-semibold text-brand-400 hover:text-brand-300"
            >
              Ver todos →
            </Link>
          </div>

          <div className="divide-y divide-surface-border/50">
            {data?.top_prompts.map((p) => (
              <div
                key={p.id}
                className="py-3 flex items-center justify-between gap-4 hover:bg-white/[0.02] px-2 rounded-lg transition-colors"
              >
                <div className="truncate">
                  <Link
                    href={`/prompts/${p.slug}`}
                    className="text-xs font-bold text-white hover:text-brand-400 truncate block"
                  >
                    {p.title}
                  </Link>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                    <span>{p.source_type === "official" ? "Oficial" : "Criador"}</span>
                    <span>•</span>
                    <span className="capitalize">{p.prompt_type}</span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <div className="text-xs font-mono font-bold text-slate-200">
                    {p.copy_count.toLocaleString()} cópias
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {p.view_count.toLocaleString()} views
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Management Shortcuts */}
        <div className="glass p-6 rounded-3xl border border-surface-border space-y-5">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-400" />
            Ações Rápidas de Administração
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/admin/prompts/create"
              className="p-4 rounded-2xl bg-surface hover:bg-surface-hover border border-surface-border hover:border-brand-500/40 transition-all group"
            >
              <PlusCircle className="w-5 h-5 text-brand-400 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white mb-1">
                Novo Prompt Oficial
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Adicionar prompt oficial direto com selo PromptStock.
              </p>
            </Link>

            <Link
              href="/admin/prompts"
              className="p-4 rounded-2xl bg-surface hover:bg-surface-hover border border-surface-border hover:border-brand-500/40 transition-all group"
            >
              <FileText className="w-5 h-5 text-accent-cyan mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white mb-1">
                Moderar Catálogo
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Aprovar, rejeitar ou arquivar prompts submetidos.
              </p>
            </Link>

            <Link
              href="/admin/users"
              className="p-4 rounded-2xl bg-surface hover:bg-surface-hover border border-surface-border hover:border-brand-500/40 transition-all group"
            >
              <Users className="w-5 h-5 text-accent-violet mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white mb-1">
                Gerenciar Usuários
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Suspender contas ou promover usuários a criadores.
              </p>
            </Link>

            <Link
              href="/categories"
              className="p-4 rounded-2xl bg-surface hover:bg-surface-hover border border-surface-border hover:border-brand-500/40 transition-all group"
            >
              <ShieldCheck className="w-5 h-5 text-accent-emerald mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white mb-1">
                Categorias Oficiais
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Visualizar a taxonomia e as 15 categorias de IA.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
