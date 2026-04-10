import { Head, Link } from '@inertiajs/react';

import Container from '@/components/container';
import AppLayout from '@/Layouts/AppLayout';

type Post = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    body: string;
    cover_image: string | null;
    destination?: {
        title: string;
        slug: string;
        country: string;
    } | null;
    category?: {
        name: string;
    } | null;
    tags?: Array<{
        id: number;
        name: string;
    }>;
    author?: {
        name: string;
    } | null;
};

type Props = {
    post: Post;
    relatedPosts: Post[];
};

export default function PostShow({ post, relatedPosts }: Props) {
    return (
        <AppLayout>
            <Head title={post.title} />

            <article className="pb-20 pt-16">
                <Container className="max-w-5xl">
                    <Link href="/posts" className="text-sm font-semibold text-[#0f766e]">
                        Terug naar verhalen
                    </Link>

                    <p className="mt-6 text-sm font-bold uppercase tracking-[0.25em] text-[#0f766e]">
                        {post.destination?.title} {post.category?.name ? `• ${post.category.name}` : ''}
                    </p>
                    <h1 className="mt-4 text-5xl font-black leading-tight text-slate-900">{post.title}</h1>
                    <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">{post.excerpt}</p>

                    <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-500">
                        <span>{post.author?.name ?? 'Roamlog'}</span>
                        {post.destination?.country ? <span>{post.destination.country}</span> : null}
                    </div>
                </Container>

                <Container className="mt-10 max-w-6xl">
                    <img
                        src={post.cover_image ?? 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80'}
                        alt={post.title}
                        className="h-[500px] w-full rounded-[2rem] object-cover shadow-lg"
                    />
                </Container>

                <Container className="mt-12 grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_280px]">
                    <div className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-sm">
                        <div className="space-y-6 text-lg leading-9 text-slate-700">
                            {post.body
                                .split('\n')
                                .filter(Boolean)
                                .map((paragraph, index) => (
                                    <p key={`${post.id}-${index}`}>{paragraph}</p>
                                ))}
                        </div>
                    </div>

                    <aside className="space-y-6">
                        <div className="rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-slate-900">Tags</h2>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {post.tags?.map((tag) => (
                                    <span key={tag.id} className="rounded-full bg-[#e6f4f1] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#0f766e]">
                                        {tag.name}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {post.destination && (
                            <div className="rounded-[2rem] bg-[#0f766e] p-6 text-white shadow-sm">
                                <p className="text-sm uppercase tracking-[0.2em] text-white/70">Bestemming</p>
                                <h2 className="mt-3 text-2xl font-bold">{post.destination.title}</h2>
                                <p className="mt-2 text-white/80">{post.destination.country}</p>
                                <Link href={`/destinations/${post.destination.slug}`} className="mt-5 inline-flex text-sm font-semibold text-white">
                                    Bekijk bestemming
                                </Link>
                            </div>
                        )}
                    </aside>
                </Container>

                {relatedPosts.length > 0 && (
                    <Container className="mt-16 max-w-6xl">
                        <h2 className="text-3xl font-bold text-slate-900">Meer uit dezelfde bestemming</h2>
                        <div className="mt-6 grid gap-6 md:grid-cols-3">
                            {relatedPosts.map((relatedPost) => (
                                <Link
                                    key={relatedPost.id}
                                    href={`/posts/${relatedPost.slug}`}
                                    className="rounded-[1.5rem] border border-white/70 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1"
                                >
                                    <h3 className="text-xl font-bold text-slate-900">{relatedPost.title}</h3>
                                    <p className="mt-3 text-sm leading-7 text-slate-600">{relatedPost.excerpt}</p>
                                </Link>
                            ))}
                        </div>
                    </Container>
                )}
            </article>
        </AppLayout>
    );
}
