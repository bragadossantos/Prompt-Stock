<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            [
                'key' => 'platform_name',
                'value' => 'PromptStock',
                'type' => 'string',
                'group' => 'general',
                'description' => 'Nome da plataforma oficial.',
            ],
            [
                'key' => 'platform_commission_percentage',
                'value' => '30',
                'type' => 'integer',
                'group' => 'marketplace',
                'description' => 'Percentagem de comissão da plataforma sobre as vendas dos criadores.',
            ],
            [
                'key' => 'default_currency',
                'value' => 'AOA',
                'type' => 'string',
                'group' => 'financial',
                'description' => 'Moeda padrão de comercialização.',
            ],
            [
                'key' => 'creator_min_withdrawal_amount',
                'value' => '5000',
                'type' => 'integer',
                'group' => 'financial',
                'description' => 'Valor mínimo para solicitação de levantamento pelo criador.',
            ],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
