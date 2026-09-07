<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Prompt extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'uuid',
        'title',
        'slug',
        'short_description',
        'description',
        'prompt_preview',
        'prompt_content',
        'category_id',
        'sub_category_id',
        'author_id',
        'source_type',
        'prompt_type',
        'ai_tool',
        'ai_model',
        'price',
        'currency',
        'status',
        'is_featured',
        'cover_image_url',
        'view_count',
        'copy_count',
        'usage_count',
        'favorite_count',
        'average_rating',
        'reviews_count',
        'published_at',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'price' => 'decimal:2',
        'average_rating' => 'decimal:2',
        'published_at' => 'datetime',
        'view_count' => 'integer',
        'copy_count' => 'integer',
        'usage_count' => 'integer',
        'favorite_count' => 'integer',
        'reviews_count' => 'integer',
    ];

    protected static function booted(): void
    {
        static::creating(function ($prompt) {
            if (empty($prompt->uuid)) {
                $prompt->uuid = (string) Str::uuid();
            }
            if (empty($prompt->slug)) {
                $baseSlug = Str::slug($prompt->title);
                $prompt->slug = $baseSlug . '-' . Str::random(6);
            }
        });
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function subCategory(): BelongsTo
    {
        return $this->belongsTo(SubCategory::class, 'sub_category_id');
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function results(): HasMany
    {
        return $this->hasMany(PromptResult::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'prompt_tags');
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }

    public function savedBy(): HasMany
    {
        return $this->hasMany(SavedPrompt::class);
    }

    // Scopes
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published');
    }

    public function scopeOfficial(Builder $query): Builder
    {
        return $query->where('source_type', 'official');
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    public function scopeFree(Builder $query): Builder
    {
        return $query->where('prompt_type', 'free');
    }

    public function scopePremium(Builder $query): Builder
    {
        return $query->where('prompt_type', 'premium');
    }

    public function isFree(): bool
    {
        return $this->prompt_type === 'free' || (float)$this->price === 0.0;
    }

    public function isOfficial(): bool
    {
        return $this->source_type === 'official';
    }
}
