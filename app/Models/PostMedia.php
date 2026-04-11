<?php

namespace App\Models;

use App\Support\MediaUrl;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PostMedia extends Model
{
    protected $fillable = [
        'post_id',
        'type',
        'path',
        'original_name',
        'sort_order',
    ];

    protected function path(): Attribute
    {
        return Attribute::make(
            get: fn (?string $value) => MediaUrl::from($value),
        );
    }

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }
}
