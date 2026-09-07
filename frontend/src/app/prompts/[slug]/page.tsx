"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { Prompt } from "@/types/prompt";
import { useAuth } from "@/context/auth-context";
import { CopyButton } from "@/components/prompts/CopyButton";
import { Button } from "@/components/ui/Button";
import {
  Sparkles,
  ShieldCheck,
  Star,
  Copy,
  Heart,
  Bookmark,
  Share2,
  Lock,
  ChevronRight,
  Cpu,
  Clock,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { CheckoutModal } from "@/components/prompts/CheckoutModal";

export default function PromptDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleBuyClick = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setIsCheckoutOpen(true);
  };

  useEffect(() => {
    async function loadPrompt() {
      setIsLoading(true);
      try {
        const res = await apiClient<{ success: boolean; data: Prompt }>(`/prompts/${slug}`);
        if (res.success && res.data) {
          setPrompt(res.data);
          setIsFavorited(res.data.user_interactions.is_favorited);
          setFavoriteCount(res.data.metrics.favorite_count);
          setIsSaved(res.data.user_interactions.is_saved);
        }
      } catch (err: any) {
        setErrorMessage(err.message || "Prompt não encontrado.");
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) {
      loadPrompt();
    }
  }, [slug]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!prompt) return;

    try {
      const res = await apiClient<{ success: boolean; data: { is_favorited: boolean; favorite_count: number } }>(
        `/prompts/${prompt.id}/favorite`,
        { method: "POST" }
      );
      if (res.success) {
        setIsFavorited(res.data.is_favorited);
        setFavoriteCount(res.data.favorite_count);
      }
    } catch (err) {
      console.error("Erro ao favoritar:", err);
    }
  };

  const handleToggleSave = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!prompt) return;

    try {
      const res = await apiClient<{ success: boolean; data: { is_saved: boolean } }>(
        `/prompts/${prompt.id}/save`,
        { method: "POST" }
      );
      if (res.success) {
        setIsSaved(res.data.is_saved);
      }
    } catch (err) {
      console.error("Erro ao salvar na biblioteca:", err);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
        <p className="text-xs">Carregando detalhes do prompt...</p>
      </div>
    );
  }

  if (errorMessage || !prompt) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center px-4">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Prompt não encontrado</h2>
        <p className="text-xs text-slate-400 mb-6">{errorMessage || "O prompt solicitado não existe ou foi arquivado."}</p>
        <Link href="/explore">
          <Button variant="primary">Voltar ao Catálogo</Button>
        </Link>
      </div>
    );
  }

  const isOfficial = prompt.source_type === "official";
  const isFree = prompt.prompt_type === "free" || prompt.price === 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8 overflow-x-auto">
        <Link href="/" className="hover:text-slate-300">Início</Link>
        <ChevronRight className="w-3 h-3 text-slate-600" />
        <Link href="/explore" className="hover:text-slate-300">Prompts</Link>
        {prompt.category && (
          <>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <Link href={`/explore?category=${encodeURIComponent(prompt.category.slug)}`} className="hover:text-slate-300">
              {prompt.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3 h-3 text-slate-600" />
        <span className="text-slate-300 truncate max-w-xs">{prompt.title}</span>
      </nav>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details & Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header Card */}
          <div className="glass p-6 sm:p-8 rounded-3xl border border-surface-border">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {isOfficial ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-brand-600/20 border border-brand-500/30 text-brand-300 text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4 text-brand-400" />
                  PromptStock Official
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-surface border border-surface-border text-slate-300 text-xs font-medium">
                  Criador: {prompt.author.name}
                </span>
              )}

              {isFree ? (
                <span className="px-3 py-1 rounded-lg bg-accent-emerald/10 border border-accent-emerald/30 text-accent-emerald text-xs font-bold">
                  Gratuito
                </span>
              ) : (
                <span className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
                  Premium • {prompt.price.toLocaleString("pt-AO")} {prompt.currency}
                </span>
              )}

              <span className="px-2.5 py-1 rounded-lg bg-surface border border-surface-border text-slate-400 text-xs font-mono">
                {prompt.ai_tool} {prompt.ai_model && `• ${prompt.ai_model}`}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4">
              {prompt.title}
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              {prompt.description}
            </p>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-surface-border">
              {!prompt.is_locked ? (
                <CopyButton
                  promptId={prompt.id}
                  textToCopy={prompt.prompt_content || prompt.prompt_preview}
                  size="md"
                  className="shadow-glow"
                />
              ) : (
                <Button variant="primary" size="md" onClick={handleBuyClick} className="shadow-glow">
                  <Lock className="w-4 h-4 mr-1.5" />
                  Comprar Prompt ({prompt.price.toLocaleString("pt-AO")} {prompt.currency})
                </Button>
              )}

              <Button
                variant="outline"
                size="md"
                onClick={handleToggleFavorite}
                className={isFavorited ? "border-red-500/50 text-red-400" : ""}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? "fill-red-400 text-red-400" : ""}`} />
                <span>{favoriteCount}</span>
              </Button>

              <Button
                variant="outline"
                size="md"
                onClick={handleToggleSave}
                className={isSaved ? "border-brand-500/50 text-brand-300" : ""}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? "fill-brand-400 text-brand-400" : ""}`} />
                <span>{isSaved ? "Salvo" : "Salvar"}</span>
              </Button>

              <Button variant="ghost" size="md" onClick={handleShare} title="Compartilhar link">
                <Share2 className="w-4 h-4" />
                <span>{copiedShare ? "Link Copiado!" : "Compartilhar"}</span>
              </Button>
            </div>
          </div>

          {/* Prompt Content Section */}
          <div className="glass p-6 sm:p-8 rounded-3xl border border-surface-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-400" />
                Texto do Prompt
              </h2>
              {!prompt.is_locked && (
                <span className="text-xs text-slate-400 font-mono">Pronto para uso</span>
              )}
            </div>

            {prompt.is_locked ? (
              <div className="relative rounded-2xl overflow-hidden border border-surface-border bg-surface/80 p-6">
                {/* Blurred text mockup */}
                <div className="blur-sm select-none text-xs font-mono text-slate-400 leading-relaxed space-y-2">
                  <p>{prompt.prompt_preview}</p>
                  <p>************************************************************************</p>
                  <p>***************************************************************************************</p>
                  <p>************************************************************</p>
                </div>

                {/* Unlock Overlay */}
                <div className="absolute inset-0 bg-surface/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-1">Conteúdo Premium Protegido</h4>
                  <p className="text-xs text-slate-400 max-w-sm mb-4">
                    Este prompt foi criado com engenharia avançada. Adquira o acesso vitalício com pagamento local em AOA.
                  </p>
                  <Button variant="primary" size="md" onClick={handleBuyClick} className="shadow-glow">
                    Desbloquear por {prompt.price.toLocaleString("pt-AO")} {prompt.currency}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative rounded-2xl bg-surface p-5 border border-surface-border">
                <pre className="text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed font-normal">
                  {prompt.prompt_content || prompt.prompt_preview}
                </pre>
              </div>
            )}
          </div>

          {/* Results Demonstration Section */}
          {prompt.results && prompt.results.length > 0 && (
            <div className="glass p-6 sm:p-8 rounded-3xl border border-surface-border">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent-emerald" />
                Demonstração de Resultado do Prompt
              </h2>

              <div className="space-y-4">
                {prompt.results.map((res) => (
                  <div key={res.id} className="p-4 rounded-xl bg-surface border border-surface-border">
                    {res.result_text && (
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        {res.result_text}
                      </p>
                    )}
                    <div className="mt-3 pt-3 border-t border-surface-border/50 flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                      <span>Ferramenta: {res.ai_tool || prompt.ai_tool}</span>
                      <span>Modelo: {res.ai_model || prompt.ai_model}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Tech specs & Author */}
        <div className="space-y-6">
          {/* Specs Card */}
          <div className="glass p-6 rounded-2xl border border-surface-border space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Informações Técnicas
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-surface-border/50">
                <span className="text-slate-400">Ferramenta de IA</span>
                <span className="font-semibold text-white font-mono">{prompt.ai_tool}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-surface-border/50">
                <span className="text-slate-400">Modelo Recomendado</span>
                <span className="font-semibold text-accent-cyan font-mono">{prompt.ai_model || "Qualquer versão"}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-surface-border/50">
                <span className="text-slate-400">Categoria</span>
                <span className="font-semibold text-white">{prompt.category?.name || "Geral"}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-surface-border/50">
                <span className="text-slate-400">Total de Cópias</span>
                <span className="font-semibold text-white">{prompt.metrics.copy_count.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-surface-border/50">
                <span className="text-slate-400">Visualizações</span>
                <span className="font-semibold text-white">{prompt.metrics.view_count.toLocaleString()}</span>
              </div>
            </div>

            {/* Tags */}
            {prompt.tags && prompt.tags.length > 0 && (
              <div className="pt-2">
                <div className="text-xs font-semibold text-slate-400 mb-2">Tags:</div>
                <div className="flex flex-wrap gap-1.5">
                  {prompt.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-2.5 py-1 rounded-md bg-surface text-slate-300 text-[11px] border border-surface-border"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {prompt && (
        <CheckoutModal
          prompt={prompt}
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
        />
      )}
    </div>
  );
}
