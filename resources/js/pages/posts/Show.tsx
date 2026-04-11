import { Head, Link, useForm, usePage } from '@inertiajs/react';
import type { FormEvent } from 'react';

import Container from '@/components/container';
import { useI18n } from '@/lib/i18n';
import AppLayout from '@/Layouts/AppLayout';
import type { LocalizedText } from '@/types';

type Comment = {
    id: number;
    body: string;
    created_at: string;
    guest_name: string | null;
    author?: {
        id: number;
        name: string;
    } | null;
};

type Post = {
    id: number;
    title: string;
    title_translations?: LocalizedText | null;
    slug: string;
    excerpt: string | null;
    excerpt_translations?: LocalizedText | null;
    body: string;
    body_translations?: LocalizedText | null;
    cover_image: string | null;
    destination?: {
        title: string;
        title_translations?: LocalizedText | null;
        slug: string;
        country: string;
        country_translations?: LocalizedText | null;
    } | null;
    category?: {
        name: string;
        slug?: string;
    } | null;
    tags?: Array<{
        id: number;
        name: string;
        name_translations?: LocalizedText | null;
    }>;
    media?: Array<{
        id: number;
        type: 'image' | 'video';
        path: string;
        original_name?: string | null;
    }>;
    author?: {
        name: string;
    } | null;
    comments?: Comment[];
};

type Props = {
    post: Post;
    relatedPosts: Post[];
};

