<?php

use App\Models\Category;
use App\Models\Destination;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('homepage only shows map pins for destinations with coordinates and a published post', function () {
    $author = User::factory()->create([
        'role' => 'master',
        'status' => 'active',
    ]);

    $category = Category::create([
        'name' => 'Travel Diary',
        'slug' => 'travel-diary',
    ]);

    $mappedDestination = Destination::create([
        'title' => 'Medellin',
        'slug' => 'medellin',
        'country' => 'Colombia',
        'latitude' => 6.2442,
        'longitude' => -75.5812,
    ]);

    $missingCoordinates = Destination::create([
        'title' => 'Isla Fuerte',
        'slug' => 'isla-fuerte',
        'country' => 'Colombia',
    ]);

    Post::create([
        'user_id' => $author->id,
        'destination_id' => $mappedDestination->id,
        'category_id' => $category->id,
        'title' => 'Medellin verhaal',
        'slug' => 'medellin-verhaal',
        'excerpt' => 'Een verhaal in de stad.',
        'body' => 'De inhoud van het verhaal.',
        'status' => 'published',
    ]);

    Post::create([
        'user_id' => $author->id,
        'destination_id' => $missingCoordinates->id,
        'category_id' => $category->id,
        'title' => 'Verborgen eilandverhaal',
        'slug' => 'verborgen-eilandverhaal',
        'body' => 'Deze post heeft geen coordinaten op de bestemming.',
        'status' => 'published',
    ]);

    $response = $this->get('/');

    $response->assertInertia(fn (Assert $page) => $page
        ->component('Home')
        ->has('mapLocations', 1)
        ->where('mapLocations.0.title', 'Medellin')
        ->where('mapLocations.0.featured_post.slug', 'medellin-verhaal')
        ->where('destinations.0.slug', 'medellin')
    );
});
