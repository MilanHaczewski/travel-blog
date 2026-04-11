<?php

namespace App\Http\Controllers;

use App\Models\AdminInvitation;
use App\Models\Category;
use App\Models\Comment;
use App\Models\Destination;
use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('dashboard/index', [
            'stats' => [
                'posts' => Post::count(),
                'destinations' => Destination::count(),
                'categories' => Category::count(),
                'tags' => Tag::count(),
                'publishedPosts' => Post::query()->where('status', 'published')->count(),
                'comments' => Comment::count(),
                'admins' => User::query()->whereIn('role', ['master', 'admin'])->count(),
                'openInvitations' => AdminInvitation::query()
                    ->whereNull('accepted_at')
                    ->whereNull('revoked_at')
                    ->where('expires_at', '>', now())
                    ->count(),
            ],
            'recentPosts' => Post::query()
                ->with(['destination', 'category'])
                ->latest('published_at')
                ->latest()
                ->take(5)
                ->get(),
        ]);
    }
}
