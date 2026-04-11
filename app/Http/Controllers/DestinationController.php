<?php

namespace App\Http\Controllers;

use App\Models\Destination;
use App\Support\LocalizedContent;
use App\Support\PostDeletion;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class DestinationController extends Controller
{
    public function index(): Response
    {
        $destinations = Destination::query()
            ->withCount('posts')
            ->with([
                'posts' => fn ($query) => $query
                    ->where('status', 'published')
                    ->latest('published_at')
                    ->latest()
                    ->take(3),
            ])
            ->orderBy('title')
            ->get();

        return Inertia::render('destinations/Index', [
            'destinations' => $destinations,
        ]);
    }

    public function show(string $slug): Response
    {
        $destination = Destination::query()
            ->where('slug', $slug)
            ->with([
                'posts' => fn ($query) => $query
                    ->where('status', 'published')
                    ->with(['category', 'tags'])
                    ->latest('published_at')
                    ->latest(),
            ])
            ->firstOrFail();

        return Inertia::render('destinations/Show', [
            'destination' => $destination,
        ]);
    }

    public function adminIndex(): Response
    {
        return Inertia::render('dashboard/Destinations/Index', [
            'destinations' => Destination::query()
                ->withCount('posts')
                ->latest()
                ->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('dashboard/Destinations/Form', [
            'destination' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'title_translations' => ['nullable', 'array'],
            'title_translations.*' => ['nullable', 'string', 'max:255'],
            'country' => ['nullable', 'string', 'max:255'],
            'country_translations' => ['nullable', 'array'],
            'country_translations.*' => ['nullable', 'string', 'max:255'],
            'continent' => ['nullable', 'in:Europa,Zuid-Amerika,Noord-Amerika,Azie,Afrika,Oceanie'],
            'city' => ['nullable', 'string', 'max:255'],
            'city_translations' => ['nullable', 'array'],
            'city_translations.*' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'description_translations' => ['nullable', 'array'],
            'description_translations.*' => ['nullable', 'string'],
            'cover_image' => ['nullable', 'url', 'max:2048'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
        ]);

        $data = $this->prepareLocalizedDestinationData($data);
        $data['slug'] = Str::slug($data['title']);

        Destination::create($data);

        return redirect()->route('dashboard.destinations.index');
    }

    public function edit(Destination $destination): Response
    {
        return Inertia::render('dashboard/Destinations/Form', [
            'destination' => [
                'id' => $destination->id,
                'title' => $destination->title,
                'title_translations' => LocalizedContent::formValues($destination->title_translations, $destination->title),
                'country' => $destination->country,
                'country_translations' => LocalizedContent::formValues($destination->country_translations, $destination->country),
                'continent' => $destination->continent,
                'city' => $destination->city,
                'city_translations' => LocalizedContent::formValues($destination->city_translations, $destination->city),
                'description' => $destination->description,
                'description_translations' => LocalizedContent::formValues($destination->description_translations, $destination->description),
                'cover_image' => $destination->cover_image,
                'latitude' => $destination->latitude,
                'longitude' => $destination->longitude,
            ],
        ]);
    }

    public function update(Request $request, Destination $destination): RedirectResponse
    {
        $data = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'title_translations' => ['nullable', 'array'],
            'title_translations.*' => ['nullable', 'string', 'max:255'],
            'country' => ['nullable', 'string', 'max:255'],
            'country_translations' => ['nullable', 'array'],
            'country_translations.*' => ['nullable', 'string', 'max:255'],
            'continent' => ['nullable', 'in:Europa,Zuid-Amerika,Noord-Amerika,Azie,Afrika,Oceanie'],
            'city' => ['nullable', 'string', 'max:255'],
            'city_translations' => ['nullable', 'array'],
            'city_translations.*' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'description_translations' => ['nullable', 'array'],
            'description_translations.*' => ['nullable', 'string'],
            'cover_image' => ['nullable', 'url', 'max:2048'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
        ]);

        $data = $this->prepareLocalizedDestinationData($data);
        $data['slug'] = Str::slug($data['title']);

        $destination->update($data);

        return redirect()->route('dashboard.destinations.index');
    }

    public function destroy(Destination $destination): RedirectResponse
    {
        DB::transaction(function () use ($destination): void {
            $destination->loadMissing('posts.media');

            $destination->posts->each(function ($post): void {
                PostDeletion::delete($post);
            });

            $destination->delete();
        });

        return redirect()->route('dashboard.destinations.index')->with('success', 'Bestemming verwijderd.');
    }

    private function prepareLocalizedDestinationData(array $data): array
    {
        $titleTranslations = LocalizedContent::fromPayload($data, 'title');
        $countryTranslations = LocalizedContent::fromPayload($data, 'country');
        $cityTranslations = LocalizedContent::fromPayload($data, 'city');
        $descriptionTranslations = LocalizedContent::fromPayload($data, 'description');

        if (! LocalizedContent::primary($titleTranslations)) {
            throw ValidationException::withMessages([
                'title_translations.nl' => 'Voeg minimaal een titel toe in een van de taalvelden.',
            ]);
        }

        if (! LocalizedContent::primary($countryTranslations)) {
            throw ValidationException::withMessages([
                'country_translations.nl' => 'Voeg minimaal een land toe in een van de taalvelden.',
            ]);
        }

        $data['title'] = LocalizedContent::primary($titleTranslations);
        $data['title_translations'] = LocalizedContent::nullable($titleTranslations);
        $data['country'] = LocalizedContent::primary($countryTranslations);
        $data['country_translations'] = LocalizedContent::nullable($countryTranslations);
        $data['city'] = LocalizedContent::primary($cityTranslations);
        $data['city_translations'] = LocalizedContent::nullable($cityTranslations);
        $data['description'] = LocalizedContent::primary($descriptionTranslations);
        $data['description_translations'] = LocalizedContent::nullable($descriptionTranslations);

        return $data;
    }
}
