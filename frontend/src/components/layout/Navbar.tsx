"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/Button";
import {
  Sparkles,
  Search,
  Compass,
  ShoppingBag,
  Grid,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  PlusCircle,
  ShieldAlert,
} from "lucide-react";

export function Navbar() {
  const { user, isAuthenticated, isAdmin, isCreator, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-surface-border/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-cyan flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">
              Prompt<span className="text-brand-500">Stock</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              href="/explore"
              className="px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4 text-brand-500" />
              Explorar
            </Link>
            <Link
              href="/marketplace"
              className="px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4 text-accent-cyan" />
              Marketplace
            </Link>
            <Link
              href="/categories"
              className="px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1.5"
            >
              <Grid className="w-4 h-4 text-accent-violet" />
              Categorias
            </Link>
          </nav>
        </div>

        {/* Search Bar Preview */}
        <div className="hidden lg:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Pesquisar prompts para Midjourney, ChatGPT, Claude..."
              className="w-full bg-surface/80 border border-surface-border hover:border-slate-700 focus:border-brand-500 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 transition-all focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Link href="/admin">
                  <Button variant="outline" size="sm" className="border-amber-500/50 text-amber-300">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                    Admin
                  </Button>
                </Link>
              )}

              {isCreator && (
                <Link href="/creator/prompts/create">
                  <Button variant="outline" size="sm" className="border-brand-500/50 text-brand-300">
                    <PlusCircle className="w-3.5 h-3.5 text-brand-400" />
                    Criar Prompt
                  </Button>
                </Link>
              )}

              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface border border-surface-border hover:border-slate-600 text-sm font-medium text-slate-200"
              >
                <div className="w-6 h-6 rounded-full bg-brand-600/30 flex items-center justify-center text-brand-400 text-xs">
                  <UserIcon className="w-3.5 h-3.5" />
                </div>
                <span>{user?.name?.split(" ")[0]}</span>
              </Link>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => logout()}
                title="Sair da Conta"
                className="text-slate-400 hover:text-red-400"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Entrar
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">
                  Começar Grátis
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
            aria-label="Abrir Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-surface-border bg-surface px-4 py-5 space-y-4">
          <nav className="flex flex-col gap-2">
            <Link
              href="/explore"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-slate-300 hover:bg-white/5 flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-brand-500" />
              Explorar
            </Link>
            <Link
              href="/marketplace"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-slate-300 hover:bg-white/5 flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-accent-cyan" />
              Marketplace
            </Link>
            <Link
              href="/categories"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-slate-300 hover:bg-white/5 flex items-center gap-2"
            >
              <Grid className="w-4 h-4 text-accent-violet" />
              Categorias
            </Link>
          </nav>

          <div className="pt-3 border-t border-surface-border flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg bg-surface-hover text-white text-sm font-medium flex items-center justify-between"
                >
                  <span>Olá, {user?.name}</span>
                  <span className="text-xs text-brand-400 uppercase font-semibold">{user?.role}</span>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-red-400 border-red-500/30"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Encerrar Sessão
                </Button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    Entrar
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full">
                    Criar Conta
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
