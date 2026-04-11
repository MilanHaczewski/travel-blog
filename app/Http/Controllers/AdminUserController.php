<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class AdminUserController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('dashboard/AdminUsers/Index', [
            'users' => User::query()
                ->whereIn('role', ['master', 'admin'])
                ->with('invitedBy:id,name')
                ->orderByRaw("role = 'master' desc")
                ->latest()
                ->get(),
        ]);
    }

    public function updateStatus(Request $request, User $user): RedirectResponse
    {
        abort_if($user->isMaster(), 422, 'Het master-account kan niet via dit scherm aangepast worden.');

        $data = $request->validate([
            'status' => ['required', 'in:active,deactivated,archived'],
        ]);

        $payload = [
            'status' => $data['status'],
            'deactivated_at' => null,
            'archived_at' => null,
        ];

        if ($data['status'] === 'deactivated') {
            $payload['deactivated_at'] = Carbon::now();
        }

        if ($data['status'] === 'archived') {
            $payload['archived_at'] = Carbon::now();
        }

        $user->update($payload);

        return redirect()->route('dashboard.admin-users.index')->with('success', 'Accountstatus bijgewerkt.');
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        abort_if($user->isMaster(), 422, 'Het master-account kan niet verwijderd worden.');
        abort_if($request->user()->is($user), 422, 'Je kunt je eigen account niet verwijderen.');

        $user->posts()->update([
            'user_id' => $request->user()->id,
        ]);

        $user->delete();

        return redirect()->route('dashboard.admin-users.index')->with('success', 'Administrator-account verwijderd.');
    }
}
