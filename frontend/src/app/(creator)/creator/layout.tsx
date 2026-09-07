"use client";

import React, { useState } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import {
  Sparkles,
  LayoutDashboard,
  FileCode2,
  PlusCircle,
  Wallet,
  ExternalLink,
  ArrowLeft,
  Loader2,
  Lock,
  Zap,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { apiClient } from "@/lib/api-client";

export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isCreator, isLoading, refreshUser } = useAuth();
  const pathname = usePathname();

  // Application form state for regular users
  const [isApplying, setIsApplying] = useState(false);
  const [applyForm, setApplyForm] = useState({
    username: "",
    headline: "",
    bio: "",
    portfolio_url: "",
  });
  const [applyError, setApplyError] = useState<string | null>(null);
  const [applySuccess, setApplySuccess] = useState(false);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsApplying(true);
    setApplyError(null);

    try {
      await apiClient("/creator/apply", {
        method: "POST",
        body: JSON.stringify(applyForm),
      });
      setApplySuccess(true);
      await refreshUser();
    } catch (err: any) {
      setApplyError(err.message || "Ocorreu um erro ao submeter o pedido.");
    } finally {
      setIsApplying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-background text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
        <p className="text-xs">Verificando credenciais do estúdio...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 mb-4">
          <Lock className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Acesso ao Creator Studio</h1>
        <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
          Autentique-se na PromptStock para aceder às suas ferramentas de monetização, gestão de prompts e relatórios de vendas.
        </p>
        <div className="flex items-center gap-3">
          <NextLink href="/login">
            <Button variant="primary" size="md">
              Fazer Login
            </Button>
          </NextLink>
          <NextLink href="/">
            <Button variant="outline" size="md">
              Explorar Prompts
            </Button>
          </NextLink>
        </div>
      </div>
    );
  }

  // If user is authenticated but not yet approved as a creator
  if (!isCreator) {
    return (
      <div className="min-h-screen py-16 px-4 max-w-2xl mx-auto">
        <div className="glass rounded-3xl p-8 border border-surface-border shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white shadow-glow">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Torne-se um Criador PromptStock</h1>
              <p className="text-xs text-slate-400">Monetize a sua mestria em engenharia de prompts de IA.</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="p-3.5 rounded-2xl bg-surface/60 border border-surface-border flex flex-col items-center text-center">
              <TrendingUp className="w-5 h-5 text-emerald-400 mb-2" />
              <div className="text-xs font-bold text-white">80% Repasse</div>
              <div className="text-[10px] text-slate-400">Receba por cada venda</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-surface/60 border border-surface-border flex flex-col items-center text-center">
              <Wallet className="w-5 h-5 text-amber-400 mb-2" />
              <div className="text-xs font-bold text-white">Multicaixa</div>
              <div className="text-[10px] text-slate-400">Levantamentos em AOA</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-surface/60 border border-surface-border flex flex-col items-center text-center">
              <Sparkles className="w-5 h-5 text-brand-400 mb-2" />
              <div className="text-xs font-bold text-white">Audiência Global</div>
              <div className="text-[10px] text-slate-400">Visibilidade garantida</div>
            </div>
          </div>

          {applySuccess ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h2 className="text-base font-bold text-white">Conta de Criador Ativada com Sucesso!</h2>
              <p className="text-xs text-slate-300">
                O seu perfil de criador já está pronto. Agora pode aceder ao Creator Studio para começar a submeter e monetizar prompts.
              </p>
              <Button
                variant="primary"
                onClick={() => window.location.reload()}
                className="mx-auto"
              >
                Entrar no Creator Studio
              </Button>
            </div>
          ) : (
            <form onSubmit={handleApply} className="space-y-4">
              {applyError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {applyError}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nome de Utilizador / Handle do Criador *
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-500 text-xs">@</span>
                  <input
                    type="text"
                    required
                    placeholder="ex: ai_master"
                    value={applyForm.username}
                    onChange={(e) => setApplyForm({ ...applyForm, username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "") })}
                    className="w-full bg-surface/80 border border-surface-border rounded-xl pl-8 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>
                <span className="text-[10px] text-slate-500">Este será o link para o seu perfil público: /creator/{applyForm.username || "seu_nome"}</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Especialidade / Título Profissional *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Especialista em Midjourney V6 e Ilustração Fotorealista"
                  value={applyForm.headline}
                  onChange={(e) => setApplyForm({ ...applyForm, headline: e.target.value })}
                  className="w-full bg-surface/80 border border-surface-border rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Biografia do Criador
                </label>
                <textarea
                  rows={3}
                  placeholder="Conte-nos sobre a sua experiência com Inteligência Artificial..."
                  value={applyForm.bio}
                  onChange={(e) => setApplyForm({ ...applyForm, bio: e.target.value })}
                  className="w-full bg-surface/80 border border-surface-border rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Link de Portfólio / Redes Sociais
                </label>
                <input
                  type="url"
                  placeholder="https://behance.net/seu_perfil ou https://github.com/..."
                  value={applyForm.portfolio_url}
                  onChange={(e) => setApplyForm({ ...applyForm, portfolio_url: e.target.value })}
                  className="w-full bg-surface/80 border border-surface-border rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  isLoading={isApplying}
                >
                  Concluir Registo de Criador
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  const navItems = [
    {
      label: "Painel Geral",
      href: "/creator/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Meus Prompts",
      href: "/creator/prompts",
      icon: FileCode2,
    },
    {
      label: "Submeter Prompt",
      href: "/creator/prompts/create",
      icon: PlusCircle,
    },
    {
      label: "Ganhos & Levantamentos",
      href: "/creator/earnings",
      icon: Wallet,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Creator Sidebar */}
      <aside className="w-full md:w-64 shrink-0 glass border-r border-surface-border p-5 flex flex-col justify-between">
        <div>
          {/* Brand Header */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-surface-border">
            <NextLink href="/creator/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center shadow-glow">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-extrabold text-white tracking-tight leading-none">
                  Creator Studio
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400">
                  PromptStock PRO
                </span>
              </div>
            </NextLink>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-semibold">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <NextLink
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? "bg-brand-600 text-white shadow-glow"
                      : "text-slate-400 hover:text-white hover:bg-surface-hover"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NextLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Info */}
        <div className="pt-6 border-t border-surface-border mt-6 space-y-3">
          <div className="p-3 rounded-xl bg-surface border border-surface-border">
            <div className="text-[11px] font-semibold text-slate-200 truncate">{user?.name}</div>
            <div className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Criador Verificado
            </div>
          </div>

          <NextLink
            href="/"
            className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-surface-hover border border-surface-border transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar à Loja Pública</span>
          </NextLink>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-x-hidden">{children}</main>
    </div>
  );
}
