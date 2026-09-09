<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\CreatorProfile;
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

        // 1. Creator: Manuel dos Santos (Senior Midjourney & Copywriter)
        $creatorManuel = User::firstOrCreate(
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

        CreatorProfile::firstOrCreate(
            ['user_id' => $creatorManuel->id],
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

        // 2. Creator: Sofia Chen (UI/UX & Visual Design)
        $creatorSofia = User::firstOrCreate(
            ['email' => 'sofia@promptstock.com'],
            [
                'uuid' => (string) Str::uuid(),
                'name' => 'Sofia Chen',
                'password' => bcrypt('PromptStock@2026!'),
                'role' => 'creator',
                'status' => 'active',
                'bio' => 'Lead Product Designer com foco em Design Systems e geração de assets visuais com IA.',
            ]
        );

        CreatorProfile::firstOrCreate(
            ['user_id' => $creatorSofia->id],
            [
                'username' => 'sofia_design',
                'headline' => 'Lead UI/UX Designer & Prompt Engineer Visual',
                'bio' => 'Especialista em prompts para Flux, Midjourney e especificações de UI/UX completas para desenvolvedores.',
                'available_balance' => 18000.00,
                'pending_balance' => 3200.00,
                'withdrawn_balance' => 31000.00,
                'is_verified' => true,
                'total_sales_count' => 9,
            ]
        );

        // 3. Creator: Lucas Vance (Full-Stack & Automações)
        $creatorLucas = User::firstOrCreate(
            ['email' => 'lucas@promptstock.com'],
            [
                'uuid' => (string) Str::uuid(),
                'name' => 'Lucas Vance',
                'password' => bcrypt('PromptStock@2026!'),
                'role' => 'creator',
                'status' => 'active',
                'bio' => 'Arquiteto de Software Full-Stack, especialista em Next.js, Laravel e automações com Make e Python.',
            ]
        );

        CreatorProfile::firstOrCreate(
            ['user_id' => $creatorLucas->id],
            [
                'username' => 'lucas_vance',
                'headline' => 'Senior Software Architect & Automation Specialist',
                'bio' => 'Construo pipelines de automação e prompts de desenvolvimento para criar MVPs funcionais em horas.',
                'available_balance' => 32000.00,
                'pending_balance' => 7500.00,
                'withdrawn_balance' => 58000.00,
                'is_verified' => true,
                'total_sales_count' => 21,
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

        // Categories
        $catBusiness = Category::where('slug', 'business')->first();
        $catImage = Category::where('slug', 'image-generation')->first();
        $catDev = Category::where('slug', 'programming')->first();
        $catMarketing = Category::where('slug', 'marketing')->first();
        $catOffice = Category::where('slug', 'office-productivity')->first();
        $catData = Category::where('slug', 'data-analysis')->first();
        $catVideo = Category::where('slug', 'video')->first();
        $catWriting = Category::where('slug', 'writing')->first();
        $catDesign = Category::where('slug', 'design')->first();
        $catEducation = Category::where('slug', 'education')->first();
        $catSocial = Category::where('slug', 'social-media')->first();
        $catAutomation = Category::where('slug', 'automation')->first();
        $catCareer = Category::where('slug', 'career')->first();
        $catResearch = Category::where('slug', 'research')->first();

        // Tags
        $tagMidjourney = Tag::firstOrCreate(['slug' => 'midjourney'], ['name' => 'Midjourney']);
        $tagChatGpt = Tag::firstOrCreate(['slug' => 'chatgpt'], ['name' => 'ChatGPT']);
        $tagClaude = Tag::firstOrCreate(['slug' => 'claude'], ['name' => 'Claude']);
        $tagFlux = Tag::firstOrCreate(['slug' => 'flux'], ['name' => 'Flux.1']);
        $tagNextJs = Tag::firstOrCreate(['slug' => 'nextjs'], ['name' => 'Next.js']);
        $tagLaravel = Tag::firstOrCreate(['slug' => 'laravel'], ['name' => 'Laravel']);
        $tagPython = Tag::firstOrCreate(['slug' => 'python'], ['name' => 'Python']);
        $tagCopywriting = Tag::firstOrCreate(['slug' => 'copywriting'], ['name' => 'Copywriting']);
        $tagSaas = Tag::firstOrCreate(['slug' => 'saas'], ['name' => 'SaaS']);
        $tagSeo = Tag::firstOrCreate(['slug' => 'seo'], ['name' => 'SEO']);
        $tagExcel = Tag::firstOrCreate(['slug' => 'excel'], ['name' => 'Excel']);
        $tagUiUx = Tag::firstOrCreate(['slug' => 'ui-ux'], ['name' => 'UI/UX']);

        $promptsData = [
            // 1. Business (Official - Free)
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
                'published_at' => now()->subDays(12),
                'tags' => [$tagChatGpt->id, $tagSaas->id],
                'result' => [
                    'result_text' => "Sumário Executivo gerado com sucesso: Plano de GTM estruturado em 5 fases, incluindo matriz de objeções com 8 contramedidas comprovadas.",
                    'ai_tool' => 'ChatGPT',
                    'ai_model' => 'GPT-4o',
                ],
            ],

            // 2. Image Generation (Official - Free)
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
                'published_at' => now()->subDays(10),
                'tags' => [$tagMidjourney->id],
                'result' => [
                    'result_text' => "Gera imagens com riqueza de detalhes impressionante, granulação sutil de cinema e composição balanceada.",
                    'ai_tool' => 'Midjourney',
                    'ai_model' => 'v6.1',
                ],
            ],

            // 3. Programming (Official - Premium)
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
                'published_at' => now()->subDays(8),
                'tags' => [$tagClaude->id, $tagNextJs->id, $tagSaas->id],
                'result' => [
                    'result_text' => "Gera código 100% pronto para produção sem necessidade de refatoração, com tipagem TypeScript e Server Components.",
                    'ai_tool' => 'Claude',
                    'ai_model' => 'Claude 3.5 Sonnet',
                ],
            ],

            // 4. Marketing (Creator - Premium)
            [
                'title' => 'Copywriting de Página de Vendas de Alta Conversão',
                'slug' => 'copywriting-de-pagina-de-vendas-de-alta-conversao',
                'short_description' => 'Modelo de copy persuasiva utilizando framework PASTOR para produtos digitais e infoprodutos.',
                'description' => 'Criado por criador experiente da comunidade. Estrutura completa de títulos instigantes, histórias de conexão emocional, quebra de objeções e ofertas irresistíveis.',
                'prompt_preview' => 'Atue como um Copywriter de elite com mais de \$10M em vendas diretas. Desenvolva uma página de vendas utilizando o método PASTOR...',
                'prompt_content' => "Você é um Copywriter de elite responsável por lançamentos digitais de 7 dígitos.\n\nEscreva a copy completa para a página de vendas do produto [Nome do Produto], seguindo o método PASTOR:\n- P (Problem): Identifique a dor imediata do prospecto.\n- A (Amplify): Amplifique a consequência de não resolver essa dor.\n- S (Story & Solution): Conte uma história de transformação.\n- T (Transformation & Testimony): Apresente os benefícios tangíveis.\n- O (Offer): Apresente o produto e os bônus.\n- R (Response): Chamada para ação clara e urgente.",
                'category_id' => $catMarketing?->id,
                'author_id' => $creatorManuel->id,
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
                'published_at' => now()->subDays(6),
                'tags' => [$tagChatGpt->id, $tagCopywriting->id],
                'result' => [
                    'result_text' => "Produz roteiro persuasivo pronto para diagramação em Landing Page, com taxas de clique acima de 12%.",
                    'ai_tool' => 'ChatGPT',
                    'ai_model' => 'GPT-4o',
                ],
            ],

            // 5. Data Analysis (Official - Free)
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
                'published_at' => now()->subDays(7),
                'tags' => [$tagChatGpt->id, $tagPython->id],
                'result' => [
                    'result_text' => "Gera código Python sem dependências obscuras, compatível com Jupyter Notebook e Google Colab.",
                    'ai_tool' => 'ChatGPT',
                    'ai_model' => 'GPT-4o',
                ],
            ],

            // 6. Video (Official - Free)
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
                'published_at' => now()->subDays(5),
                'tags' => [$tagChatGpt->id],
                'result' => [
                    'result_text' => "Gera roteiros dinâmicos com indicações de edição, cortes rápidos e posicionamento de texto na tela.",
                    'ai_tool' => 'ChatGPT',
                    'ai_model' => 'GPT-4o',
                ],
            ],

            // 7. Image Generation (Flux.1 - Sofia - Premium)
            [
                'title' => 'Renderização Arquitetônica Hiper-Realista no Flux.1',
                'slug' => 'renderizacao-arquitetonica-hiper-realista-no-flux1',
                'short_description' => 'Fachadas residenciais contemporâneas, materiais nobres, iluminação dourada crepuscular.',
                'description' => 'Prompt calibrado exclusivamente para o modelo Flux.1 Pro / Schnell. Renderiza concreto aparente, vidro reflexivo, madeira teca e jardins paisagísticos com iluminação crepuscular cinematográfica.',
                'prompt_preview' => 'Architectural photograph of a modern luxury brutalist villa in coastal cliffs, floor-to-ceiling glass, warm interior ambient lights, golden hour dusk...',
                'prompt_content' => "Architectural photography of an ultra-modern luxury brutalist villa situated on a coastal cliff, exposed textured concrete, floor-to-ceiling panoramic glass windows showing warm minimalist interior, cantilevered infinity pool overlooking stormy ocean, lush tropical landscaping with ferns and monsteras, shot during golden hour twilight, overcast diffused sky, soft ambient lighting, Hasselblad H6D-100c, 24mm tilt-shift architectural lens, highly detailed textures, photorealistic, 8k --ar 16:9",
                'category_id' => $catImage?->id,
                'author_id' => $creatorSofia->id,
                'source_type' => 'creator',
                'prompt_type' => 'premium',
                'ai_tool' => 'Flux',
                'ai_model' => 'Flux.1 Pro',
                'price' => 5000.00,
                'currency' => 'AOA',
                'status' => 'published',
                'is_featured' => true,
                'copy_count' => 520,
                'view_count' => 2400,
                'usage_count' => 480,
                'favorite_count' => 170,
                'average_rating' => 4.96,
                'reviews_count' => 22,
                'published_at' => now()->subDays(4),
                'tags' => [$tagFlux->id],
                'result' => [
                    'result_text' => "Renderização ultra-nítida de arquitetura sem distorções de perspectiva, com reflexos realistas nas superfícies envidraçadas.",
                    'ai_tool' => 'Flux',
                    'ai_model' => 'Flux.1 Pro',
                ],
            ],

            // 8. Programming (Lucas - Premium)
            [
                'title' => 'API REST Escalável em Laravel 12 com Arquitetura Modular',
                'slug' => 'api-rest-escalavel-em-laravel-12-com-arquitetura-modular',
                'short_description' => 'Estrutura completa com Form Requests, API Resources, Sanctum Tokens, Rate Limiting e Testes PHPUnit.',
                'description' => 'Crie endpoints corporativos em Laravel 12 seguindo princípios SOLID, separação em Services e Repositories, DTOs e testes automatizados de integração.',
                'prompt_preview' => 'Atue como Arquiteto de Software Especialista em Laravel 12. Modele a arquitetura REST para a seguinte entidade de negócio...',
                'prompt_content' => "Atue como Arquiteto de Software Especialista em Laravel 12.\n\nPara o módulo de: [Nome do Módulo/Domínio]\n\nDesenvolva:\n1. Migration com UUID, soft deletes e índices eficientes.\n2. Model com casts tipados, scopes e relacionamentos.\n3. Form Requests separados para Store e Update com regras de validação rigorosas.\n4. Controller REST limpo delegando a lógica de negócio para uma Service Class dedicada.\n5. API Resource formatando a resposta JSON com segurança.\n6. Classe de teste de Feature no PHPUnit cobrindo casos de sucesso e falha (401, 403, 422).",
                'category_id' => $catDev?->id,
                'author_id' => $creatorLucas->id,
                'source_type' => 'creator',
                'prompt_type' => 'premium',
                'ai_tool' => 'Claude',
                'ai_model' => 'Claude 3.5 Sonnet',
                'price' => 3800.00,
                'currency' => 'AOA',
                'status' => 'published',
                'is_featured' => true,
                'copy_count' => 780,
                'view_count' => 3600,
                'usage_count' => 710,
                'favorite_count' => 240,
                'average_rating' => 4.97,
                'reviews_count' => 38,
                'published_at' => now()->subDays(5),
                'tags' => [$tagClaude->id, $tagLaravel->id],
                'result' => [
                    'result_text' => "Estrutura modular gerada com 100% de conformidade com as diretrizes do Laravel 12 e PSR-12.",
                    'ai_tool' => 'Claude',
                    'ai_model' => 'Claude 3.5 Sonnet',
                ],
            ],

            // 9. Office & Productivity (Official - Free)
            [
                'title' => 'Mestre em Fórmulas Avançadas de Excel e Automação VBA',
                'slug' => 'mestre-em-formulas-avancadas-de-excel-e-automacao-vba',
                'short_description' => 'Solucione cálculos complexos com PROCX, MATRIZES DINÂMICAS, LAMBDA e macros em VBA.',
                'description' => 'Prompt definitivo para analistas financeiros e administrativos. Explique seu desafio de dados e receba a fórmula exata ou macro VBA comentada linha por linha.',
                'prompt_preview' => 'Você é um Especialista Sênior em Microsoft Excel e Power Query. Ajude-me a criar uma fórmula dinâmica...',
                'prompt_content' => "Você é um Especialista Sênior em Microsoft Excel, Power Query e automação com VBA.\n\nMeu objetivo é: [Descrever o que você quer calcular ou automatizar]\nEstrutura dos meus dados: [Indique as colunas e exemplos de linhas]\nVersão do Excel: Microsoft 365 / Excel 2021\n\nForneça:\n1. A fórmula mais moderna e eficiente (priorizando PROCX, PROCX com múltiplos critérios, ou LET/LAMBDA).\n2. Explicação passo a passo de como a fórmula processa os dados.\n3. (Opcional) Código VBA alternativo se a automação for repetitiva, com tratamento de erros `On Error GoTo`.",
                'category_id' => $catOffice?->id,
                'author_id' => $admin->id,
                'source_type' => 'official',
                'prompt_type' => 'free',
                'ai_tool' => 'ChatGPT',
                'ai_model' => 'GPT-4o',
                'price' => 0.00,
                'status' => 'published',
                'is_featured' => false,
                'copy_count' => 2150,
                'view_count' => 8900,
                'usage_count' => 1950,
                'favorite_count' => 610,
                'average_rating' => 4.93,
                'reviews_count' => 65,
                'published_at' => now()->subDays(9),
                'tags' => [$tagChatGpt->id, $tagExcel->id],
                'result' => [
                    'result_text' => "Fórmula validada com sintaxe em Português e Inglês, pronta para colar na planilha sem erros de referência.",
                    'ai_tool' => 'ChatGPT',
                    'ai_model' => 'GPT-4o',
                ],
            ],

            // 10. Writing & SEO (Official - Free)
            [
                'title' => 'Artigos SEO Long-Form de 2.500 Palavras com Critérios E-E-A-T',
                'slug' => 'artigos-seo-long-form-de-2500-palavras-com-criterios-e-e-a-t',
                'short_description' => 'Redação completa com intenção de busca, cabeçalhos semânticos H2/H3 e rich snippets.',
                'description' => 'Escreva artigos autoritários que ranqueiam no topo do Google. Otimizado para os padrões do Helpful Content Update e busca semântica.',
                'prompt_preview' => 'Você é um Redator SEO Chefe e Estrategista de Conteúdo. Escreva um artigo completo sobre...',
                'prompt_content' => "Você é um Redator SEO Chefe com histórico comprovado de ranqueamento de artigos na posição #1 do Google.\n\nPalavra-chave Principal: [Insira a palavra-chave]\nIntenção de Busca: [Informativa / Transacional / Comercial]\nPúblico-Alvo: [Ex: Empreendedores e Gestores]\n\nEscreva um artigo aprofundado com:\n1. Título H1 magnético contendo a palavra-chave.\n2. Introdução envolvente com gancho, promessa e resposta direta à busca (para Featured Snippet).\n3. Estrutura lógica de subtítulos (H2 e H3) abordando dúvidas frequentes (People Also Ask).\n4. Tabelas comparativas e listas bulleted para retenção de leitura.\n5. Seção de FAQ estruturada com 5 perguntas e respostas concisas.",
                'category_id' => $catWriting?->id,
                'author_id' => $admin->id,
                'source_type' => 'official',
                'prompt_type' => 'free',
                'ai_tool' => 'ChatGPT',
                'ai_model' => 'GPT-4o',
                'price' => 0.00,
                'status' => 'published',
                'is_featured' => false,
                'copy_count' => 1620,
                'view_count' => 7100,
                'usage_count' => 1430,
                'favorite_count' => 390,
                'average_rating' => 4.91,
                'reviews_count' => 42,
                'published_at' => now()->subDays(11),
                'tags' => [$tagChatGpt->id, $tagSeo->id],
                'result' => [
                    'result_text' => "Gera texto fluido, sem clichês de IA (como 'no mundo acelerado de hoje'), focado em utilidade prática e autoridade.",
                    'ai_tool' => 'ChatGPT',
                    'ai_model' => 'GPT-4o',
                ],
            ],

            // 11. Design (Sofia - Premium)
            [
                'title' => 'Design System Completo: Especificação de Componentes Figma para Código',
                'slug' => 'design-system-completo-especificacao-de-componentes-figma-para-codigo',
                'short_description' => 'Tokens de design, estados (hover, active, focus, disabled), acessibilidade WCAG AAA e código Tailwind.',
                'description' => 'Transforme conceitos de design em tokens de cores HSL, escalas tipográficas e componentes reutilizáveis prontos para o frontend.',
                'prompt_preview' => 'Atue como Staff Design System Engineer. Desenvolva as diretrizes completas de tokenização e o componente...',
                'prompt_content' => "Atue como Staff Design System Engineer e Especialista em Acessibilidade (WCAG 2.2 AAA).\n\nPara o componente: [Ex: Modal de Diálogo, Dropdown Select, Card de Preço]\n\nForneça:\n1. Anatomia do componente e estrutura semântica.\n2. Design Tokens associados (cores primárias, borders, shadows, espaçamentos em rem).\n3. Especificação completa dos estados: Default, Hover, Active, Focus-Visible, Disabled, Loading.\n4. Código de implementação em React com Tailwind CSS e Radix UI.\n5. Atributos de acessibilidade ARIA obrigatórios (aria-expanded, aria-haspopup, etc.).",
                'category_id' => $catDesign?->id,
                'author_id' => $creatorSofia->id,
                'source_type' => 'creator',
                'prompt_type' => 'premium',
                'ai_tool' => 'Claude',
                'ai_model' => 'Claude 3.5 Sonnet',
                'price' => 4200.00,
                'currency' => 'AOA',
                'status' => 'published',
                'is_featured' => true,
                'copy_count' => 460,
                'view_count' => 2100,
                'usage_count' => 410,
                'favorite_count' => 165,
                'average_rating' => 4.95,
                'reviews_count' => 19,
                'published_at' => now()->subDays(3),
                'tags' => [$tagClaude->id, $tagUiUx->id],
                'result' => [
                    'result_text' => "Componente gerado com conformidade total WCAG 2.2, tipagem TypeScript estrita e classes Tailwind sem estilos redundantes.",
                    'ai_tool' => 'Claude',
                    'ai_model' => 'Claude 3.5 Sonnet',
                ],
            ],

            // 12. Education (Official - Free)
            [
                'title' => 'Plano de Aula Dinâmico com Metodologias Ativas e Rubrica de Avaliação',
                'slug' => 'plano-de-aula-dinamico-com-metodologias-ativas-e-rubrica-de-avaliacao',
                'short_description' => 'Estrutura pedagógica com sala de aula invertida, estudos de caso e critérios objetivos de avaliação.',
                'description' => 'Ideal para professores e instrutores corporativos. Crie planos de aula engajadores para 50 ou 90 minutos de duração.',
                'prompt_preview' => 'Você é um Coordenador Pedagógico Especialista em Metodologias Ativas. Crie um plano de aula sobre...',
                'prompt_content' => "Você é um Coordenador Pedagógico Especialista em Metodologias Ativas e Ensino Baseado em Problemas (PBL).\n\nDisciplina: [Nome da Disciplina]\nTópico da Aula: [Ex: Redes Neurais Artificiais / Gestão Financeira]\nNível dos Estudantes: [Graduação / Ensino Médio / Pós-Graduação]\nDuração: [Ex: 90 minutos]\n\nElabore um plano de aula contendo:\n1. Objetivos de Aprendizagem (Taxonomia de Bloom).\n2. Cronograma minuto a minuto (Aquecimento, Dinâmica em Grupo, Síntese do Professor).\n3. Estudo de caso real ou exercício prático para resolução em sala.\n4. Rubrica de avaliação em 4 níveis (Insuficiente, Básico, Proficiente, Avançado).",
                'category_id' => $catEducation?->id,
                'author_id' => $admin->id,
                'source_type' => 'official',
                'prompt_type' => 'free',
                'ai_tool' => 'ChatGPT',
                'ai_model' => 'GPT-4o',
                'price' => 0.00,
                'status' => 'published',
                'is_featured' => false,
                'copy_count' => 970,
                'view_count' => 4100,
                'usage_count' => 880,
                'favorite_count' => 250,
                'average_rating' => 4.90,
                'reviews_count' => 28,
                'published_at' => now()->subDays(6),
                'tags' => [$tagChatGpt->id],
                'result' => [
                    'result_text' => "Plano de aula estruturado com foco em participação dos alunos e rubrica clara pronta para impressão.",
                    'ai_tool' => 'ChatGPT',
                    'ai_model' => 'GPT-4o',
                ],
            ],

            // 13. Social Media (Lucas - Free)
            [
                'title' => 'Gerador de Carrosséis Virais para LinkedIn com Alto Alcance Orgânico',
                'slug' => 'gerador-de-carrosseis-virais-para-linkedin-com-alto-alcance-organico',
                'short_description' => 'Estrutura de 8 a 10 slides com ganchos fortes, diagramação limpa e chamadas para salvar e compartilhar.',
                'description' => 'Aumente sua autoridade profissional no LinkedIn. Transforme tópicos técnicos em carrosséis PDF altamente compartilháveis.',
                'prompt_preview' => 'Você é um Consultor de Marca Pessoal e Conteúdo para LinkedIn. Crie o roteiro de um carrossel em 10 slides...',
                'prompt_content' => "Você é um Consultor de Marca Pessoal para Executivos com foco em LinkedIn.\n\nTema: [Ex: 5 Erros que Deixam sua Aplicação Web Lenta / 7 Leis de Negociação B2B]\nPúblico: [Ex: Fundadores de Startups e Engenheiros]\n\nEscreva o conteúdo para um carrossel de 8 a 10 slides no seguinte formato:\n- Slide 1 (Capa): Título provocativo + Subtítulo curto + Gancho visual.\n- Slides 2 a 7: Um insight por slide (máximo 40 palavras por tela, linguagem direta e impacto visual).\n- Slide 8 (Resumo): Checklist visual de tudo que foi ensinado.\n- Slide 9 (CTA): Chamada para seguir, salvar para consultar depois e comentar.",
                'category_id' => $catSocial?->id,
                'author_id' => $creatorLucas->id,
                'source_type' => 'creator',
                'prompt_type' => 'free',
                'ai_tool' => 'ChatGPT',
                'ai_model' => 'GPT-4o',
                'price' => 0.00,
                'status' => 'published',
                'is_featured' => false,
                'copy_count' => 1340,
                'view_count' => 5400,
                'usage_count' => 1210,
                'favorite_count' => 310,
                'average_rating' => 4.87,
                'reviews_count' => 35,
                'published_at' => now()->subDays(4),
                'tags' => [$tagChatGpt->id],
                'result' => [
                    'result_text' => "Roteiro conciso que cabe perfeitamente no formato visual de slides do Figma ou Canva.",
                    'ai_tool' => 'ChatGPT',
                    'ai_model' => 'GPT-4o',
                ],
            ],

            // 14. Automation (Lucas - Premium)
            [
                'title' => 'Fluxo de Automação Make.com / N8N: Lead Scoring e Notificação WhatsApp',
                'slug' => 'fluxo-de-automacao-makecom-n8n-lead-scoring-e-notificacao-whatsapp',
                'short_description' => 'Arquitetura de webhook, enriquecimento de leads com OpenAI e despacho em tempo real para equipe comercial.',
                'description' => 'Prompt para Claude desenhar a lógica de nós, schemas JSON, tratamento de erros e integração via API do WhatsApp Business.',
                'prompt_preview' => 'Você é um Engenheiro de Automação Sênior. Escreva a especificação do cenário no Make/n8n...',
                'prompt_content' => "Você é um Engenheiro de Automação de Processos Sênior especialista em Make.com e n8n.\n\nObjetivo: Automatizar a qualificação de leads recebidos via formulário da web.\n\nForneça:\n1. Diagrama de fluxo de execução nó a nó.\n2. Payload JSON de entrada esperado pelo Webhook.\n3. Prompt do nó de IA (OpenAI) para calcular um Lead Score de 1 a 10 e resumir o perfil do cliente em 2 frases.\n4. Roteamento condicional (Se score >= 8, notifica vendedor sênior via WhatsApp; se score < 8, adiciona a fluxo de nutrição de e-mail).\n5. Lógica de fallback para erros e retentativas automáticas.",
                'category_id' => $catAutomation?->id,
                'author_id' => $creatorLucas->id,
                'source_type' => 'creator',
                'prompt_type' => 'premium',
                'ai_tool' => 'Claude',
                'ai_model' => 'Claude 3.5 Sonnet',
                'price' => 5500.00,
                'currency' => 'AOA',
                'status' => 'published',
                'is_featured' => true,
                'copy_count' => 380,
                'view_count' => 1720,
                'usage_count' => 330,
                'favorite_count' => 135,
                'average_rating' => 4.98,
                'reviews_count' => 17,
                'published_at' => now()->subDays(2),
                'tags' => [$tagClaude->id],
                'result' => [
                    'result_text' => "Especificação técnica minuciosa que permite montar o fluxo no Make em menos de 30 minutos.",
                    'ai_tool' => 'Claude',
                    'ai_model' => 'Claude 3.5 Sonnet',
                ],
            ],

            // 15. Career (Official - Free)
            [
                'title' => 'Simulador de Entrevistas Técnicas para Vagas Internacionais',
                'slug' => 'simulador-de-entrevistas-tecnicas-para-vagas-internacionais',
                'short_description' => 'Entrevista simulada no estilo FAANG: System Design, algoritmos, perguntas comportamentais (STAR).',
                'description' => 'Treine para vagas remotas de empresas de tecnologia internacionais. A IA atua como Head de Engenharia e dá feedback em tempo real sobre suas respostas.',
                'prompt_preview' => 'Atue como Diretor de Engenharia do Google ou Stripe. Simule uma entrevista técnica comigo para o cargo de...',
                'prompt_content' => "Atue como Diretor de Engenharia de uma empresa de tecnologia global de primeira linha (Stripe / Google).\n\nMeu Perfil: [Ex: Desenvolvedor Full-Stack com 4 anos de experiência em React e Node.js]\nVaga desejada: [Ex: Senior Software Engineer - Remote]\n\nInstruções da simulação:\n1. Faça UMA pergunta de cada vez e aguarde minha resposta.\n2. Comece com uma pergunta sobre um desafio de arquitetura real (System Design).\n3. Após minha resposta, aponte um ponto forte e um ponto cego ou risco que não considerei.\n4. Prossiga para perguntas comportamentais usando o método STAR (Situação, Tarefa, Ação, Resultado).\n5. Ao final de 5 rodadas, apresente uma nota de 1 a 10 e um relatório de melhorias para a entrevista real.",
                'category_id' => $catCareer?->id,
                'author_id' => $admin->id,
                'source_type' => 'official',
                'prompt_type' => 'free',
                'ai_tool' => 'ChatGPT',
                'ai_model' => 'GPT-4o',
                'price' => 0.00,
                'status' => 'published',
                'is_featured' => false,
                'copy_count' => 1890,
                'view_count' => 6900,
                'usage_count' => 1720,
                'favorite_count' => 520,
                'average_rating' => 4.94,
                'reviews_count' => 47,
                'published_at' => now()->subDays(7),
                'tags' => [$tagChatGpt->id],
                'result' => [
                    'result_text' => "Simulação interativa rigorosa com feedback construtivo alinhado com o padrão de contratação internacional.",
                    'ai_tool' => 'ChatGPT',
                    'ai_model' => 'GPT-4o',
                ],
            ],

            // 16. Image Generation (Manuel - Premium)
            [
                'title' => 'Fotografia de Produto Minimalista em Estúdio 3D no Midjourney',
                'slug' => 'fotografia-de-produto-minimalista-em-estudio-3d-no-midjourney',
                'short_description' => 'Fotografia comercial de cosméticos, perfumes e eletrônicos em pódios de pedra e mármore.',
                'description' => 'Crie imagens comerciais de catálogo publicitário com profundidade de campo suave, reflexos sutis de acrílico e iluminação difusa de estúdio.',
                'prompt_preview' => 'Commercial product photography of a luxury minimalist perfume bottle on a travertine stone podium, soft neutral beige background...',
                'prompt_content' => "Commercial product photography of a luxury minimalist frosted glass perfume bottle with gold cap, standing on an organic raw travertine stone podium, soft warm neutral studio background, gentle water ripples on glossy surface, soft diffused side lighting, subtle shadows, shot on Hasselblad H6D-100c, 100mm macro lens, f/4, clean composition, high-end editorial cosmetics campaign, 8k resolution --ar 4:5 --v 6.1 --style raw",
                'category_id' => $catImage?->id,
                'author_id' => $creatorManuel->id,
                'source_type' => 'creator',
                'prompt_type' => 'premium',
                'ai_tool' => 'Midjourney',
                'ai_model' => 'v6.1',
                'price' => 3500.00,
                'currency' => 'AOA',
                'status' => 'published',
                'is_featured' => true,
                'copy_count' => 910,
                'view_count' => 4100,
                'usage_count' => 840,
                'favorite_count' => 310,
                'average_rating' => 4.96,
                'reviews_count' => 33,
                'published_at' => now()->subDays(5),
                'tags' => [$tagMidjourney->id],
                'result' => [
                    'result_text' => "Imagens prontas para campanhas de e-commerce, anúncios no Instagram e catálogos de marca de luxo.",
                    'ai_tool' => 'Midjourney',
                    'ai_model' => 'v6.1',
                ],
            ],

            // 17. Research (Official - Free)
            [
                'title' => 'Síntese Executiva de Artigos Científicos e Livros Complexos',
                'slug' => 'sintese-executiva-de-artigos-cientificos-e-livros-complexos',
                'short_description' => 'Extração de teses centrais, evidências empíricas, metodologia e aplicações práticas.',
                'description' => 'Economize horas de leitura acadêmica densa. Obtenha resumos críticos com perguntas desafiadoras sobre a validade das conclusões.',
                'prompt_preview' => 'Você é um Pesquisador de Pós-Doutorado e Revisor Científico. Analise criticamente o seguinte texto...',
                'prompt_content' => "Você é um Pesquisador de Pós-Doutorado com vasta experiência em análise bibliográfica e pensamento crítico.\n\nTexto/Artigo para análise: [Cole o texto ou cite o título e autor]\n\nProduza uma síntese estruturada:\n1. Tese Central: A hipótese primária defendida em no máximo 2 frases.\n2. Metodologia & Evidências: Dados ou experimentos que sustentam a conclusão.\n3. Pontos Fortes e Limitações Metodológicas.\n4. Três Aplicações Práticas para o mundo dos negócios / tecnologia.\n5. Três Perguntas Desafiadoras que um debatedor qualificado faria ao autor.",
                'category_id' => $catResearch?->id,
                'author_id' => $admin->id,
                'source_type' => 'official',
                'prompt_type' => 'free',
                'ai_tool' => 'Claude',
                'ai_model' => 'Claude 3.5 Sonnet',
                'price' => 0.00,
                'status' => 'published',
                'is_featured' => false,
                'copy_count' => 740,
                'view_count' => 3100,
                'usage_count' => 690,
                'favorite_count' => 190,
                'average_rating' => 4.93,
                'reviews_count' => 21,
                'published_at' => now()->subDays(8),
                'tags' => [$tagClaude->id],
                'result' => [
                    'result_text' => "Resumo objetivo e imparcial sem perda de nuances técnicas e conceituais do material original.",
                    'ai_tool' => 'Claude',
                    'ai_model' => 'Claude 3.5 Sonnet',
                ],
            ],

            // 18. Business (Sofia - Premium)
            [
                'title' => 'Pitch Deck Vencedor para Captação de Investimento Seed e Série A',
                'slug' => 'pitch-deck-vencedor-para-captacao-de-investimento-seed-e-serie-a',
                'short_description' => 'Estrutura de 12 slides recomendada por aceleradoras globais (Y Combinator e Techstars).',
                'description' => 'Roteiro slide a slide para convencer investidores de venture capital com dados de tração, unit economics e tamanho de mercado (TAM/SAM/SOM).',
                'prompt_preview' => 'Você é um Sócio de uma firma de Venture Capital e Mentor de Startups. Desenvolva o roteiro do meu Pitch Deck...',
                'prompt_content' => "Você é um Partner de um fundo de Venture Capital com mais de 50 investimentos em startups early-stage.\n\nDados da minha startup:\n- Setor: [Ex: Fintech / Edtech]\n- O que fazemos: [Uma frase clara]\n- Tração atual: [Ex: 500 clientes ativos, \$15k MRR, crescimento de 20% ao mês]\n- Valor a captar: [Ex: \$500k em rodada Pre-Seed]\n\nEscreva o roteiro detalhado para uma apresentação de 12 slides:\n1. Problema urgente.\n2. Solução e Demonstração do Produto.\n3. Tamanho de Mercado (TAM, SAM, SOM).\n4. Modelo de Negócio & Unit Economics (LTV/CAC).\n5. Tração e Principais Métricas.\n6. Vantagem Competitiva Injusta (Moat).\n7. Equipe Fundadora.\n8. O Ask (Uso detalhado dos recursos captados para 18 meses de runway).",
                'category_id' => $catBusiness?->id,
                'author_id' => $creatorSofia->id,
                'source_type' => 'creator',
                'prompt_type' => 'premium',
                'ai_tool' => 'ChatGPT',
                'ai_model' => 'GPT-4o',
                'price' => 6000.00,
                'currency' => 'AOA',
                'status' => 'published',
                'is_featured' => true,
                'copy_count' => 610,
                'view_count' => 2800,
                'usage_count' => 540,
                'favorite_count' => 210,
                'average_rating' => 4.97,
                'reviews_count' => 26,
                'published_at' => now()->subDays(4),
                'tags' => [$tagChatGpt->id, $tagSaas->id],
                'result' => [
                    'result_text' => "Roteiro validado por padrões de VC globais, sem jargões desnecessários e com narrativa persuasiva.",
                    'ai_tool' => 'ChatGPT',
                    'ai_model' => 'GPT-4o',
                ],
            ],

            // 19. Programming (Lucas - Free)
            [
                'title' => 'Auditoria de Segurança e Checklist OWASP Top 10 para APIs Web',
                'slug' => 'auditoria-de-seguranca-e-checklist-owasp-top-10-para-apis-web',
                'short_description' => 'Identifique vulnerabilidades de injeção SQL, BOLA (quebra de autorização), CORS mal configurado e vazamento de tokens.',
                'description' => 'Cole seu código de controller ou configuração de rotas e receba uma análise de vetores de ataque com código corrigido.',
                'prompt_preview' => 'Você é um Especialista em Segurança Ofensiva (Red Team) e Pentest de APIs. Analise o código abaixo...',
                'prompt_content' => "Você é um Especialista Sênior em Segurança Ofensiva e Pentest de Aplicações Web.\n\nAnalise o seguinte trecho de código / rotas de API: [Cole o código]\n\nExecute a seguinte auditoria:\n1. Classifique o nível de risco (Crítico, Alto, Médio, Baixo).\n2. Identifique se há vulnerabilidades mapeadas no OWASP Top 10 (ex: Broken Object Level Authorization, Broken Authentication, Mass Assignment, etc.).\n3. Descreva o vetor de ataque exato que um invasor utilizaria.\n4. Apresente a versão do código 100% corrigida e segura com explicações da correção.",
                'category_id' => $catDev?->id,
                'author_id' => $creatorLucas->id,
                'source_type' => 'creator',
                'prompt_type' => 'free',
                'ai_tool' => 'Claude',
                'ai_model' => 'Claude 3.5 Sonnet',
                'price' => 0.00,
                'status' => 'published',
                'is_featured' => false,
                'copy_count' => 1120,
                'view_count' => 4600,
                'usage_count' => 990,
                'favorite_count' => 280,
                'average_rating' => 4.95,
                'reviews_count' => 36,
                'published_at' => now()->subDays(6),
                'tags' => [$tagClaude->id],
                'result' => [
                    'result_text' => "Relatório técnico conciso com recomendações de sanitização e proteção contra CSRF/BOLA.",
                    'ai_tool' => 'Claude',
                    'ai_model' => 'Claude 3.5 Sonnet',
                ],
            ],

            // 20. Marketing (Manuel - Premium)
            [
                'title' => 'Sequência Completa de E-mails de Boas-Vindas e Nutrição de Leads',
                'slug' => 'sequencia-completa-de-e-mails-de-boas-vindas-e-nutricao-de-leads',
                'short_description' => 'Série de 5 e-mails automáticos para transformar novos inscritos em clientes fiéis.',
                'description' => 'Desenvolvida com storytelling envolvente, loops abertos (open loops) para aumentar taxa de abertura e ofertas no momento certo.',
                'prompt_preview' => 'Você é um Especialista em E-mail Marketing e Retenção. Crie uma sequência de boas-vindas de 5 e-mails...',
                'prompt_content' => "Você é um Estrategista de E-mail Marketing focado em entregabilidade e conversão.\n\nPara o negócio: [Descreva o seu produto ou serviço]\nLead Magnet entregue: [Ex: E-book gratuito / Checklist / Trial]\n\nEscreva a sequência completa de 5 e-mails:\n- E-mail 1 (Entrega do bônus + Alinhamento de expectativas + Pedido de resposta para passar no filtro de spam).\n- E-mail 2 (História de origem e maior erro que o lead comete).\n- E-mail 3 (Estudo de caso de cliente com resultado real).\n- E-mail 4 (Apresentação da solução completa com quebra da principal objeção).\n- E-mail 5 (Última oportunidade com senso de urgência e bônus exclusivo).\n\nPara cada e-mail, inclua 3 opções de linhas de assunto persuasivas com preview text.",
                'category_id' => $catMarketing?->id,
                'author_id' => $creatorManuel->id,
                'source_type' => 'creator',
                'prompt_type' => 'premium',
                'ai_tool' => 'ChatGPT',
                'ai_model' => 'GPT-4o',
                'price' => 2800.00,
                'currency' => 'AOA',
                'status' => 'published',
                'is_featured' => true,
                'copy_count' => 540,
                'view_count' => 2300,
                'usage_count' => 490,
                'favorite_count' => 180,
                'average_rating' => 4.91,
                'reviews_count' => 23,
                'published_at' => now()->subDays(3),
                'tags' => [$tagChatGpt->id, $tagCopywriting->id],
                'result' => [
                    'result_text' => "Sequência com taxas estimadas de abertura superiores a 45% e cliques de mais de 8% nos links de chamada.",
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
