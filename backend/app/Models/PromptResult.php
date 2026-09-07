<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PromptResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'prompt_id',
        'result_text',
        'result_image_url',
        'ai_tool',
        'ai_model',
        'notes',
    ];

    public function prompt(): BelongsTo
    {
        return $this->belongsTo(Prompt::class);
    }
}
