<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Destination;
use App\Models\Post;
use App\Models\Tag;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
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
            ->with(['author', 'destination', 'category', 'tags'])
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
            'destinations' => Destination::query()->orderBy('title')->get(['id', 'title']),
            'categories' => Category::query()->orderBy('name')->get(['id', 'name']),
            'tags' => Tag::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validatePost($request);
        $data['slug'] = Str::slug($data['title']);
        $data['user_id'] = $request->user()->id;

        $post = Post::create($data);
        $post->tags()->sync($request->input('tag_ids', []));

        return redirect()->route('dashboard.posts.index');
    }

    public function edit(Post $post): Response
    {
        $post->load('tags:id');

        return Inertia::render('dashboard/Posts/Form', [
            'post' => [
                ...$post->toArray(),
                'tag_ids' => $post->tags->pluck('id'),
            ],
            'destinations' => Destination::query()->orderBy('title')->get(['id', 'title']),
            'categories' => Category::query()->orderBy('name')->get(['id', 'name']),
            'tags' => Tag::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, Post $post): RedirectResponse
    {
        $data = $this->validatePost($request);
        $data['slug'] = Str::slug($data['title']);

        $post->update($data);
        $post->tags()->sync($request->input('tag_ids', []));

        return redirect()->route('dashboard.posts.index');
    }

    public function destroy(Post $post): RedirectResponse
    {
        $post->delete();

        return redirect()->route('dashboard.posts.index');
    }

    private function validatePost(Request $request): array
    {
        return $request->validate([
            'destination_id' => ['required', 'exists:destinations,id'],
            'category_id' => ['required', 'exists:categories,id'],
            'title' => ['required', 'string', 'max:255'],
            'excerpt' => ['nullable', 'string', 'max:400'],
            'body' => ['required', 'string'],
            'cover_image' => ['nullable', 'url', 'max:2048'],
            'video_url' => ['nullable', 'url', 'max:2048'],
            'status' => ['required', 'in:draft,published'],
            'published_at' => ['nullable', 'date'],
            'tag_ids' => ['array'],
            'tag_ids.*' => ['integer', 'exists:tags,id'],
        ]);
    }
}
