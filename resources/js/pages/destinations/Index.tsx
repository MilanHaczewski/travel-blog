import { Head, Link } from '@inertiajs/react';

import Container from '@/components/container';
import { useI18n } from '@/lib/i18n';
import AppLayout from '@/Layouts/AppLayout';
import type { LocalizedText } from '@/types';

type Destination = {
    id: number;
    title: string;
    title_translations?: LocalizedText | null;
    slug: string;
    country: string;
    country_translations?: LocalizedText | null;
    city: string | null;
    description: string | null;
    description_translations?: LocalizedText | null;
    cover_image: string | null;
    posts_count?: number;
};

type Props = {
    destinations: Destination[];
};

export default function DestinationsIndex({ destinations }: Props) {
    const { count, t, translated } = useI18n();

    return (
        <AppLayout>
            <Head title={t('destinationsIndex.title')} />

            <section className="py-16">
                <Container>
                    <div className="rounded-[2rem] border border-white/60 bg-white/75 p-10 shadow-sm">
                        <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#0f766e]">{t('destinationsIndex.label')}</p>
                        <h1 className="mt-4 text-5xl font-black text-slate-900">{t('destinationsIndex.heading')}</h1>
                        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{t('destinationsIndex.body')}</p>
                    </div>

                    <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {destinations.map((destination) => (
                            <Link
                                key={destination.id}
                                href={`/destinations/${destination.slug}`}
                                className="group overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/85 shadow-sm transition hover:-translate-y-1"
                            >
                                <img
                                    src={destination.cover_image ?? 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80'}
                                    alt={translated(destination.title_translations, destination.title)}
                                    className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                                />
                                <div className="p-6">
                                    <p className="text-sm text-slate-500">{translated(destination.country_translations, destination.country)}</p>
                                    <h2 className="mt-2 text-2xl font-bold text-slate-900">{translated(destination.title_translations, destination.title)}</h2>
                                    <p className="mt-3 text-sm leading-7 text-slate-600">{translated(destination.description_translations, destination.description)}</p>
                                    <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-[#0f766e]">
                                        {count('story', destination.posts_count ?? 0)}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </Container>
            </section>
        </AppLayout>
    );
}
