import { Head, Link } from '@inertiajs/react';

import Container from '@/components/container';
import AppLayout from '@/Layouts/AppLayout';

type Post = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    cover_image: string | null;
    destination?: {
        title: string;
    } | null;
    category?: {
        name: string;
    } | null;
};

type Props = {
    posts: Post[];
    featuredPost?: Post | null;
};

export default function PostsIndex({ posts, featuredPost }: Props) {
    return (
        <AppLayout>
            <Head title="Verhalen" />

            <section className="pb-10 pt-16">
                <Container>
                    <div className="rounded-[2rem] bg-[#0f766e] p-10 text-white">
                        <p className="text-sm font-bold uppercase tracking-[0.3em] text-white/70">Travel stories</p>
                        <h1 className="mt-4 max-w-3xl text-5xl font-black">Verhalen, tips en routes uit de plekken waar we bleven hangen.</h1>
                        <p className="mt-4 max-w-2xl text-lg leading-8 text-white/85">
                            Hier vind je alle blogposts, van city guides tot langzame roadtripdagen.
                        </p>
                    </div>
                </Container>
            </section>

            {featuredPost && (
                <section className="py-8">
                    <Container>
                        <article className="grid overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-sm lg:grid-cols-[1.1fr_0.9fr]">
                            <img
                                src={featuredPost.cover_image ?? 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=1200&q=80'}
                                alt={featuredPost.title}
                                className="h-full min-h-[320px] w-full object-cover"
                            />
                            <div className="p-8">
                                <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#0f766e]">Uitgelicht</p>
                                <h2 className="mt-4 text-4xl font-bold text-slate-900">{featuredPost.title}</h2>
                                <p className="mt-4 leading-8 text-slate-600">{featuredPost.excerpt}</p>
                                <Link href={`/posts/${featuredPost.slug}`} className="mt-6 inline-flex rounded-full bg-[#0f766e] px-5 py-3 text-sm font-semibold text-white">
                                    Lees dit verhaal
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
                                    alt={post.title}
                                    className="h-56 w-full object-cover"
                                />
                                <div className="p-6">
                                    <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#0f766e]">
                                        <span>{post.destination?.title ?? 'Onbekende plek'}</span>
                                        {post.category?.name ? <span>{post.category.name}</span> : null}
                                    </div>
                                    <h2 className="mt-4 text-2xl font-bold text-slate-900">{post.title}</h2>
                                    <p className="mt-3 text-sm leading-7 text-slate-600">{post.excerpt}</p>
                                    <Link href={`/posts/${post.slug}`} className="mt-5 inline-flex text-sm font-semibold text-[#0f766e]">
                                        Verder lezen
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
