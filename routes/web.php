<?php

use App\Http\Controllers\AdminInvitationController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\InvitationAcceptanceController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DestinationController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\TagController;
use App\Models\Destination;
use App\Models\Post;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

Route::get('/', function () {
    $featuredPosts = [];
    $destinations = [];
    $mapLocations = [];

    if (Schema::hasTable('posts')) {
        $featuredPosts = Post::query()
            ->with(['destination', 'category'])
            ->where('status', 'published')
            ->latest('published_at')
            ->latest()
            ->take(3)
            ->get();
    }

    if (Schema::hasTable('destinations') && Schema::hasTable('posts')) {
        $destinations = Destination::query()
            ->withCount([
                'posts as published_posts_count' => fn ($query) => $query->where('status', 'published'),
            ])
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->whereHas('posts', fn ($query) => $query->where('status', 'published'))
            ->orderBy('title')
            ->get();

        $mapLocations = Destination::query()
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->whereHas('posts', fn ($query) => $query->where('status', 'published'))
            ->withCount([
                'posts as published_posts_count' => fn ($query) => $query->where('status', 'published'),
            ])
            ->with([
                'posts' => fn ($query) => $query
                    ->where('status', 'published')
                    ->latest('published_at')
                    ->latest()
                    ->take(1),
            ])
            ->get()
            ->sortByDesc(fn (Destination $destination) => $destination->posts->first()?->published_at?->getTimestamp() ?? 0)
            ->values()
            ->map(function (Destination $destination) {
                $latestPost = $destination->posts->first();

                return [
                    'id' => $destination->id,
                'title' => $destination->title,
                'slug' => $destination->slug,
                'country' => $destination->country,
                'continent' => $destination->continent,
                'city' => $destination->city,
                'cover_image' => $destination->cover_image,
                'latitude' => $destination->latitude,
                'longitude' => $destination->longitude,
                    'post_count' => $destination->published_posts_count,
                    'featured_post' => $latestPost ? [
                        'title' => $latestPost->title,
                        'slug' => $latestPost->slug,
                        'excerpt' => $latestPost->excerpt,
                        'cover_image' => $latestPost->cover_image,
                    ] : null,
                ];
            });
    }

    return Inertia::render('Home', [
        'featuredPosts' => $featuredPosts,
        'destinations' => $destinations,
        'mapLocations' => $mapLocations,
    ]);
})->name('home');

Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login.store');
    Route::get('/admin/invitations/{token}', [InvitationAcceptanceController::class, 'create'])->name('invitations.accept');
    Route::post('/admin/invitations/{token}', [InvitationAcceptanceController::class, 'store'])->name('invitations.store');
});

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth')->name('logout');

Route::get('/posts', [PostController::class, 'index'])->name('posts.index');
Route::get('/posts/{slug}', [PostController::class, 'show'])->name('posts.show');
Route::post('/posts/{post:slug}/comments', [CommentController::class, 'store'])->name('posts.comments.store');

Route::get('/destinations', [DestinationController::class, 'index'])->name('destinations.index');
Route::get('/destinations/{slug}', [DestinationController::class, 'show'])->name('destinations.show');

Route::middleware(['auth', 'active', 'admin'])->prefix('dashboard')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/posts', [PostController::class, 'adminIndex'])->name('dashboard.posts.index');
    Route::get('/posts/create', [PostController::class, 'create'])->name('dashboard.posts.create');
    Route::post('/posts', [PostController::class, 'store'])->name('dashboard.posts.store');
    Route::get('/posts/{post}/edit', [PostController::class, 'edit'])->name('dashboard.posts.edit');
    Route::put('/posts/{post}', [PostController::class, 'update'])->name('dashboard.posts.update');
    Route::delete('/posts/{post}', [PostController::class, 'destroy'])->name('dashboard.posts.destroy');

    Route::get('/destinations', [DestinationController::class, 'adminIndex'])->name('dashboard.destinations.index');
    Route::get('/destinations/create', [DestinationController::class, 'create'])->name('dashboard.destinations.create');
    Route::post('/destinations', [DestinationController::class, 'store'])->name('dashboard.destinations.store');
    Route::get('/destinations/{destination}/edit', [DestinationController::class, 'edit'])->name('dashboard.destinations.edit');
    Route::put('/destinations/{destination}', [DestinationController::class, 'update'])->name('dashboard.destinations.update');
    Route::delete('/destinations/{destination}', [DestinationController::class, 'destroy'])->name('dashboard.destinations.destroy');

    Route::get('/invitations', [AdminInvitationController::class, 'index'])->name('dashboard.invitations.index');
    Route::post('/invitations', [AdminInvitationController::class, 'store'])->name('dashboard.invitations.store');
    Route::delete('/invitations/{invitation}', [AdminInvitationController::class, 'destroy'])->name('dashboard.invitations.destroy');

    Route::get('/tags', [TagController::class, 'index'])->name('dashboard.tags.index');
    Route::post('/tags', [TagController::class, 'store'])->name('dashboard.tags.store');
    Route::put('/tags/{tag}', [TagController::class, 'update'])->name('dashboard.tags.update');
    Route::delete('/tags/{tag}', [TagController::class, 'destroy'])->name('dashboard.tags.destroy');

    Route::middleware('master')->group(function () {
        Route::get('/admin-users', [AdminUserController::class, 'index'])->name('dashboard.admin-users.index');
        Route::put('/admin-users/{user}/status', [AdminUserController::class, 'updateStatus'])->name('dashboard.admin-users.status');
        Route::delete('/admin-users/{user}', [AdminUserController::class, 'destroy'])->name('dashboard.admin-users.destroy');
    });
});
