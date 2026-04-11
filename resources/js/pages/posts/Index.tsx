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
    destination?: {
        title: string;
        title_translations?: LocalizedText | null;
    } | null;
    category?: {
        name: string;
        slug?: string;
    } | null;
};

type Props = {
    posts: Post[];
    featuredPost?: Post | null;
};

export default function PostsIndex({ posts, featuredPost }: Props) {
    const { categoryName, t, translated } = useI18n();

    return (
        <AppLayout>
            <Head title={t('postsIndex.title')} />

            <section className="pb-10 pt-16">
                <Container>
                    <div className="rounded-[2rem] bg-[#cb5b4c] p-10 text-white">
                        <p className="text-sm font-bold uppercase tracking-[0.3em] text-white/70">Tulips & Arepas</p>
                        <h1 className="mt-4 max-w-3xl text-5xl font-black">{t('postsIndex.heading')}</h1>
                        <p className="mt-4 max-w-2xl text-lg leading-8 text-white/85">{t('postsIndex.body')}</p>
                    </div>
                </Container>
            </section>

            {featuredPost && (
                <section className="py-8">
                    <Container>
                        <article className="grid overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-sm lg:grid-cols-[1.1fr_0.9fr]">
                            <img
                                src={featuredPost.cover_image ?? 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=1200&q=80'}
                                alt={translated(featuredPost.title_translations, featuredPost.title)}
                                className="h-full min-h-[320px] w-full object-cover"
                            />
                            <div className="p-8">
                                <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#cb5b4c]">{t('postsIndex.featuredLabel')}</p>
                                <h2 className="mt-4 text-4xl font-bold text-slate-900">{translated(featuredPost.title_translations, featuredPost.title)}</h2>
                                <p className="mt-4 leading-8 text-slate-600">{translated(featuredPost.excerpt_translations, featuredPost.excerpt)}</p>
                                <Link href={`/posts/${featuredPost.slug}`} className="mt-6 inline-flex rounded-full bg-[#cb5b4c] px-5 py-3 text-sm font-semibold text-white">
                                    {t('postsIndex.readFeatured')}
                                </Link>
                            </div>
                        </article>
                    </Container>
                </section>
            )}

            <section className="py-12">
                <Container>
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {posts.map((post) => (
                            <article key={post.id} className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/85 shadow-sm">
                                <img
                                    src={post.cover_image ?? 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1200&q=80'}
                                    alt={translated(post.title_translations, post.title)}
                                    className="h-56 w-full object-cover"
                                />
                                <div className="p-6">
                                    <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#cb5b4c]">
                                        <span>{post.destination ? translated(post.destination.title_translations, post.destination.title) : t('postsIndex.unknownPlace')}</span>
                                        {post.category?.name ? <span>{categoryName(post.category.slug, post.category.name)}</span> : null}
                                    </div>
                                    <h2 className="mt-4 text-2xl font-bold text-slate-900">{translated(post.title_translations, post.title)}</h2>
                                    <p className="mt-3 text-sm leading-7 text-slate-600">{translated(post.excerpt_translations, post.excerpt)}</p>
                                    <Link href={`/posts/${post.slug}`} className="mt-5 inline-flex text-sm font-semibold text-[#cb5b4c]">
                                        {t('postsIndex.readMore')}
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
