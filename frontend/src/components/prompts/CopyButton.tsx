"use client";

import React, { useState } from "react";
import { Copy, Check, X } from "lucide-react";
import { apiClient } from "@/lib/api-client";

interface CopyButtonProps {
  promptId: number;
  textToCopy?: string | null;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "button" | "icon";
  onCopied?: (newCount?: number) => void;
}

export function CopyButton({
  promptId,
  textToCopy,
  className = "",
  size = "md",
  variant = "button",
  onCopied,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (copied || failed || isCopying) return;

    setIsCopying(true);

    try {
      if (textToCopy) {
        await navigator.clipboard.writeText(textToCopy);
      }

      // The clipboard write succeeded — the user's task is done, so show
      // success regardless of whether the background tracking call below works.
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2500);

      // Record copy event in API. This is best-effort telemetry: if it fails,
      // fail silently since the user already got what they wanted (the copy).
      try {
        const res = await apiClient<{ success: boolean; data: { copy_count: number } }>(
          `/prompts/${promptId}/copy`,
          { method: "POST" }
        );
        if (onCopied && res?.data?.copy_count) {
          onCopied(res.data.copy_count);
        }
      } catch (trackingErr) {
        console.error("Falha ao registar cópia do prompt:", trackingErr);
      }
    } catch (err) {
      // The clipboard write itself failed — this is something the user needs
      // to know about, since nothing was actually copied.
      console.error("Falha ao copiar prompt:", err);
      setFailed(true);
      setTimeout(() => {
        setFailed(false);
      }, 2000);
    } finally {
      setIsCopying(false);
    }
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleCopy}
        className={`p-2 rounded-xl transition-all duration-200 ${
          copied
            ? "bg-accent-emerald/20 text-accent-emerald border border-accent-emerald/30"
            : failed
            ? "bg-red-500/20 text-red-400 border border-red-500/30"
            : "bg-surface hover:bg-surface-hover text-slate-300 hover:text-white border border-surface-border"
        } ${className}`}
        title={copied ? "Copiado!" : failed ? "Falha ao copiar" : "Copiar prompt"}
        aria-label="Copiar prompt"
      >
        {copied ? (
          <Check className="w-4 h-4 text-accent-emerald" />
        ) : failed ? (
          <X className="w-4 h-4 text-red-400" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>
    );
  }

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-xs gap-2 font-semibold",
    lg: "px-6 py-2.5 text-sm gap-2.5 font-bold",
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center justify-center rounded-xl transition-all duration-200 ${
        sizeClasses[size]
      } ${
        copied
          ? "bg-accent-emerald/20 text-accent-emerald border border-accent-emerald/30 shadow-glow"
          : failed
          ? "bg-red-500/20 text-red-400 border border-red-500/30"
          : "bg-surface hover:bg-surface-hover hover:border-brand-500/50 text-slate-200 border border-surface-border"
      } ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-accent-emerald" />
          <span>Prompt Copiado!</span>
        </>
      ) : failed ? (
        <>
          <X className="w-4 h-4 text-red-400" />
          <span>Falha ao Copiar</span>
        </>
      ) : (
        <>
          <Copy className="w-4 h-4 text-brand-400" />
          <span>Copiar Prompt</span>
        </>
      )}
    </button>
  );
}
