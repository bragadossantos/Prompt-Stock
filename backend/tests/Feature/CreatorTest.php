<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\CreatorProfile;
use App\Models\Prompt;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CreatorTest extends TestCase
{
    use RefreshDatabase;

    public function test_regular_user_cannot_access_creator_studio(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        $token = $user->createToken('user-token')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/v1/creator/dashboard');

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'message' => 'Acesso restrito ao Creator Studio. Torne-se um criador aprovado para publicar prompts.',
            ]);
    }

    public function test_user_can_apply_to_become_creator(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        $token = $user->createToken('user-token')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/v1/creator/apply', [
                'bio' => 'Engenheiro de software e criador de prompts.',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertEquals('creator', $user->fresh()->role);
        $this->assertDatabaseHas('creator_profiles', [
            'user_id' => $user->id,
        ]);
    }

    public function test_creator_can_access_creator_dashboard(): void
    {
        $creator = User::factory()->create(['role' => 'creator']);
        $token = $creator->createToken('creator-token')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/v1/creator/dashboard');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'profile',
                    'stats' => ['total_prompts', 'published_prompts', 'pending_prompts'],
                    'financial' => ['available_balance', 'pending_balance'],
                ],
            ]);
    }

    public function test_creator_prompt_submission_requires_admin_approval(): void
    {
        $creator = User::factory()->create(['role' => 'creator']);
        $token = $creator->createToken('creator-token')->plainTextToken;
        $category = Category::factory()->create();

        $payload = [
            'title' => 'Prompt Criado por Membro da Comunidade',
            'short_description' => 'Prompt aguardando revisão',
            'description' => 'Descrição completa',
            'prompt_preview' => 'Prévia pública',
            'prompt_content' => 'Conteúdo secreto',
            'category_id' => $category->id,
            'prompt_type' => 'free',
            'ai_tool' => 'ChatGPT',
            'submit_for_review' => true,
        ];

        // 1. Creator submits prompt
        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/v1/creator/prompts', $payload);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'status' => 'pending_review',
                    'source_type' => 'creator',
                ],
            ]);

        $promptId = $response->json('data.id');

        // 2. Prompt must NOT appear in public catalog yet
        $publicCatalogRes = $this->getJson('/api/v1/prompts');
        $publicCatalogRes->assertStatus(200);
        $this->assertEmpty($publicCatalogRes->json('data'));

        // 3. Admin approves the prompt
        $admin = User::factory()->create(['role' => 'admin']);
        \Laravel\Sanctum\Sanctum::actingAs($admin, ['*']);
        $approveRes = $this->patchJson("/api/v1/admin/prompts/{$promptId}/status", [
            'status' => 'published',
        ]);

        $approveRes->assertStatus(200);

        // 4. Prompt is now live and published in public catalog!
        $publicCatalogAfterRes = $this->getJson('/api/v1/prompts');
        $publicCatalogAfterRes->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }

    public function test_creator_can_request_withdrawal(): void
    {
        $creator = User::factory()->create(['role' => 'creator']);
        $token = $creator->createToken('creator-token')->plainTextToken;

        // Give creator 15,000 AOA balance
        $profile = CreatorProfile::create([
            'user_id' => $creator->id,
            'username' => 'creator-test',
            'available_balance' => 15000.00,
            'pending_balance' => 0.00,
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/v1/creator/withdrawals', [
                'amount' => 10000.00,
                'payment_method' => 'multicaixa_express',
                'account_details' => '923000111',
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
            ]);

        $profile->refresh();
        $this->assertEquals(5000.00, $profile->available_balance);
        $this->assertEquals(10000.00, $profile->pending_balance);
    }

    public function test_public_can_view_creators_list_and_profile(): void
    {
        $creator = User::factory()->create(['name' => 'Sara Designer', 'role' => 'creator']);
        CreatorProfile::create([
            'user_id' => $creator->id,
            'username' => 'sara-designer',
            'headline' => 'Especialista em Midjourney e Design com IA',
            'is_verified' => true,
        ]);

        $listRes = $this->getJson('/api/v1/creators');
        $listRes->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonFragment(['username' => 'sara-designer']);

        $profileRes = $this->getJson('/api/v1/creators/sara-designer');
        $profileRes->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'creator' => [
                        'username' => 'sara-designer',
                        'name' => 'Sara Designer',
                        'is_verified' => true,
                    ],
                ],
            ]);
    }
}
