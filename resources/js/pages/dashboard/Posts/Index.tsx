import { Link, router } from '@inertiajs/react';

import { useI18n } from '@/lib/i18n';
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { LocalizedText } from '@/types';

type Props = {
    posts: Array<{
        id: number;
        title: string;
        title_translations?: LocalizedText | null;
        status: string;
        destination?: {
            title: string;
            title_translations?: LocalizedText | null;
        } | null;
        category?: {
            name: string;
            slug?: string;
        } | null;
    }>;
};

export default function DashboardPostsIndex({ posts }: Props) {
    const { categoryName, status, t, translated } = useI18n();

    const removePost = (post: Props['posts'][number]) => {
        if (!window.confirm(t('dashboardPosts.deleteConfirm', { title: translated(post.title_translations, post.title) }))) {
            return;
        }

        router.delete(`/dashboard/posts/${post.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <DashboardLayout>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">{t('dashboardLayout.posts')}</h1>
                    <p className="mt-2 text-slate-600">{t('dashboardPosts.body')}</p>
                </div>
                <Link href="/dashboard/posts/create" className="rounded-full bg-[#0f766e] px-5 py-3 text-sm font-semibold text-white">
                    {t('dashboardPosts.newPost')}
                </Link>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/70 bg-white shadow-sm">
                {posts.map((post) => (
                    <div key={post.id} className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-4 last:border-b-0">
                        <div>
                            <p className="font-semibold text-slate-900">{translated(post.title_translations, post.title)}</p>
                            <p className="text-sm text-slate-500">
                                {post.destination ? translated(post.destination.title_translations, post.destination.title) : t('dashboardPosts.noDestination')} / {post.category?.name ? categoryName(post.category.slug, post.category.name) : t('dashboardPosts.noCategory')}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#0f766e]">{status('post', post.status)}</span>
                            <Link href={`/dashboard/posts/${post.id}/edit`} className="text-sm font-semibold text-slate-700">
                                {t('dashboardPosts.edit')}
                            </Link>
                            <button type="button" onClick={() => removePost(post)} className="text-sm font-semibold text-[#cb5b4c]">
                                {t('dashboardPosts.delete')}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </DashboardLayout>
    );
}
