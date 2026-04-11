<?php

namespace App\Http\Controllers;

use App\Models\AdminInvitation;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdminInvitationController extends Controller
{
    public function index(): Response
    {
        $invitations = AdminInvitation::query()
            ->with('inviter:id,name')
            ->latest()
            ->get()
            ->map(fn (AdminInvitation $invitation) => [
                'id' => $invitation->id,
                'email' => $invitation->email,
                'expires_at' => $invitation->expires_at,
                'accepted_at' => $invitation->accepted_at,
                'revoked_at' => $invitation->revoked_at,
                'status' => $invitation->accepted_at
                    ? 'accepted'
                    : ($invitation->revoked_at ? 'revoked' : ($invitation->expires_at->isPast() ? 'expired' : 'open')),
                'inviter' => $invitation->inviter?->only('id', 'name'),
                'invite_url' => route('invitations.accept', $invitation->token),
            ]);

        return Inertia::render('dashboard/Invitations/Index', [
            'invitations' => $invitations,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email'),
                Rule::unique('admin_invitations', 'email')->where(fn ($query) => $query
                    ->whereNull('accepted_at')
                    ->whereNull('revoked_at')
                    ->where('expires_at', '>', now())),
            ],
        ]);

        AdminInvitation::create([
            'invited_by_id' => $request->user()->id,
            'email' => $data['email'],
            'token' => Str::random(48),
            'expires_at' => Carbon::now()->addDays(7),
        ]);

        return redirect()
            ->route('dashboard.invitations.index')
            ->with('success', 'Uitnodigingslink aangemaakt. Je kunt hem nu kopieren en versturen.');
    }

    public function destroy(Request $request, AdminInvitation $invitation): RedirectResponse
    {
        abort_unless(
            $request->user()->isMaster() || ($invitation->inviter && $request->user()->is($invitation->inviter)),
            403
        );

        abort_if($invitation->accepted_at !== null, 422, 'Geaccepteerde uitnodigingen kun je niet intrekken.');

        $invitation->update([
            'revoked_at' => Carbon::now(),
        ]);

        return redirect()->route('dashboard.invitations.index')->with('success', 'De uitnodiging is ingetrokken.');
    }
}
