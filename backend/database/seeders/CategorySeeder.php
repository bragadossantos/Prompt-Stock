<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Image Generation',
                'description' => 'Prompts de alto nível para Midjourney, DALL-E, Stable Diffusion e Flux.',
                'icon' => 'Sparkles',
                'sort_order' => 1,
            ],
            [
                'name' => 'Programming',
                'description' => 'Desenvolvimento de software, depuração, arquitetura, scripts e refatoração.',
                'icon' => 'Code',
                'sort_order' => 2,
            ],
            [
                'name' => 'Office & Productivity',
                'description' => 'Planilhas, automações de rotina, relatórios e organização diária.',
                'icon' => 'Briefcase',
                'sort_order' => 3,
            ],
            [
                'name' => 'Writing',
                'description' => 'Copywriting, redação de artigos, e-books, storytelling e redação criativa.',
                'icon' => 'PenTool',
                'sort_order' => 4,
            ],
            [
                'name' => 'Marketing',
                'description' => 'Estratégias de vendas, funis, anúncios publicitários e posicionamento de marca.',
                'icon' => 'Target',
                'sort_order' => 5,
            ],
            [
                'name' => 'Business',
                'description' => 'Modelagem de negócios, pitch decks, gestão empresarial e finanças.',
                'icon' => 'TrendingUp',
                'sort_order' => 6,
            ],
            [
                'name' => 'Data Analysis',
                'description' => 'Análise de métricas, visualização de dados, SQL e insights estatísticos.',
                'icon' => 'BarChart3',
                'sort_order' => 7,
            ],
            [
                'name' => 'Education',
                'description' => 'Planos de aula, resumos acadêmicos, tutoriais e aprendizagem acelerada.',
                'icon' => 'GraduationCap',
                'sort_order' => 8,
            ],
            [
                'name' => 'Design',
                'description' => 'Conceitos de UI/UX, paletas de cores, tipografia e design de interação.',
                'icon' => 'Layout',
                'sort_order' => 9,
            ],
            [
                'name' => 'Video',
                'description' => 'Roteiros audiovisuais, ganchos (hooks) para Reels/TikTok e pós-produção.',
                'icon' => 'Video',
                'sort_order' => 10,
            ],
            [
                'name' => 'Social Media',
                'description' => 'Criação de conteúdo engajante para LinkedIn, Twitter/X, Instagram e YouTube.',
                'icon' => 'Share2',
                'sort_order' => 11,
            ],
            [
                'name' => 'Research',
                'description' => 'Pesquisa aprofundada, síntese de artigos científicos e inteligência de mercado.',
                'icon' => 'Search',
                'sort_order' => 12,
            ],
            [
                'name' => 'Automation',
                'description' => 'Fluxos no Make, Zapier, N8N e integrações inteligentes com IA.',
                'icon' => 'Cpu',
                'sort_order' => 13,
            ],
            [
                'name' => 'Career',
                'description' => 'Otimização de currículos, preparação para entrevistas e transição de carreira.',
                'icon' => 'UserCheck',
                'sort_order' => 14,
            ],
            [
                'name' => 'Other',
                'description' => 'Prompts gerais, experimentais e utilitários diversos.',
                'icon' => 'Folder',
                'sort_order' => 15,
            ],
        ];

        foreach ($categories as $cat) {
            Category::updateOrCreate(
                ['slug' => Str::slug($cat['name'])],
                [
                    'name' => $cat['name'],
                    'description' => $cat['description'],
                    'icon' => $cat['icon'],
                    'sort_order' => $cat['sort_order'],
                    'is_active' => true,
                ]
            );
        }
    }
}
