"use client";

import React, { useEffect } from "react";
import Link from "next/navigation";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import {
  ShieldAlert,
  LayoutDashboard,
  FileText,
  PlusCircle,
  Users,
  ExternalLink,
  Sparkles,
  ArrowLeft,
  Loader2,
  Lock,
} from "lucide-react";
import NextLink from "next/link";
import { Button } from "@/components/ui/Button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      // Don't auto-redirect immediately so the user can read the error if forbidden
    }
  }, [isLoading, isAuthenticated, isAdmin, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-background text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
        <p className="text-xs">Verificando autorizações administrativas...</p>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
          <Lock className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Painel Restrito a Administradores</h1>
        <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
          Você precisa estar autenticado com uma conta com privilégios de Administrador da PromptStock (como <span className="font-mono text-brand-400">admin@promptstock.com</span>).
        </p>
        <div className="flex items-center gap-3">
          <NextLink href="/login">
            <Button variant="primary" size="md">
              Fazer Login como Administrador
            </Button>
          </NextLink>
          <NextLink href="/">
            <Button variant="outline" size="md">
              Voltar à Loja
            </Button>
          </NextLink>
        </div>
      </div>
    );
  }

  const navItems = [
    {
      label: "Visão Geral",
      href: "/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "Gestão de Prompts",
      href: "/admin/prompts",
      icon: FileText,
      exact: true,
    },
    {
      label: "Criar Prompt Oficial",
      href: "/admin/prompts/create",
      icon: PlusCircle,
      exact: true,
    },
    {
      label: "Gestão de Utilizadores",
      href: "/admin/users",
      icon: Users,
      exact: true,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 shrink-0 glass border-r border-surface-border p-5 flex flex-col justify-between">
        <div>
          {/* Brand Header */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-surface-border">
            <NextLink href="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-brand-600 flex items-center justify-center shadow-glow">
                <ShieldAlert className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-extrabold text-white tracking-tight leading-none">
                  PromptStock
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Admin Console
                </span>
              </div>
            </NextLink>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-semibold">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname?.startsWith(item.href);

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
            <div className="text-[10px] text-amber-400 uppercase font-bold">Administrador Mestre</div>
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

      {/* Admin Main View */}
      <main className="flex-1 p-6 sm:p-10 overflow-x-hidden">{children}</main>
    </div>
  );
}
