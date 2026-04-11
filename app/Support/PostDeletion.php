<?php

namespace App\Support;

use App\Models\Post;
use App\Models\PostMedia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PostDeletion
{
    public static function delete(Post $post): void
    {
        $post->loadMissing('media');

        self::deleteStoredFile($post->getRawOriginal('cover_image'));

        $post->media->each(function (PostMedia $media): void {
            self::deleteStoredFile($media->getRawOriginal('path'));
        });

        $post->delete();
    }

    private static function deleteStoredFile(?string $path): void
    {
        if (! $path || Str::startsWith($path, ['http://', 'https://', '/'])) {
            return;
        }

        Storage::disk('public')->delete($path);
    }
}
