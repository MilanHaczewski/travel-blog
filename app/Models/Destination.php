<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Destination extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'country',
        'city',
        'description',
        'cover_image',
    ];

    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }
}
