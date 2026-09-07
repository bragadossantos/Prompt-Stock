"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
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
  const [isCopying, setIsCopying] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (copied || isCopying) return;

    setIsCopying(true);

    try {
      if (textToCopy) {
        await navigator.clipboard.writeText(textToCopy);
      }

      // Record copy event in API
      const res = await apiClient<{ success: boolean; data: { copy_count: number } }>(
        `/prompts/${promptId}/copy`,
        { method: "POST" }
      );

      setCopied(true);
      if (onCopied && res?.data?.copy_count) {
        onCopied(res.data.copy_count);
      }

      setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch (err) {
      console.error("Falha ao copiar prompt:", err);
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
            : "bg-surface hover:bg-surface-hover text-slate-300 hover:text-white border border-surface-border"
        } ${className}`}
        title={copied ? "Copiado!" : "Copiar prompt"}
        aria-label="Copiar prompt"
      >
        {copied ? <Check className="w-4 h-4 text-accent-emerald" /> : <Copy className="w-4 h-4" />}
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
          : "bg-surface hover:bg-surface-hover hover:border-brand-500/50 text-slate-200 border border-surface-border"
      } ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-accent-emerald" />
          <span>Prompt Copiado!</span>
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
