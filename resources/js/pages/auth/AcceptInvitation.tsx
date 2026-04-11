import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

import Container from '@/components/container';
import { useI18n } from '@/lib/i18n';
import AppLayout from '@/Layouts/AppLayout';

type Props = {
    invitation: {
        email: string;
        expires_at: string;
    };
};

export default function AcceptInvitation({ invitation }: Props) {
    const { t } = useI18n();
    const form = useForm({
        name: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.post(window.location.pathname);
    };

    return (
        <AppLayout>
            <Head title={t('authInvitation.title')} />

            <section className="py-20">
                <Container className="max-w-2xl">
                    <div className="rounded-[2rem] border border-white/70 bg-white/85 p-10 shadow-sm">
                        <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#0f766e]">{t('authInvitation.label')}</p>
                        <h1 className="mt-4 text-4xl font-black text-slate-900">{t('authInvitation.heading')}</h1>
                        <p className="mt-4 text-slate-600">
                            {t('authInvitation.body', { email: invitation.email })}
                        </p>

                        <form onSubmit={submit} className="mt-8 space-y-5">
                            <label className="block space-y-2">
                                <span className="text-sm font-semibold text-slate-700">{t('authInvitation.name')}</span>
                                <input
                                    value={form.data.name}
                                    onChange={(event) => form.setData('name', event.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                                />
                                {form.errors.name ? <p className="text-sm text-rose-600">{form.errors.name}</p> : null}
                            </label>

                            <label className="block space-y-2">
                                <span className="text-sm font-semibold text-slate-700">{t('authInvitation.password')}</span>
                                <input
                                    type="password"
                                    value={form.data.password}
                                    onChange={(event) => form.setData('password', event.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                                />
                                {form.errors.password ? <p className="text-sm text-rose-600">{form.errors.password}</p> : null}
                            </label>

                            <label className="block space-y-2">
                                <span className="text-sm font-semibold text-slate-700">{t('authInvitation.confirmPassword')}</span>
                                <input
                                    type="password"
                                    value={form.data.password_confirmation}
                                    onChange={(event) => form.setData('password_confirmation', event.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                                />
                            </label>

                            <button type="submit" disabled={form.processing} className="rounded-full bg-[#0f766e] px-6 py-3 text-sm font-semibold text-white disabled:opacity-60">
                                {t('authInvitation.submit')}
                            </button>
                        </form>
                    </div>
                </Container>
            </section>
        </AppLayout>
    );
}
