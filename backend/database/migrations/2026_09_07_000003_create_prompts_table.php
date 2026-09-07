<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('prompts', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('title');
            $table->string('slug')->unique()->index();
            $table->string('short_description', 255);
            $table->text('description');
            $table->text('prompt_preview');
            $table->longText('prompt_content');
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->foreignId('sub_category_id')->nullable()->constrained('subcategories')->nullOnDelete();
            $table->foreignId('author_id')->constrained('users')->onDelete('cascade');
            $table->string('source_type')->default('official')->index(); // official, creator
            $table->string('prompt_type')->default('free')->index(); // free, premium, package, subscription
            $table->string('ai_tool')->default('ChatGPT')->index(); // Midjourney, ChatGPT, Claude, DALL-E, etc.
            $table->string('ai_model')->nullable(); // GPT-4o, v6.1, Claude 3.5 Sonnet
            $table->decimal('price', 10, 2)->default(0.00);
            $table->string('currency', 10)->default('AOA');
            $table->string('status')->default('published')->index(); // draft, pending_review, approved, published, rejected, archived
            $table->boolean('is_featured')->default(false)->index();
            $table->string('cover_image_url')->nullable();

            // Counters and Metrics
            $table->unsignedBigInteger('view_count')->default(0);
            $table->unsignedBigInteger('copy_count')->default(0);
            $table->unsignedBigInteger('usage_count')->default(0);
            $table->unsignedBigInteger('favorite_count')->default(0);
            $table->decimal('average_rating', 3, 2)->default(0.00);
            $table->unsignedInteger('reviews_count')->default(0);

            $table->timestamp('published_at')->nullable()->index();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('prompt_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('prompt_id')->constrained('prompts')->onDelete('cascade');
            $table->text('result_text')->nullable();
            $table->string('result_image_url')->nullable();
            $table->string('ai_tool')->nullable();
            $table->string('ai_model')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('prompt_tags', function (Blueprint $table) {
            $table->foreignId('prompt_id')->constrained('prompts')->onDelete('cascade');
            $table->foreignId('tag_id')->constrained('tags')->onDelete('cascade');
            $table->primary(['prompt_id', 'tag_id']);
        });

        Schema::create('favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('prompt_id')->constrained('prompts')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['user_id', 'prompt_id']);
        });

        Schema::create('saved_prompts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('prompt_id')->constrained('prompts')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['user_id', 'prompt_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('saved_prompts');
        Schema::dropIfExists('favorites');
        Schema::dropIfExists('prompt_tags');
        Schema::dropIfExists('prompt_results');
        Schema::dropIfExists('prompts');
    }
};
