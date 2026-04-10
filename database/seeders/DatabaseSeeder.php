<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Destination;
use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $user = User::firstOrCreate([
            'email' => 'test@example.com',
        ], [
            'name' => 'Travel Editor',
            'password' => bcrypt('password'),
        ]);

        $categories = collect(['City Guide', 'Roadtrip', 'Slow Travel'])->mapWithKeys(function (string $name) {
            return [
                $name => Category::updateOrCreate(
                    ['slug' => Str::slug($name)],
                    ['name' => $name],
                ),
            ];
        });

        $tags = collect(['Coffee', 'Sunrise', 'Budget', 'Boutique Hotel', 'Nature'])->mapWithKeys(function (string $name) {
            return [
                $name => Tag::updateOrCreate(
                    ['slug' => Str::slug($name)],
                    ['name' => $name],
                ),
            ];
        });

        $destinations = collect([
            [
                'title' => 'Lissabon',
                'country' => 'Portugal',
                'city' => 'Lissabon',
                'description' => 'Een zonnige mix van trams, tegelgevels en uitzichtpunten boven de Taag.',
                'cover_image' => 'https://images.unsplash.com/photo-1513735492246-483525079686?auto=format&fit=crop&w=1400&q=80',
            ],
            [
                'title' => 'Bled',
                'country' => 'Slovenie',
                'city' => 'Bled',
                'description' => 'Een kalm meer, alpine lucht en rustige wandelingen langs het water.',
                'cover_image' => 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&w=1400&q=80',
            ],
            [
                'title' => 'Marrakech',
                'country' => 'Marokko',
                'city' => 'Marrakech',
                'description' => 'Warme avonden, verborgen riads en een medina vol kleur en ritme.',
                'cover_image' => 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1400&q=80',
            ],
            [
                'title' => 'Dolomieten',
                'country' => 'Italie',
                'city' => null,
                'description' => 'Bergpassen, rifugi en wandelingen die elke omweg waard zijn.',
                'cover_image' => 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',
            ],
        ])->mapWithKeys(function (array $destination) {
            return [
                $destination['title'] => Destination::updateOrCreate(
                    ['slug' => Str::slug($destination['title'])],
                    $destination + ['slug' => Str::slug($destination['title'])],
                ),
            ];
        });

        $posts = [
            [
                'title' => '48 uur in Lissabon met uitzicht, pastel de nata en tram 28',
                'excerpt' => 'Een compacte city guide vol plekken waar je langzaam wilt blijven hangen.',
                'body' => "Lissabon voelt als een stad die je meteen vertraagt.\n\nWe begonnen vroeg bij Miradouro da Senhora do Monte en lieten de stad langzaam oplichten. Daarna volgden koffie, tegels, steile straatjes en een lange middag in Alfama.\n\nDeze route is ideaal voor een eerste weekend: veel sfeer, weinig stress en genoeg ruimte om spontaan af te slaan.",
                'destination' => 'Lissabon',
                'category' => 'City Guide',
                'tags' => ['Coffee', 'Sunrise'],
                'cover_image' => 'https://images.unsplash.com/photo-1525715843408-5c6ec445fdb5?auto=format&fit=crop&w=1400&q=80',
                'published_at' => Carbon::now()->subDays(3),
            ],
            [
                'title' => 'Een rustige ochtend rond het meer van Bled',
                'excerpt' => 'Mist boven het water, korte hikes en adressen voor een lang ontbijt.',
                'body' => "Bled is op zijn mooist voor de dag echt begint.\n\nRond zonsopgang hangt er vaak mist boven het meer en lijkt het eilandje haast te zweven. Daarna is het tijd voor een korte luswandeling, een stuk kremsnita en een boottocht zonder haast.\n\nVoor slow travel is dit precies goed: weinig planning, veel sfeer.",
                'destination' => 'Bled',
                'category' => 'Slow Travel',
                'tags' => ['Nature', 'Sunrise'],
                'cover_image' => 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=80',
                'published_at' => Carbon::now()->subDays(7),
            ],
            [
                'title' => 'Roadtrip door de Dolomieten zonder gehaast schema',
                'excerpt' => 'Een route langs bergpassen, rifugi en fotostops die je spontaan wilt maken.',
                'body' => "In de Dolomieten draait alles om ritme.\n\nWe planden per dag maar een paar ankerpunten en hielden de rest open voor wandelingen, uitzichtpunten en espresso in de zon. Juist daardoor voelde de route licht en haalbaar.\n\nDeze post is handig als je bergen wilt combineren met comfort en goede stops onderweg.",
                'destination' => 'Dolomieten',
                'category' => 'Roadtrip',
                'tags' => ['Nature', 'Boutique Hotel'],
                'cover_image' => 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80',
                'published_at' => Carbon::now()->subDays(12),
            ],
        ];

        foreach ($posts as $index => $postData) {
            $post = Post::updateOrCreate([
                'slug' => Str::slug($postData['title']),
            ], [
                'user_id' => $user->id,
                'destination_id' => $destinations[$postData['destination']]->id,
                'category_id' => $categories[$postData['category']]->id,
                'title' => $postData['title'],
                'slug' => Str::slug($postData['title']),
                'excerpt' => $postData['excerpt'],
                'body' => $postData['body'],
                'cover_image' => $postData['cover_image'],
                'status' => 'published',
                'published_at' => $postData['published_at'],
                'created_at' => Carbon::now()->subDays(15 - $index),
                'updated_at' => Carbon::now()->subDays(15 - $index),
            ]);

            $post->tags()->sync(
                collect($postData['tags'])->map(fn (string $tagName) => $tags[$tagName]->id)->all()
            );
        }
    }
}
