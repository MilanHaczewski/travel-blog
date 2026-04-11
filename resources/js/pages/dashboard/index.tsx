import { useI18n } from '@/lib/i18n';
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { LocalizedText } from '@/types';

type Props = {
    stats: {
        posts: number;
        destinations: number;
        categories: number;
        tags: number;
        publishedPosts: number;
        comments: number;
        admins: number;
        openInvitations: number;
    };
    recentPosts: Array<{
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

export default function DashboardIndex({ stats, recentPosts }: Props) {
    const { categoryName, status, t, translated } = useI18n();

    const statCards = [
        { label: t('dashboardHome.posts'), value: stats.posts },
        { label: t('dashboardHome.destinations'), value: stats.destinations },
        { label: t('dashboardHome.published'), value: stats.publishedPosts },
        { label: t('dashboardHome.comments'), value: stats.comments },
        { label: t('dashboardHome.admins'), value: stats.admins },
        { label: t('dashboardHome.openInvites'), value: stats.openInvitations },
    ];

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">{t('dashboardHome.heading')}</h1>
                <p className="mt-2 max-w-2xl text-slate-600">{t('dashboardHome.body')}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {statCards.map((card) => (
                    <div key={card.label} className="rounded-3xl border border-white/70 bg-white p-6 shadow-sm">
                        <p className="text-sm text-slate-500">{card.label}</p>
                        <h2 className="mt-2 text-3xl font-bold text-slate-900">{card.value}</h2>
                    </div>
                ))}
            </div>

            <div className="mt-8 rounded-3xl border border-white/70 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-slate-900">{t('dashboardHome.recentPosts')}</h3>
                <div className="mt-4 space-y-4">
                    {recentPosts.map((post) => (
                        <div key={post.id} className="flex items-center justify-between rounded-2xl bg-[#f7f3eb] px-4 py-3">
                            <div>
                                <p className="font-semibold text-slate-900">{translated(post.title_translations, post.title)}</p>
                                <p className="text-sm text-slate-500">
                                    {post.destination ? translated(post.destination.title_translations, post.destination.title) : t('dashboardHome.noDestination')} / {post.category?.name ? categoryName(post.category.slug, post.category.name) : t('dashboardHome.noCategory')}
                                </p>
                            </div>
                            <span className="rounded-full bg-[#e6f4f1] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#0f766e]">
                                {status('post', post.status)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
