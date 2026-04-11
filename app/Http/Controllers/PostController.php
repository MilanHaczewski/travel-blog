<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Destination;
use App\Models\Post;
use App\Models\PostMedia;
use App\Models\Tag;
use App\Support\LocalizedContent;
use App\Support\PostDeletion;
use Carbon\CarbonInterface;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    public function index(): Response
    {
        $posts = Post::query()
            ->with(['destination', 'category', 'tags'])
            ->where('status', 'published')
            ->latest('published_at')
            ->latest()
            ->get();

        return Inertia::render('posts/Index', [
            'posts' => $posts,
            'featuredPost' => $posts->first(),
        ]);
    }

    public function show(string $slug): Response
    {
        $post = Post::query()
            ->with([
                'author',
                'destination',
                'category',
                'tags',
                'media',
                'comments' => fn ($query) => $query
                    ->where('status', 'visible')
                    ->with('author:id,name')
                    ->latest(),
            ])
            ->where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();

        $relatedPosts = Post::query()
            ->with(['destination', 'category'])
            ->where('status', 'published')
            ->where('destination_id', $post->destination_id)
            ->whereKeyNot($post->id)
            ->latest('published_at')
            ->take(3)
            ->get();

        return Inertia::render('posts/Show', [
            'post' => $post,
            'relatedPosts' => $relatedPosts,
        ]);
    }

    public function adminIndex(): Response
    {
        return Inertia::render('dashboard/Posts/Index', [
            'posts' => Post::query()
                ->with(['destination', 'category'])
                ->latest()
                ->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('dashboard/Posts/Form', [
            'post' => null,
            'destinations' => Destination::query()->orderBy('title')->get(['id', 'title', 'title_translations']),
            'categories' => Category::query()->orderBy('name')->get(['id', 'name', 'slug']),
            'tags' => Tag::query()->orderBy('name')->get(['id', 'name', 'name_translations']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validatePost($request);

        $post = Post::create([
            'user_id' => $request->user()->id,
            'destination_id' => $data['destination_id'],
            'category_id' => $data['category_id'],
            'title' => $data['title'],
            'title_translations' => $data['title_translations'],
            'slug' => Str::slug($data['title']),
            'excerpt' => $data['excerpt'] ?? null,
            'excerpt_translations' => $data['excerpt_translations'],
            'body' => $data['body'],
            'body_translations' => $data['body_translations'],
            'cover_image' => $this->determineCoverImage($request),
            'video_url' => null,
            'status' => $data['status'],
            'published_at' => $this->normalizePublishedAt($data['status'], $data['published_at'] ?? null),
        ]);

        $post->tags()->sync($data['tag_ids'] ?? []);
        $this->syncUploadedMedia($request, $post);

        return redirect()->route('dashboard.posts.index')->with('success', 'Post opgeslagen.');
    }

    public function edit(Post $post): Response
    {
        $post->load(['tags:id,name', 'media']);

        return Inertia::render('dashboard/Posts/Form', [
            'post' => [
                'id' => $post->id,
                'destination_id' => $post->destination_id,
                'category_id' => $post->category_id,
                'title' => $post->title,
                'title_translations' => LocalizedContent::formValues($post->title_translations, $post->title),
                'excerpt' => $post->excerpt,
                'excerpt_translations' => LocalizedContent::formValues($post->excerpt_translations, $post->excerpt),
                'body' => $post->body,
                'body_translations' => LocalizedContent::formValues($post->body_translations, $post->body),
                'cover_image' => $post->cover_image,
                'video_url' => $post->video_url,
                'status' => $post->status,
                'published_at' => optional($post->published_at)?->toISOString(),
                'tag_ids' => $post->tags->pluck('id'),
                'existing_media' => $post->media->map(fn (PostMedia $media) => [
                    'id' => $media->id,
                    'type' => $media->type,
                    'path' => $media->path,
                    'original_name' => $media->original_name,
                ])->values(),
            ],
            'destinations' => Destination::query()->orderBy('title')->get(['id', 'title', 'title_translations']),
            'categories' => Category::query()->orderBy('name')->get(['id', 'name', 'slug']),
            'tags' => Tag::query()->orderBy('name')->get(['id', 'name', 'name_translations']),
        ]);
    }

    public function update(Request $request, Post $post): RedirectResponse
    {
        $data = $this->validatePost($request);

        $post->update([
            'destination_id' => $data['destination_id'],
            'category_id' => $data['category_id'],
            'title' => $data['title'],
            'title_translations' => $data['title_translations'],
            'slug' => Str::slug($data['title']),
            'excerpt' => $data['excerpt'] ?? null,
            'excerpt_translations' => $data['excerpt_translations'],
            'body' => $data['body'],
            'body_translations' => $data['body_translations'],
            'cover_image' => $this->determineCoverImage($request, $post),
            'status' => $data['status'],
            'published_at' => $this->normalizePublishedAt($data['status'], $data['published_at'] ?? null),
        ]);

        $post->tags()->sync($data['tag_ids'] ?? []);
        $this->removeSelectedMedia($post, $data['remove_media_ids'] ?? []);
        $this->syncUploadedMedia($request, $post);

        return redirect()->route('dashboard.posts.index')->with('success', 'Post bijgewerkt.');
    }

    public function destroy(Post $post): RedirectResponse
    {
        PostDeletion::delete($post);

        return redirect()->route('dashboard.posts.index')->with('success', 'Post verwijderd.');
    }

    private function validatePost(Request $request): array
    {
        $data = $request->validate([
            'destination_id' => ['required', 'exists:destinations,id'],
            'category_id' => ['required', 'exists:categories,id'],
            'title' => ['nullable', 'string', 'max:255'],
            'title_translations' => ['nullable', 'array'],
            'title_translations.*' => ['nullable', 'string', 'max:255'],
            'excerpt' => ['nullable', 'string', 'max:400'],
            'excerpt_translations' => ['nullable', 'array'],
            'excerpt_translations.*' => ['nullable', 'string', 'max:400'],
            'body' => ['nullable', 'string'],
            'body_translations' => ['nullable', 'array'],
            'body_translations.*' => ['nullable', 'string'],
            'cover_image_url' => ['nullable', 'url', 'max:2048'],
            'cover_image_upload' => ['nullable', 'image', 'max:10240'],
            'status' => ['required', 'in:draft,published'],
            'published_at' => ['nullable', 'date'],
            'tag_ids' => ['array'],
            'tag_ids.*' => ['integer', 'exists:tags,id'],
            'media_uploads' => ['array'],
            'media_uploads.*' => ['file', 'max:102400', 'mimetypes:image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime'],
            'remove_media_ids' => ['array'],
            'remove_media_ids.*' => ['integer'],
        ]);

        $titleTranslations = LocalizedContent::fromPayload($data, 'title');
        $bodyTranslations = LocalizedContent::fromPayload($data, 'body');
        $excerptTranslations = LocalizedContent::fromPayload($data, 'excerpt');

        if (! LocalizedContent::primary($titleTranslations)) {
            throw ValidationException::withMessages([
                'title_translations.nl' => 'Voeg minimaal een titel toe in een van de taalvelden.',
            ]);
        }

        if (! LocalizedContent::primary($bodyTranslations)) {
            throw ValidationException::withMessages([
                'body_translations.nl' => 'Voeg minimaal een verhaaltekst toe in een van de taalvelden.',
            ]);
        }

        $data['title'] = LocalizedContent::primary($titleTranslations);
        $data['title_translations'] = LocalizedContent::nullable($titleTranslations);
        $data['excerpt'] = LocalizedContent::primary($excerptTranslations);
        $data['excerpt_translations'] = LocalizedContent::nullable($excerptTranslations);
        $data['body'] = LocalizedContent::primary($bodyTranslations);
        $data['body_translations'] = LocalizedContent::nullable($bodyTranslations);

        return $data;
    }

    private function determineCoverImage(Request $request, ?Post $post = null): ?string
    {
        if ($request->hasFile('cover_image_upload')) {
            $this->deleteStoredFile($post?->getRawOriginal('cover_image'));

            return $request->file('cover_image_upload')->store('post-covers', 'public');
        }

        $coverImageUrl = trim((string) $request->input('cover_image_url'));

        if ($coverImageUrl !== '') {
            if ($post && $post->getRawOriginal('cover_image') !== $coverImageUrl) {
                $this->deleteStoredFile($post->getRawOriginal('cover_image'));
            }

            return $coverImageUrl;
        }

        return $post?->getRawOriginal('cover_image');
    }

    private function normalizePublishedAt(string $status, ?string $publishedAt): ?CarbonInterface
    {
        if ($status === 'draft') {
            return $publishedAt ? Carbon::parse($publishedAt) : null;
        }

        return $publishedAt ? Carbon::parse($publishedAt) : now();
    }

    private function syncUploadedMedia(Request $request, Post $post): void
    {
        if (! $request->hasFile('media_uploads')) {
            return;
        }

        $sortOrder = (int) $post->media()->max('sort_order');

        foreach ($request->file('media_uploads') as $file) {
            $sortOrder++;

            $post->media()->create([
                'type' => Str::startsWith((string) $file->getMimeType(), 'video/') ? 'video' : 'image',
                'path' => $file->store("posts/{$post->id}", 'public'),
                'original_name' => $file->getClientOriginalName(),
                'sort_order' => $sortOrder,
            ]);
        }
    }

    private function removeSelectedMedia(Post $post, array $removeMediaIds): void
    {
        $mediaToDelete = $post->media()->whereIn('id', $removeMediaIds)->get();

        foreach ($mediaToDelete as $media) {
            $this->deleteStoredFile($media->getRawOriginal('path'));
            $media->delete();
        }
    }

    private function deleteStoredFile(?string $path): void
    {
        if (! $path || Str::startsWith($path, ['http://', 'https://', '/'])) {
            return;
        }

        Storage::disk('public')->delete($path);
    }
}
