"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { apiClient } from "@/lib/api-client";
import { Prompt } from "@/types/prompt";
import { PromptCard } from "@/components/prompts/PromptCard";
import { Button } from "@/components/ui/Button";
import {
  Bookmark,
  Heart,
  Compass,
  Loader2,
  FolderPlus,
  Sparkles,
  ShoppingBag,
} from "lucide-react";

export default function LibraryPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();

  const [activeTab, setActiveTab] = useState<"purchased" | "saved" | "favorites">("purchased");
  const [purchasedPrompts, setPurchasedPrompts] = useState<Prompt[]>([]);
  const [savedPrompts, setSavedPrompts] = useState<Prompt[]>([]);
  const [favoritePrompts, setFavoritePrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    async function loadLibrary() {
      if (!isAuthenticated) return;
      setIsLoading(true);
      try {
        const res = await apiClient<{
          success: boolean;
          data: { purchased?: Prompt[]; saved: Prompt[]; favorites: Prompt[] };
        }>("/library");

        if (res.success && res.data) {
          setPurchasedPrompts(res.data.purchased || []);
          setSavedPrompts(res.data.saved);
          setFavoritePrompts(res.data.favorites);
        }
      } catch (err) {
        console.error("Erro ao carregar biblioteca:", err);
      } finally {
        setIsLoading(false);
      }
    }

    if (isAuthenticated) {
      loadLibrary();
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading || (!isAuthenticated && isLoading)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
        <p className="text-xs">Verificando credenciais...</p>
      </div>
    );
  }

  const currentList =
    activeTab === "purchased"
      ? purchasedPrompts
      : activeTab === "saved"
      ? savedPrompts
      : favoritePrompts;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-600/10 border border-brand-500/20 text-brand-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Bookmark className="w-3.5 h-3.5 text-brand-400" />
            <span>Painel do Utilizador</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Minha Biblioteca
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Aceda rapidamente aos seus prompts adquiridos, guardados e favoritos ({user?.name}).
          </p>
        </div>

        <Link href="/marketplace">
          <Button variant="outline" size="sm">
            <ShoppingBag className="w-4 h-4 mr-1.5 text-brand-400" />
            Explorar Marketplace
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-surface-border pb-4 mb-8 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab("purchased")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === "purchased"
              ? "bg-brand-600 text-white shadow-glow"
              : "bg-surface hover:bg-surface-hover text-slate-400 hover:text-white border border-surface-border"
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Prompts Comprados ({purchasedPrompts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("saved")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === "saved"
              ? "bg-brand-600 text-white shadow-glow"
              : "bg-surface hover:bg-surface-hover text-slate-400 hover:text-white border border-surface-border"
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Guardados ({savedPrompts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("favorites")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === "favorites"
              ? "bg-brand-600 text-white shadow-glow"
              : "bg-surface hover:bg-surface-hover text-slate-400 hover:text-white border border-surface-border"
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Favoritos ({favoritePrompts.length})</span>
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass rounded-2xl h-64 border border-surface-border animate-pulse p-6">
              <div className="h-4 bg-surface rounded w-1/3 mb-4" />
              <div className="h-6 bg-surface rounded w-3/4 mb-3" />
            </div>
          ))}
        </div>
      ) : currentList.length === 0 ? (
        <div className="glass p-12 rounded-3xl text-center max-w-md mx-auto border border-surface-border my-12">
          {activeTab === "purchased" ? (
            <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          ) : activeTab === "saved" ? (
            <Bookmark className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          ) : (
            <Heart className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          )}
          <h3 className="text-base font-bold text-white mb-2">
            Nenhum prompt{" "}
            {activeTab === "purchased"
              ? "adquirido ainda"
              : activeTab === "saved"
              ? "guardado ainda"
              : "marcado como favorito"}
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            {activeTab === "purchased"
              ? "Quando adquirir prompts premium no marketplace, eles aparecerão aqui com acesso vitalício e desbloqueado."
              : "Quando encontrar prompts incríveis no catálogo, clique em Salvar ou no ícone de coração para organizar sua coleção pessoal."}
          </p>
          <Link href={activeTab === "purchased" ? "/marketplace" : "/explore"}>
            <Button variant="primary" size="md">
              {activeTab === "purchased" ? "Explorar Marketplace" : "Explorar Catálogo de Prompts"}
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentList.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      )}
    </div>
  );
}
