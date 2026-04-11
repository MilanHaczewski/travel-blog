<?php

use App\Models\Category;
use App\Models\Destination;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

test('administrator can create a post with uploaded cover and gallery media', function () {
    Storage::fake('public');
    $tinyPng = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO7Z0x8AAAAASUVORK5CYII=');

    $admin = User::factory()->create([
        'role' => 'master',
        'status' => 'active',
    ]);

    $destination = Destination::create([
        'title' => 'Medellin',
        'slug' => 'medellin',
        'country' => 'Colombia',
    ]);

    $category = Category::create([
        'name' => 'Slow Travel',
        'slug' => 'slow-travel',
    ]);

    $response = $this->actingAs($admin)->post('/dashboard/posts', [
        'destination_id' => $destination->id,
        'category_id' => $category->id,
        'title' => 'Tulips and Arepas testpost',
        'excerpt' => 'Een testverhaal.',
        'body' => 'De inhoud van dit verhaal.',
        'status' => 'published',
        'cover_image_upload' => UploadedFile::fake()->createWithContent('cover.png', $tinyPng),
        'media_uploads' => [
            UploadedFile::fake()->createWithContent('gallery-1.png', $tinyPng),
            UploadedFile::fake()->create('clip.mp4', 500, 'video/mp4'),
        ],
    ]);

    $response->assertRedirect('/dashboard/posts');

    $this->assertDatabaseHas('posts', [
        'title' => 'Tulips and Arepas testpost',
        'status' => 'published',
    ]);

    $post = \App\Models\Post::query()->where('title', 'Tulips and Arepas testpost')->firstOrFail();

    expect($post->media()->count())->toBe(2);
    Storage::disk('public')->assertExists($post->getRawOriginal('cover_image'));
});
