import { Head, Link } from '@inertiajs/react';

import Container from '@/components/container';
import { useI18n } from '@/lib/i18n';
import AppLayout from '@/Layouts/AppLayout';
import type { LocalizedText } from '@/types';

type Post = {
    id: number;
    title: string;
    title_translations?: LocalizedText | null;
    slug: string;
    excerpt: string | null;
    excerpt_translations?: LocalizedText | null;
    cover_image: string | null;
    category?: {
        name: string;
        slug?: string;
    } | null;
};

type Destination = {
    id: number;
    title: string;
    title_translations?: LocalizedText | null;
    country: string;
    country_translations?: LocalizedText | null;
    description: string | null;
    description_translations?: LocalizedText | null;
    cover_image: string | null;
    posts: Post[];
};

type Props = {
    destination: Destination;
};

export default function DestinationsShow({ destination }: Props) {
    const { categoryName, t, translated } = useI18n();

    return (
        <AppLayout>
            <Head title={translated(destination.title_translations, destination.title)} />

            <section className="pb-16 pt-16">
                <Container className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                    <div>
                        <Link href="/destinations" className="text-sm font-semibold text-[#0f766e]">
                            {t('destinationsShow.back')}
                        </Link>
                        <p className="mt-6 text-sm font-bold uppercase tracking-[0.28em] text-[#0f766e]">{translated(destination.country_translations, destination.country)}</p>
                        <h1 className="mt-4 text-5xl font-black text-slate-900">{translated(destination.title_translations, destination.title)}</h1>
                        <p className="mt-6 text-lg leading-8 text-slate-600">{translated(destination.description_translations, destination.description)}</p>
                    </div>

                    <img
                        src={destination.cover_image ?? 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1400&q=80'}
                        alt={translated(destination.title_translations, destination.title)}
                        className="h-[420px] w-full rounded-[2rem] object-cover shadow-lg"
                    />
                </Container>
            </section>

            <section className="pb-20">
                <Container>
                    <div className="mb-8">
                        <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#0f766e]">{t('destinationsShow.label')}</p>
                        <h2 className="mt-3 text-3xl font-bold text-slate-900">{t('destinationsShow.heading', { destination: translated(destination.title_translations, destination.title) })}</h2>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {destination.posts.map((post) => (
                            <article key={post.id} className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/85 shadow-sm">
                                <img
                                    src={post.cover_image ?? 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'}
                                    alt={translated(post.title_translations, post.title)}
                                    className="h-52 w-full object-cover"
                                />
                                <div className="p-6">
                                    {post.category?.name ? (
                                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0f766e]">{categoryName(post.category.slug, post.category.name)}</p>
                                    ) : null}
                                    <h3 className="mt-3 text-2xl font-bold text-slate-900">{translated(post.title_translations, post.title)}</h3>
                                    <p className="mt-3 text-sm leading-7 text-slate-600">{translated(post.excerpt_translations, post.excerpt)}</p>
                                    <Link href={`/posts/${post.slug}`} className="mt-5 inline-flex text-sm font-semibold text-[#0f766e]">
                                        {t('destinationsShow.readStory')}
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </Container>
            </section>
        </AppLayout>
    );
}
