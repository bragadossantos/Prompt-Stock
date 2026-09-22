import Link from "next/link";
import { Wallet, ArrowLeft, Mail } from "lucide-react";

export const metadata = {
  title: "Comissões & Pagamentos — PromptStock",
};

export default function CommissionsPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="glass max-w-lg w-full rounded-3xl border border-surface-border p-8 sm:p-10 text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400">
          <Wallet className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">Comissões & Pagamentos</h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            A página completa com a explicação detalhada das comissões, prazos de levantamento e
            métodos de pagamento ainda está a ser preparada.
          </p>
          <p className="text-xs text-slate-500 leading-relaxed">
            Em resumo: os criadores ficam com 80% de cada venda, e os levantamentos podem ser
            pedidos a partir do seu painel em Creator Studio. Para detalhes sobre um pagamento
            específico, contacte o suporte.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-violet text-white text-xs font-semibold shadow-glow hover:opacity-90 transition-all"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contactar Suporte</span>
          </Link>
          <Link
            href="/creator/earnings"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface hover:bg-surface-hover border border-surface-border text-slate-300 hover:text-white text-xs font-semibold transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Ver os Meus Ganhos</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
