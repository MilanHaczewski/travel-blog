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
        $localized = fn (string $nl, ?string $en = null, ?string $es = null): array => array_filter([
            'nl' => $nl,
            'en' => $en,
            'es' => $es,
        ], fn (?string $value) => filled($value));

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

        $tagTranslations = [
            'Interrail' => $localized('Interrail', 'Interrail', 'Interrail'),
            'Colombia' => $localized('Colombia', 'Colombia', 'Colombia'),
            'Amsterdam' => $localized('Amsterdam', 'Amsterdam', 'Amsterdam'),
            'Medellin' => $localized('Medellin', 'Medellin', 'Medellin'),
            'Cartagena' => $localized('Cartagena', 'Cartagena', 'Cartagena'),
            'Isla Fuerte' => $localized('Isla Fuerte', 'Isla Fuerte', 'Isla Fuerte'),
            'Couple Travel' => $localized('Samen reizen', 'Couple travel', 'Viaje en pareja'),
            'Train Travel' => $localized('Treinreis', 'Train travel', 'Viaje en tren'),
            'Food' => $localized('Eten', 'Food', 'Comida'),
            'City Walks' => $localized('Stadswandelingen', 'City walks', 'Caminatas por la ciudad'),
        ];

        $tags = collect(array_keys($tagTranslations))->mapWithKeys(function (string $name) use ($tagTranslations) {
            return [
                $name => Tag::updateOrCreate(
                    ['slug' => Str::slug($name)],
                    [
                        'name' => $name,
                        'name_translations' => $tagTranslations[$name],
                    ],
                ),
            ];
        });

        $destinations = collect([
            [
                'title' => 'Amsterdam',
                'title_translations' => $localized('Amsterdam', 'Amsterdam', 'Amsterdam'),
                'country' => 'Nederland',
                'country_translations' => $localized('Nederland', 'Netherlands', 'Paises Bajos'),
                'continent' => 'Europa',
                'city' => 'Amsterdam',
                'city_translations' => $localized('Amsterdam', 'Amsterdam', 'Amsterdam'),
                'description' => 'De stad waar het allemaal begon: stations, grachten en een onverwachte eerste klik.',
                'description_translations' => $localized(
                    'De stad waar het allemaal begon: stations, grachten en een onverwachte eerste klik.',
                    'The city where it all began: stations, canals and an unexpected first spark.',
                    'La ciudad donde empezo todo: estaciones, canales y una primera chispa inesperada.',
                ),
                'cover_image' => 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1400&q=80',
                'latitude' => 52.3676,
                'longitude' => 4.9041,
            ],
            [
                'title' => 'Medellin',
                'title_translations' => $localized('Medellin', 'Medellin', 'Medellin'),
                'country' => 'Colombia',
                'country_translations' => $localized('Colombia', 'Colombia', 'Colombia'),
                'continent' => 'Zuid-Amerika',
                'city' => 'Medellin',
                'city_translations' => $localized('Medellin', 'Medellin', 'Medellin'),
                'description' => 'Juliana haar thuisstad, vol cable cars, uitzichtpunten en buurten met een eigen ritme.',
                'description_translations' => $localized(
                    'Juliana haar thuisstad, vol cable cars, uitzichtpunten en buurten met een eigen ritme.',
                    "Juliana's home city, full of cable cars, viewpoints and neighborhoods with their own rhythm.",
                    'La ciudad de Juliana, llena de metrocables, miradores y barrios con su propio ritmo.',
                ),
                'cover_image' => 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=80',
                'latitude' => 6.2442,
                'longitude' => -75.5812,
            ],
            [
                'title' => 'Cartagena',
                'title_translations' => $localized('Cartagena', 'Cartagena', 'Cartagena'),
                'country' => 'Colombia',
                'country_translations' => $localized('Colombia', 'Colombia', 'Colombia'),
                'continent' => 'Zuid-Amerika',
                'city' => 'Cartagena',
                'city_translations' => $localized('Cartagena', 'Cartagena', 'Cartagena'),
                'description' => 'Warme avonden, kleurrijke straten en een reis die een nieuw hoofdstuk inluidde.',
                'description_translations' => $localized(
                    'Warme avonden, kleurrijke straten en een reis die een nieuw hoofdstuk inluidde.',
                    'Warm evenings, colorful streets and a trip that opened a new chapter.',
                    'Noches calidas, calles coloridas y un viaje que abrio un nuevo capitulo.',
                ),
                'cover_image' => 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=1400&q=80',
                'latitude' => 10.3910,
                'longitude' => -75.4794,
            ],
            [
                'title' => 'Isla Fuerte',
                'title_translations' => $localized('Isla Fuerte', 'Isla Fuerte', 'Isla Fuerte'),
                'country' => 'Colombia',
                'country_translations' => $localized('Colombia', 'Colombia', 'Colombia'),
                'continent' => 'Zuid-Amerika',
                'city' => null,
                'city_translations' => $localized('Isla Fuerte', 'Isla Fuerte', 'Isla Fuerte'),
                'description' => 'Een klein Caribisch eiland waar alles vertraagt en de zee de toon zet.',
                'description_translations' => $localized(
                    'Een klein Caribisch eiland waar alles vertraagt en de zee de toon zet.',
                    'A small Caribbean island where everything slows down and the sea sets the pace.',
                    'Una pequena isla caribena donde todo baja el ritmo y el mar marca el paso.',
                ),
                'cover_image' => 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1400&q=80',
                'latitude' => 9.3859,
                'longitude' => -76.1767,
            ],
            [
                'title' => 'Praag',
                'title_translations' => $localized('Praag', 'Prague', 'Praga'),
                'country' => 'Tsjechie',
                'country_translations' => $localized('Tsjechie', 'Czech Republic', 'Republica Checa'),
                'continent' => 'Europa',
                'city' => 'Praag',
                'city_translations' => $localized('Praag', 'Prague', 'Praga'),
                'description' => 'Kasseien, stations en de sfeer van een treinreis die onderweg steeds beter wordt.',
                'description_translations' => $localized(
                    'Kasseien, stations en de sfeer van een treinreis die onderweg steeds beter wordt.',
                    'Cobblestones, stations and the feeling of a train trip that keeps getting better on the way.',
                    'Adoquines, estaciones y la sensacion de un viaje en tren que se pone mejor en el camino.',
                ),
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
                'title_translations' => $localized(
                    'De eerste keer samen in Amsterdam',
                    'The first time together in Amsterdam',
                    'La primera vez juntos en Amsterdam',
                ),
                'excerpt' => 'Een onverwachte ontmoeting rond een busstation, een paar dagen samen in de stad en het begin van iets groters.',
                'excerpt_translations' => $localized(
                    'Een onverwachte ontmoeting rond een busstation, een paar dagen samen in de stad en het begin van iets groters.',
                    'An unexpected meeting near a bus station, a few days together in the city and the start of something bigger.',
                    'Un encuentro inesperado cerca de una estacion de buses, unos dias juntos en la ciudad y el comienzo de algo mas grande.',
                ),
                'body' => "Sommige verhalen beginnen niet met een groot plan, maar met een moment dat ineens belangrijk blijkt te worden.\n\nOnze eerste dagen samen in Amsterdam voelden licht en open. We wandelden, praatten veel en merkten hoe makkelijk het was om tijd met elkaar door te brengen.\n\nAls we terugdenken aan waar Tulips & Arepas begon, komen we steeds weer bij dat eerste hoofdstuk uit.",
                'body_translations' => $localized(
                    "Sommige verhalen beginnen niet met een groot plan, maar met een moment dat ineens belangrijk blijkt te worden.\n\nOnze eerste dagen samen in Amsterdam voelden licht en open. We wandelden, praatten veel en merkten hoe makkelijk het was om tijd met elkaar door te brengen.\n\nAls we terugdenken aan waar Tulips & Arepas begon, komen we steeds weer bij dat eerste hoofdstuk uit.",
                    "Some stories do not start with a big plan, but with a moment that suddenly turns out to matter.\n\nOur first days together in Amsterdam felt light and open. We walked, talked a lot and noticed how easy it was to spend time together.\n\nWhen we think back to where Tulips & Arepas began, we always end up at that first chapter.",
                    "Algunas historias no empiezan con un gran plan, sino con un momento que de repente se vuelve importante.\n\nNuestros primeros dias juntos en Amsterdam se sintieron ligeros y abiertos. Caminamos, hablamos mucho y notamos lo facil que era pasar tiempo juntos.\n\nCuando pensamos en donde empezo Tulips & Arepas, siempre volvemos a ese primer capitulo.",
                ),
                'destination' => 'Amsterdam',
                'category' => 'Travel Diary',
                'tags' => ['Amsterdam', 'Couple Travel', 'City Walks'],
                'cover_image' => 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=1400&q=80',
                'published_at' => Carbon::now()->subDays(18),
            ],
            [
                'title' => 'Van Medellin naar Cartagena: de reis waar we officieel samen begonnen',
                'title_translations' => $localized(
                    'Van Medellin naar Cartagena: de reis waar we officieel samen begonnen',
                    'From Medellin to Cartagena: the trip where we officially began together',
                    'De Medellin a Cartagena: el viaje donde oficialmente comenzamos juntos',
                ),
                'excerpt' => 'Een Colombiaanse reis vol warmte, kleur en het gevoel dat alles plots heel duidelijk werd.',
                'excerpt_translations' => $localized(
                    'Een Colombiaanse reis vol warmte, kleur en het gevoel dat alles plots heel duidelijk werd.',
                    'A Colombian trip full of warmth, color and the feeling that everything suddenly became clear.',
                    'Un viaje por Colombia lleno de calor, color y la sensacion de que todo de repente quedo claro.',
                ),
                'body' => "Colombia was niet alleen decor, maar ook een wezenlijk onderdeel van hoe onze relatie groeide.\n\nTijdens een gezamenlijke reis naar Cartagena werd helder dat wat we samen voelden ook echt een nieuw hoofdstuk mocht zijn. De stad gaf het moment iets feestelijks: warmte op straat, avonden die bleven hangen en een soort lichtheid die je onthoudt.\n\nVoor ons blijft dit een van die reizen waar gevoel en plek helemaal samenvielen.",
                'body_translations' => $localized(
                    "Colombia was niet alleen decor, maar ook een wezenlijk onderdeel van hoe onze relatie groeide.\n\nTijdens een gezamenlijke reis naar Cartagena werd helder dat wat we samen voelden ook echt een nieuw hoofdstuk mocht zijn. De stad gaf het moment iets feestelijks: warmte op straat, avonden die bleven hangen en een soort lichtheid die je onthoudt.\n\nVoor ons blijft dit een van die reizen waar gevoel en plek helemaal samenvielen.",
                    "Colombia was not just the setting, but an essential part of how our relationship grew.\n\nDuring a trip together to Cartagena it became clear that what we felt deserved to be a real new chapter. The city gave that moment something celebratory: warmth in the streets, evenings that lingered and a kind of lightness you remember.\n\nFor us this remains one of those trips where place and feeling fully lined up.",
                    "Colombia no fue solo el escenario, sino una parte esencial de como crecio nuestra relacion.\n\nDurante un viaje juntos a Cartagena se hizo claro que lo que sentiamos merecia ser un nuevo capitulo de verdad. La ciudad le dio al momento algo festivo: calor en las calles, noches que se quedaban contigo y una ligereza dificil de olvidar.\n\nPara nosotros sigue siendo uno de esos viajes donde el lugar y lo que sentiamos coincidieron por completo.",
                ),
                'destination' => 'Cartagena',
                'category' => 'Travel Diary',
                'tags' => ['Colombia', 'Cartagena', 'Couple Travel'],
                'cover_image' => 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=1400&q=80',
                'published_at' => Carbon::now()->subDays(14),
            ],
            [
                'title' => 'Medellin door Juliana haar ogen',
                'title_translations' => $localized(
                    'Medellin door Juliana haar ogen',
                    "Medellin through Juliana's eyes",
                    'Medellin a traves de los ojos de Juliana',
                ),
                'excerpt' => 'Niet alleen de bekende plekken, maar juist het persoonlijke gevoel van terug zijn in haar stad.',
                'excerpt_translations' => $localized(
                    'Niet alleen de bekende plekken, maar juist het persoonlijke gevoel van terug zijn in haar stad.',
                    'Not just the well known places, but the personal feeling of being back in her city.',
                    'No solo los lugares conocidos, sino la sensacion personal de volver a su ciudad.',
                ),
                'body' => "Medellin is voor ons niet zomaar een bestemming, maar ook een plek met herinneringen, familiegevoel en verhalen die veel dichterbij komen.\n\nDoor Juliana zie ik de stad anders: minder als bezoeker en meer als iemand die mag meekijken in haar dagelijkse wereld.\n\nDat maakt deze verhalen persoonlijker dan een gewone city guide ooit zou zijn.",
                'body_translations' => $localized(
                    "Medellin is voor ons niet zomaar een bestemming, maar ook een plek met herinneringen, familiegevoel en verhalen die veel dichterbij komen.\n\nDoor Juliana zie ik de stad anders: minder als bezoeker en meer als iemand die mag meekijken in haar dagelijkse wereld.\n\nDat maakt deze verhalen persoonlijker dan een gewone city guide ooit zou zijn.",
                    "For us Medellin is not just a destination, but also a place full of memories, family feeling and stories that come much closer.\n\nThrough Juliana I see the city differently: less as a visitor and more as someone allowed to look into her everyday world.\n\nThat makes these stories more personal than any regular city guide could ever be.",
                    "Para nosotros Medellin no es solo un destino, sino tambien un lugar lleno de recuerdos, familia y historias que se sienten mucho mas cercanas.\n\nA traves de Juliana veo la ciudad diferente: menos como visitante y mas como alguien que puede mirar un poco de su mundo cotidiano.\n\nEso hace que estas historias sean mucho mas personales que una guia de ciudad cualquiera.",
                ),
                'destination' => 'Medellin',
                'category' => 'Slow Travel',
                'tags' => ['Colombia', 'Medellin', 'City Walks'],
                'cover_image' => 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=80',
                'published_at' => Carbon::now()->subDays(10),
            ],
            [
                'title' => 'Een paar dagen op Isla Fuerte',
                'title_translations' => $localized(
                    'Een paar dagen op Isla Fuerte',
                    'A few days on Isla Fuerte',
                    'Unos dias en Isla Fuerte',
                ),
                'excerpt' => 'Caribische rust, boottochten, warm water en het gevoel dat tijd even niet zo belangrijk is.',
                'excerpt_translations' => $localized(
                    'Caribische rust, boottochten, warm water en het gevoel dat tijd even niet zo belangrijk is.',
                    'Caribbean calm, boat rides, warm water and the feeling that time matters a little less.',
                    'Calma caribena, paseos en bote, agua tibia y la sensacion de que el tiempo importa un poco menos.',
                ),
                'body' => "Isla Fuerte is zo'n plek waar de dagen vanzelf trager worden.\n\nWe brachten er tijd door zonder veel plan: wandelen, zwemmen, eten, praten en gewoon kijken naar het licht op het water.\n\nPrecies dat soort momenten willen we bewaren op de site, omdat ze later vaak meer betekenen dan de strak geplande hoogtepunten.",
                'body_translations' => $localized(
                    "Isla Fuerte is zo'n plek waar de dagen vanzelf trager worden.\n\nWe brachten er tijd door zonder veel plan: wandelen, zwemmen, eten, praten en gewoon kijken naar het licht op het water.\n\nPrecies dat soort momenten willen we bewaren op de site, omdat ze later vaak meer betekenen dan de strak geplande hoogtepunten.",
                    "Isla Fuerte is one of those places where the days naturally slow down.\n\nWe spent time there without much of a plan: walking, swimming, eating, talking and simply watching the light on the water.\n\nThose are exactly the moments we want to keep on the site, because later they often mean more than the tightly planned highlights.",
                    "Isla Fuerte es uno de esos lugares donde los dias bajan el ritmo por si solos.\n\nPasamos tiempo alli sin mucho plan: caminar, nadar, comer, hablar y simplemente mirar la luz sobre el agua.\n\nJusto esos momentos son los que queremos guardar en la web, porque despues suelen significar mas que los grandes puntos del itinerario.",
                ),
                'destination' => 'Isla Fuerte',
                'category' => 'Island Escape',
                'tags' => ['Colombia', 'Isla Fuerte', 'Couple Travel'],
                'cover_image' => 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80',
                'published_at' => Carbon::now()->subDays(6),
            ],
            [
                'title' => 'Interrail van Duitsland naar Tsjechie: onze treinreis samen',
                'title_translations' => $localized(
                    'Interrail van Duitsland naar Tsjechie: onze treinreis samen',
                    'Interrail from Germany to the Czech Republic: our train trip together',
                    'Interrail de Alemania a Republica Checa: nuestro viaje juntos en tren',
                ),
                'excerpt' => 'Een verhaal over overstappen, stationskoffie, ramen vol landschap en waarom reizen per trein zo goed bij ons past.',
                'excerpt_translations' => $localized(
                    'Een verhaal over overstappen, stationskoffie, ramen vol landschap en waarom reizen per trein zo goed bij ons past.',
                    'A story about transfers, station coffee, windows full of landscapes and why train travel suits us so well.',
                    'Una historia sobre conexiones, cafe de estacion, ventanas llenas de paisaje y por que viajar en tren nos queda tan bien.',
                ),
                'body' => "Onze treinreis door Duitsland en Tsjechie voelde vanaf het begin als precies ons soort avontuur.\n\nWe reisden langzaam, keken veel uit het raam en lieten genoeg ruimte open voor spontane stops, lange gesprekken en steden die pas onderweg echt gingen leven.\n\nJuist die combinatie van vrijheid en ritme willen we op deze blog vaker vastleggen, omdat het zo goed past bij hoe wij samen reizen.",
                'body_translations' => $localized(
                    "Onze treinreis door Duitsland en Tsjechie voelde vanaf het begin als precies ons soort avontuur.\n\nWe reisden langzaam, keken veel uit het raam en lieten genoeg ruimte open voor spontane stops, lange gesprekken en steden die pas onderweg echt gingen leven.\n\nJuist die combinatie van vrijheid en ritme willen we op deze blog vaker vastleggen, omdat het zo goed past bij hoe wij samen reizen.",
                    "Our train trip through Germany and the Czech Republic felt like exactly our kind of adventure from the start.\n\nWe traveled slowly, looked out the window a lot and left enough room for spontaneous stops, long conversations and cities that only really came alive on the way.\n\nThat mix of freedom and rhythm is something we want to capture on this blog more often, because it fits the way we travel together so well.",
                    "Nuestro viaje en tren por Alemania y Republica Checa se sintio desde el principio como exactamente el tipo de aventura que va con nosotros.\n\nViajamos despacio, miramos mucho por la ventana y dejamos espacio para paradas espontaneas, conversaciones largas y ciudades que solo cobraron vida de verdad en el camino.\n\nEsa mezcla de libertad y ritmo es algo que queremos guardar mas seguido en este blog, porque encaja mucho con nuestra manera de viajar juntos.",
                ),
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
                'title_translations' => $postData['title_translations'],
                'slug' => Str::slug($postData['title']),
                'excerpt' => $postData['excerpt'],
                'excerpt_translations' => $postData['excerpt_translations'],
                'body' => $postData['body'],
                'body_translations' => $postData['body_translations'],
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
