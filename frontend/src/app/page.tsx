import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Search,
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  ShoppingBag,
  Users,
  Star,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CategoryIcon } from "@/components/ui/CategoryIcon";

export default function HomePage() {
  const featuredCategories = [
    { name: "Image Generation", count: "1,240+", desc: "Midjourney, DALL-E 3 & Flux" },
    { name: "Programming", count: "890+", desc: "Clean Code, Python, React & DevOps" },
    { name: "Marketing", count: "720+", desc: "Copywriting, Funnels & Ads de Alta Conversão" },
    { name: "Office & Productivity", count: "650+", desc: "Planilhas, Automação & Workflows" },
    { name: "Business", count: "510+", desc: "Estratégia, Pitch Decks & Finanças" },
    { name: "Writing", count: "480+", desc: "Artigos SEO, Livros & Roteiros Criativos" },
  ];

  return (
    <div className="flex flex-col gap-20 pb-16">
      {/* HERO SECTION */}
      <section className="relative pt-16 sm:pt-24 lg:pt-32 overflow-hidden">
        {/* Background glow ornaments */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[350px] h-[250px] bg-accent-cyan/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-600/10 border border-brand-500/20 text-brand-300 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5 text-accent-cyan animate-pulse" />
            <span>The Marketplace for Better Prompts</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Descubra, Use e Venda <br />
            <span className="text-gradient">Prompts de Alta Performance</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 mb-10 leading-relaxed">
            A plataforma profissional de engenharia de prompts. Prompts testados e certificados para ChatGPT, Midjourney, Claude e fluxos de automação.
          </p>

          {/* Main Search Bar in Hero */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="glass p-2 rounded-2xl flex items-center gap-3 shadow-2xl border-surface-border hover:border-brand-500/50 transition-all">
              <Search className="w-5 h-5 text-slate-400 ml-3" />
              <input
                type="text"
                placeholder="Ex: Criar estratégia de marketing B2B, Retratos hiper-realistas no Midjourney..."
                className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
              />
              <Button size="md" className="hidden sm:inline-flex shrink-0">
                Pesquisar
              </Button>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/explore">
              <Button size="lg" className="shadow-glow">
                Explorar Prompts
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="secondary">
                Tornar-se um Criador
              </Button>
            </Link>
          </div>

          {/* Trust Metrics */}
          <div className="mt-14 pt-8 border-t border-surface-border/60 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white">100%</div>
              <div className="text-xs text-slate-500 mt-1">Prompts Testados</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-gradient">Oficial & Criadores</div>
              <div className="text-xs text-slate-500 mt-1">Curadoria Especializada</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white">Multicaixa</div>
              <div className="text-xs text-slate-500 mt-1">Pagamento Seguro em AOA</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-accent-cyan">Instantâneo</div>
              <div className="text-xs text-slate-500 mt-1">Acesso Imediato à Biblioteca</div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-brand-400 mb-1">
              Catálogo Organizado
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Categorias Populares
            </h2>
          </div>
          <Link href="/categories" className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1">
            Ver todas as 15 categorias <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredCategories.map((cat) => (
            <Link
              key={cat.name}
              href={`/explore?category=${encodeURIComponent(cat.name)}`}
              className="glass-card p-6 rounded-2xl flex flex-col justify-between group"
            >
              <div>
                <CategoryIcon nameOrSlug={cat.name} size="md" showContainer className="mb-4" />
                <h3 className="text-lg font-bold text-white group-hover:text-brand-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{cat.desc}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-surface-border/50 flex items-center justify-between text-xs text-slate-500">
                <span>{cat.count} prompts</span>
                <span className="text-brand-400 font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Ver prompts <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* PLATFORM VALUE PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass p-8 sm:p-12 rounded-3xl border border-surface-border relative overflow-hidden">
          <div className="max-w-3xl mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">
              Muito Mais que uma Biblioteca de Prompts
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              O PromptStock combina catálogo gratuito, marketplace pago, ferramentas para criadores e painel de gestão com infraestrutura moderna e segura.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-surface/70 border border-surface-border">
              <div className="w-10 h-10 rounded-xl bg-brand-600/20 text-brand-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">PromptStock Official</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Prompts verificados e desenvolvidos por especialistas da plataforma com selo de garantia de qualidade e resultados comprovados.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface/70 border border-surface-border">
              <div className="w-10 h-10 rounded-xl bg-accent-cyan/20 text-accent-cyan flex items-center justify-center mb-4">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Marketplace & Compras</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Compre pacotes especializados e prompts premium com pagamento local via Multicaixa Express e desbloqueio seguro no backend.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface/70 border border-surface-border">
              <div className="w-10 h-10 rounded-xl bg-accent-violet/20 text-accent-violet flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Creator Studio</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Publique suas próprias criações, acompanhe estatísticas de cópia e vendas, e monetize seu conhecimento em IA com comissões transparentes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-10 sm:p-16 rounded-3xl bg-gradient-to-b from-brand-900/30 to-surface border border-brand-500/30 shadow-glow">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Pronto para elevar seu trabalho com IA?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-8">
            Crie sua conta gratuita em segundos, salve seus prompts favoritos e acesse prompts oficiais exclusivos.
          </p>
          <Link href="/register">
            <Button size="lg" className="px-8 py-3.5 shadow-glow">
              Criar Conta Gratuita no PromptStock
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
