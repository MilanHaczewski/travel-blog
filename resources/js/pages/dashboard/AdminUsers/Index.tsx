import { router } from '@inertiajs/react';

import DashboardLayout from '@/Layouts/DashboardLayout';

type Props = {
    users: Array<{
        id: number;
        name: string;
        email: string;
        role: 'master' | 'admin';
        status: 'active' | 'deactivated' | 'archived';
        invited_by?: {
            id: number;
            name: string;
        } | null;
    }>;
};

export default function DashboardAdminUsersIndex({ users }: Props) {
    return (
        <DashboardLayout>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-900">Administrators</h1>
                <p className="mt-2 max-w-2xl text-slate-600">
                    Alleen de master-admin kan accounts deactiveren, archiveren, reactiveren of definitief verwijderen.
                </p>
            </div>

            <div className="space-y-5">
                {users.map((user) => (
                    <div key={user.id} className="rounded-3xl border border-white/70 bg-white p-6 shadow-sm">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <h2 className="text-xl font-semibold text-slate-900">{user.name}</h2>
                                    <span className="rounded-full bg-[#e6f4f1] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#0f766e]">
                                        {user.role}
                                    </span>
                                    <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-600">
                                        {user.status}
                                    </span>
                                </div>
                                <p className="mt-2 text-slate-500">{user.email}</p>
                                <p className="mt-1 text-sm text-slate-500">
                                    Uitgenodigd door {user.invited_by?.name ?? 'Systeem / master-admin'}
                                </p>
                            </div>

                            {user.role === 'master' ? (
                                <p className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                                    Master-account beschermd
                                </p>
                            ) : (
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        type="button"
                                        onClick={() => router.put(`/dashboard/admin-users/${user.id}/status`, { status: 'active' })}
                                        className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                                    >
                                        Activeren
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => router.put(`/dashboard/admin-users/${user.id}/status`, { status: 'deactivated' })}
                                        className="rounded-full border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-700"
                                    >
                                        Tijdelijk deactiveren
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => router.put(`/dashboard/admin-users/${user.id}/status`, { status: 'archived' })}
                                        className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                                    >
                                        Archiveren
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => router.delete(`/dashboard/admin-users/${user.id}`)}
                                        className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700"
                                    >
                                        Verwijderen
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </DashboardLayout>
    );
}
