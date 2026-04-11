import { router } from '@inertiajs/react';

import { useI18n } from '@/lib/i18n';
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
    const { status, t } = useI18n();

    return (
        <DashboardLayout>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-900">{t('dashboardAdmins.heading')}</h1>
                <p className="mt-2 max-w-2xl text-slate-600">{t('dashboardAdmins.body')}</p>
            </div>

            <div className="space-y-5">
                {users.map((user) => (
                    <div key={user.id} className="rounded-3xl border border-white/70 bg-white p-6 shadow-sm">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <h2 className="text-xl font-semibold text-slate-900">{user.name}</h2>
                                    <span className="rounded-full bg-[#e6f4f1] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#0f766e]">
                                        {status('role', user.role)}
                                    </span>
                                    <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-600">
                                        {status('admin', user.status)}
                                    </span>
                                </div>
                                <p className="mt-2 text-slate-500">{user.email}</p>
                                <p className="mt-1 text-sm text-slate-500">
                                    {t('dashboardAdmins.invitedBy', { name: user.invited_by?.name ?? t('dashboardAdmins.systemMaster') })}
                                </p>
                            </div>

                            {user.role === 'master' ? (
                                <p className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                                    {t('dashboardAdmins.protected')}
                                </p>
                            ) : (
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        type="button"
                                        onClick={() => router.put(`/dashboard/admin-users/${user.id}/status`, { status: 'active' })}
                                        className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                                    >
                                        {t('dashboardAdmins.activate')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => router.put(`/dashboard/admin-users/${user.id}/status`, { status: 'deactivated' })}
                                        className="rounded-full border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-700"
                                    >
                                        {t('dashboardAdmins.deactivate')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => router.put(`/dashboard/admin-users/${user.id}/status`, { status: 'archived' })}
                                        className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                                    >
                                        {t('dashboardAdmins.archive')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => router.delete(`/dashboard/admin-users/${user.id}`)}
                                        className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700"
                                    >
                                        {t('dashboardAdmins.delete')}
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
