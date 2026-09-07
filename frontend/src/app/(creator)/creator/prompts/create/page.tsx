"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import {
  Sparkles,
  ArrowLeft,
  Save,
  Send,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { apiClient } from "@/lib/api-client";
import { Category } from "@/types/auth";

export default function CreateCreatorPromptPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCats, setIsLoadingCats] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category_id: "",
    short_description: "",
    description: "",
    prompt_preview: "",
    prompt_content: "",
    prompt_type: "free" as "free" | "premium",
    price: 1500,
    ai_tool: "ChatGPT",
    ai_model: "GPT-4o",
    notes: "",
    example_output: "",
    example_image_url: "",
    submit_for_review: true,
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await apiClient<{ success: boolean; data: Category[] }>("/categories");
        if (res.success && res.data) {
          setCategories(res.data);
          if (res.data.length > 0) {
            setFormData((prev) => ({ ...prev, category_id: String(res.data[0].id) }));
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingCats(false);
      }
    };
    loadCategories();
  }, []);

  const handleSubmit = async (submitForReview: boolean) => {
    setError(null);
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        category_id: Number(formData.category_id),
        price: formData.prompt_type === "free" ? 0 : Number(formData.price),
        submit_for_review: submitForReview,
      };

      await apiClient("/creator/prompts", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setSuccess(true);
      setTimeout(() => {
        router.push("/creator/prompts");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Erro ao salvar ou submeter o prompt.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <NextLink
            href="/creator/prompts"
            className="p-2 rounded-xl bg-surface border border-surface-border text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </NextLink>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Criar e Submeter Prompt</h1>
            <p className="text-xs text-slate-400">
              Crie um novo prompt de IA para catálogo gratuito ou monetize como criador oficial.
            </p>
          </div>
        </div>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-3 text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Prompt gravado com sucesso! Redirecionando para a sua lista de prompts...</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-3 text-xs">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(true);
        }}
        className="space-y-6"
      >
        {/* Main Details Card */}
        <div className="glass rounded-3xl border border-surface-border p-6 space-y-5">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-400" /> Informações Principais
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Título do Prompt *
              </label>
              <input
                type="text"
                required
                placeholder="ex: Gerador de Artigos SEO de Alta Performance com ChatGPT"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-surface/80 border border-surface-border rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Categoria *
              </label>
              <select
                required
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full bg-surface/80 border border-surface-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-slate-900 text-white">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Ferramenta de IA *
              </label>
              <select
                required
                value={formData.ai_tool}
                onChange={(e) => setFormData({ ...formData, ai_tool: e.target.value })}
                className="w-full bg-surface/80 border border-surface-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
              >
                <option value="ChatGPT" className="bg-slate-900">ChatGPT</option>
                <option value="Midjourney" className="bg-slate-900">Midjourney</option>
                <option value="Claude" className="bg-slate-900">Claude</option>
                <option value="Stable Diffusion" className="bg-slate-900">Stable Diffusion</option>
                <option value="DALL-E" className="bg-slate-900">DALL-E 3</option>
                <option value="Gemini" className="bg-slate-900">Google Gemini</option>
                <option value="Outro" className="bg-slate-900">Outro</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Modelo Específico
              </label>
              <input
                type="text"
                placeholder="ex: GPT-4o, Midjourney v6.1, Claude 3.5"
                value={formData.ai_model}
                onChange={(e) => setFormData({ ...formData, ai_model: e.target.value })}
                className="w-full bg-surface/80 border border-surface-border rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tipo de Acesso & Monetização
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, prompt_type: "free" })}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    formData.prompt_type === "free"
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                      : "bg-surface border-surface-border text-slate-400"
                  }`}
                >
                  Gratuito
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, prompt_type: "premium" })}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    formData.prompt_type === "premium"
                      ? "bg-amber-500/20 border-amber-500 text-amber-300 shadow-glow"
                      : "bg-surface border-surface-border text-slate-400"
                  }`}
                >
                  Premium (Venda)
                </button>
              </div>
            </div>

            {formData.prompt_type === "premium" && (
              <div className="md:col-span-2 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-300">
                    Preço de Venda (AOA) *
                  </label>
                  <span className="text-[11px] text-amber-400">
                    Você recebe 80% ({Math.round(formData.price * 0.8).toLocaleString("pt-AO")} AOA líquidos por venda)
                  </span>
                </div>
                <input
                  type="number"
                  min="500"
                  step="100"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Descrição Curta (Resumo)
              </label>
              <input
                type="text"
                placeholder="Breve descrição do que este prompt faz e os resultados que proporciona..."
                value={formData.short_description}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                className="w-full bg-surface/80 border border-surface-border rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Prompt Content Card */}
        <div className="glass rounded-3xl border border-surface-border p-6 space-y-5">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            Engenharia do Prompt
          </h2>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Pré-visualização Pública (Teaser) *
              </label>
              <span className="text-[10px] text-slate-500">Visível para qualquer utilizador antes da compra</span>
            </div>
            <textarea
              rows={3}
              required
              placeholder="ex: Act as a senior copywriter specializing in direct response marketing. Your task is to..."
              value={formData.prompt_preview}
              onChange={(e) => setFormData({ ...formData, prompt_preview: e.target.value })}
              className="w-full font-mono bg-surface/80 border border-surface-border rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Conteúdo Secreto do Prompt (Template Completo) *
              </label>
              <span className="text-[10px] text-amber-400 font-medium">Bloqueado até compra ou login</span>
            </div>
            <textarea
              rows={6}
              required
              placeholder="Escreva aqui a fórmula completa do prompt, com todas as variáveis [EXEMPLO_VARIAVEL], regras, tom de voz e instruções detalhadas..."
              value={formData.prompt_content}
              onChange={(e) => setFormData({ ...formData, prompt_content: e.target.value })}
              className="w-full font-mono bg-surface/80 border border-surface-border rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Instruções de Uso / Recomendações
            </label>
            <textarea
              rows={3}
              placeholder="ex: Para melhores resultados no Midjourney utilize o parâmetro --v 6.1 --ar 16:9..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-surface/80 border border-surface-border rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              URL da Imagem de Exemplo / Demonstração (Opcional)
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/... ou link direto da imagem gerada"
              value={formData.example_image_url}
              onChange={(e) => setFormData({ ...formData, example_image_url: e.target.value })}
              className="w-full bg-surface/80 border border-surface-border rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSubmit(false)}
            isLoading={isSubmitting}
            className="w-full sm:w-auto gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Guardar como Rascunho</span>
          </Button>

          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            className="w-full sm:w-auto gap-2 shadow-glow"
          >
            <Send className="w-4 h-4" />
            <span>Submeter para Aprovação</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
