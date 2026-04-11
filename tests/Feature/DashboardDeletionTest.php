<?php

use App\Models\Category;
use App\Models\Destination;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

test('administrator can delete a post and its uploaded media from the dashboard', function () {
    Storage::fake('public');
    $tinyPng = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO7Z0x8AAAAASUVORK5CYII=');

    $admin = User::factory()->create([
        'role' => 'master',
        'status' => 'active',
    ]);

    $destination = Destination::create([
        'title' => 'Praag',
        'slug' => 'praag',
        'country' => 'Tsjechie',
    ]);

    $category = Category::create([
        'name' => 'Train Travel',
        'slug' => 'train-travel',
    ]);

    Storage::disk('public')->put('post-covers/test-cover.png', $tinyPng);
    Storage::disk('public')->put('posts/1/gallery-1.png', $tinyPng);

    $post = Post::create([
        'user_id' => $admin->id,
        'destination_id' => $destination->id,
        'category_id' => $category->id,
        'title' => 'Te verwijderen post',
        'slug' => 'te-verwijderen-post',
        'body' => 'Deze post wordt verwijderd.',
        'cover_image' => 'post-covers/test-cover.png',
        'status' => 'draft',
    ]);

    $post->media()->create([
        'type' => 'image',
        'path' => 'posts/1/gallery-1.png',
        'original_name' => 'gallery-1.png',
        'sort_order' => 1,
    ]);

    $response = $this->actingAs($admin)->delete("/dashboard/posts/{$post->id}");

    $response->assertRedirect('/dashboard/posts');
    $this->assertDatabaseMissing('posts', ['id' => $post->id]);
    Storage::disk('public')->assertMissing('post-covers/test-cover.png');
    Storage::disk('public')->assertMissing('posts/1/gallery-1.png');
});

test('administrator can delete a destination and its related posts from the dashboard', function () {
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
        'continent' => 'Zuid-Amerika',
    ]);

    $category = Category::create([
        'name' => 'Travel Diary',
        'slug' => 'travel-diary',
    ]);

    Storage::disk('public')->put('post-covers/medellin.png', $tinyPng);

    $post = Post::create([
        'user_id' => $admin->id,
        'destination_id' => $destination->id,
        'category_id' => $category->id,
        'title' => 'Medellin verhaal',
        'slug' => 'medellin-verhaal',
        'body' => 'Een verhaal dat mee verwijderd moet worden.',
        'cover_image' => 'post-covers/medellin.png',
        'status' => 'published',
    ]);

    $response = $this->actingAs($admin)->delete("/dashboard/destinations/{$destination->id}");

    $response->assertRedirect('/dashboard/destinations');
    $this->assertDatabaseMissing('destinations', ['id' => $destination->id]);
    $this->assertDatabaseMissing('posts', ['id' => $post->id]);
    Storage::disk('public')->assertMissing('post-covers/medellin.png');
});
