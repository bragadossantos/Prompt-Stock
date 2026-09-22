"use client";

import React, { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { Order, OrderStatus } from "@/types/order";
import {
  Receipt,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Smartphone,
  Building2,
} from "lucide-react";

interface OrdersApiResponse {
  success: boolean;
  data: Order[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

const STATUS_TABS: { value: OrderStatus | ""; label: string }[] = [
  { value: "awaiting_confirmation", label: "Aguardando Confirmação" },
  { value: "pending", label: "Pendentes" },
  { value: "completed", label: "Confirmadas" },
  { value: "failed", label: "Rejeitadas" },
  { value: "", label: "Todas" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("awaiting_confirmation");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [actioningOrder, setActioningOrder] = useState<string | null>(null);

  const loadOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);

      const res = await apiClient<OrdersApiResponse>(`/admin/orders?${params.toString()}`);
      if (res.success && res.data) {
        setOrders(res.data);
      }
    } catch (err: any) {
      setError(err.message || "Erro ao carregar as encomendas.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleConfirm = async (order: Order) => {
    setActioningOrder(order.order_number);
    try {
      const res = await apiClient<{ success: boolean; message: string }>(
        `/admin/orders/${order.order_number}/confirm`,
        { method: "PATCH" }
      );
      if (res.success) {
        showFeedback(`Encomenda ${order.order_number} confirmada e desbloqueada.`);
        await loadOrders();
      }
    } catch (err: any) {
      alert(err.message || "Falha ao confirmar o pagamento.");
    } finally {
      setActioningOrder(null);
    }
  };

  const handleReject = async (order: Order) => {
    const reason = window.prompt(
      `Motivo da rejeição da encomenda ${order.order_number} (opcional):`
    );
    if (reason === null) return; // user cancelled

    setActioningOrder(order.order_number);
    try {
      const res = await apiClient<{ success: boolean; message: string }>(
        `/admin/orders/${order.order_number}/reject`,
        {
          method: "PATCH",
          body: JSON.stringify({ reason: reason || null }),
        }
      );
      if (res.success) {
        showFeedback(`Encomenda ${order.order_number} rejeitada.`);
        await loadOrders();
      }
    } catch (err: any) {
      alert(err.message || "Falha ao rejeitar a encomenda.");
    } finally {
      setActioningOrder(null);
    }
  };

  const statusBadge = (status: OrderStatus) => {
    const map: Record<OrderStatus, string> = {
      pending: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      awaiting_confirmation: "bg-brand-500/10 text-brand-400 border-brand-500/30",
      completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      failed: "bg-red-500/10 text-red-400 border-red-500/30",
      refunded: "bg-slate-500/10 text-slate-400 border-slate-500/30",
    };
    const labels: Record<OrderStatus, string> = {
      pending: "Pendente",
      awaiting_confirmation: "Em Confirmação",
      completed: "Confirmada",
      failed: "Rejeitada",
      refunded: "Reembolsada",
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full border font-bold text-[10px] ${map[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Encomendas & Pagamentos
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Confirme manualmente os pagamentos reportados pelos compradores antes de desbloquear o acesso e creditar o criador.
        </p>
      </div>

      {feedbackMessage && (
        <div className="p-3 rounded-xl bg-accent-emerald/10 border border-accent-emerald/30 text-xs text-accent-emerald flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      <div className="glass p-4 rounded-2xl border border-surface-border flex items-center gap-2 overflow-x-auto">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value || "all"}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              statusFilter === tab.value
                ? "bg-brand-600 text-white shadow-glow"
                : "bg-surface hover:bg-surface-hover text-slate-400 hover:text-white border border-surface-border"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="glass rounded-2xl border border-surface-border overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-7 h-7 animate-spin text-brand-500" />
            <p className="text-xs">Carregando encomendas...</p>
          </div>
        ) : error ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3 text-center px-6">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <p className="text-xs text-red-300 max-w-sm">{error}</p>
            <button
              onClick={loadOrders}
              className="text-xs font-semibold text-brand-400 hover:text-brand-300"
            >
              Tentar novamente
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
            <Receipt className="w-8 h-8 text-slate-600" />
            <span>Nenhuma encomenda encontrada para este filtro.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-surface/80 uppercase text-[11px] font-bold text-slate-400 border-b border-surface-border">
                <tr>
                  <th className="px-5 py-3.5">Encomenda</th>
                  <th className="px-4 py-3.5">Comprador</th>
                  <th className="px-4 py-3.5">Prompt</th>
                  <th className="px-4 py-3.5">Método</th>
                  <th className="px-4 py-3.5">Valor</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/50">
                {orders.map((order) => {
                  const item = order.items?.[0];
                  const isActionable =
                    order.status === "pending" || order.status === "awaiting_confirmation";
                  const isBusy = actioningOrder === order.order_number;

                  return (
                    <tr key={order.order_number} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-mono font-bold text-white">{order.order_number}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {new Date(order.created_at).toLocaleString("pt-AO")}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-300">#{order.user_id}</td>
                      <td className="px-4 py-3.5 text-slate-300 max-w-[180px] truncate">
                        {item?.prompt?.title || `Prompt #${item?.prompt_id ?? "-"}`}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 text-slate-400">
                          {order.payment_method === "multicaixa_express" ? (
                            <Smartphone className="w-3.5 h-3.5" />
                          ) : (
                            <Building2 className="w-3.5 h-3.5" />
                          )}
                          {order.payment_phone || order.payment_reference || "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-bold text-white whitespace-nowrap">
                        {order.total_amount.toLocaleString("pt-AO", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        {order.currency}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">{statusBadge(order.status)}</td>
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        {isActionable ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              disabled={isBusy}
                              onClick={() => handleConfirm(order)}
                              className="px-2.5 py-1 rounded-lg bg-accent-emerald/10 hover:bg-accent-emerald/20 text-accent-emerald border border-accent-emerald/30 font-semibold text-[11px] transition-all disabled:opacity-50 inline-flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Confirmar
                            </button>
                            <button
                              disabled={isBusy}
                              onClick={() => handleReject(order)}
                              className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-semibold text-[11px] transition-all disabled:opacity-50 inline-flex items-center gap-1"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              Rejeitar
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-600 text-[11px]">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
