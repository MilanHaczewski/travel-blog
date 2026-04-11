<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\AdminInvitation;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Carbon;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class InvitationAcceptanceController extends Controller
{
    public function create(string $token): Response
    {
        $invitation = $this->findInvitation($token);

        return Inertia::render('auth/AcceptInvitation', [
            'invitation' => [
                'email' => $invitation->email,
                'expires_at' => $invitation->expires_at,
            ],
        ]);
    }

    public function store(Request $request, string $token): RedirectResponse
    {
        $invitation = $this->findInvitation($token);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        if (User::query()->where('email', $invitation->email)->exists()) {
            throw ValidationException::withMessages([
                'name' => 'Voor dit e-mailadres bestaat al een account.',
            ]);
        }

        $user = DB::transaction(function () use ($data, $invitation) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $invitation->email,
                'password' => Hash::make($data['password']),
                'role' => 'admin',
                'status' => 'active',
                'invited_by_id' => $invitation->invited_by_id,
                'email_verified_at' => Carbon::now(),
            ]);

            $invitation->update([
                'accepted_at' => Carbon::now(),
            ]);

            return $user;
        });

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->route('dashboard')->with('success', 'Je administrator-account is aangemaakt.');
    }

    private function findInvitation(string $token): AdminInvitation
    {
        $invitation = AdminInvitation::query()
            ->where('token', $token)
            ->firstOrFail();

        abort_unless($invitation->isAvailable(), 404);

        return $invitation;
    }
}
