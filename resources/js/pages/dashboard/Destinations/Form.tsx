import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

import DashboardLayout from '@/Layouts/DashboardLayout';

type Props = {
    destination: {
        id: number;
        title: string;
        country: string;
        city: string | null;
        description: string | null;
        cover_image: string | null;
    } | null;
};

export default function DashboardDestinationForm({ destination }: Props) {
    const form = useForm({
        title: destination?.title ?? '',
        country: destination?.country ?? '',
        city: destination?.city ?? '',
        description: destination?.description ?? '',
        cover_image: destination?.cover_image ?? '',
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (destination) {
            form.put(`/dashboard/destinations/${destination.id}`);
            return;
        }

        form.post('/dashboard/destinations');
    };

    return (
        <DashboardLayout>
            <h1 className="text-3xl font-bold text-slate-900">{destination ? 'Bestemming bewerken' : 'Nieuwe bestemming'}</h1>

            <form onSubmit={submit} className="mt-8 space-y-6 rounded-3xl border border-white/70 bg-white p-8 shadow-sm">
                <div className="grid gap-6 md:grid-cols-2">
                    <label className="space-y-2">
                        <span className="text-sm font-semibold text-slate-700">Titel</span>
                        <input value={form.data.title} onChange={(event) => form.setData('title', event.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
                    </label>
                    <label className="space-y-2">
                        <span className="text-sm font-semibold text-slate-700">Land</span>
                        <input value={form.data.country} onChange={(event) => form.setData('country', event.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
                    </label>
                </div>

                <label className="block space-y-2">
                    <span className="text-sm font-semibold text-slate-700">Stad</span>
                    <input value={form.data.city} onChange={(event) => form.setData('city', event.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 md:max-w-sm" />
                </label>

                <label className="block space-y-2">
                    <span className="text-sm font-semibold text-slate-700">Beschrijving</span>
                    <textarea value={form.data.description} onChange={(event) => form.setData('description', event.target.value)} className="min-h-40 w-full rounded-2xl border border-slate-200 px-4 py-3" />
                </label>

                <label className="block space-y-2">
                    <span className="text-sm font-semibold text-slate-700">Cover image URL</span>
                    <input value={form.data.cover_image} onChange={(event) => form.setData('cover_image', event.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
                </label>

                <button type="submit" disabled={form.processing} className="rounded-full bg-[#0f766e] px-6 py-3 text-sm font-semibold text-white disabled:opacity-60">
                    Opslaan
                </button>
            </form>
        </DashboardLayout>
    );
}
