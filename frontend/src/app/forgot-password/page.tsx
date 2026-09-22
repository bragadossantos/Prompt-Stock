import Link from "next/link";
import { KeyRound, ArrowLeft, Mail } from "lucide-react";

export const metadata = {
  title: "Recuperar Palavra-passe — PromptStock",
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="glass max-w-lg w-full rounded-3xl border border-surface-border p-8 sm:p-10 text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto text-brand-400">
          <KeyRound className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">Recuperar Palavra-passe</h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Ainda não disponibilizamos a recuperação automática de palavra-passe na plataforma.
            Para repor o acesso à sua conta, contacte a nossa equipa de suporte diretamente —
            iremos ajudá-lo(a) a verificar a sua identidade e restaurar o acesso manualmente.
          </p>
        </div>

        <a
          href="mailto:suporte@promptstock.com"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-surface-border text-slate-200 text-xs font-mono hover:border-brand-500/50 hover:text-white transition-all"
        >
          <Mail className="w-3.5 h-3.5 text-brand-400" />
          <span>suporte@promptstock.com</span>
        </a>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-violet text-white text-xs font-semibold shadow-glow hover:opacity-90 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar ao Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
