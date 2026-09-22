import Link from "next/link";
import { Mail, ArrowLeft, MessageCircle } from "lucide-react";

export const metadata = {
  title: "Contacto — PromptStock",
};

export default function ContactPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="glass max-w-lg w-full rounded-3xl border border-surface-border p-8 sm:p-10 text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto text-brand-400">
          <MessageCircle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">Contacto</h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Ainda não temos um formulário de contacto ou chat ao vivo disponível na plataforma.
            Enquanto isso, pode falar diretamente com a nossa equipa de suporte por e-mail.
          </p>
        </div>

        <a
          href="mailto:suporte@promptstock.com"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-surface-border text-slate-200 text-xs font-mono hover:border-brand-500/50 hover:text-white transition-all"
        >
          <Mail className="w-3.5 h-3.5 text-brand-400" />
          <span>suporte@promptstock.com</span>
        </a>

        <p className="text-xs text-slate-500 leading-relaxed">
          Respondemos o mais rápido possível a questões sobre a sua conta, compras, submissão de
          prompts ou levantamentos de saldo.
        </p>

        <div className="pt-2">
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
