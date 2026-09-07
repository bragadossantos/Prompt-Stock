<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Prompt;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminTest extends TestCase
{
    use RefreshDatabase;

    public function test_non_admin_cannot_access_admin_endpoints(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        $token = $user->createToken('user-token')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/v1/admin/dashboard');

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'message' => 'Acesso negado. Esta rota é restrita a administradores da PromptStock.',
            ]);
    }

    public function test_admin_can_access_dashboard_metrics(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $token = $admin->createToken('admin-token')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/v1/admin/dashboard');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'users' => ['total', 'active', 'creators', 'admins'],
                    'prompts' => ['total', 'published', 'pending', 'free', 'premium'],
                    'engagement' => ['total_copies', 'total_views'],
                ],
            ]);
    }

    public function test_admin_can_create_official_prompt(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $token = $admin->createToken('admin-token')->plainTextToken;
        $category = Category::factory()->create();

        $payload = [
            'title' => 'Prompt Oficial de Produtividade',
            'short_description' => 'Prompt criado pela plataforma PromptStock',
            'description' => 'Descrição completa detalhada',
            'prompt_preview' => 'Prévia do prompt oficial...',
            'prompt_content' => 'Conteúdo secreto completo do prompt oficial',
            'category_id' => $category->id,
            'prompt_type' => 'free',
            'ai_tool' => 'ChatGPT',
            'ai_model' => 'GPT-4o',
            'is_featured' => true,
            'tags' => ['produtividade', 'oficial'],
            'result_text' => 'Resultado de demonstração gerado com sucesso.',
        ];

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/v1/admin/prompts', $payload);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'title' => 'Prompt Oficial de Produtividade',
                    'source_type' => 'official',
                    'is_featured' => true,
                ],
            ]);

        $this->assertDatabaseHas('prompts', [
            'title' => 'Prompt Oficial de Produtividade',
            'source_type' => 'official',
            'author_id' => $admin->id,
        ]);
    }

    public function test_admin_can_toggle_featured_status(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $token = $admin->createToken('admin-token')->plainTextToken;
        $category = Category::factory()->create();

        $prompt = Prompt::create([
            'title' => 'Prompt Teste Featured',
            'slug' => 'prompt-teste-featured',
            'short_description' => 'Curto',
            'description' => 'Longo',
            'prompt_preview' => 'Prévia',
            'prompt_content' => 'Conteúdo',
            'category_id' => $category->id,
            'author_id' => $admin->id,
            'prompt_type' => 'free',
            'is_featured' => false,
            'status' => 'published',
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->patchJson("/api/v1/admin/prompts/{$prompt->id}/featured");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => ['is_featured' => true],
            ]);

        $this->assertTrue($prompt->fresh()->is_featured);
    }

    public function test_admin_can_suspend_and_reactivate_user(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $token = $admin->createToken('admin-token')->plainTextToken;
        $targetUser = User::factory()->create(['status' => 'active']);

        // Suspend
        $res = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->patchJson("/api/v1/admin/users/{$targetUser->id}/status", [
                'status' => 'suspended',
            ]);

        $res->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => ['status' => 'suspended'],
            ]);

        $this->assertEquals('suspended', $targetUser->fresh()->status);
    }

    public function test_admin_cannot_suspend_themselves(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $token = $admin->createToken('admin-token')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->patchJson("/api/v1/admin/users/{$admin->id}/status", [
                'status' => 'suspended',
            ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'Não é permitido suspender a própria conta de administrador.',
            ]);
    }

    public function test_admin_can_change_user_role(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $token = $admin->createToken('admin-token')->plainTextToken;
        $targetUser = User::factory()->create(['role' => 'user']);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->patchJson("/api/v1/admin/users/{$targetUser->id}/role", [
                'role' => 'creator',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => ['role' => 'creator'],
            ]);

        $this->assertEquals('creator', $targetUser->fresh()->role);
    }
}
