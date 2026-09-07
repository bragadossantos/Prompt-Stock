"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { Prompt, PromptsResponse } from "@/types/prompt";
import { Category } from "@/types/auth";
import { PromptCard } from "@/components/prompts/PromptCard";
import { PromptFilters } from "@/components/prompts/PromptFilters";
import { Compass, Loader2, Frown } from "lucide-react";

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";

  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sourceType, setSourceType] = useState("");
  const [promptType, setPromptType] = useState("");
  const [aiTool, setAiTool] = useState("");
  const [sort, setSort] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Load categories once
  useEffect(() => {
    async function loadCats() {
      try {
        const res = await apiClient<{ success: boolean; data: Category[] }>("/categories");
        if (res.success) {
          setCategories(res.data);
        }
      } catch (err) {
        console.error("Falha ao carregar categorias:", err);
      }
    }
    loadCats();
  }, []);

  // Fetch prompts when filters change
  useEffect(() => {
    async function fetchPrompts() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set("q", search);
        if (selectedCategory) params.set("category", selectedCategory);
        if (sourceType) params.set("source_type", sourceType);
        if (promptType) params.set("prompt_type", promptType);
        if (aiTool) params.set("ai_tool", aiTool);
        if (sort) params.set("sort", sort);
        params.set("page", currentPage.toString());

        const res = await apiClient<PromptsResponse>(`/prompts?${params.toString()}`);
        if (res.success) {
          setPrompts(res.data);
          setTotalPages(res.pagination.last_page);
          setTotalItems(res.pagination.total);
        }
      } catch (err) {
        console.error("Falha ao pesquisar prompts:", err);
      } finally {
        setIsLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchPrompts();
    }, 200);

    return () => clearTimeout(timer);
  }, [search, selectedCategory, sourceType, promptType, aiTool, sort, currentPage]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-600/10 border border-brand-500/20 text-brand-300 text-xs font-semibold uppercase tracking-wider mb-3">
          <Compass className="w-3.5 h-3.5 text-brand-400" />
          <span>Catálogo de Prompts</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Explorar Prompts de IA
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Navegue por centenas de prompts curados para Midjourney, ChatGPT, Claude e automação.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="glass p-6 rounded-2xl border border-surface-border mb-8 shadow-xl">
        <PromptFilters
          search={search}
          onSearchChange={(v) => {
            setSearch(v);
            setCurrentPage(1);
          }}
          selectedCategory={selectedCategory}
          onCategoryChange={(v) => {
            setSelectedCategory(v);
            setCurrentPage(1);
          }}
          sourceType={sourceType}
          onSourceTypeChange={(v) => {
            setSourceType(v);
            setCurrentPage(1);
          }}
          promptType={promptType}
          onPromptTypeChange={(v) => {
            setPromptType(v);
            setCurrentPage(1);
          }}
          aiTool={aiTool}
          onAiToolChange={(v) => {
            setAiTool(v);
            setCurrentPage(1);
          }}
          sort={sort}
          onSortChange={setSort}
          categories={categories}
        />
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-6">
        <span>
          Exibindo <span className="font-semibold text-white">{prompts.length}</span> de{" "}
          <span className="font-semibold text-white">{totalItems}</span> prompts encontrados
        </span>
      </div>

      {/* Prompts Grid / Loading / Empty State */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass rounded-2xl h-72 border border-surface-border animate-pulse p-6">
              <div className="h-4 bg-surface rounded w-1/3 mb-4" />
              <div className="h-6 bg-surface rounded w-3/4 mb-3" />
              <div className="h-12 bg-surface rounded w-full mb-6" />
              <div className="h-8 bg-surface rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : prompts.length === 0 ? (
        <div className="glass p-12 rounded-3xl text-center max-w-lg mx-auto border border-surface-border">
          <Frown className="w-12 h-12 mx-auto text-slate-500 mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Nenhum prompt encontrado</h3>
          <p className="text-xs text-slate-400 mb-6">
            Não encontramos resultados para os filtros selecionados. Tente ajustar os termos da busca ou limpar os filtros.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("");
              setSourceType("");
              setPromptType("");
              setAiTool("");
            }}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition-all shadow-glow"
          >
            Limpar Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {prompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-xl bg-surface border border-surface-border hover:bg-surface-hover text-xs font-semibold text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <span className="text-xs text-slate-400 px-3">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-xl bg-surface border border-surface-border hover:bg-surface-hover text-xs font-semibold text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
          <p className="text-xs">Carregando catálogo de prompts...</p>
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
