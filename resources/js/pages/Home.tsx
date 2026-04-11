import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

import Container from '@/components/container';
import TravelMap, { type MapLocation } from '@/components/TravelMap';
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
    continent: string | null;
    city: string | null;
    city_translations?: LocalizedText | null;
    cover_image: string | null;
    published_posts_count?: number;
};

type Post = {
    id: number;
    title: string;
    title_translations?: LocalizedText | null;
    slug: string;
    excerpt: string | null;
    excerpt_translations?: LocalizedText | null;
    cover_image: string | null;
    destination: Destination | null;
};

type Props = {
    featuredPosts?: Post[];
    destinations?: Destination[];
    mapLocations?: MapLocation[];
};

const fallbackPreview =
    'https://images.unsplash.com/photo-1499856871958-5b9357976b82?auto=format&fit=crop&w=1400&q=80';

const allContinentsLabel = 'Alles';

export default function Home({ featuredPosts = [], destinations = [], mapLocations = [] }: Props) {
    const heroPost = featuredPosts[0];
    const [selectedContinent, setSelectedContinent] = useState(allContinentsLabel);
    const { continent: continentLabel, count, t, tArray, translated } = useI18n();
    const highlights = tArray('home.highlights');

    const continentOptions = [
        allContinentsLabel,
        ...Array.from(
            new Set(
                [...destinations.map((destination) => destination.continent), ...mapLocations.map((location) => location.continent)].filter(
                    (value): value is string => Boolean(value),
                ),
            ),
        ),
    ];

    const filteredDestinations =
        selectedContinent === allContinentsLabel
            ? destinations
            : destinations.filter((destination) => destination.continent === selectedContinent);

    const filteredMapLocations =
        selectedContinent === allContinentsLabel
            ? mapLocations
            : mapLocations.filter((location) => location.continent === selectedContinent);

    return (
        <AppLayout>
            <Head title={t('navbar.home')} />

            <section className="overflow-hidden pb-16 pt-18">
                <Container className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                    <div>
                        <div className="mb-5 flex items-center gap-4">
                            <img src="/tulips-and-arepas.png" alt="Tulips and Arepas" className="h-18 w-18 rounded-[1.5rem] object-cover shadow-md" />
                            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#cb5b4c]">Tulips & Arepas</p>
                        </div>
                        <h1 className="max-w-4xl text-5xl font-black leading-tight text-slate-900 md:text-7xl">{t('home.heroTitle')}</h1>
                        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">{t('home.heroBody')}</p>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link href="/posts" className="rounded-full bg-[#cb5b4c] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#b4493b]">
                                {t('home.ctaStories')}
                            </Link>
                            <Link href="/about" className="rounded-full border border-[#cb5b4c]/20 bg-white/70 px-6 py-3 text-sm font-semibold text-[#cb5b4c] transition hover:bg-white">
                                {t('home.ctaAbout')}
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
                        <div className="absolute -left-6 top-10 h-40 w-40 rounded-full bg-[#ffd66b]/40 blur-3xl" />
                        <div className="absolute -right-6 bottom-0 h-48 w-48 rounded-full bg-[#cb5b4c]/25 blur-3xl" />
                        <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-[#0f172a] shadow-[0_30px_90px_rgba(15,23,42,0.18)]">
                            <img src={heroPost?.cover_image ?? fallbackPreview} alt={heroPost ? translated(heroPost.title_translations, heroPost.title) : 'Tulips and Arepas sfeerbeeld'} className="h-[540px] w-full object-cover opacity-90" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/35 to-transparent" />
                            <div className="absolute bottom-0 p-8 text-white">
                                <p className="text-sm uppercase tracking-[0.25em] text-white/70">{t('home.heroLabel')}</p>
                                <h2 className="mt-3 text-3xl font-bold">{heroPost ? translated(heroPost.title_translations, heroPost.title) : t('home.heroFallbackTitle')}</h2>
                                <p className="mt-3 max-w-lg text-sm leading-7 text-white/80">{heroPost ? translated(heroPost.excerpt_translations, heroPost.excerpt) : t('home.heroFallbackBody')}</p>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            <section className="py-16">
                <Container>
                    <div className="mb-8 flex items-end justify-between gap-4">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#cb5b4c]">{t('home.latestLabel')}</p>
                            <h2 className="mt-3 text-3xl font-bold text-slate-900">{t('home.latestTitle')}</h2>
                        </div>
                        <Link href="/posts" className="text-sm font-semibold text-[#cb5b4c]">
                            {t('home.viewAll')}
                        </Link>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        {featuredPosts.length > 0 ? (
                            featuredPosts.map((post) => (
                                <article key={post.id} className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/85 shadow-sm">
                                    <img
                                        src={post.cover_image ?? 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80'}
                                        alt={translated(post.title_translations, post.title)}
                                        className="h-60 w-full object-cover"
                                    />
                                    <div className="p-6">
                                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#cb5b4c]">
                                            {post.destination ? translated(post.destination.title_translations, post.destination.title) : t('home.newDestination')}
                                        </p>
                                        <h3 className="mt-3 text-2xl font-bold text-slate-900">{translated(post.title_translations, post.title)}</h3>
                                        <p className="mt-3 text-sm leading-7 text-slate-600">{translated(post.excerpt_translations, post.excerpt)}</p>
                                        <Link href={`/posts/${post.slug}`} className="mt-5 inline-flex text-sm font-semibold text-[#cb5b4c]">
                                            {t('home.latestRead')}
                                        </Link>
                                    </div>
                                </article>
                            ))
                        ) : (
                            <div className="rounded-[1.75rem] border border-dashed border-[#cb5b4c]/20 bg-white/70 p-10 text-slate-500 lg:col-span-3">
                                {t('home.emptyLatest')}
                            </div>
                        )}
                    </div>
                </Container>
            </section>

            <section className="py-16">
                <Container>
                    <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#cb5b4c]">{t('home.mapLabel')}</p>
                            <h2 className="mt-3 text-3xl font-bold text-slate-900">{t('home.mapTitle')}</h2>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {continentOptions.map((option) => {
                                const isActive = selectedContinent === option;

                                return (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => setSelectedContinent(option)}
                                        className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                                            isActive
                                                ? 'bg-[#0f766e] text-white shadow-lg'
                                                : 'border border-[#0f766e]/15 bg-white/80 text-[#0f766e] hover:bg-white'
                                        }`}
                                    >
                                        {option === allContinentsLabel ? t('continents.all') : continentLabel(option)}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <TravelMap locations={filteredMapLocations} focusRegion={selectedContinent} />

                        <div className="grid gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
                            <div className="rounded-[2.2rem] bg-[linear-gradient(145deg,#bf5448_0%,#d56a56_50%,#ef9d66_100%)] p-8 text-white shadow-[0_24px_60px_rgba(203,91,76,0.28)]">
                                <p className="text-sm font-bold uppercase tracking-[0.25em] text-white/72">{t('home.overviewLabel')}</p>
                                <h3 className="mt-4 text-3xl font-black leading-tight">
                                    {selectedContinent === allContinentsLabel
                                        ? t('home.overviewAllTitle')
                                        : t('home.overviewRegionTitle', { region: continentLabel(selectedContinent) })}
                                </h3>
                                <p className="mt-4 text-base leading-8 text-white/88">
                                    {selectedContinent === allContinentsLabel ? t('home.overviewAllBody') : t('home.overviewRegionBody')}
                                </p>

                                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                                    <div className="rounded-[1.4rem] border border-white/20 bg-white/12 px-4 py-4 backdrop-blur-sm">
                                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">{t('home.locationsLabel')}</p>
                                        <p className="mt-2 text-3xl font-black">{filteredDestinations.length}</p>
                                    </div>
                                    <div className="rounded-[1.4rem] border border-white/20 bg-white/12 px-4 py-4 backdrop-blur-sm">
                                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">{t('home.activePins')}</p>
                                        <p className="mt-2 text-3xl font-black">{filteredMapLocations.length}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-[2.2rem] border border-white/70 bg-white/80 p-3 shadow-[0_18px_50px_rgba(15,118,110,0.08)] backdrop-blur-sm">
                                <div className="flex flex-wrap items-center justify-between gap-3 px-3 pb-4 pt-2">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#0f766e]">{t('home.locationsInView')}</p>
                                        <h3 className="mt-1 text-2xl font-black text-slate-900">
                                            {selectedContinent === allContinentsLabel
                                                ? t('home.locationsTitle')
                                                : t('home.locationsRegionTitle', { region: continentLabel(selectedContinent) })}
                                        </h3>
                                    </div>
                                    <p className="text-sm text-slate-500">{t('home.locationsHint')}</p>
                                </div>

                                <div className="max-h-[420px] overflow-y-auto px-2 pb-2 pr-1 [scrollbar-color:#0f766e_transparent] [scrollbar-width:thin]">
                                    <div className="grid gap-4">
                                        {filteredDestinations.length > 0 ? (
                                            filteredDestinations.map((destination) => (
                                                <Link
                                                    key={destination.id}
                                                    href={`/destinations/${destination.slug}`}
                                                    className="flex items-center gap-4 rounded-[1.6rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(247,252,251,0.98)_100%)] p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                                                >
                                                    <img
                                                        src={destination.cover_image ?? 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80'}
                                                    alt={translated(destination.title_translations, destination.title)}
                                                        className="h-20 w-20 rounded-[1.1rem] object-cover"
                                                    />
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0f766e]">
                                                            {translated(destination.country_translations, destination.country)} / {count('story', destination.published_posts_count ?? 0)}
                                                        </p>
                                                        <h3 className="mt-2 text-xl font-black text-slate-900">{translated(destination.title_translations, destination.title)}</h3>
                                                        <p className="mt-1 text-sm text-slate-600">
                                                            {destination.continent ? `${continentLabel(destination.continent)} / ` : ''}
                                                            {translated(destination.city_translations, destination.city) || t('home.fallbackCity')}
                                                        </p>
                                                    </div>
                                                </Link>
                                            ))
                                        ) : (
                                            <div className="rounded-[1.75rem] border border-dashed border-[#cb5b4c]/20 bg-white/70 p-10 text-slate-500">
                                                {t('home.noLocations')}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
        </AppLayout>
    );
}
