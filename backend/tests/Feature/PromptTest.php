<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Prompt;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PromptTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
    }

    public function test_can_list_published_prompts(): void
    {
        $category = Category::factory()->create();
        $author = User::factory()->create();

        Prompt::create([
            'title' => 'Prompt de Teste',
            'slug' => 'prompt-de-teste',
            'short_description' => 'Breve descrição de teste',
            'description' => 'Descrição detalhada',
            'prompt_preview' => 'Prévia do prompt',
            'prompt_content' => 'Conteúdo secreto',
            'category_id' => $category->id,
            'author_id' => $author->id,
            'source_type' => 'official',
            'prompt_type' => 'free',
            'status' => 'published',
        ]);

        $response = $this->getJson('/api/v1/prompts');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => ['id', 'uuid', 'title', 'slug', 'category', 'author'],
                ],
                'pagination',
            ]);
    }

    public function test_free_prompt_exposes_full_content(): void
    {
        $category = Category::factory()->create();
        $author = User::factory()->create();

        $prompt = Prompt::create([
            'title' => 'Prompt Gratuito',
            'slug' => 'prompt-gratuito',
            'short_description' => 'Curto',
            'description' => 'Longo',
            'prompt_preview' => 'Prévia pública',
            'prompt_content' => 'Conteúdo total gratuito liberado',
            'category_id' => $category->id,
            'author_id' => $author->id,
            'prompt_type' => 'free',
            'status' => 'published',
        ]);

        $response = $this->getJson("/api/v1/prompts/{$prompt->slug}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'prompt_content' => 'Conteúdo total gratuito liberado',
                    'is_locked' => false,
                ],
            ]);
    }

    public function test_premium_prompt_hides_content_from_unauthorized_users(): void
    {
        $category = Category::factory()->create();
        $author = User::factory()->create();

        $prompt = Prompt::create([
            'title' => 'Prompt Pago Premium',
            'slug' => 'prompt-pago-premium',
            'short_description' => 'Curto',
            'description' => 'Longo',
            'prompt_preview' => 'Prévia pública visível',
            'prompt_content' => 'Segredo industrial protegido por pagamento',
            'category_id' => $category->id,
            'author_id' => $author->id,
            'prompt_type' => 'premium',
            'price' => 5000.00,
            'status' => 'published',
        ]);

        $response = $this->getJson("/api/v1/prompts/{$prompt->slug}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'prompt_preview' => 'Prévia pública visível',
                    'prompt_content' => null,
                    'is_locked' => true,
                ],
            ]);
    }

    public function test_admin_can_view_premium_prompt_content(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $category = Category::factory()->create();
        $author = User::factory()->create();

        $prompt = Prompt::create([
            'title' => 'Prompt Pago Premium Admin',
            'slug' => 'prompt-pago-premium-admin',
            'short_description' => 'Curto',
            'description' => 'Longo',
            'prompt_preview' => 'Prévia',
            'prompt_content' => 'Segredo liberado para Admin',
            'category_id' => $category->id,
            'author_id' => $author->id,
            'prompt_type' => 'premium',
            'price' => 5000.00,
            'status' => 'published',
        ]);

        $token = $admin->createToken('admin-token')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson("/api/v1/prompts/{$prompt->slug}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'prompt_content' => 'Segredo liberado para Admin',
                    'is_locked' => false,
                ],
            ]);
    }

    public function test_can_increment_copy_count(): void
    {
        $category = Category::factory()->create();
        $author = User::factory()->create();

        $prompt = Prompt::create([
            'title' => 'Prompt para Cópia',
            'slug' => 'prompt-para-copia',
            'short_description' => 'Curto',
            'description' => 'Longo',
            'prompt_preview' => 'Prévia',
            'prompt_content' => 'Conteúdo para copiar',
            'category_id' => $category->id,
            'author_id' => $author->id,
            'prompt_type' => 'free',
            'copy_count' => 5,
            'usage_count' => 3,
            'status' => 'published',
        ]);

        $response = $this->postJson("/api/v1/prompts/{$prompt->id}/copy");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'copy_count' => 6,
                    'usage_count' => 4,
                ],
            ]);

        $this->assertEquals(6, $prompt->fresh()->copy_count);
    }

    public function test_authenticated_user_can_toggle_favorite_and_save_to_library(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $category = Category::factory()->create();
        $prompt = Prompt::create([
            'title' => 'Prompt Favorito',
            'slug' => 'prompt-favorito',
            'short_description' => 'Curto',
            'description' => 'Longo',
            'prompt_preview' => 'Prévia',
            'prompt_content' => 'Conteúdo',
            'category_id' => $category->id,
            'author_id' => $user->id,
            'prompt_type' => 'free',
            'favorite_count' => 0,
            'status' => 'published',
        ]);

        // Toggle Favorite -> Add
        $res1 = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson("/api/v1/prompts/{$prompt->id}/favorite");

        $res1->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => ['is_favorited' => true, 'favorite_count' => 1],
            ]);

        // Toggle Save -> Add to Library
        $res2 = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson("/api/v1/prompts/{$prompt->id}/save");

        $res2->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => ['is_saved' => true],
            ]);

        // Check Library
        $libRes = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/v1/library');

        $libRes->assertStatus(200)
            ->assertJsonCount(1, 'data.favorites')
            ->assertJsonCount(1, 'data.saved');
    }
}
