"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import NextLink from "next/link";
import {
  Sparkles,
  CheckCircle2,
  Star,
  Globe,
  FileCode2,
  TrendingUp,
  Eye,
  Copy,
  ArrowLeft,
  Loader2,
  Calendar,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { PublicCreator } from "@/types/creator";
import { Prompt } from "@/types/prompt";
import { Button } from "@/components/ui/Button";

export default function CreatorProfilePage() {
  const params = useParams();
  const username = params.username as string;

  const [creator, setCreator] = useState<PublicCreator | null>(null);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;

    const fetchCreatorProfile = async () => {
      try {
        setIsLoading(true);
        const res = await apiClient<{
          success: boolean;
          data: {
            creator: PublicCreator;
            prompts: Prompt[];
          };
        }>(`/creators/${username}`);

        if (res.success && res.data) {
          setCreator(res.data.creator);
          setPrompts(res.data.prompts);
        }
      } catch (err: any) {
        setError(err.message || "Criador não encontrado.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCreatorProfile();
  }, [username]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
        <p className="text-xs text-slate-400">Carregando perfil do criador...</p>
      </div>
    );
  }

  if (error || !creator) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-2xl font-bold text-white mb-2">Criador não encontrado</h1>
        <p className="text-xs text-slate-400 max-w-sm mb-6">
          {error || "O criador que procura não existe ou o seu perfil não está ativo."}
        </p>
        <NextLink href="/creators">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Ver Todos os Criadores</span>
          </Button>
        </NextLink>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10">
      {/* Back Link */}
      <NextLink
        href="/creators"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar à lista de criadores</span>
      </NextLink>

      {/* Creator Profile Card */}
      <div className="glass rounded-3xl border border-surface-border p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start md:items-center gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white text-3xl font-black shadow-glow shrink-0">
              {creator.avatar_url ? (
                <img
                  src={creator.avatar_url}
                  alt={creator.name}
                  className="w-full h-full object-cover rounded-3xl"
                />
              ) : (
                creator.name.charAt(0)
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {creator.name}
                </h1>
                {creator.is_verified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verificado
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="text-brand-400 font-semibold">@{creator.username}</span>
                {creator.joined_at && (
                  <span className="flex items-center gap-1 text-slate-500">
                    <Calendar className="w-3 h-3" /> Membro desde {new Date(creator.joined_at).getFullYear()}
                  </span>
                )}
              </div>

              {creator.headline && (
                <p className="text-sm font-medium text-slate-200 pt-1">
                  {creator.headline}
                </p>
              )}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex-1 md:flex-initial p-4 rounded-2xl bg-surface/80 border border-surface-border text-center">
              <div className="text-xl font-bold text-white">{prompts.length}</div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Prompts</div>
            </div>
            <div className="flex-1 md:flex-initial p-4 rounded-2xl bg-surface/80 border border-surface-border text-center">
              <div className="text-xl font-bold text-amber-400 flex items-center justify-center gap-1">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{creator.rating > 0 ? Number(creator.rating).toFixed(1) : "—"}</span>
              </div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Avaliação</div>
            </div>
            <div className="flex-1 md:flex-initial p-4 rounded-2xl bg-surface/80 border border-surface-border text-center">
              <div className="text-xl font-bold text-emerald-400">{creator.total_sales || 0}</div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Vendas</div>
            </div>
          </div>
        </div>

        {/* Bio */}
        {creator.bio && (
          <div className="mt-6 pt-6 border-t border-surface-border text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
            {creator.bio}
          </div>
        )}
      </div>

      {/* Prompts by this Creator */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Prompts por {creator.name}
            </h2>
            <p className="text-xs text-slate-400">
              Explore e use os modelos de inteligência artificial desenvolvidos por este criador.
            </p>
          </div>
        </div>

        {prompts.length === 0 ? (
          <div className="glass p-12 rounded-3xl border border-surface-border text-center text-xs text-slate-500">
            Este criador ainda não tem prompts publicados publicamente.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map((p) => (
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
                    {p.prompt_type === "free" ? (
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        Gratuito
                      </span>
                    ) : (
                      <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                        {p.price.toLocaleString("pt-AO")} {p.currency || "AOA"}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-brand-400 transition-colors mb-2 line-clamp-2">
                    {p.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-3 mb-4 font-mono bg-surface/50 p-2.5 rounded-xl border border-surface-border/50">
                    {p.prompt_preview}
                  </p>
                </div>

                <div className="pt-3 border-t border-surface-border/60 flex items-center justify-between text-slate-400 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      {p.metrics?.view_count || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      {p.metrics?.copy_count || 0}
                    </span>
                  </div>

                  <span className="text-brand-400 font-semibold group-hover:underline">
                    Ver Prompt &rarr;
                  </span>
                </div>
              </NextLink>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
