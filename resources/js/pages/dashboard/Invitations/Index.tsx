import { router, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

import { useI18n } from '@/lib/i18n';
import DashboardLayout from '@/Layouts/DashboardLayout';

type Props = {
    invitations: Array<{
        id: number;
        email: string;
        expires_at: string;
        accepted_at: string | null;
        revoked_at: string | null;
        status: 'open' | 'accepted' | 'revoked' | 'expired';
        invite_url: string;
        inviter?: {
            id: number;
            name: string;
        } | null;
    }>;
};

export default function DashboardInvitationsIndex({ invitations }: Props) {
    const { status, t } = useI18n();
    const form = useForm({
        email: '',
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.post('/dashboard/invitations', {
            onSuccess: () => form.reset(),
        });
    };

    return (
        <DashboardLayout>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-900">{t('dashboardInvitations.heading')}</h1>
                <p className="mt-2 text-slate-600">{t('dashboardInvitations.body')}</p>
            </div>

            <div className="grid gap-8 xl:grid-cols-[360px_minmax(0,1fr)]">
                <form onSubmit={submit} className="rounded-3xl border border-white/70 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-slate-900">{t('dashboardInvitations.newInvitation')}</h2>
                    <label className="mt-5 block space-y-2">
                        <span className="text-sm font-semibold text-slate-700">{t('dashboardInvitations.adminEmail')}</span>
                        <input
                            type="email"
                            value={form.data.email}
                            onChange={(event) => form.setData('email', event.target.value)}
                            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                        />
                        {form.errors.email ? <p className="text-sm text-rose-600">{form.errors.email}</p> : null}
                    </label>

                    <button type="submit" disabled={form.processing} className="mt-5 rounded-full bg-[#0f766e] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
                        {t('dashboardInvitations.create')}
                    </button>
                </form>

                <div className="space-y-5">
                    {invitations.map((invitation) => (
                        <div key={invitation.id} className="rounded-3xl border border-white/70 bg-white p-6 shadow-sm">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div>
                                    <p className="font-semibold text-slate-900">{invitation.email}</p>
                                    <p className="text-sm text-slate-500">
                                        {t('dashboardInvitations.createdBy', { name: invitation.inviter?.name ?? t('dashboardInvitations.unknown') })}
                                    </p>
                                </div>
                                <span className="rounded-full bg-[#e6f4f1] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#0f766e]">
                                    {status('invitation', invitation.status)}
                                </span>
                            </div>

                            <div className="mt-4 rounded-2xl bg-[#f7f3eb] p-4 text-sm text-slate-600">
                                <p className="break-all">{invitation.invite_url}</p>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={() => navigator.clipboard.writeText(invitation.invite_url)}
                                    className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                                >
                                    {t('dashboardInvitations.copyLink')}
                                </button>
                                {invitation.status === 'open' ? (
                                    <button
                                        type="button"
                                        onClick={() => router.delete(`/dashboard/invitations/${invitation.id}`)}
                                        className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700"
                                    >
                                        {t('dashboardInvitations.revoke')}
                                    </button>
                                ) : null}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
