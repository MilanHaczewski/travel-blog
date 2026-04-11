import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

import Container from '@/components/container';
import AppLayout from '@/Layouts/AppLayout';

export default function Login() {
    const form = useForm({
        email: '',
        password: '',
        remember: true,
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.post('/login');
    };

    return (
        <AppLayout>
            <Head title="Login" />

            <section className="py-20">
                <Container className="max-w-2xl">
                    <div className="rounded-[2rem] border border-white/70 bg-white/85 p-10 shadow-sm">
                        <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#cb5b4c]">Tulips & Arepas</p>
                        <h1 className="mt-4 text-4xl font-black text-slate-900">Login</h1>
                        <p className="mt-4 text-slate-600">
                            Milan en Juliana kunnen hier inloggen om verhalen, foto’s, video’s en nieuwe avonturen toe te voegen.
                        </p>

                        <form onSubmit={submit} className="mt-8 space-y-5">
                            <label className="block space-y-2">
                                <span className="text-sm font-semibold text-slate-700">E-mail</span>
                                <input
                                    type="email"
                                    value={form.data.email}
                                    onChange={(event) => form.setData('email', event.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                                />
                                {form.errors.email ? <p className="text-sm text-rose-600">{form.errors.email}</p> : null}
                            </label>

                            <label className="block space-y-2">
                                <span className="text-sm font-semibold text-slate-700">Wachtwoord</span>
                                <input
                                    type="password"
                                    value={form.data.password}
                                    onChange={(event) => form.setData('password', event.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                                />
                            </label>

                            <label className="flex items-center gap-3 text-sm text-slate-600">
                                <input
                                    type="checkbox"
                                    checked={form.data.remember}
                                    onChange={(event) => form.setData('remember', event.target.checked)}
                                />
                                Ingelogd blijven op dit apparaat
                            </label>

                            <button type="submit" disabled={form.processing} className="rounded-full bg-[#cb5b4c] px-6 py-3 text-sm font-semibold text-white disabled:opacity-60">
                                Inloggen
                            </button>
                        </form>
                    </div>
                </Container>
            </section>
        </AppLayout>
    );
}
