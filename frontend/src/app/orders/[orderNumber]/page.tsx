"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import NextLink from "next/link";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Smartphone,
  Building2,
  ArrowRight,
  Sparkles,
  Copy,
  Check,
  Loader2,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { apiClient } from "@/lib/api-client";
import { Order } from "@/types/order";

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderNumber = params.orderNumber as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  const fetchOrder = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient<{ success: boolean; data: Order }>(`/orders/${orderNumber}`);
      if (res.success && res.data) {
        setOrder(res.data);
      }
    } catch (err: any) {
      setError(err.message || "Erro ao carregar os detalhes da encomenda.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (orderNumber) {
      fetchOrder();
    }
  }, [orderNumber]);

  const handleSimulatePayment = async () => {
    try {
      setIsPaying(true);
      setError(null);
      const res = await apiClient<{ success: boolean; message: string }>(`/orders/${orderNumber}/pay`, {
        method: "POST",
      });

      if (res.success) {
        await fetchOrder();
      }
    } catch (err: any) {
      setError(err.message || "Erro ao liquidar o pagamento.");
    } finally {
      setIsPaying(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
        <p className="text-xs text-slate-400">Consultando o estado da encomenda...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
        <h1 className="text-2xl font-bold text-white mb-2">Encomenda Não Encontrada</h1>
        <p className="text-xs text-slate-400 max-w-sm mb-6">
          {error || "Não conseguimos localizar a encomenda solicitada."}
        </p>
        <NextLink href="/marketplace">
          <Button variant="outline" size="sm">
            Voltar ao Marketplace
          </Button>
        </NextLink>
      </div>
    );
  }

  const isCompleted = order.status === "completed";
  const firstItem = order.items?.[0];
  const prompt = firstItem?.prompt;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-8">
      {/* Header Badge */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-surface-border text-slate-400 text-xs font-mono">
          <span>Encomenda: {order.order_number}</span>
        </div>

        {isCompleted ? (
          <div className="space-y-2">
            <div className="w-14 h-14 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Pagamento Confirmado com Sucesso!
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              O conteúdo secreto deste prompt foi desbloqueado com sucesso e já está disponível na sua conta.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="w-14 h-14 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
              <Clock className="w-8 h-8 animate-pulse" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Aguardando Confirmação do Pagamento
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              Siga as instruções abaixo para liquidar o valor e desbloquear o acesso imediato.
            </p>
          </div>
        )}
      </div>

      {/* Order Summary Receipt */}
      <div className="glass rounded-3xl border border-surface-border p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-surface-border">
          <div className="text-xs text-slate-400">
            Data: {new Date(order.created_at).toLocaleString("pt-AO")}
          </div>
          <span
            className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase ${
              isCompleted
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
            }`}
          >
            {isCompleted ? "Pago & Ativo" : "Pendente"}
          </span>
        </div>

        {/* Item */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-brand-400 uppercase tracking-wider">
              {prompt?.ai_tool || "IA Prompt"}
            </div>
            <div className="text-base font-bold text-white">{prompt?.title || "Prompt Premium"}</div>
            <div className="text-xs text-slate-400">{prompt?.short_description}</div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-lg font-black text-white">
              {order.total_amount.toLocaleString("pt-AO")} {order.currency}
            </div>
            <div className="text-[10px] text-emerald-400 font-medium">Acesso Completo</div>
          </div>
        </div>

        {/* Payment Details / Simulation */}
        {!isCompleted && (
          <div className="p-5 rounded-2xl bg-surface/80 border border-surface-border space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
              {order.payment_method === "multicaixa_express" ? (
                <>
                  <Smartphone className="w-4 h-4 text-brand-400" />
                  <span>Multicaixa Express</span>
                </>
              ) : (
                <>
                  <Building2 className="w-4 h-4 text-brand-400" />
                  <span>Transferência Bancária / Multicaixa</span>
                </>
              )}
            </div>

            {order.payment_method === "multicaixa_express" ? (
              <div className="space-y-2 text-xs text-slate-300">
                <p>
                  Foi enviada uma notificação para o telemóvel{" "}
                  <strong className="text-white font-mono">{order.payment_phone}</strong>.
                </p>
                <p className="text-[11px] text-slate-400">
                  Abra a app Multicaixa Express no seu telefone e aprove a autorização de{" "}
                  <strong className="text-brand-400">
                    {order.total_amount.toLocaleString("pt-AO")} {order.currency}
                  </strong>.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-background border border-surface-border flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">IBAN BAI</div>
                    <div className="font-mono text-white font-bold">AO06.0040.0000.1234.5678.9012.3</div>
                  </div>
                  <button
                    onClick={() => copyToClipboard("AO06004000001234567890123")}
                    className="p-1.5 rounded-lg bg-surface text-slate-400 hover:text-white"
                    title="Copiar IBAN"
                  >
                    {copiedRef ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="p-3 rounded-xl bg-background border border-surface-border flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Código de Referência</div>
                    <div className="font-mono text-brand-400 font-bold">{order.payment_reference}</div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(order.payment_reference || "")}
                    className="p-1.5 rounded-lg bg-surface text-slate-400 hover:text-white"
                    title="Copiar Referência"
                  >
                    {copiedRef ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Instant Confirmation Action (Demo & Live) */}
            <div className="pt-2">
              <Button
                variant="primary"
                onClick={handleSimulatePayment}
                isLoading={isPaying}
                className="w-full gap-2 shadow-glow"
              >
                <span>Simular Confirmação Multicaixa Express / Pagar Agora</span>
                <CheckCircle2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Action Buttons if Completed */}
        {isCompleted && (
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
            {prompt?.slug && (
              <NextLink href={`/prompts/${prompt.slug}`} className="w-full sm:w-auto flex-1">
                <Button variant="primary" size="md" className="w-full gap-2 shadow-glow">
                  <span>Aceder ao Prompt Desbloqueado</span>
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </NextLink>
            )}
            <NextLink href="/library" className="w-full sm:w-auto flex-1">
              <Button variant="outline" size="md" className="w-full gap-2">
                <span>Ver na Minha Biblioteca</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </NextLink>
          </div>
        )}
      </div>
    </div>
  );
}
