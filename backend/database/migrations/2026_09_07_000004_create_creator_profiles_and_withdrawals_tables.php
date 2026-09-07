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
        Schema::create('creator_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->onDelete('cascade');
            $table->string('username')->unique()->index();
            $table->string('headline')->nullable();
            $table->text('bio')->nullable();
            $table->string('cover_image_url')->nullable();
            $table->json('social_links')->nullable();
            $table->decimal('available_balance', 10, 2)->default(0.00);
            $table->decimal('pending_balance', 10, 2)->default(0.00);
            $table->decimal('withdrawn_balance', 10, 2)->default(0.00);
            $table->boolean('is_verified')->default(false)->index();
            $table->unsignedInteger('total_sales_count')->default(0);
            $table->timestamps();
        });

        Schema::create('creator_withdrawals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->decimal('amount', 10, 2);
            $table->string('currency', 10)->default('AOA');
            $table->string('payment_method')->default('multicaixa_express');
            $table->string('account_details'); // IBAN ou Telefone Multicaixa Express
            $table->string('status')->default('pending')->index(); // pending, approved, paid, rejected
            $table->text('admin_notes')->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('creator_withdrawals');
        Schema::dropIfExists('creator_profiles');
    }
};
