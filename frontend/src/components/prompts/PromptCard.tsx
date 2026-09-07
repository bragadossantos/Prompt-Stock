"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Prompt } from "@/types/prompt";
import { CopyButton } from "./CopyButton";
import {
  Sparkles,
  Star,
  Copy,
  Lock,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Cpu,
} from "lucide-react";

interface PromptCardProps {
  prompt: Prompt;
}

export function PromptCard({ prompt }: PromptCardProps) {
  const [copyCount, setCopyCount] = useState(prompt.metrics.copy_count);

  const isOfficial = prompt.source_type === "official";
  const isFree = prompt.prompt_type === "free" || prompt.price === 0;

  return (
    <div className="glass-card rounded-2xl flex flex-col justify-between border border-surface-border overflow-hidden group">
      {/* Top Media / Gradient Preview */}
      <div className="relative h-40 w-full bg-gradient-to-tr from-surface to-surface-hover p-4 flex flex-col justify-between overflow-hidden border-b border-surface-border/50">
        {/* Subtle accent mesh in background */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-brand-600/10 rounded-full blur-2xl group-hover:bg-brand-600/20 transition-all pointer-events-none" />

        {/* Badges Row */}
        <div className="flex items-center justify-between gap-2 z-10">
          {/* Source Badge */}
          {isOfficial ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-600/20 border border-brand-500/30 text-brand-300 text-[11px] font-semibold tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
              PromptStock Official
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface/80 border border-surface-border text-slate-300 text-[11px] font-medium">
              Por {prompt.author.name.split(" ")[0]}
            </span>
          )}

          {/* Type / Price Badge */}
          {isFree ? (
            <span className="px-2.5 py-0.5 rounded-full bg-accent-emerald/10 border border-accent-emerald/30 text-accent-emerald text-[11px] font-bold">
              Grátis
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-bold">
              <Lock className="w-3 h-3" />
              {prompt.price.toLocaleString("pt-AO")} {prompt.currency}
            </span>
          )}
        </div>

        {/* AI Tool indicator in bottom of banner */}
        <div className="flex items-center justify-between z-10">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface/90 border border-surface-border text-slate-300 text-[11px] font-mono">
            <Cpu className="w-3 h-3 text-accent-cyan" />
            {prompt.ai_tool} {prompt.ai_model && `• ${prompt.ai_model}`}
          </span>

          {prompt.category && (
            <span className="text-[11px] font-medium text-slate-400">
              {prompt.category.name}
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/prompts/${prompt.slug}`} className="block group-hover:text-brand-400 transition-colors">
            <h3 className="text-base font-bold text-white tracking-tight line-clamp-1 mb-1.5">
              {prompt.title}
            </h3>
          </Link>
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
            {prompt.short_description}
          </p>
        </div>

        {/* Card Footer & Metrics */}
        <div className="pt-4 border-t border-surface-border/50 flex items-center justify-between gap-3">
          {/* Metrics */}
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              {copyCount.toLocaleString()}
            </span>
            {prompt.metrics.average_rating > 0 && (
              <span className="flex items-center gap-1 text-amber-400 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {prompt.metrics.average_rating.toFixed(1)}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {!prompt.is_locked && (
              <CopyButton
                promptId={prompt.id}
                textToCopy={prompt.prompt_content || prompt.prompt_preview}
                variant="icon"
                onCopied={(newCount) => newCount && setCopyCount(newCount)}
              />
            )}

            <Link
              href={`/prompts/${prompt.slug}`}
              className="p-2 rounded-xl bg-surface hover:bg-surface-hover hover:border-brand-500/50 text-slate-300 hover:text-white border border-surface-border transition-all"
              title="Ver detalhes do prompt"
            >
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
