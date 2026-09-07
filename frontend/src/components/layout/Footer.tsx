import React from "react";
import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-surface-border bg-surface/50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1 */}
          <div className="md:col-span-1 space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-accent-cyan flex items-center justify-center shadow-glow">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Prompt<span className="text-brand-500">Stock</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Discover, Use and Sell Better Prompts. A plataforma definitiva para engenharia de prompts e inteligência artificial.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Plataforma</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/explore" className="hover:text-white transition-colors">Explorar Prompts</Link></li>
              <li><Link href="/marketplace" className="hover:text-white transition-colors">Marketplace Premium</Link></li>
              <li><Link href="/categories" className="hover:text-white transition-colors">Todas as Categorias</Link></li>
              <li><Link href="/creators" className="hover:text-white transition-colors">Criadores em Destaque</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Criadores</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/creator/dashboard" className="hover:text-white transition-colors">Creator Studio</Link></li>
              <li><Link href="/creator/prompts/create" className="hover:text-white transition-colors">Vender Prompts</Link></li>
              <li><Link href="/guidelines" className="hover:text-white transition-colors">Diretrizes de Qualidade</Link></li>
              <li><Link href="/commissions" className="hover:text-white transition-colors">Comissões & Pagamentos</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Legal & Suporte</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/terms" className="hover:text-white transition-colors">Termos de Uso</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Política de Privacidade</Link></li>
              <li><Link href="/security" className="hover:text-white transition-colors">Segurança</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contacto</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PromptStock. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            Desenvolvido com padrão internacional para criadores de IA
          </p>
        </div>
      </div>
    </footer>
  );
}
