<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Prompt;
use App\Models\PromptResult;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PromptSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'admin@promptstock.com')->first();
        if (!$admin) {
            return;
        }

        // Create sample creator user
        $creator = User::firstOrCreate(
            ['email' => 'creator@promptstock.com'],
            [
                'uuid' => (string) Str::uuid(),
                'name' => 'Manuel dos Santos',
                'password' => bcrypt('PromptStock@2026!'),
                'role' => 'creator',
                'status' => 'active',
                'bio' => 'Engenheiro de Prompts sênior e especialista em IA Generativa.',
            ]
        );

        \App\Models\CreatorProfile::firstOrCreate(
            ['user_id' => $creator->id],
            [
                'username' => 'manuel_ia',
                'headline' => 'Engenheiro de Prompts Sênior & Especialista Midjourney',
                'bio' => 'Crio soluções de prompt avançadas para negócios, copywriting de alta conversão e arte generativa fotorealista.',
                'available_balance' => 25000.00,
                'pending_balance' => 5000.00,
                'withdrawn_balance' => 45000.00,
                'is_verified' => true,
                'total_sales_count' => 14,
            ]
        );

        // Sample regular customer
        User::firstOrCreate(
            ['email' => 'cliente@promptstock.com'],
            [
                'uuid' => (string) Str::uuid(),
                'name' => 'Adriano Comprador',
                'password' => bcrypt('PromptStock@2026!'),
                'role' => 'user',
                'status' => 'active',
                'bio' => 'Entusiasta de inteligência artificial e automações.',
            ]
        );

        $catImage = Category::where('slug', 'image-generation')->first();
        $catDev = Category::where('slug', 'programming')->first();
        $catMarketing = Category::where('slug', 'marketing')->first();
        $catBusiness = Category::where('slug', 'business')->first();
        $catData = Category::where('slug', 'data-analysis')->first();
        $catVideo = Category::where('slug', 'video')->first();

        // Sample Tags
        $tagMidjourney = Tag::firstOrCreate(['slug' => 'midjourney'], ['name' => 'Midjourney']);
        $tagChatGpt = Tag::firstOrCreate(['slug' => 'chatgpt'], ['name' => 'ChatGPT']);
        $tagClaude = Tag::firstOrCreate(['slug' => 'claude'], ['name' => 'Claude']);
        $tagNextJs = Tag::firstOrCreate(['slug' => 'nextjs'], ['name' => 'Next.js']);
        $tagCopywriting = Tag::firstOrCreate(['slug' => 'copywriting'], ['name' => 'Copywriting']);
        $tagSaas = Tag::firstOrCreate(['slug' => 'saas'], ['name' => 'SaaS']);

        $promptsData = [
            [
                'title' => 'Estratégia Completa de Go-to-Market B2B',
                'slug' => 'estrategia-completa-de-go-to-market-b2b',
                'short_description' => 'Estruture plano de vendas, personas, canais de aquisição e precificação para SaaS B2B.',
                'description' => 'Um prompt detalhado desenhado para CEOs, fundadores e gerentes de produto que precisam lançar um produto de software no mercado corporativo. Cobre desde posicionamento até matriz de objeções de vendas.',
                'prompt_preview' => 'Você é o Diretor de Estratégia de uma consultoria global de SaaS. Ajude-me a desenhar um plano de Go-to-Market completo...',
                'prompt_content' => "Você é o Diretor de Estratégia de uma consultoria global de SaaS com mais de 20 anos de experiência em lançamentos B2B.\n\nCom base nas seguintes informações da minha empresa:\n- Produto: [Descreva seu produto]\n- ICP (Perfil de Cliente Ideal): [Ex: Diretores de TI de médias empresas]\n- Faixa de Preço esperada: [Ex: \$500 - \$2,000/mês]\n\nPor favor, elabore um documento detalhado contendo:\n1. Posicionamento de Marca & Proposta de Valor Única (UVP).\n2. Análise de Dores e Matriz de Objeções do decisor de compra.\n3. Estratégia de Aquisição (Inbound vs Outbound Sales).\n4. Roteiro de Demonstração de Vendas em 5 etapas.\n5. Métricas de Sucesso (CAC, LTV, Churn esperado, Ciclo de Vendas).",
                'category_id' => $catBusiness?->id,
                'author_id' => $admin->id,
                'source_type' => 'official',
                'prompt_type' => 'free',
                'ai_tool' => 'ChatGPT',
                'ai_model' => 'GPT-4o',
                'price' => 0.00,
                'status' => 'published',
                'is_featured' => true,
                'copy_count' => 1420,
                'view_count' => 5800,
                'usage_count' => 1250,
                'favorite_count' => 340,
                'average_rating' => 4.95,
                'reviews_count' => 48,
                'published_at' => now()->subDays(10),
                'tags' => [$tagChatGpt->id, $tagSaas->id],
                'result' => [
                    'result_text' => "Sumário Executivo gerado com sucesso: Plano de GTM estruturado em 5 fases, incluindo matriz de objeções com 8 contramedidas comprovadas.",
                    'ai_tool' => 'ChatGPT',
                    'ai_model' => 'GPT-4o',
                ],
            ],
            [
                'title' => 'Retrato Cyberpunk Foto-Realista 8K no Midjourney',
                'slug' => 'retrato-cyberpunk-foto-realista-8k-no-midjourney',
                'short_description' => 'Prompt calibrado com iluminação volumétrica, estética neon noir e lentes anamórficas de 85mm.',
                'description' => 'Obtenha retratos cinematográficos com texturas de pele ultra-realistas, reflexos de néon molhado e profundidade de campo precisa no Midjourney v6.1.',
                'prompt_preview' => 'Cinematic close-up portrait of an android engineer in Neo-Tokyo, wet neon reflections, shot on 85mm anamorphic lens, f/1.4, ray-tracing...',
                'prompt_content' => "Cinematic close-up portrait of an android engineer in a rainy Neo-Tokyo alley, wet neon reflections casting cyan and magenta highlights on metallic face plates, ultra-detailed skin pores, shot on ARRI Alexa Mini LF, 85mm anamorphic lens, f/1.4, photorealistic, octane render, 8k resolution, volumetric smoke, dramatic rim lighting --ar 16:9 --v 6.1 --style raw --q 2",
                'category_id' => $catImage?->id,
                'author_id' => $admin->id,
                'source_type' => 'official',
                'prompt_type' => 'free',
                'ai_tool' => 'Midjourney',
                'ai_model' => 'v6.1',
                'price' => 0.00,
                'status' => 'published',
                'is_featured' => true,
                'copy_count' => 2890,
                'view_count' => 11400,
                'usage_count' => 2600,
                'favorite_count' => 710,
                'average_rating' => 4.98,
                'reviews_count' => 92,
                'published_at' => now()->subDays(8),
                'tags' => [$tagMidjourney->id],
                'result' => [
                    'result_text' => "Gera imagens com riqueza de detalhes impressionante, granulação sutil de cinema e composição balanceada.",
                    'ai_tool' => 'Midjourney',
                    'ai_model' => 'v6.1',
                ],
            ],
            [
                'title' => 'Gerador de Micro-SaaS em Next.js 15 e Tailwind',
                'slug' => 'gerador-de-micro-saas-em-nextjs-15-e-tailwind',
                'short_description' => 'Arquitetura de software completa para scaffolding de produto com autenticação, dashboard e stripe/multicaixa.',
                'description' => 'Prompt mestre para Claude 3.5 Sonnet gerar aplicações completas no App Router do Next.js 15 com TypeScript estrito, Server Actions, validação Zod e design system limpo.',
                'prompt_preview' => 'Atue como Engenheiro de Software Principal. Escreva a estrutura de diretórios e o código completo para um Micro-SaaS...',
                'prompt_content' => "Atue como Engenheiro de Software Principal e Especialista em Next.js 15 App Router.\n\nRequisitos:\n1. Utilize React 19, TypeScript estrito e Tailwind CSS.\n2. Crie uma arquitetura modular dividindo app, components/ui, lib e types.\n3. Forneça o código das rotas da API, layout responsivo e Server Actions com tratamento de erro tipado.\n4. Inclua middleware de proteção de rotas privadas.\n\nProjeto a ser construído: [Descreva seu SaaS].",
                'category_id' => $catDev?->id,
                'author_id' => $admin->id,
                'source_type' => 'official',
                'prompt_type' => 'premium',
                'ai_tool' => 'Claude',
                'ai_model' => 'Claude 3.5 Sonnet',
                'price' => 4500.00,
                'currency' => 'AOA',
                'status' => 'published',
                'is_featured' => true,
                'copy_count' => 640,
                'view_count' => 3200,
                'usage_count' => 590,
                'favorite_count' => 195,
                'average_rating' => 5.00,
                'reviews_count' => 24,
                'published_at' => now()->subDays(5),
                'tags' => [$tagClaude->id, $tagNextJs->id, $tagSaas->id],
                'result' => [
                    'result_text' => "Gera código 100% pronto para produção sem necessidade de refatoração, com tipagem TypeScript e Server Components.",
                    'ai_tool' => 'Claude',
                    'ai_model' => 'Claude 3.5 Sonnet',
                ],
            ],
            [
                'title' => 'Copywriting de Página de Vendas de Alta Conversão',
                'slug' => 'copywriting-de-pagina-de-vendas-de-alta-conversao',
                'short_description' => 'Modelo de copy persuasiva utilizando framework PASTOR para produtos digitais e infoprodutos.',
                'description' => 'Criado pelo criador experiente da comunidade. Estrutura completa de títulos instigantes, histórias de conexão emocional, quebra de objeções e ofertas irresistíveis.',
                'prompt_preview' => 'Atue como um Copywriter de elite com mais de \$10M em vendas diretas. Desenvolva uma página de vendas utilizando o método PASTOR...',
                'prompt_content' => "Você é um Copywriter de elite responsável por lançamentos digitais de 7 dígitos.\n\nEscreva a copy completa para a página de vendas do produto [Nome do Produto], seguindo o método PASTOR:\n- P (Problem): Identifique a dor imediata do prospecto.\n- A (Amplify): Amplifique a consequência de não resolver essa dor.\n- S (Story & Solution): Conte uma história de transformação.\n- T (Transformation & Testimony): Apresente os benefícios tangíveis.\n- O (Offer): Apresente o produto e os bônus.\n- R (Response): Chamada para ação clara e urgente.",
                'category_id' => $catMarketing?->id,
                'author_id' => $creator->id,
                'source_type' => 'creator',
                'prompt_type' => 'premium',
                'ai_tool' => 'ChatGPT',
                'ai_model' => 'GPT-4o',
                'price' => 3000.00,
                'currency' => 'AOA',
                'status' => 'published',
                'is_featured' => false,
                'copy_count' => 410,
                'view_count' => 1980,
                'usage_count' => 380,
                'favorite_count' => 140,
                'average_rating' => 4.88,
                'reviews_count' => 18,
                'published_at' => now()->subDays(3),
                'tags' => [$tagChatGpt->id, $tagCopywriting->id],
                'result' => [
                    'result_text' => "Produz roteiro persuasivo pronto para diagramação em Landing Page, com taxas de clique acima de 12%.",
                    'ai_tool' => 'ChatGPT',
                    'ai_model' => 'GPT-4o',
                ],
            ],
            [
                'title' => 'Análise Estatística e Visualização Automatizada em Python',
                'slug' => 'analise-estatistica-e-visualizacao-automatizada-em-python',
                'short_description' => 'Script de análise exploratória (EDA) com Pandas, Seaborn e geração de relatórios executivos.',
                'description' => 'Automatize a limpeza de dados, detecção de outliers, matriz de correlação e gráficos explicativos para tomada de decisão em negócios.',
                'prompt_preview' => 'Você é um Cientista de Dados Sênior. Escreva um pipeline em Python para realizar uma análise exploratória completa...',
                'prompt_content' => "Você é um Cientista de Dados Sênior especialista em Business Intelligence.\n\nDado o seguinte conjunto de colunas de um arquivo CSV: [Listar colunas]\n\nEscreva um script Python robusto que realize:\n1. Limpeza e tratamento de valores nulos.\n2. Estatísticas descritivas (média, mediana, quartis, desvio padrão).\n3. Gráficos com Seaborn e Matplotlib (histogramas, boxplots e heatmap de correlação).\n4. Resumo em texto dos 3 principais insights que um Diretor Financeiro precisa saber.",
                'category_id' => $catData?->id,
                'author_id' => $admin->id,
                'source_type' => 'official',
                'prompt_type' => 'free',
                'ai_tool' => 'ChatGPT',
                'ai_model' => 'GPT-4o',
                'price' => 0.00,
                'status' => 'published',
                'is_featured' => false,
                'copy_count' => 890,
                'view_count' => 3400,
                'usage_count' => 780,
                'favorite_count' => 220,
                'average_rating' => 4.92,
                'reviews_count' => 31,
                'published_at' => now()->subDays(6),
                'tags' => [$tagChatGpt->id],
                'result' => [
                    'result_text' => "Gera código Python sem dependências obscuras, compatível com Jupyter Notebook e Google Colab.",
                    'ai_tool' => 'ChatGPT',
                    'ai_model' => 'GPT-4o',
                ],
            ],
            [
                'title' => 'Roteiros Virais de Vídeos Curtos para Reels e TikTok',
                'slug' => 'roteiros-virais-de-videos-curtos-para-reels-e-tiktok',
                'short_description' => 'Framework de retenção nos primeiros 3 segundos com ganchos emocionais e chamada para ação.',
                'description' => 'Gere 10 ideias e roteiros completos para vídeos de 30 a 60 segundos otimizados para viralização e retenção de audiência.',
                'prompt_preview' => 'Você é um estrategista de conteúdo para mídias sociais. Crie 5 roteiros para Reels de 45 segundos...',
                'prompt_content' => "Você é um Estrategista de Mídias Sociais com foco em retenção de audiência no TikTok e Instagram Reels.\n\nPara o nicho: [Insira seu nicho]\n\nCrie 5 roteiros de vídeos com duração de 30 a 45 segundos estruturados assim:\n- Gancho Visual e Verbal (0-3s): Frase de alto impacto.\n- Problema / Curiosidade (3-15s): O conflito.\n- Solução Prática (15-35s): Dica acionável.\n- Chamada para Ação (35-45s): Pergunta para incentivar comentários.",
                'category_id' => $catVideo?->id,
                'author_id' => $admin->id,
                'source_type' => 'official',
                'prompt_type' => 'free',
                'ai_tool' => 'ChatGPT',
                'ai_model' => 'GPT-4o',
                'price' => 0.00,
                'status' => 'published',
                'is_featured' => false,
                'copy_count' => 1750,
                'view_count' => 6200,
                'usage_count' => 1600,
                'favorite_count' => 430,
                'average_rating' => 4.89,
                'reviews_count' => 54,
                'published_at' => now()->subDays(4),
                'tags' => [$tagChatGpt->id],
                'result' => [
                    'result_text' => "Gera roteiros dinâmicos com indicações de edição, cortes rápidos e posicionamento de texto na tela.",
                    'ai_tool' => 'ChatGPT',
                    'ai_model' => 'GPT-4o',
                ],
            ],
        ];

        foreach ($promptsData as $data) {
            $tags = $data['tags'] ?? [];
            $result = $data['result'] ?? null;
            unset($data['tags'], $data['result']);

            $data['uuid'] = (string) Str::uuid();

            $prompt = Prompt::updateOrCreate(
                ['slug' => $data['slug']],
                $data
            );

            if (!empty($tags)) {
                $prompt->tags()->sync($tags);
            }

            if ($result) {
                PromptResult::updateOrCreate(
                    ['prompt_id' => $prompt->id],
                    [
                        'result_text' => $result['result_text'],
                        'ai_tool' => $result['ai_tool'],
                        'ai_model' => $result['ai_model'],
                    ]
                );
            }
        }
    }
}
