<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('master administrator can log in and reach the dashboard', function () {
    $master = User::factory()->create([
        'email' => 'master@example.com',
        'password' => 'password',
        'role' => 'master',
        'status' => 'active',
    ]);

    $response = $this->post('/login', [
        'email' => $master->email,
        'password' => 'password',
    ]);

    $response->assertRedirect('/dashboard');
    $this->assertAuthenticatedAs($master);
});

test('regular administrator cannot access master only administrator management', function () {
    $admin = User::factory()->create([
        'role' => 'admin',
        'status' => 'active',
    ]);

    $response = $this->actingAs($admin)->get('/dashboard/admin-users');

    $response->assertForbidden();
});
