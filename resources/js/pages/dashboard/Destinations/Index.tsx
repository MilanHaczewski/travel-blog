import { Link, router } from '@inertiajs/react';

import DashboardLayout from '@/Layouts/DashboardLayout';

type Props = {
    destinations: Array<{
        id: number;
        title: string;
        country: string;
        continent: string | null;
        posts_count: number;
        latitude: number | null;
        longitude: number | null;
    }>;
};

export default function DashboardDestinationsIndex({ destinations }: Props) {
    const removeDestination = (destination: Props['destinations'][number]) => {
        const confirmation = destination.posts_count > 0
            ? `Weet je zeker dat je ${destination.title} wilt verwijderen? Dit verwijdert ook ${destination.posts_count} gekoppelde posts.`
            : `Weet je zeker dat je ${destination.title} wilt verwijderen?`;

        if (!window.confirm(confirmation)) {
            return;
        }

        router.delete(`/dashboard/destinations/${destination.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <DashboardLayout>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Bestemmingen</h1>
                    <p className="mt-2 text-slate-600">Beheer de plekken waar je verhalen over schrijft.</p>
                </div>
                <Link href="/dashboard/destinations/create" className="rounded-full bg-[#0f766e] px-5 py-3 text-sm font-semibold text-white">
                    Nieuwe bestemming
                </Link>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/70 bg-white shadow-sm">
                {destinations.map((destination) => (
                    <div key={destination.id} className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-4 last:border-b-0">
                        <div>
                            <p className="font-semibold text-slate-900">{destination.title}</p>
                            <p className="text-sm text-slate-500">
                                {destination.country}
                                {destination.continent ? ` / ${destination.continent}` : ''}
                                {` / ${destination.posts_count} posts / `}
                                {destination.latitude !== null && destination.longitude !== null ? 'pin staat klaar' : 'nog geen kaartpin'}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href={`/dashboard/destinations/${destination.id}/edit`} className="text-sm font-semibold text-slate-700">
                                Bewerken
                            </Link>
                            <button type="button" onClick={() => removeDestination(destination)} className="text-sm font-semibold text-[#cb5b4c]">
                                Verwijderen
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </DashboardLayout>
    );
}
