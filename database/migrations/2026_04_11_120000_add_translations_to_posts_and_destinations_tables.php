<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->json('title_translations')->nullable()->after('title');
            $table->json('excerpt_translations')->nullable()->after('excerpt');
            $table->json('body_translations')->nullable()->after('body');
        });

        Schema::table('destinations', function (Blueprint $table) {
            $table->json('title_translations')->nullable()->after('title');
            $table->json('country_translations')->nullable()->after('country');
            $table->json('city_translations')->nullable()->after('city');
            $table->json('description_translations')->nullable()->after('description');
        });

        DB::table('posts')
            ->select(['id', 'title', 'excerpt', 'body'])
            ->orderBy('id')
            ->lazyById()
            ->each(function (object $post): void {
                DB::table('posts')
                    ->where('id', $post->id)
                    ->update([
                        'title_translations' => json_encode(['nl' => $post->title], JSON_UNESCAPED_UNICODE),
                        'excerpt_translations' => $post->excerpt ? json_encode(['nl' => $post->excerpt], JSON_UNESCAPED_UNICODE) : null,
                        'body_translations' => json_encode(['nl' => $post->body], JSON_UNESCAPED_UNICODE),
                    ]);
            });

        DB::table('destinations')
            ->select(['id', 'title', 'country', 'city', 'description'])
            ->orderBy('id')
            ->lazyById()
            ->each(function (object $destination): void {
                DB::table('destinations')
                    ->where('id', $destination->id)
                    ->update([
                        'title_translations' => json_encode(['nl' => $destination->title], JSON_UNESCAPED_UNICODE),
                        'country_translations' => json_encode(['nl' => $destination->country], JSON_UNESCAPED_UNICODE),
                        'city_translations' => $destination->city ? json_encode(['nl' => $destination->city], JSON_UNESCAPED_UNICODE) : null,
                        'description_translations' => $destination->description ? json_encode(['nl' => $destination->description], JSON_UNESCAPED_UNICODE) : null,
                    ]);
            });
    }

    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn(['title_translations', 'excerpt_translations', 'body_translations']);
        });

        Schema::table('destinations', function (Blueprint $table) {
            $table->dropColumn(['title_translations', 'country_translations', 'city_translations', 'description_translations']);
        });
    }
};
