<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tags', function (Blueprint $table) {
            $table->json('name_translations')->nullable()->after('name');
        });

        DB::table('tags')
            ->select(['id', 'name'])
            ->orderBy('id')
            ->lazyById()
            ->each(function (object $tag): void {
                DB::table('tags')
                    ->where('id', $tag->id)
                    ->update([
                        'name_translations' => json_encode(['nl' => $tag->name], JSON_UNESCAPED_UNICODE),
                    ]);
            });
    }

    public function down(): void
    {
        Schema::table('tags', function (Blueprint $table) {
            $table->dropColumn('name_translations');
        });
    }
};
