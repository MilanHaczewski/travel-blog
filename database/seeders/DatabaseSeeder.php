<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Comment;
use App\Models\Destination;
use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::firstOrCreate([
            'email' => env('MASTER_ADMIN_EMAIL', 'master@example.com'),
        ], [
            'name' => env('MASTER_ADMIN_NAME', 'Master Admin'),
            'password' => bcrypt(env('MASTER_ADMIN_PASSWORD', 'password')),
        ]);

        $user->update([
            'role' => 'master',
            'status' => 'active',
            'deactivated_at' => null,
            'archived_at' => null,
        ]);

        $categories = collect([
            'Travel Diary',
            'City Guide',
            'Train Travel',
            'Slow Travel',
            'Island Escape',
        ])->mapWithKeys(function (string $name) {
            return [
                $name => Category::updateOrCreate(
                    ['slug' => Str::slug($name)],
                    ['name' => $name],
                ),
            ];
        });

        $tags = collect([
            'Interrail',
            'Colombia',
            'Amsterdam',
            'Medellin',
            'Cartagena',
            'Isla Fuerte',
            'Couple Travel',
            'Train Travel',
            'Food',
            'City Walks',
        ])->mapWithKeys(function (string $name) {
            return [
                $name => Tag::updateOrCreate(
                    ['slug' => Str::slug($name)],
                    ['name' => $name],
                ),
            ];
        });

        $destinations = collect([
            [
                'title' => 'Amsterdam',
                'country' => 'Nederland',
                'continent' => 'Europa',
                'city' => 'Amsterdam',
                'description' => 'De stad waar het allemaal begon: stations, grachten en een onverwachte eerste klik.',
                'cover_image' => 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1400&q=80',
                'latitude' => 52.3676,
                'longitude' => 4.9041,
            ],
            [
                'title' => 'Medellin',
                'country' => 'Colombia',
                'continent' => 'Zuid-Amerika',
                'city' => 'Medellin',
                'description' => 'Juliana haar thuisstad, vol cable cars, uitzichtpunten en buurten met een eigen ritme.',
                'cover_image' => 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=80',
                'latitude' => 6.2442,
                'longitude' => -75.5812,
            ],
            [
                'title' => 'Cartagena',
                'country' => 'Colombia',
                'continent' => 'Zuid-Amerika',
                'city' => 'Cartagena',
                'description' => 'Warme avonden, kleurrijke straten en een reis die een nieuw hoofdstuk inluidde.',
                'cover_image' => 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=1400&q=80',
                'latitude' => 10.3910,
                'longitude' => -75.4794,
            ],
            [
                'title' => 'Isla Fuerte',
                'country' => 'Colombia',
                'continent' => 'Zuid-Amerika',
                'city' => null,
                'description' => 'Een klein Caribisch eiland waar alles vertraagt en de zee de toon zet.',
                'cover_image' => 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1400&q=80',
                'latitude' => 9.3859,
                'longitude' => -76.1767,
            ],
            [
                'title' => 'Praag',
                'country' => 'Tsjechie',
                'continent' => 'Europa',
                'city' => 'Praag',
                'description' => 'Kasseien, stations en de sfeer van een treinreis die onderweg steeds beter wordt.',
                'cover_image' => 'https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=1400&q=80',
                'latitude' => 50.0755,
                'longitude' => 14.4378,
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
                'title' => 'De eerste keer samen in Amsterdam',
                'excerpt' => 'Een onverwachte ontmoeting rond een busstation, een paar dagen samen in de stad en het begin van iets groters.',
                'body' => "Sommige verhalen beginnen niet met een groot plan, maar met een moment dat ineens belangrijk blijkt te worden.\n\nOnze eerste dagen samen in Amsterdam voelden licht en open. We wandelden, praatten veel en merkten hoe makkelijk het was om tijd met elkaar door te brengen.\n\nAls we terugdenken aan waar Tulips & Arepas begon, komen we steeds weer bij dat eerste hoofdstuk uit.",
                'destination' => 'Amsterdam',
                'category' => 'Travel Diary',
                'tags' => ['Amsterdam', 'Couple Travel', 'City Walks'],
                'cover_image' => 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=1400&q=80',
                'published_at' => Carbon::now()->subDays(18),
            ],
            [
                'title' => 'Van Medellin naar Cartagena: de reis waar we officieel samen begonnen',
                'excerpt' => 'Een Colombiaanse reis vol warmte, kleur en het gevoel dat alles plots heel duidelijk werd.',
                'body' => "Colombia was niet alleen decor, maar ook een wezenlijk onderdeel van hoe onze relatie groeide.\n\nTijdens een gezamenlijke reis naar Cartagena werd helder dat wat we samen voelden ook echt een nieuw hoofdstuk mocht zijn. De stad gaf het moment iets feestelijks: warmte op straat, avonden die bleven hangen en een soort lichtheid die je onthoudt.\n\nVoor ons blijft dit een van die reizen waar gevoel en plek helemaal samenvielen.",
                'destination' => 'Cartagena',
                'category' => 'Travel Diary',
                'tags' => ['Colombia', 'Cartagena', 'Couple Travel'],
                'cover_image' => 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=1400&q=80',
                'published_at' => Carbon::now()->subDays(14),
            ],
            [
                'title' => 'Medellin door Juliana haar ogen',
                'excerpt' => 'Niet alleen de bekende plekken, maar juist het persoonlijke gevoel van terug zijn in haar stad.',
                'body' => "Medellin is voor ons niet zomaar een bestemming, maar ook een plek met herinneringen, familiegevoel en verhalen die veel dichterbij komen.\n\nDoor Juliana zie ik de stad anders: minder als bezoeker en meer als iemand die mag meekijken in haar dagelijkse wereld.\n\nDat maakt deze verhalen persoonlijker dan een gewone city guide ooit zou zijn.",
                'destination' => 'Medellin',
                'category' => 'Slow Travel',
                'tags' => ['Colombia', 'Medellin', 'City Walks'],
                'cover_image' => 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=80',
                'published_at' => Carbon::now()->subDays(10),
            ],
            [
                'title' => 'Een paar dagen op Isla Fuerte',
                'excerpt' => 'Caribische rust, boottochten, warm water en het gevoel dat tijd even niet zo belangrijk is.',
                'body' => "Isla Fuerte is zo'n plek waar de dagen vanzelf trager worden.\n\nWe brachten er tijd door zonder veel plan: wandelen, zwemmen, eten, praten en gewoon kijken naar het licht op het water.\n\nPrecies dat soort momenten willen we bewaren op de site, omdat ze later vaak meer betekenen dan de strak geplande hoogtepunten.",
                'destination' => 'Isla Fuerte',
                'category' => 'Island Escape',
                'tags' => ['Colombia', 'Isla Fuerte', 'Couple Travel'],
                'cover_image' => 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80',
                'published_at' => Carbon::now()->subDays(6),
            ],
            [
                'title' => 'Interrail van Duitsland naar Tsjechie: onze treinreis samen',
                'excerpt' => 'Een verhaal over overstappen, stationskoffie, ramen vol landschap en waarom reizen per trein zo goed bij ons past.',
                'body' => "Onze treinreis door Duitsland en Tsjechie voelde vanaf het begin als precies ons soort avontuur.\n\nWe reisden langzaam, keken veel uit het raam en lieten genoeg ruimte open voor spontane stops, lange gesprekken en steden die pas onderweg echt gingen leven.\n\nJuist die combinatie van vrijheid en ritme willen we op deze blog vaker vastleggen, omdat het zo goed past bij hoe wij samen reizen.",
                'destination' => 'Praag',
                'category' => 'Train Travel',
                'tags' => ['Interrail', 'Train Travel', 'Couple Travel'],
                'cover_image' => 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1400&q=80',
                'published_at' => Carbon::now()->subDays(2),
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
                'created_at' => Carbon::now()->subDays(20 - $index),
                'updated_at' => Carbon::now()->subDays(20 - $index),
            ]);

            $post->tags()->sync(
                collect($postData['tags'])->map(fn (string $tagName) => $tags[$tagName]->id)->all()
            );
        }

        $featuredPost = Post::query()->where('slug', Str::slug('Interrail van Duitsland naar Tsjechie: onze treinreis samen'))->first();

        if ($featuredPost) {
            Comment::updateOrCreate([
                'post_id' => $featuredPost->id,
                'guest_email' => 'sanne@example.com',
            ], [
                'guest_name' => 'Sanne',
                'body' => 'Heel leuk dat jullie deze treinreis ook echt als verhaal delen. Dit voelt meteen persoonlijk.',
                'status' => 'visible',
            ]);
        }
    }
}
