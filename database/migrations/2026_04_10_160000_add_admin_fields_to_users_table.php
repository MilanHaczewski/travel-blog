<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('admin')->after('password');
            $table->string('status')->default('active')->after('role');
            $table->foreignId('invited_by_id')->nullable()->after('status')->constrained('users')->nullOnDelete();
            $table->timestamp('deactivated_at')->nullable()->after('remember_token');
            $table->timestamp('archived_at')->nullable()->after('deactivated_at');

            $table->index(['role', 'status']);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('invited_by_id');
            $table->dropColumn(['role', 'status', 'deactivated_at', 'archived_at']);
        });
    }
};
