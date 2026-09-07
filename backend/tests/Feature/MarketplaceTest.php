<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\CreatorProfile;
use App\Models\Order;
use App\Models\Prompt;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class MarketplaceTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_initiate_checkout(): void
    {
        $response = $this->postJson('/api/v1/checkout', [
            'prompt_id' => 1,
            'payment_method' => 'multicaixa_express',
        ]);

        $response->assertStatus(401);
    }

    public function test_user_can_create_checkout_order_for_premium_prompt(): void
    {
        $buyer = User::factory()->create(['role' => 'user']);
        $creator = User::factory()->create(['role' => 'creator']);

        $category = Category::create([
            'name' => 'Marketing',
            'slug' => 'marketing',
            'is_active' => true,
        ]);

        $prompt = Prompt::create([
            'title' => 'Prompt Premium de Conversão',
            'slug' => 'prompt-premium-de-conversao',
            'short_description' => 'Prompt incrível',
            'description' => 'Descrição do prompt',
            'prompt_preview' => 'Prévia pública',
            'prompt_content' => 'Conteúdo ultrassecreto',
            'category_id' => $category->id,
            'author_id' => $creator->id,
            'source_type' => 'creator',
            'prompt_type' => 'premium',
            'price' => 10000.00,
            'currency' => 'AOA',
            'status' => 'published',
            'ai_tool' => 'ChatGPT',
        ]);

        Sanctum::actingAs($buyer, ['*']);

        $response = $this->postJson('/api/v1/checkout', [
            'prompt_id' => $prompt->id,
            'payment_method' => 'multicaixa_express',
            'payment_phone' => '923111222',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'order' => [
                        'total_amount' => 10000.00,
                        'currency' => 'AOA',
                        'status' => 'pending',
                        'payment_method' => 'multicaixa_express',
                    ],
                    'payment_instructions' => [
                        'type' => 'multicaixa_express',
                        'phone' => '923111222',
                    ],
                ],
            ]);

        $this->assertDatabaseHas('orders', [
            'user_id' => $buyer->id,
            'total_amount' => 10000.00,
            'status' => 'pending',
        ]);

        $this->assertDatabaseHas('order_items', [
            'prompt_id' => $prompt->id,
            'creator_id' => $creator->id,
            'price' => 10000.00,
            'creator_earnings' => 8000.00, // 80%
            'platform_fee' => 2000.00,     // 20%
        ]);
    }

    public function test_order_completion_unlocks_prompt_and_credits_creator(): void
    {
        $buyer = User::factory()->create(['role' => 'user']);
        $creator = User::factory()->create(['role' => 'creator']);

        $creatorProfile = CreatorProfile::create([
            'user_id' => $creator->id,
            'username' => 'creator_test',
            'available_balance' => 0.00,
            'pending_balance' => 0.00,
            'total_earnings' => 0.00,
            'total_sales' => 0,
        ]);

        $category = Category::create([
            'name' => 'Design',
            'slug' => 'design',
            'is_active' => true,
        ]);

        $prompt = Prompt::create([
            'title' => 'Fotografia de Produto Midjourney',
            'slug' => 'fotografia-de-produto-midjourney',
            'short_description' => 'Fotografia profissional com Midjourney',
            'description' => 'Descrição detalhada do prompt',
            'prompt_preview' => 'Prévia pública',
            'prompt_content' => 'Fórmula secreta do prompt',
            'category_id' => $category->id,
            'author_id' => $creator->id,
            'source_type' => 'creator',
            'prompt_type' => 'premium',
            'price' => 5000.00,
            'currency' => 'AOA',
            'status' => 'published',
            'ai_tool' => 'Midjourney',
        ]);

        // 1. Before purchase: Prompt is locked for buyer
        Sanctum::actingAs($buyer, ['*']);
        $beforeRes = $this->getJson("/api/v1/prompts/{$prompt->slug}");
        $beforeRes->assertStatus(200)
            ->assertJson([
                'data' => [
                    'is_locked' => true,
                    'prompt_content' => null,
                ],
            ]);

        // 2. Buyer creates order
        $checkoutRes = $this->postJson('/api/v1/checkout', [
            'prompt_id' => $prompt->id,
            'payment_method' => 'multicaixa_express',
            'payment_phone' => '923000999',
        ]);
        $orderNumber = $checkoutRes->json('data.order.order_number');

        // 3. Payment simulation / settlement
        $payRes = $this->postJson("/api/v1/orders/{$orderNumber}/pay");
        $payRes->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'status' => 'completed',
                ],
            ]);

        // 4. Creator received 80% (4,000 AOA) and 1 sale
        $creatorProfile->refresh();
        $this->assertEquals(4000.00, $creatorProfile->available_balance);
        $this->assertEquals(1, $creatorProfile->total_sales_count);

        // 5. Buyer now has prompt UNLOCKED and accessible
        $afterRes = $this->getJson("/api/v1/prompts/{$prompt->slug}");
        $afterRes->assertStatus(200)
            ->assertJson([
                'data' => [
                    'is_locked' => false,
                    'prompt_content' => 'Fórmula secreta do prompt',
                    'user_interactions' => [
                        'is_purchased' => true,
                    ],
                ],
            ]);

        // 6. Prompt appears in user's library
        $libraryRes = $this->getJson('/api/v1/library');
        $libraryRes->assertStatus(200)
            ->assertJsonFragment(['slug' => $prompt->slug]);
    }

    public function test_user_cannot_buy_already_purchased_prompt(): void
    {
        $buyer = User::factory()->create();
        $author = User::factory()->create();
        $category = Category::create(['name' => 'Tech', 'slug' => 'tech', 'is_active' => true]);

        $prompt = Prompt::create([
            'title' => 'Prompt Único',
            'slug' => 'prompt-unico',
            'short_description' => 'Prompt único para teste',
            'description' => 'Descrição detalhada do prompt',
            'prompt_preview' => 'Prévia',
            'prompt_content' => 'Segredo',
            'category_id' => $category->id,
            'author_id' => $author->id,
            'prompt_type' => 'premium',
            'price' => 2000.00,
            'status' => 'published',
            'ai_tool' => 'ChatGPT',
        ]);

        Sanctum::actingAs($buyer, ['*']);

        // First purchase and pay
        $res1 = $this->postJson('/api/v1/checkout', [
            'prompt_id' => $prompt->id,
            'payment_method' => 'bank_transfer',
        ]);
        $orderNumber = $res1->json('data.order.order_number');
        $this->postJson("/api/v1/orders/{$orderNumber}/pay");

        // Second purchase attempt must fail with validation error
        $res2 = $this->postJson('/api/v1/checkout', [
            'prompt_id' => $prompt->id,
            'payment_method' => 'bank_transfer',
        ]);

        $res2->assertStatus(422)
            ->assertJsonValidationErrors(['prompt_id']);
    }

    public function test_user_can_view_orders_history_and_details(): void
    {
        $buyer = User::factory()->create();
        $author = User::factory()->create();
        $category = Category::create(['name' => 'AI', 'slug' => 'ai', 'is_active' => true]);

        $prompt = Prompt::create([
            'title' => 'Prompt Claude',
            'slug' => 'prompt-claude',
            'short_description' => 'Prompt incrível de Claude',
            'description' => 'Descrição detalhada do prompt Claude',
            'prompt_preview' => 'Prévia',
            'prompt_content' => 'Segredo',
            'category_id' => $category->id,
            'author_id' => $author->id,
            'prompt_type' => 'premium',
            'price' => 3000.00,
            'status' => 'published',
            'ai_tool' => 'Claude',
        ]);

        Sanctum::actingAs($buyer, ['*']);

        $checkoutRes = $this->postJson('/api/v1/checkout', [
            'prompt_id' => $prompt->id,
            'payment_method' => 'bank_transfer',
        ]);
        $orderNumber = $checkoutRes->json('data.order.order_number');

        // Orders list
        $listRes = $this->getJson('/api/v1/orders');
        $listRes->assertStatus(200)
            ->assertJsonCount(1, 'data');

        // Order detail
        $detailRes = $this->getJson("/api/v1/orders/{$orderNumber}");
        $detailRes->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'order_number' => $orderNumber,
                ],
            ]);
    }

    public function test_public_can_browse_marketplace_with_filters(): void
    {
        $author = User::factory()->create();
        $category = Category::create(['name' => 'Design', 'slug' => 'design', 'is_active' => true]);

        Prompt::create([
            'title' => 'Prompt Grátis',
            'slug' => 'prompt-gratis',
            'short_description' => 'Prompt grátis básico',
            'description' => 'Descrição grátis',
            'prompt_preview' => 'Prévia',
            'prompt_content' => 'Livre',
            'category_id' => $category->id,
            'author_id' => $author->id,
            'prompt_type' => 'free',
            'price' => 0.00,
            'status' => 'published',
            'ai_tool' => 'ChatGPT',
        ]);

        Prompt::create([
            'title' => 'Prompt Caro',
            'slug' => 'prompt-caro',
            'short_description' => 'Prompt caro avançado',
            'description' => 'Descrição avançada',
            'prompt_preview' => 'Prévia',
            'prompt_content' => 'Secreto',
            'category_id' => $category->id,
            'author_id' => $author->id,
            'prompt_type' => 'premium',
            'price' => 15000.00,
            'status' => 'published',
            'ai_tool' => 'Midjourney',
        ]);

        // Filter by premium
        $premiumRes = $this->getJson('/api/v1/marketplace?prompt_type=premium');
        $premiumRes->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonFragment(['slug' => 'prompt-caro']);

        // Filter by ai_tool
        $chatGptRes = $this->getJson('/api/v1/marketplace?ai_tool=ChatGPT');
        $chatGptRes->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonFragment(['slug' => 'prompt-gratis']);
    }
}
