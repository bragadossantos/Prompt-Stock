"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { Category } from "@/types/auth";
import { Grid, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { CategoryIcon } from "@/components/ui/CategoryIcon";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await apiClient<{ success: boolean; data: Category[] }>("/categories");
        if (res.success) {
          setCategories(res.data);
        }
      } catch (err) {
        console.error("Falha ao carregar categorias:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCategories();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-violet/10 border border-accent-violet/20 text-accent-violet text-xs font-semibold uppercase tracking-wider mb-3">
          <Grid className="w-3.5 h-3.5" />
          <span>Arquitetura de Conteúdo</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Todas as Categorias
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-2xl">
          Navegue pelas 15 áreas especializadas de prompts para Inteligência Artificial da PromptStock.
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
          <p className="text-xs">Carregando catálogo de categorias...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/explore?category=${encodeURIComponent(cat.slug)}`}
              className="glass-card p-6 rounded-2xl flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <CategoryIcon nameOrSlug={cat.slug || cat.name} size="md" showContainer />
                  <span className="text-[11px] font-semibold text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/20 px-2.5 py-0.5 rounded-full">
                    Ativa
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-brand-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {cat.description || "Coleção de prompts curados e validados para sua produtividade."}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-surface-border/60 flex items-center justify-between text-xs text-brand-400 font-medium">
                <span>Explorar prompts</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
