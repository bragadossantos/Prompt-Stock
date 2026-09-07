"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Smartphone,
  Building2,
  ShieldCheck,
  Sparkles,
  Lock,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { apiClient } from "@/lib/api-client";
import { Prompt } from "@/types/prompt";
import { CheckoutResponse } from "@/types/order";

interface CheckoutModalProps {
  prompt: Prompt;
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutModal({ prompt, isOpen, onClose }: CheckoutModalProps) {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<"multicaixa_express" | "bank_transfer">("multicaixa_express");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const payload = {
        prompt_id: prompt.id,
        payment_method: paymentMethod,
        payment_phone: paymentMethod === "multicaixa_express" ? phone : null,
      };

      const res = await apiClient<CheckoutResponse>("/checkout", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (res.success && res.data.order) {
        onClose();
        router.push(`/orders/${res.data.order.order_number}`);
      }
    } catch (err: any) {
      setError(err.message || "Erro ao processar checkout. Verifique os dados e tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass rounded-3xl border border-surface-border p-6 sm:p-8 shadow-2xl space-y-6 overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Checkout Seguro</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-surface border border-surface-border text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Prompt Summary Card */}
        <div className="p-4 rounded-2xl bg-surface/80 border border-surface-border flex items-start justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <span className="px-2 py-0.5 rounded-md bg-brand-500/10 border border-brand-500/20 text-[10px] font-semibold text-brand-300 uppercase">
              {prompt.ai_tool}
            </span>
            <h3 className="text-sm font-bold text-white truncate max-w-xs">{prompt.title}</h3>
            <p className="text-[11px] text-slate-400 truncate">
              Por {prompt.source_type === "official" ? "PromptStock Official" : prompt.author?.name}
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-lg font-black text-amber-400">
              {prompt.price.toLocaleString("pt-AO")} {prompt.currency || "AOA"}
            </div>
            <div className="text-[10px] text-emerald-400 flex items-center justify-end gap-1 font-medium">
              <ShieldCheck className="w-3 h-3" /> Acesso Vitalício
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Payment Methods */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Escolha a Forma de Pagamento em Angola
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("multicaixa_express")}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  paymentMethod === "multicaixa_express"
                    ? "bg-brand-600/20 border-brand-500 shadow-glow text-white"
                    : "bg-surface border-surface-border text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Smartphone className={`w-5 h-5 ${paymentMethod === "multicaixa_express" ? "text-brand-400" : "text-slate-500"}`} />
                  <span className="text-[10px] uppercase font-bold text-brand-400">Instantâneo</span>
                </div>
                <div className="text-xs font-bold text-white">Multicaixa Express</div>
                <div className="text-[10px] text-slate-400">Notificação Push</div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("bank_transfer")}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  paymentMethod === "bank_transfer"
                    ? "bg-brand-600/20 border-brand-500 shadow-glow text-white"
                    : "bg-surface border-surface-border text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Building2 className={`w-5 h-5 ${paymentMethod === "bank_transfer" ? "text-brand-400" : "text-slate-500"}`} />
                  <span className="text-[10px] uppercase font-bold text-slate-400">Referência</span>
                </div>
                <div className="text-xs font-bold text-white">Transferência / IBAN</div>
                <div className="text-[10px] text-slate-400">BAI / Multicaixa</div>
              </button>
            </div>
          </div>

          {/* Conditional Method Inputs */}
          {paymentMethod === "multicaixa_express" ? (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Número de Telemóvel Multicaixa Express *
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-slate-500 text-xs font-semibold">+244</span>
                <input
                  type="tel"
                  required
                  placeholder="923 000 000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                  maxLength={9}
                  className="w-full bg-surface/80 border border-surface-border rounded-xl pl-14 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 font-mono"
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Irá receber uma solicitação de pagamento no seu aplicativo Express.
              </span>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-surface/60 border border-surface-border text-[11px] text-slate-300 space-y-1">
              <p className="font-semibold text-white">Instruções de Transferência Bancária:</p>
              <p className="text-slate-400">
                Após gerar a encomenda, forneceremos o IBAN da conta PromptStock e o código de referência para confirmação.
              </p>
            </div>
          )}

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              className="w-full gap-2 shadow-glow py-3"
            >
              <span>Pagar {prompt.price.toLocaleString("pt-AO")} {prompt.currency || "AOA"}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 text-center">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>Transação segura e encriptada com desbloqueio instantâneo do conteúdo.</span>
          </div>
        </form>
      </div>
    </div>
  );
}
