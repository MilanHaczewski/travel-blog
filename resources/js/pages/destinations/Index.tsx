import { Head, Link } from '@inertiajs/react';

import Container from '@/components/container';
import AppLayout from '@/Layouts/AppLayout';

type Destination = {
    id: number;
    title: string;
    slug: string;
    country: string;
    city: string | null;
    description: string | null;
    cover_image: string | null;
    posts_count?: number;
};

type Props = {
    destinations: Destination[];
};

export default function DestinationsIndex({ destinations }: Props) {
    return (
        <AppLayout>
            <Head title="Bestemmingen" />

            <section className="py-16">
                <Container>
                    <div className="rounded-[2rem] border border-white/60 bg-white/75 p-10 shadow-sm">
                        <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#0f766e]">Destinations</p>
                        <h1 className="mt-4 text-5xl font-black text-slate-900">Alle bestemmingen op de kaart van deze blog.</h1>
                        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
                            Gebruik deze pagina als overzicht van steden, eilanden en routes waar je over schrijft.
                        </p>
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
                                    alt={destination.title}
                                    className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                                />
                                <div className="p-6">
                                    <p className="text-sm text-slate-500">{destination.country}</p>
                                    <h2 className="mt-2 text-2xl font-bold text-slate-900">{destination.title}</h2>
                                    <p className="mt-3 text-sm leading-7 text-slate-600">{destination.description}</p>
                                    <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-[#0f766e]">
                                        {destination.posts_count ?? 0} verhalen
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