export default function PostShow({ post, relatedPosts }: Props) {
    const { categoryName, formatDate, t, translated } = useI18n();
    const { auth } = usePage().props as {
        auth: {
            user?: {
                name: string;
                email: string;
            } | null;
        };
    };

    const form = useForm({
        guest_name: '',
        guest_email: '',
        body: '',
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.post(`/posts/${post.slug}/comments`, {
            preserveScroll: true,
            onSuccess: () => form.reset('body'),
        });
    };

    return (
        <AppLayout>
            <Head title={translated(post.title_translations, post.title)} />

            <article className="pb-20 pt-16">
                <Container className="max-w-5xl">
                    <Link href="/posts" className="text-sm font-semibold text-[#0f766e]">
                        {t('postsShow.back')}
                    </Link>

                    <p className="mt-6 text-sm font-bold uppercase tracking-[0.25em] text-[#0f766e]">
                        {post.destination ? translated(post.destination.title_translations, post.destination.title) : ''}
                        {post.category?.name ? ` / ${categoryName(post.category.slug, post.category.name)}` : ''}
                    </p>
                    <h1 className="mt-4 text-5xl font-black leading-tight text-slate-900">{translated(post.title_translations, post.title)}</h1>
                    <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">{translated(post.excerpt_translations, post.excerpt)}</p>

                    <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-500">
                        <span>{post.author?.name ?? t('postsShow.siteName')}</span>
                        {post.destination?.country ? <span>{translated(post.destination.country_translations, post.destination.country)}</span> : null}
                    </div>
                </Container>

                <Container className="mt-10 max-w-6xl">
                    <img
                        src={post.cover_image ?? 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80'}
                        alt={translated(post.title_translations, post.title)}
                        className="h-[500px] w-full rounded-[2rem] object-cover shadow-lg"
                    />
                </Container>

                <Container className="mt-12 grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_280px]">
                    <div className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-sm">
                        <div className="space-y-6 text-lg leading-9 text-slate-700">
                            {translated(post.body_translations, post.body)
                                .split('\n')
                                .filter(Boolean)
                                .map((paragraph, index) => (
                                    <p key={`${post.id}-${index}`}>{paragraph}</p>
                                ))}
                        </div>
                    </div>

                    <aside className="space-y-6">
                        <div className="rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-slate-900">{t('postsShow.tags')}</h2>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {post.tags?.map((tag) => (
                                    <span key={tag.id} className="rounded-full bg-[#e6f4f1] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#0f766e]">
                                        {translated(tag.name_translations, tag.name)}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {post.destination && (
                            <div className="rounded-[2rem] bg-[#0f766e] p-6 text-white shadow-sm">
                                <p className="text-sm uppercase tracking-[0.2em] text-white/70">{t('postsShow.destination')}</p>
                                <h2 className="mt-3 text-2xl font-bold">{translated(post.destination.title_translations, post.destination.title)}</h2>
                                <p className="mt-2 text-white/80">{translated(post.destination.country_translations, post.destination.country)}</p>
                                <Link href={`/destinations/${post.destination.slug}`} className="mt-5 inline-flex text-sm font-semibold text-white">
                                    {t('postsShow.viewDestination')}
                                </Link>
                            </div>
                        )}
                    </aside>
                </Container>

                {post.media?.length ? (
                    <Container className="mt-12 max-w-6xl">
                        <div className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-sm">
                            <h2 className="text-3xl font-bold text-slate-900">{t('postsShow.mediaHeading')}</h2>
                            <div className="mt-6 grid gap-4 md:grid-cols-2">
                                {post.media.map((media) =>
                                    media.type === 'image' ? (
                                        <img key={media.id} src={media.path} alt={media.original_name ?? t('postsShow.mediaHeading')} className="h-72 w-full rounded-[1.5rem] object-cover" />
                                    ) : (
                                        <video key={media.id} src={media.path} controls className="h-72 w-full rounded-[1.5rem] object-cover" />
                                    ),
                                )}
                            </div>
                        </div>
                    </Container>
                ) : null}

                <Container className="mt-16 max-w-6xl">
                    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
                        <div className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-sm">
                            <div className="flex items-end justify-between gap-4">
                                <div>
                                    <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#0f766e]">{t('postsShow.comments')}</p>
                                    <h2 className="mt-3 text-3xl font-bold text-slate-900">{t('postsShow.reactions')}</h2>
                                </div>
                                <span className="rounded-full bg-[#e6f4f1] px-4 py-2 text-sm font-semibold text-[#0f766e]">
                                    {post.comments?.length ?? 0}
                                </span>
                            </div>

                            <div className="mt-8 space-y-5">
                                {post.comments?.length ? (
                                    post.comments.map((comment) => (
                                        <div key={comment.id} className="rounded-3xl bg-[#f7f3eb] p-5">
                                            <div className="flex items-center justify-between gap-4">
                                                <p className="font-semibold text-slate-900">{comment.author?.name ?? comment.guest_name ?? t('postsShow.guest')}</p>
                                                <p className="text-sm text-slate-500">{formatDate(comment.created_at)}</p>
                                            </div>
                                            <p className="mt-3 text-sm leading-7 text-slate-600">{comment.body}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-slate-500">{t('postsShow.noComments')}</p>
                                )}
                            </div>
                        </div>

                        <form onSubmit={submit} className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-sm">
                            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#0f766e]">{t('postsShow.addComment')}</p>
                            <h2 className="mt-3 text-3xl font-bold text-slate-900">{t('postsShow.leaveSomething')}</h2>
                            <p className="mt-3 text-slate-600">
                                {auth?.user ? t('postsShow.loggedInAs', { name: auth.user.name }) : t('postsShow.visitorCopy')}
                            </p>

                            {!auth?.user ? (
                                <div className="mt-6 grid gap-5">
                                    <label className="space-y-2">
                                        <span className="text-sm font-semibold text-slate-700">{t('postsShow.name')}</span>
                                        <input
                                            value={form.data.guest_name}
                                            onChange={(event) => form.setData('guest_name', event.target.value)}
                                            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                                        />
                                        {form.errors.guest_name ? <p className="text-sm text-rose-600">{form.errors.guest_name}</p> : null}
                                    </label>

                                    <label className="space-y-2">
                                        <span className="text-sm font-semibold text-slate-700">{t('postsShow.email')}</span>
                                        <input
                                            type="email"
                                            value={form.data.guest_email}
                                            onChange={(event) => form.setData('guest_email', event.target.value)}
                                            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                                        />
                                        {form.errors.guest_email ? <p className="text-sm text-rose-600">{form.errors.guest_email}</p> : null}
                                    </label>
                                </div>
                            ) : null}

                            <label className="mt-6 block space-y-2">
                                <span className="text-sm font-semibold text-slate-700">{t('postsShow.comment')}</span>
                                <textarea
                                    value={form.data.body}
                                    onChange={(event) => form.setData('body', event.target.value)}
                                    className="min-h-36 w-full rounded-2xl border border-slate-200 px-4 py-3"
                                />
                                {form.errors.body ? <p className="text-sm text-rose-600">{form.errors.body}</p> : null}
                            </label>

                            <button type="submit" disabled={form.processing} className="mt-6 rounded-full bg-[#0f766e] px-6 py-3 text-sm font-semibold text-white disabled:opacity-60">
                                {t('postsShow.postComment')}
                            </button>
                        </form>
                    </div>
                </Container>

                {relatedPosts.length > 0 && (
                    <Container className="mt-16 max-w-6xl">
                        <h2 className="text-3xl font-bold text-slate-900">{t('postsShow.moreFromDestination')}</h2>
                        <div className="mt-6 grid gap-6 md:grid-cols-3">
                            {relatedPosts.map((relatedPost) => (
                                <Link
                                    key={relatedPost.id}
                                    href={`/posts/${relatedPost.slug}`}
                                    className="rounded-[1.5rem] border border-white/70 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1"
                                >
                                    <h3 className="text-xl font-bold text-slate-900">{translated(relatedPost.title_translations, relatedPost.title)}</h3>
                                    <p className="mt-3 text-sm leading-7 text-slate-600">{translated(relatedPost.excerpt_translations, relatedPost.excerpt)}</p>
                                    <p className="mt-4 text-sm font-semibold text-[#0f766e]">{t('postsShow.readStory')}</p>
                                </Link>
                            ))}
                        </div>
                    </Container>
                )}
            </article>
        </AppLayout>
    );
}
