<?php

use App\Models\Category;
use App\Models\Destination;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('visitor can place a comment on a published post', function () {
    $author = User::factory()->create([
        'role' => 'master',
        'status' => 'active',
    ]);

    $destination = Destination::create([
        'title' => 'Lissabon',
        'slug' => 'lissabon',
        'country' => 'Portugal',
    ]);

    $category = Category::create([
        'name' => 'City Guide',
        'slug' => 'city-guide',
    ]);

    $post = Post::create([
        'user_id' => $author->id,
        'destination_id' => $destination->id,
        'category_id' => $category->id,
        'title' => 'Een verhaal',
        'slug' => 'een-verhaal',
        'body' => 'Inhoud van het verhaal',
        'status' => 'published',
    ]);

    $response = $this->post("/posts/{$post->slug}/comments", [
        'guest_name' => 'Lezer',
        'guest_email' => 'lezer@example.com',
        'body' => 'Wat een mooi verhaal.',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('comments', [
        'post_id' => $post->id,
        'guest_name' => 'Lezer',
        'guest_email' => 'lezer@example.com',
        'body' => 'Wat een mooi verhaal.',
    ]);
});
