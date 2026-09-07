"use client";

import React from "react";
import { Search, Filter, Sparkles, Check, ShieldCheck, Users, Crown, Cpu, Layers } from "lucide-react";
import { Category } from "@/types/auth";

interface PromptFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  sourceType: string;
  onSourceTypeChange: (value: string) => void;
  promptType: string;
  onPromptTypeChange: (value: string) => void;
  aiTool: string;
  onAiToolChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  categories: Category[];
}

export function PromptFilters({
  search,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sourceType,
  onSourceTypeChange,
  promptType,
  onPromptTypeChange,
  aiTool,
  onAiToolChange,
  sort,
  onSortChange,
  categories,
}: PromptFiltersProps) {
  const aiTools = ["Todos", "ChatGPT", "Midjourney", "Claude", "Flux", "DALL-E"];

  return (
    <div className="space-y-5">
      {/* Top Search & Sort Row */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Pesquisar prompts por título, tecnologia, modelo ou palavras-chave..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-surface border border-surface-border hover:border-slate-700 focus:border-brand-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Sort Select */}
        <div className="w-full sm:w-auto shrink-0 flex items-center gap-2">
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full sm:w-auto bg-surface border border-surface-border hover:border-slate-700 focus:border-brand-500 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-200 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="newest">Mais Recentes</option>
            <option value="popular">Mais Usados & Copiados</option>
            <option value="rating">Melhor Avaliados</option>
            <option value="price_asc">Menor Preço</option>
            <option value="price_desc">Maior Preço</option>
          </select>
        </div>
      </div>

      {/* Pill Filter Rows */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-surface-border/50">
        {/* Source Pills */}
        <button
          onClick={() => onSourceTypeChange("")}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            sourceType === ""
              ? "bg-brand-600 text-white shadow-glow"
              : "bg-surface hover:bg-surface-hover text-slate-400 hover:text-slate-200 border border-surface-border"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Todas as Origens</span>
        </button>
        <button
          onClick={() => onSourceTypeChange("official")}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            sourceType === "official"
              ? "bg-brand-600 text-white shadow-glow"
              : "bg-surface hover:bg-surface-hover text-slate-400 hover:text-slate-200 border border-surface-border"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-accent-cyan" />
          <span>PromptStock Official</span>
        </button>
        <button
          onClick={() => onSourceTypeChange("creator")}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            sourceType === "creator"
              ? "bg-brand-600 text-white shadow-glow"
              : "bg-surface hover:bg-surface-hover text-slate-400 hover:text-slate-200 border border-surface-border"
          }`}
        >
          <Users className="w-3.5 h-3.5 text-brand-300" />
          <span>Criadores da Comunidade</span>
        </button>

        <span className="w-px h-5 bg-surface-border hidden sm:block mx-1" />

        {/* Pricing Pills */}
        <button
          onClick={() => onPromptTypeChange("")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            promptType === ""
              ? "bg-slate-200 text-slate-900"
              : "bg-surface hover:bg-surface-hover text-slate-400 hover:text-slate-200 border border-surface-border"
          }`}
        >
          Todos os Preços
        </button>
        <button
          onClick={() => onPromptTypeChange("free")}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            promptType === "free"
              ? "bg-accent-emerald text-slate-900"
              : "bg-surface hover:bg-surface-hover text-slate-400 hover:text-slate-200 border border-surface-border"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Grátis</span>
        </button>
        <button
          onClick={() => onPromptTypeChange("premium")}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            promptType === "premium"
              ? "bg-amber-400 text-slate-900 font-bold"
              : "bg-surface hover:bg-surface-hover text-slate-400 hover:text-slate-200 border border-surface-border"
          }`}
        >
          <Crown className="w-3.5 h-3.5" />
          <span>Premium</span>
        </button>
      </div>

      {/* AI Tool Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="inline-flex items-center gap-1 text-slate-500 font-medium shrink-0">
          <Cpu className="w-3.5 h-3.5 text-brand-400" />
          <span>Ferramenta IA:</span>
        </span>
        {aiTools.map((tool) => {
          const val = tool === "Todos" ? "" : tool;
          const isSelected = aiTool === val;
          return (
            <button
              key={tool}
              onClick={() => onAiToolChange(val)}
              className={`px-2.5 py-1 rounded-md transition-all shrink-0 font-mono ${
                isSelected
                  ? "bg-accent-cyan/20 border border-accent-cyan/40 text-accent-cyan font-bold"
                  : "bg-surface text-slate-400 hover:text-white border border-surface-border"
              }`}
            >
              {tool}
            </button>
          );
        })}
      </div>
    </div>
  );
}
