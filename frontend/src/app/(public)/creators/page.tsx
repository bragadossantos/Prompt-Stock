"use client";

import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import {
  Sparkles,
  Users,
  Star,
  CheckCircle2,
  FileCode2,
  TrendingUp,
  Search,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { PublicCreator } from "@/types/creator";
import { Button } from "@/components/ui/Button";

export default function PublicCreatorsPage() {
  const [creators, setCreators] = useState<PublicCreator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        setIsLoading(true);
        const res = await apiClient<{ success: boolean; data: PublicCreator[] }>("/creators");
        if (res.success && res.data) {
          setCreators(res.data);
        }
      } catch (err) {
        console.error("Erro ao listar criadores:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCreators();
  }, []);

  const filteredCreators = creators.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.username.toLowerCase().includes(search.toLowerCase()) ||
    (c.headline && c.headline.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Engenheiros & Artistas de IA</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Conheça os Melhores <span className="gradient-text">Criadores de Prompts</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Descubra especialistas que desenham prompts de elite para ChatGPT, Midjourney, Claude e fluxos de automação com IA.
        </p>

        {/* Search Input */}
        <div className="relative max-w-md mx-auto pt-2">
          <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Pesquisar por criador ou especialidade..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface/80 border border-surface-border rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {/* Creator Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
          <p className="text-xs text-slate-400">Carregando lista de criadores...</p>
        </div>
      ) : filteredCreators.length === 0 ? (
        <div className="glass p-12 rounded-3xl border border-surface-border text-center space-y-4 max-w-md mx-auto">
          <Users className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">Nenhum criador encontrado</h3>
          <p className="text-xs text-slate-400">
            Não encontramos nenhum perfil correspondente aos critérios da sua pesquisa.
          </p>
          <NextLink href="/creator/dashboard">
            <Button variant="primary" size="sm">
              Torne-se o Primeiro Criador
            </Button>
          </NextLink>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCreators.map((creator) => (
            <div
              key={creator.username}
              className="glass rounded-3xl border border-surface-border p-6 flex flex-col justify-between hover:border-brand-500/50 hover:shadow-glow transition-all group"
            >
              <div>
                {/* Header Profile */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center font-bold text-white text-lg shadow-glow">
                      {creator.avatar_url ? (
                        <img
                          src={creator.avatar_url}
                          alt={creator.name}
                          className="w-full h-full object-cover rounded-2xl"
                        />
                      ) : (
                        creator.name.charAt(0)
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-white group-hover:text-brand-400 transition-colors">
                          {creator.name}
                        </span>
                        {creator.is_verified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
                        )}
                      </div>
                      <span className="text-xs text-slate-500">@{creator.username}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-xl border border-amber-500/20">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{creator.rating > 0 ? Number(creator.rating).toFixed(1) : "Novo"}</span>
                  </div>
                </div>

                {/* Headline & Bio */}
                <p className="text-xs font-medium text-slate-200 line-clamp-2 mb-2">
                  {creator.headline || "Criador de Prompts de IA na PromptStock"}
                </p>
                <p className="text-[11px] text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                  {creator.bio || "Explorando as fronteiras dos modelos de linguagem e arte generativa."}
                </p>
              </div>

              {/* Stats & CTA */}
              <div className="pt-4 border-t border-surface-border/60 flex items-center justify-between">
                <div className="flex items-center gap-4 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <FileCode2 className="w-3.5 h-3.5 text-brand-400" />
                    <strong className="text-white">{creator.prompts_count || 0}</strong> prompts
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    <strong className="text-white">{creator.total_sales || 0}</strong> vendas
                  </span>
                </div>

                <NextLink href={`/creator/${creator.username}`}>
                  <Button variant="outline" size="sm" className="gap-1 text-xs">
                    <span>Ver Perfil</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Button>
                </NextLink>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
