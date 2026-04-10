import { Head, Link } from '@inertiajs/react';

import Container from '@/components/container';
import AppLayout from '@/Layouts/AppLayout';

type Destination = {
    id: number;
    title: string;
    slug: string;
    country: string;
    city: string | null;
    cover_image: string | null;
};

type Post = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    cover_image: string | null;
    destination: Destination | null;
};

type Props = {
    featuredPosts?: Post[];
    destinations?: Destination[];
};

const highlights = [
    'Langzame routes en persoonlijke reisverhalen',
    'Fotogenieke stays, koffiebars en natuurstops',
    'Praktische tips voor city trips en roadtrips',
];

export default function Home({ featuredPosts = [], destinations = [] }: Props) {
    const heroPost = featuredPosts[0];

    return (
        <AppLayout>
            <Head title="Home" />

            <section className="overflow-hidden pb-16 pt-18">
                <Container className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                    <div>
                        <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#0f766e]">Travel diary from the road</p>
                        <h1 className="max-w-3xl text-5xl font-black leading-tight text-slate-900 md:text-7xl">
                            Een travel blog vol verhalen die je meteen zin geven om te vertrekken.
                        </h1>
                        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                            Roamlog bundelt persoonlijke reiservaringen, route-ideeën en plekken die de omweg waard zijn. Van zonsopgang boven
                            Lissabon tot rustige meren in Slovenië.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link href="/posts" className="rounded-full bg-[#0f766e] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#115e59]">
                                Lees de nieuwste verhalen
                            </Link>
                            <Link
                                href="/destinations"
                                className="rounded-full border border-[#0f766e]/20 bg-white/60 px-6 py-3 text-sm font-semibold text-[#0f766e] transition hover:bg-white"
                            >
                                Bekijk bestemmingen
                            </Link>
                        </div>

                        <div className="mt-10 grid gap-3 md:grid-cols-3">
                            {highlights.map((item) => (
                                <div key={item} className="rounded-3xl border border-white/70 bg-white/70 p-4 text-sm text-slate-700 shadow-sm">
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -left-6 top-10 h-40 w-40 rounded-full bg-[#f6c453]/35 blur-3xl" />
                        <div className="absolute -right-6 bottom-0 h-48 w-48 rounded-full bg-[#0f766e]/20 blur-3xl" />
                        <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-[#0f172a] shadow-[0_30px_90px_rgba(15,23,42,0.18)]">
                            <img
                                src={heroPost?.cover_image ?? 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'}
                                alt={heroPost?.title ?? 'Travel sfeerbeeld'}
                                className="h-[520px] w-full object-cover opacity-85"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
                            <div className="absolute bottom-0 p-8 text-white">
                                <p className="text-sm uppercase tracking-[0.25em] text-white/70">Uitgelicht verhaal</p>
                                <h2 className="mt-3 text-3xl font-bold">{heroPost?.title ?? 'Weekend tussen oceaanlicht en kleurrijke steegjes'}</h2>
                                <p className="mt-3 max-w-lg text-sm leading-7 text-white/80">
                                    {heroPost?.excerpt ?? 'Een eerste glimp van de sfeer die je travel blog kan dragen: warm, persoonlijk en beeldend.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            <section className="py-16">
                <Container>
                    <div className="mb-8 flex items-end justify-between gap-4">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#0f766e]">Nieuwste verhalen</p>
                            <h2 className="mt-3 text-3xl font-bold text-slate-900">Vers van de route</h2>
                        </div>
                        <Link href="/posts" className="text-sm font-semibold text-[#0f766e]">
                            Alles bekijken
                        </Link>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        {featuredPosts.length > 0 ? (
                            featuredPosts.map((post) => (
                                <article key={post.id} className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/80 shadow-sm">
                                    <img
                                        src={post.cover_image ?? 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80'}
                                        alt={post.title}
                                        className="h-60 w-full object-cover"
                                    />
                                    <div className="p-6">
                                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#0f766e]">{post.destination?.title ?? 'Nieuwe bestemming'}</p>
                                        <h3 className="mt-3 text-2xl font-bold text-slate-900">{post.title}</h3>
                                        <p className="mt-3 text-sm leading-7 text-slate-600">{post.excerpt}</p>
                                        <Link href={`/posts/${post.slug}`} className="mt-5 inline-flex text-sm font-semibold text-[#0f766e]">
                                            Lees verhaal
                                        </Link>
                                    </div>
                                </article>
                            ))
                        ) : (
                            <div className="rounded-[1.75rem] border border-dashed border-[#0f766e]/20 bg-white/70 p-10 text-slate-500 lg:col-span-3">
                                Voeg posts toe via de seeder of het dashboard om hier je nieuwste reisverhalen te tonen.
                            </div>
                        )}
                    </div>
                </Container>
            </section>

            <section className="py-16">
                <Container className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                    <div className="rounded-[2rem] bg-[#0f766e] p-8 text-white shadow-lg">
                        <p className="text-sm font-bold uppercase tracking-[0.25em] text-white/70">Bestemmingen</p>
                        <h2 className="mt-4 text-3xl font-bold">Plekken waar het verhaal vanzelf begint.</h2>
                        <p className="mt-4 leading-8 text-white/85">
                            Bouw je blog rond favoriete steden, eilanden en roadtripstops. Elke bestemming krijgt een eigen pagina met alle
                            gekoppelde verhalen.
                        </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        {destinations.length > 0 ? (
                            destinations.map((destination) => (
                                <Link
                                    key={destination.id}
                                    href={`/destinations/${destination.slug}`}
                                    className="group overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/80 shadow-sm transition hover:-translate-y-1"
                                >
                                    <img
                                        src={destination.cover_image ?? 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'}
                                        alt={destination.title}
                                        className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
                                    />
                                    <div className="p-5">
                                        <p className="text-sm text-slate-500">{destination.country}</p>
                                        <h3 className="mt-2 text-xl font-bold text-slate-900">{destination.title}</h3>
                                        <p className="mt-1 text-sm text-slate-600">{destination.city ?? 'Travel highlights'}</p>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="rounded-[1.75rem] border border-dashed border-[#0f766e]/20 bg-white/70 p-10 text-slate-500 md:col-span-2">
                                Nog geen bestemmingen gevonden.
                            </div>
                        )}
                    </div>
                </Container>
            </section>
        </AppLayout>
    );
}
