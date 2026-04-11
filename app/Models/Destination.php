<?php

namespace App\Models;

use App\Support\MediaUrl;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Destination extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'country',
        'continent',
        'city',
        'description',
        'cover_image',
        'latitude',
        'longitude',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'float',
            'longitude' => 'float',
        ];
    }

    protected function coverImage(): Attribute
    {
        return Attribute::make(
            get: fn (?string $value) => MediaUrl::from($value),
        );
    }

    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }
}
