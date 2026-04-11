<?php

use App\Models\Category;
use App\Models\Destination;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('administrator can store multilingual destinations and posts', function () {
    $admin = User::factory()->create([
        'role' => 'master',
        'status' => 'active',
    ]);

    $category = Category::create([
        'name' => 'Travel Diary',
        'slug' => 'travel-diary',
    ]);

    $this->actingAs($admin)->post('/dashboard/destinations', [
        'title_translations' => [
            'nl' => 'Praag',
            'en' => 'Prague',
            'es' => 'Praga',
        ],
        'country_translations' => [
            'nl' => 'Tsjechie',
            'en' => 'Czech Republic',
            'es' => 'Republica Checa',
        ],
        'continent' => 'Europa',
        'city_translations' => [
            'nl' => 'Praag',
            'en' => 'Prague',
            'es' => 'Praga',
        ],
        'description_translations' => [
            'nl' => 'Een stad vol bruggen en treinverhalen.',
            'en' => 'A city full of bridges and train stories.',
            'es' => 'Una ciudad llena de puentes e historias de tren.',
        ],
    ])->assertRedirect('/dashboard/destinations');

    $destination = Destination::query()->firstOrFail();

    expect($destination->title_translations['en'])->toBe('Prague');
    expect($destination->country_translations['es'])->toBe('Republica Checa');

    $this->actingAs($admin)->post('/dashboard/posts', [
        'destination_id' => $destination->id,
        'category_id' => $category->id,
        'title_translations' => [
            'nl' => 'Met de trein naar Praag',
            'en' => 'Taking the train to Prague',
            'es' => 'Tomando el tren a Praga',
        ],
        'excerpt_translations' => [
            'nl' => 'Een eerste meertalig verhaal.',
            'en' => 'A first multilingual story.',
            'es' => 'Una primera historia multilingue.',
        ],
        'body_translations' => [
            'nl' => "We stapten in Nederland op de trein en eindigden in Praag.\n\nDit verhaal staat nu in drie talen klaar.",
            'en' => "We boarded the train in the Netherlands and ended in Prague.\n\nThis story is now available in three languages.",
            'es' => "Nos subimos al tren en Paises Bajos y terminamos en Praga.\n\nEsta historia ya esta disponible en tres idiomas.",
        ],
        'status' => 'published',
    ])->assertRedirect('/dashboard/posts');

    $post = Post::query()->firstOrFail();

    expect($post->title_translations['es'])->toBe('Tomando el tren a Praga');
    expect($post->body_translations['en'])->toContain('available in three languages');

    $this->get("/posts/{$post->slug}")
        ->assertInertia(fn (Assert $page) => $page
            ->component('posts/Show')
            ->where('post.title_translations.en', 'Taking the train to Prague')
            ->where('post.destination.title_translations.es', 'Praga'));
});
