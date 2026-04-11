import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

import DashboardLayout from '@/Layouts/DashboardLayout';

const continentOptions = ['Europa', 'Zuid-Amerika', 'Noord-Amerika', 'Azie', 'Afrika', 'Oceanie'];

type Props = {
    destination: {
        id: number;
        title: string;
        country: string;
        continent: string | null;
        city: string | null;
        description: string | null;
        cover_image: string | null;
        latitude: number | null;
        longitude: number | null;
    } | null;
};

export default function DashboardDestinationForm({ destination }: Props) {
    const form = useForm({
        title: destination?.title ?? '',
        country: destination?.country ?? '',
        continent: destination?.continent ?? '',
        city: destination?.city ?? '',
        description: destination?.description ?? '',
        cover_image: destination?.cover_image ?? '',
        latitude: destination?.latitude?.toString() ?? '',
        longitude: destination?.longitude?.toString() ?? '',
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

                <div className="grid gap-6 md:grid-cols-2">
                    <label className="space-y-2">
                        <span className="text-sm font-semibold text-slate-700">Continent</span>
                        <select
                            value={form.data.continent}
                            onChange={(event) => form.setData('continent', event.target.value)}
                            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                        >
                            <option value="">Kies een continent</option>
                            {continentOptions.map((continent) => (
                                <option key={continent} value={continent}>
                                    {continent}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="space-y-2">
                        <span className="text-sm font-semibold text-slate-700">Stad</span>
                        <input value={form.data.city} onChange={(event) => form.setData('city', event.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
                    </label>
                </div>

                <label className="block space-y-2">
                    <span className="text-sm font-semibold text-slate-700">Beschrijving</span>
                    <textarea value={form.data.description} onChange={(event) => form.setData('description', event.target.value)} className="min-h-40 w-full rounded-2xl border border-slate-200 px-4 py-3" />
                </label>

                <label className="block space-y-2">
                    <span className="text-sm font-semibold text-slate-700">Cover image URL</span>
                    <input value={form.data.cover_image} onChange={(event) => form.setData('cover_image', event.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
                </label>

                <div className="rounded-3xl border border-[#0f766e]/10 bg-[#0f766e]/5 p-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <label className="space-y-2">
                            <span className="text-sm font-semibold text-slate-700">Latitude</span>
                            <input
                                type="number"
                                step="any"
                                value={form.data.latitude}
                                onChange={(event) => form.setData('latitude', event.target.value)}
                                placeholder="Bijv. 52.3676"
                                className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                            />
                        </label>
                        <label className="space-y-2">
                            <span className="text-sm font-semibold text-slate-700">Longitude</span>
                            <input
                                type="number"
                                step="any"
                                value={form.data.longitude}
                                onChange={(event) => form.setData('longitude', event.target.value)}
                                placeholder="Bijv. 4.9041"
                                className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                            />
                        </label>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                        Voeg coordinaten toe als je deze bestemming op de homepagekaart wilt tonen. Zonder coordinaten blijft de bestemming
                        gewoon bestaan, maar krijgt hij geen pin.
                    </p>
                </div>

                <button type="submit" disabled={form.processing} className="rounded-full bg-[#0f766e] px-6 py-3 text-sm font-semibold text-white disabled:opacity-60">
                    Opslaan
                </button>
            </form>
        </DashboardLayout>
    );
}
