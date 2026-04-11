<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use App\Support\LocalizedContent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class TagController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('dashboard/Tags/Index', [
            'tags' => Tag::query()
                ->withCount('posts')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['nullable', 'string', 'max:255', Rule::unique('tags', 'name')],
            'name_translations' => ['nullable', 'array'],
            'name_translations.*' => ['nullable', 'string', 'max:255'],
        ]);

        $nameTranslations = LocalizedContent::fromPayload($data, 'name');

        if (! LocalizedContent::primary($nameTranslations)) {
            throw ValidationException::withMessages([
                'name_translations.nl' => 'Voeg minimaal een tagnaam toe in een van de taalvelden.',
            ]);
        }

        $name = LocalizedContent::primary($nameTranslations);

        Tag::create([
            'name' => $name,
            'name_translations' => LocalizedContent::nullable($nameTranslations),
            'slug' => Str::slug($name),
        ]);

        return back()->with('success', 'Nieuwe tag toegevoegd.');
    }

    public function update(Request $request, Tag $tag): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['nullable', 'string', 'max:255', Rule::unique('tags', 'name')->ignore($tag->id)],
            'name_translations' => ['nullable', 'array'],
            'name_translations.*' => ['nullable', 'string', 'max:255'],
        ]);

        $nameTranslations = LocalizedContent::fromPayload($data, 'name');

        if (! LocalizedContent::primary($nameTranslations)) {
            throw ValidationException::withMessages([
                'name_translations.nl' => 'Voeg minimaal een tagnaam toe in een van de taalvelden.',
            ]);
        }

        $name = LocalizedContent::primary($nameTranslations);

        $tag->update([
            'name' => $name,
            'name_translations' => LocalizedContent::nullable($nameTranslations),
            'slug' => Str::slug($name),
        ]);

        return back()->with('success', 'Tag bijgewerkt.');
    }

    public function destroy(Tag $tag): RedirectResponse
    {
        $tag->posts()->detach();
        $tag->delete();

        return back()->with('success', 'Tag verwijderd.');
    }
}
