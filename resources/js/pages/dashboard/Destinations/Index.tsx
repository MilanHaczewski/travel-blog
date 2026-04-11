import { Link, router } from '@inertiajs/react';

import { useI18n } from '@/lib/i18n';
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { LocalizedText } from '@/types';

type Props = {
    destinations: Array<{
        id: number;
        title: string;
        title_translations?: LocalizedText | null;
        country: string;
        country_translations?: LocalizedText | null;
        continent: string | null;
        posts_count: number;
        latitude: number | null;
        longitude: number | null;
    }>;
};

export default function DashboardDestinationsIndex({ destinations }: Props) {
    const { continent, count, t, translated } = useI18n();

    const removeDestination = (destination: Props['destinations'][number]) => {
        const destinationTitle = translated(destination.title_translations, destination.title);
        const confirmation =
            destination.posts_count > 0
                ? t('dashboardDestinations.deleteWithPosts', { count: destination.posts_count, title: destinationTitle })
                : t('dashboardDestinations.deleteConfirm', { title: destinationTitle });

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
                    <h1 className="text-3xl font-bold text-slate-900">{t('dashboardDestinations.heading')}</h1>
                    <p className="mt-2 text-slate-600">{t('dashboardDestinations.body')}</p>
                </div>
                <Link href="/dashboard/destinations/create" className="rounded-full bg-[#0f766e] px-5 py-3 text-sm font-semibold text-white">
                    {t('dashboardDestinations.newDestination')}
                </Link>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/70 bg-white shadow-sm">
                {destinations.map((destination) => (
                    <div key={destination.id} className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-4 last:border-b-0">
                        <div>
                            <p className="font-semibold text-slate-900">{translated(destination.title_translations, destination.title)}</p>
                            <p className="text-sm text-slate-500">
                                {translated(destination.country_translations, destination.country)}
                                {destination.continent ? ` / ${continent(destination.continent)}` : ''}
                                {` / ${count('post', destination.posts_count)} / `}
                                {destination.latitude !== null && destination.longitude !== null ? t('dashboardDestinations.pinReady') : t('dashboardDestinations.noPin')}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href={`/dashboard/destinations/${destination.id}/edit`} className="text-sm font-semibold text-slate-700">
                                {t('dashboardDestinations.edit')}
                            </Link>
                            <button type="button" onClick={() => removeDestination(destination)} className="text-sm font-semibold text-[#cb5b4c]">
                                {t('dashboardDestinations.delete')}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </DashboardLayout>
    );
}
