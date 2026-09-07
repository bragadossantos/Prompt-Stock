<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@promptstock.com'],
            [
                'uuid' => (string) Str::uuid(),
                'name' => 'PromptStock Admin',
                'password' => Hash::make('PromptStock@2026!'),
                'role' => 'admin',
                'status' => 'active',
                'bio' => 'Administrador oficial e curador mestre da plataforma PromptStock.',
                'email_verified_at' => now(),
            ]
        );
    }
}
