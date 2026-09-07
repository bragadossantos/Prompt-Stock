<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CreatorProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'username',
        'headline',
        'bio',
        'cover_image_url',
        'social_links',
        'available_balance',
        'pending_balance',
        'withdrawn_balance',
        'is_verified',
        'total_sales_count',
    ];

    protected $casts = [
        'social_links' => 'array',
        'available_balance' => 'decimal:2',
        'pending_balance' => 'decimal:2',
        'withdrawn_balance' => 'decimal:2',
        'is_verified' => 'boolean',
        'total_sales_count' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
