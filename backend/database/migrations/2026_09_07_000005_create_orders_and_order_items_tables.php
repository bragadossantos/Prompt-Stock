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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('order_number')->unique();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->decimal('subtotal', 12, 2);
            $table->decimal('tax', 12, 2)->default(0.00);
            $table->decimal('discount', 12, 2)->default(0.00);
            $table->decimal('total_amount', 12, 2);
            $table->string('currency', 10)->default('AOA');
            $table->string('status', 30)->default('pending'); // pending, completed, failed, refunded
            $table->string('payment_method', 50)->default('multicaixa_express'); // multicaixa_express, bank_transfer, test_gateway
            $table->string('payment_phone')->nullable();
            $table->string('payment_reference')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index('order_number');
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->foreignId('prompt_id')->constrained('prompts')->onDelete('cascade');
            $table->foreignId('creator_id')->nullable()->constrained('users')->onDelete('set null');
            $table->decimal('price', 12, 2);
            $table->string('currency', 10)->default('AOA');
            $table->decimal('creator_earnings', 12, 2)->default(0.00); // 80% if creator
            $table->decimal('platform_fee', 12, 2)->default(0.00); // 20% or 100% if official
            $table->timestamps();

            $table->index(['order_id', 'prompt_id']);
            $table->index('creator_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
    }
};
