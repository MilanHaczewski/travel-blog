<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DestinationController;
use App\Http\Controllers\PostController;
use App\Models\Destination;
use App\Models\Post;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

Route::get('/', function () {
    $featuredPosts = [];
    $destinations = [];

    if (Schema::hasTable('posts')) {
        $featuredPosts = Post::query()
            ->with(['destination', 'category'])
            ->where('status', 'published')
            ->latest('published_at')
            ->latest()
            ->take(3)
            ->get();
    }

    if (Schema::hasTable('destinations')) {
        $destinations = Destination::query()
            ->orderBy('title')
            ->take(4)
            ->get();
    }

    return Inertia::render('Home', [
        'featuredPosts' => $featuredPosts,
        'destinations' => $destinations,
    ]);
})->name('home');

Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

Route::get('/posts', [PostController::class, 'index'])->name('posts.index');
Route::get('/posts/{slug}', [PostController::class, 'show'])->name('posts.show');

Route::get('/destinations', [DestinationController::class, 'index'])->name('destinations.index');
Route::get('/destinations/{slug}', [DestinationController::class, 'show'])->name('destinations.show');

Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

Route::get('/dashboard/posts', [PostController::class, 'adminIndex'])->name('dashboard.posts.index');
Route::get('/dashboard/posts/create', [PostController::class, 'create'])->name('dashboard.posts.create');
Route::post('/dashboard/posts', [PostController::class, 'store'])->name('dashboard.posts.store');
Route::get('/dashboard/posts/{post}/edit', [PostController::class, 'edit'])->name('dashboard.posts.edit');
Route::put('/dashboard/posts/{post}', [PostController::class, 'update'])->name('dashboard.posts.update');
Route::delete('/dashboard/posts/{post}', [PostController::class, 'destroy'])->name('dashboard.posts.destroy');

Route::get('/dashboard/destinations', [DestinationController::class, 'adminIndex'])->name('dashboard.destinations.index');
Route::get('/dashboard/destinations/create', [DestinationController::class, 'create'])->name('dashboard.destinations.create');
Route::post('/dashboard/destinations', [DestinationController::class, 'store'])->name('dashboard.destinations.store');
Route::get('/dashboard/destinations/{destination}/edit', [DestinationController::class, 'edit'])->name('dashboard.destinations.edit');
Route::put('/dashboard/destinations/{destination}', [DestinationController::class, 'update'])->name('dashboard.destinations.update');
Route::delete('/dashboard/destinations/{destination}', [DestinationController::class, 'destroy'])->name('dashboard.destinations.destroy');
