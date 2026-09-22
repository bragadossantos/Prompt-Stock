import Link from "next/link";
import { Lock, ArrowLeft, Mail } from "lucide-react";

export const metadata = {
  title: "Política de Privacidade — PromptStock",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="glass max-w-lg w-full rounded-3xl border border-surface-border p-8 sm:p-10 text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center mx-auto text-accent-cyan">
          <Lock className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">Política de Privacidade</h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            A nossa Política de Privacidade completa está a ser preparada e ainda não foi
            publicada. Esta página é apenas um espaço reservado — não representa uma política
            legal em vigor.
          </p>
          <p className="text-xs text-slate-500 leading-relaxed">
            Para questões sobre como os seus dados são tratados na PromptStock, contacte a nossa
            equipa de suporte diretamente.
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
