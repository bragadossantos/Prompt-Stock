<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'uuid',
        'name',
        'email',
        'password',
        'role',
        'status',
        'avatar_url',
        'bio',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function ($user) {
            if (empty($user->uuid)) {
                $user->uuid = (string) Str::uuid();
            }
        });
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isCreator(): bool
    {
        return $this->role === 'creator' || $this->role === 'admin';
    }

    public function isRegisteredUser(): bool
    {
        return in_array($this->role, ['user', 'creator', 'admin']);
    }

    public function prompts()
    {
        return $this->hasMany(Prompt::class, 'author_id');
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    public function savedPrompts()
    {
        return $this->hasMany(SavedPrompt::class);
    }

    public function favoritePrompts()
    {
        return $this->belongsToMany(Prompt::class, 'favorites');
    }

    public function savedLibraryPrompts()
    {
        return $this->belongsToMany(Prompt::class, 'saved_prompts');
    }

    public function creatorProfile()
    {
        return $this->hasOne(CreatorProfile::class);
    }

    public function withdrawals()
    {
        return $this->hasMany(CreatorWithdrawal::class);
    }
}
