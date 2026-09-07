"use client";

import React, { useEffect, useState } from "react";
import {
  Wallet,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
  Building2,
  Smartphone,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { apiClient } from "@/lib/api-client";
import { CreatorProfile, CreatorWithdrawal } from "@/types/creator";

export default function CreatorEarningsPage() {
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [withdrawals, setWithdrawals] = useState<CreatorWithdrawal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [withdrawForm, setWithdrawForm] = useState({
    amount: 5000,
    payment_method: "multicaixa_express" as "multicaixa_express" | "bank_transfer",
    account_details: "",
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient<{
        success: boolean;
        data: {
          profile: CreatorProfile;
          withdrawals: CreatorWithdrawal[];
        };
      }>("/creator/earnings");

      if (res.success && res.data) {
        setProfile(res.data.profile);
        setWithdrawals(res.data.withdrawals);
      }
    } catch (err: any) {
      setError(err.message || "Erro ao carregar os dados financeiros.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRequestWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    try {
      const res = await apiClient<{ success: boolean; message: string }>("/creator/withdrawals", {
        method: "POST",
        body: JSON.stringify(withdrawForm),
      });

      setSuccessMsg("Pedido de levantamento registado com sucesso!");
      setWithdrawForm((prev) => ({ ...prev, amount: 5000, account_details: "" }));
      await fetchData();
    } catch (err: any) {
      setError(err.message || "Erro ao submeter pedido de levantamento.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
        <p className="text-xs text-slate-400">Carregando dados financeiros...</p>
      </div>
    );
  }

  const availableBalance = profile?.available_balance || 0;
  const pendingBalance = profile?.pending_balance || 0;
  const totalEarnings = profile?.total_earnings || 0;
  const totalSales = profile?.total_sales || 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Ganhos & Levantamentos</h1>
        <p className="text-xs text-slate-400">
          Gerencie o seu saldo, receba as suas vendas e solicite transferências via Multicaixa Express ou IBAN.
        </p>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Saldo Disponível</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            {availableBalance.toLocaleString("pt-AO")} AOA
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">Pronto para levantamento imediato</div>
        </div>

        <div className="glass p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Saldo em Processamento</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            {pendingBalance.toLocaleString("pt-AO")} AOA
          </div>
          <div className="text-[11px] text-amber-400 mt-1">Levantamentos sob revisão</div>
        </div>

        <div className="glass p-5 rounded-2xl border border-surface-border">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Total Ganho (Histórico)</span>
            <TrendingUp className="w-4 h-4 text-brand-400" />
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            {totalEarnings.toLocaleString("pt-AO")} AOA
          </div>
          <div className="text-[11px] text-slate-400 mt-1">{totalSales} vendas concluídas</div>
        </div>

        <div className="glass p-5 rounded-2xl border border-surface-border">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Repasse por Venda</span>
            <ShieldCheck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white tracking-tight">80%</div>
          <div className="text-[11px] text-slate-400 mt-1">Taxa PromptStock: 20%</div>
        </div>
      </div>

      {/* Main Grid: Request Form + History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Withdrawal Request Form */}
        <div className="glass rounded-3xl border border-surface-border p-6 space-y-5 h-fit">
          <div>
            <h2 className="text-base font-bold text-white">Pedir Levantamento</h2>
            <p className="text-xs text-slate-400">
              Mínimo de 5.000 AOA. O valor é enviado na sua conta em até 24 horas úteis.
            </p>
          </div>

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRequestWithdrawal} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Valor do Levantamento (AOA) *
              </label>
              <input
                type="number"
                min="5000"
                max={availableBalance > 0 ? availableBalance : 5000}
                step="500"
                required
                value={withdrawForm.amount}
                onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: Number(e.target.value) })}
                className="w-full bg-surface/80 border border-surface-border rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
              />
              <span className="text-[10px] text-slate-500">
                Máximo disponível: {availableBalance.toLocaleString("pt-AO")} AOA
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Método de Transferência *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setWithdrawForm({ ...withdrawForm, payment_method: "multicaixa_express" })}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    withdrawForm.payment_method === "multicaixa_express"
                      ? "bg-brand-600 border-brand-500 text-white shadow-glow"
                      : "bg-surface border-surface-border text-slate-400 hover:text-white"
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Express</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWithdrawForm({ ...withdrawForm, payment_method: "bank_transfer" })}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    withdrawForm.payment_method === "bank_transfer"
                      ? "bg-brand-600 border-brand-500 text-white shadow-glow"
                      : "bg-surface border-surface-border text-slate-400 hover:text-white"
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>IBAN</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {withdrawForm.payment_method === "multicaixa_express"
                  ? "Número de Telefone Multicaixa Express *"
                  : "IBAN Angolano (AO06...) *"}
              </label>
              <input
                type="text"
                required
                placeholder={
                  withdrawForm.payment_method === "multicaixa_express"
                    ? "ex: 923 000 000"
                    : "AO06 0000 0000 0000 0000 0"
                }
                value={withdrawForm.account_details}
                onChange={(e) => setWithdrawForm({ ...withdrawForm, account_details: e.target.value })}
                className="w-full bg-surface/80 border border-surface-border rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              disabled={availableBalance < 5000}
              className="w-full gap-2 shadow-glow"
            >
              <Send className="w-4 h-4" />
              <span>Solicitar {withdrawForm.amount.toLocaleString("pt-AO")} AOA</span>
            </Button>
            {availableBalance < 5000 && (
              <p className="text-[11px] text-amber-400/80 text-center">
                Necessita de pelo menos 5.000 AOA de saldo disponível para solicitar transferência.
              </p>
            )}
          </form>
        </div>

        {/* Withdrawals History Table */}
        <div className="lg:col-span-2 glass rounded-3xl border border-surface-border p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold text-white">Histórico de Levantamentos</h2>
            <p className="text-xs text-slate-400">
              Todas as solicitações de saque e transferências efetuadas pela PromptStock.
            </p>
          </div>

          {withdrawals.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-xs">
              Ainda não possui nenhum registo de levantamento.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface/90 border-b border-surface-border text-slate-400 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-3 font-semibold">Data</th>
                    <th className="py-3 px-3 font-semibold">Valor</th>
                    <th className="py-3 px-3 font-semibold">Método / Conta</th>
                    <th className="py-3 px-3 font-semibold">Estado</th>
                    <th className="py-3 px-3 font-semibold">Ref. / Obs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border/50">
                  {withdrawals.map((w) => (
                    <tr key={w.id} className="hover:bg-surface-hover/50 transition-colors">
                      <td className="py-3 px-3 text-slate-400 text-[11px]">
                        {new Date(w.requested_at).toLocaleDateString("pt-AO")}
                      </td>
                      <td className="py-3 px-3 font-bold text-white">
                        {w.amount.toLocaleString("pt-AO")} {w.currency}
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-slate-300 font-medium">
                          {w.payment_method === "multicaixa_express" ? "Multicaixa Express" : "Transferência Bancária"}
                        </div>
                        <div className="text-[10px] text-slate-500">{w.account_details}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            w.status === "completed"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                              : w.status === "pending"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                          }`}
                        >
                          {w.status === "pending"
                            ? "Pendente"
                            : w.status === "completed"
                            ? "Transferido"
                            : w.status === "approved"
                            ? "Aprovado"
                            : "Recusado"}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-400 text-[10px]">
                        {w.reference ? (
                          <span className="font-mono text-brand-400">{w.reference}</span>
                        ) : (
                          w.admin_notes || "—"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
