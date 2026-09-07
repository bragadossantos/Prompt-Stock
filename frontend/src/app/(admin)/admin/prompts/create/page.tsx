"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { Category } from "@/types/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Sparkles,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

export default function CreateOfficialPromptPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCats, setIsLoadingCats] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [promptPreview, setPromptPreview] = useState("");
  const [promptContent, setPromptContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [promptType, setPromptType] = useState("free");
  const [price, setPrice] = useState("0");
  const [aiTool, setAiTool] = useState("ChatGPT");
  const [aiModel, setAiModel] = useState("GPT-4o");
  const [isFeatured, setIsFeatured] = useState(false);
  const [tagsInput, setTagsInput] = useState("");
  const [resultText, setResultText] = useState("");

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await apiClient<{ success: boolean; data: Category[] }>("/categories");
        if (res.success && res.data) {
          setCategories(res.data);
          if (res.data.length > 0) {
            setCategoryId(res.data[0].id.toString());
          }
        }
      } catch (err) {
        console.error("Falha ao carregar categorias:", err);
      } finally {
        setIsLoadingCats(false);
      }
    }
    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const payload = {
        title,
        short_description: shortDescription,
        description,
        prompt_preview: promptPreview,
        prompt_content: promptContent,
        category_id: parseInt(categoryId),
        prompt_type: promptType,
        price: promptType === "premium" ? parseFloat(price) : 0,
        currency: "AOA",
        ai_tool: aiTool,
        ai_model: aiModel || null,
        is_featured: isFeatured,
        status: "published",
        tags,
        result_text: resultText || null,
      };

      const res = await apiClient<{ success: boolean; message: string }>("/admin/prompts", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (res.success) {
        router.push("/admin/prompts");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Erro ao publicar prompt oficial.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/prompts"
          className="p-2 rounded-xl bg-surface hover:bg-surface-hover border border-surface-border text-slate-400 hover:text-white transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-600/20 text-brand-300 text-[11px] font-semibold mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
            PromptStock Official
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Criar Prompt Oficial
          </h1>
          <p className="text-xs text-slate-400">
            Prompts publicados aqui recebem automaticamente o selo de certificação oficial da plataforma.
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Information */}
        <div className="glass p-6 sm:p-8 rounded-3xl border border-surface-border space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-2">
            1. Informações Básicas
          </h2>

          <Input
            label="Título do Prompt"
            placeholder="Ex: Roteiro Cinematográfico Cyberpunk para Midjourney v6"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Input
            label="Descrição Curta (Resumo em 1 linha)"
            placeholder="Ex: Prompt calibrado para iluminação volumétrica e realismo."
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Descrição Completa
            </label>
            <textarea
              rows={3}
              placeholder="Explique os objetivos, dicas de utilização e variações recomendadas..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full bg-surface border border-surface-border hover:border-slate-700 focus:border-brand-500 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Categoria
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full bg-surface border border-surface-border hover:border-slate-700 focus:border-brand-500 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Tipo & Preço
              </label>
              <div className="flex gap-2">
                <select
                  value={promptType}
                  onChange={(e) => setPromptType(e.target.value)}
                  className="bg-surface border border-surface-border rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="free">Grátis (Free)</option>
                  <option value="premium">Premium (Pago)</option>
                </select>

                {promptType === "premium" && (
                  <input
                    type="number"
                    min="100"
                    step="50"
                    placeholder="Preço em AOA"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="flex-1 bg-surface border border-surface-border rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: AI Compatibility */}
        <div className="glass p-6 sm:p-8 rounded-3xl border border-surface-border space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-2">
            2. Compatibilidade de Inteligência Artificial
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Ferramenta de IA
              </label>
              <select
                value={aiTool}
                onChange={(e) => setAiTool(e.target.value)}
                className="w-full bg-surface border border-surface-border hover:border-slate-700 focus:border-brand-500 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
              >
                <option value="ChatGPT">ChatGPT (OpenAI)</option>
                <option value="Midjourney">Midjourney</option>
                <option value="Claude">Claude (Anthropic)</option>
                <option value="Flux">Flux (Black Forest Labs)</option>
                <option value="DALL-E">DALL-E 3</option>
                <option value="Stable Diffusion">Stable Diffusion</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            <Input
              label="Modelo / Versão Recomendada"
              placeholder="Ex: GPT-4o, v6.1, Claude 3.5 Sonnet"
              value={aiModel}
              onChange={(e) => setAiModel(e.target.value)}
            />
          </div>

          <Input
            label="Tags (Separadas por vírgula)"
            placeholder="midjourney, cyberpunk, 8k, retrato"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
          />
        </div>

        {/* Section 3: Prompt Texts & Security */}
        <div className="glass p-6 sm:p-8 rounded-3xl border border-surface-border space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-2">
            3. Conteúdo & Proteção do Prompt
          </h2>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Prévia Pública (Visível a todos)
              </label>
              <span className="text-[11px] text-slate-500">Exibida nos cards e antes da compra</span>
            </div>
            <textarea
              rows={2}
              placeholder="Trecho inicial do prompt para demonstrar a estrutura..."
              value={promptPreview}
              onChange={(e) => setPromptPreview(e.target.value)}
              required
              className="w-full bg-surface border border-surface-border hover:border-slate-700 focus:border-brand-500 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 font-mono focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Conteúdo Completo do Prompt (Protegido)
              </label>
              <span className="text-[11px] text-amber-400 font-medium">
                Nunca enviado publicamente se o prompt for premium
              </span>
            </div>
            <textarea
              rows={5}
              placeholder="Texto completo e pronto para ser executado ou copiado pelo utilizador..."
              value={promptContent}
              onChange={(e) => setPromptContent(e.target.value)}
              required
              className="w-full bg-surface border border-surface-border hover:border-slate-700 focus:border-brand-500 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 font-mono focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Exemplo de Resultado (Opcional)
            </label>
            <textarea
              rows={2}
              placeholder="Exemplo do texto ou resposta gerada pela IA..."
              value={resultText}
              onChange={(e) => setResultText(e.target.value)}
              className="w-full bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isFeatured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 rounded bg-surface border-surface-border text-brand-600 focus:ring-brand-500"
            />
            <label htmlFor="isFeatured" className="text-xs text-slate-300 font-medium cursor-pointer">
              Destacar este prompt na página inicial (Featured)
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Link href="/admin/prompts">
            <Button variant="outline" size="lg">
              Cancelar
            </Button>
          </Link>
          <Button variant="primary" size="lg" type="submit" isLoading={isSubmitting} className="shadow-glow">
            Publicar Prompt Oficial
          </Button>
        </div>
      </form>
    </div>
  );
}
