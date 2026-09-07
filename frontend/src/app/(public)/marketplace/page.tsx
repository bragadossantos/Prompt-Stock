"use client";

import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import {
  ShoppingBag,
  Sparkles,
  Search,
  Filter,
  ArrowUpDown,
  Lock,
  Eye,
  Copy,
  Star,
  Loader2,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { apiClient } from "@/lib/api-client";
import { Prompt, PromptsResponse } from "@/types/prompt";

export default function MarketplacePage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTool, setSelectedTool] = useState("all");
  const [promptType, setPromptType] = useState<"all" | "premium" | "free">("all");
  const [sortBy, setSortBy] = useState("popular");

  const fetchMarketplace = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (selectedTool !== "all") params.append("ai_tool", selectedTool);
      if (promptType !== "all") params.append("prompt_type", promptType);
      if (sortBy) params.append("sort", sortBy);

      const res = await apiClient<PromptsResponse>(`/marketplace?${params.toString()}`);
      if (res.success && res.data) {
        setPrompts(res.data);
      }
    } catch (err) {
      console.error("Erro ao carregar marketplace:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketplace();
  }, [selectedTool, promptType, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMarketplace();
  };

  const aiTools = [
    { id: "all", label: "Todas Ferramentas" },
    { id: "ChatGPT", label: "ChatGPT" },
    { id: "Midjourney", label: "Midjourney" },
    { id: "Claude", label: "Claude" },
    { id: "Stable Diffusion", label: "Stable Diffusion" },
    { id: "DALL-E", label: "DALL-E" },
  ];

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-xs font-semibold">
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Marketplace Oficial</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Adquira os Melhores <span className="gradient-text">Prompts de IA</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Compre prompts premium com pagamento local em Angola via Multicaixa Express e desbloqueie resultados profissionais imediatos.
        </p>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-xl mx-auto pt-2">
          <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Pesquisar por título, nicho ou palavra-chave..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface/80 border border-surface-border rounded-2xl pl-10 pr-24 py-3 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
          />
          <Button
            type="submit"
            variant="primary"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs"
          >
            Buscar
          </Button>
        </form>
      </div>

      {/* Filter and Sorting Controls */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 glass p-4 rounded-3xl border border-surface-border">
        {/* Tool pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {aiTools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedTool === tool.id
                  ? "bg-brand-600 text-white shadow-glow"
                  : "text-slate-400 hover:text-white hover:bg-surface-hover"
              }`}
            >
              {tool.label}
            </button>
          ))}
        </div>

        {/* Type & Sort options */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center p-1 rounded-xl bg-surface border border-surface-border text-xs">
            <button
              onClick={() => setPromptType("all")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                promptType === "all" ? "bg-brand-600 text-white shadow-glow" : "text-slate-400 hover:text-white"
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setPromptType("premium")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                promptType === "premium" ? "bg-amber-500/20 text-amber-300 font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              Premium
            </button>
            <button
              onClick={() => setPromptType("free")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                promptType === "free" ? "bg-emerald-500/20 text-emerald-300 font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              Grátis
            </button>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-surface border border-surface-border rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-brand-500"
          >
            <option value="popular" className="bg-slate-900">Mais Populares</option>
            <option value="newest" className="bg-slate-900">Mais Recentes</option>
            <option value="price_asc" className="bg-slate-900">Menor Preço</option>
            <option value="price_desc" className="bg-slate-900">Maior Preço</option>
          </select>
        </div>
      </div>

      {/* Prompts Catalog Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
          <p className="text-xs text-slate-400">Carregando prompts do marketplace...</p>
        </div>
      ) : prompts.length === 0 ? (
        <div className="glass p-12 rounded-3xl border border-surface-border text-center space-y-4 max-w-md mx-auto">
          <ShoppingBag className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">Nenhum prompt encontrado</h3>
          <p className="text-xs text-slate-400">
            Nenhum prompt correspondeu aos critérios de busca selecionados.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearch("");
              setSelectedTool("all");
              setPromptType("all");
              setSortBy("popular");
            }}
          >
            Limpar Filtros
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {prompts.map((p) => {
            const isFree = p.prompt_type === "free" || p.price === 0;

            return (
              <NextLink
                key={p.id}
                href={`/prompts/${p.slug}`}
                className="glass rounded-3xl border border-surface-border p-5 flex flex-col justify-between hover:border-brand-500/50 hover:shadow-glow transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-lg bg-surface border border-surface-border text-[11px] font-semibold text-slate-300">
                      {p.ai_tool}
                    </span>
                    {isFree ? (
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        Gratuito
                      </span>
                    ) : (
                      <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 shadow-glow">
                        {p.price.toLocaleString("pt-AO")} {p.currency || "AOA"}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-brand-400 transition-colors mb-2 line-clamp-2">
                    {p.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                    {p.short_description || p.description}
                  </p>

                  <div className="bg-surface/50 p-2.5 rounded-xl border border-surface-border/50 text-xs font-mono text-slate-400 line-clamp-2 mb-4">
                    {p.prompt_preview}
                  </div>
                </div>

                <div className="pt-3 border-t border-surface-border/60 flex items-center justify-between text-slate-400 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[11px]">
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      {p.metrics?.view_count || 0}
                    </span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      {p.metrics?.copy_count || 0}
                    </span>
                  </div>

                  <span className="text-brand-400 font-semibold flex items-center gap-1 group-hover:text-brand-300">
                    <span>{isFree ? "Usar Grátis" : "Comprar Prompt"}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </NextLink>
            );
          })}
        </div>
      )}
    </div>
  );
}
