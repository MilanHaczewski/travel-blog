<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request, Post $post): RedirectResponse
    {
        abort_unless($post->status === 'published', 404);

        $data = $request->validate([
            'guest_name' => [$request->user() ? 'nullable' : 'required', 'string', 'max:255'],
            'guest_email' => [$request->user() ? 'nullable' : 'required', 'email', 'max:255'],
            'body' => ['required', 'string', 'max:2000'],
        ]);

        $post->comments()->create([
            'user_id' => $request->user()?->id,
            'guest_name' => $request->user()?->name ?? $data['guest_name'] ?? null,
            'guest_email' => $request->user()?->email ?? $data['guest_email'] ?? null,
            'body' => $data['body'],
            'status' => 'visible',
        ]);

        return redirect()->back()->with('success', 'Je reactie is geplaatst.');
    }
}
