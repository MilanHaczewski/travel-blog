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
        'title_translations',
        'slug',
        'country',
        'country_translations',
        'continent',
        'city',
        'city_translations',
        'description',
        'description_translations',
        'cover_image',
        'latitude',
        'longitude',
    ];

    protected function casts(): array
    {
        return [
            'title_translations' => 'array',
            'country_translations' => 'array',
            'city_translations' => 'array',
            'description_translations' => 'array',
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
