<?php

namespace App\Http\Controllers;

use App\Models\Destination;
use App\Support\PostDeletion;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
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
            'title' => ['required', 'string', 'max:255'],
            'country' => ['required', 'string', 'max:255'],
            'continent' => ['nullable', 'in:Europa,Zuid-Amerika,Noord-Amerika,Azie,Afrika,Oceanie'],
            'city' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'cover_image' => ['nullable', 'url', 'max:2048'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
        ]);

        $data['slug'] = Str::slug($data['title']);

        Destination::create($data);

        return redirect()->route('dashboard.destinations.index');
    }

    public function edit(Destination $destination): Response
    {
        return Inertia::render('dashboard/Destinations/Form', [
            'destination' => $destination,
        ]);
    }

    public function update(Request $request, Destination $destination): RedirectResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'country' => ['required', 'string', 'max:255'],
            'continent' => ['nullable', 'in:Europa,Zuid-Amerika,Noord-Amerika,Azie,Afrika,Oceanie'],
            'city' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'cover_image' => ['nullable', 'url', 'max:2048'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
        ]);

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
}
