import Link from "next/link";
import { FileText, ArrowLeft, Mail } from "lucide-react";

export const metadata = {
  title: "Termos de Uso — PromptStock",
};

export default function TermsPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="glass max-w-lg w-full rounded-3xl border border-surface-border p-8 sm:p-10 text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto text-brand-400">
          <FileText className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">Termos de Uso</h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Estamos a finalizar a versão completa dos nossos Termos de Uso. Este documento
            legal ainda não foi publicado — esta página é apenas um espaço reservado.
          </p>
          <p className="text-xs text-slate-500 leading-relaxed">
            Se tiver alguma questão sobre o uso da plataforma entretanto, contacte a nossa equipa
            de suporte e teremos todo o gosto em ajudar.
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
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface hover:bg-surface-hover border border-surface-border text-slate-300 hover:text-white text-xs font-semibold transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar ao Início</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
