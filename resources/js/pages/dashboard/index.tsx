import DashboardLayout from '@/Layouts/DashboardLayout';

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
        status: string;
        destination?: {
            title: string;
        } | null;
        category?: {
            name: string;
        } | null;
    }>;
};

const statCards = (stats: Props['stats']) => [
    { label: 'Posts', value: stats.posts },
    { label: 'Bestemmingen', value: stats.destinations },
    { label: 'Gepubliceerd', value: stats.publishedPosts },
    { label: 'Comments', value: stats.comments },
    { label: 'Admins', value: stats.admins },
    { label: 'Open invites', value: stats.openInvitations },
];

export default function DashboardIndex({ stats, recentPosts }: Props) {
    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                <p className="mt-2 max-w-2xl text-slate-600">
                    Beheer hier content, administratoren en uitnodigingen. Als master-admin houd jij de controle over wie toegang krijgt en
                    wie gedeactiveerd of gearchiveerd wordt.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {statCards(stats).map((card) => (
                    <div key={card.label} className="rounded-3xl border border-white/70 bg-white p-6 shadow-sm">
                        <p className="text-sm text-slate-500">{card.label}</p>
                        <h2 className="mt-2 text-3xl font-bold text-slate-900">{card.value}</h2>
                    </div>
                ))}
            </div>

            <div className="mt-8 rounded-3xl border border-white/70 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-slate-900">Recente posts</h3>
                <div className="mt-4 space-y-4">
                    {recentPosts.map((post) => (
                        <div key={post.id} className="flex items-center justify-between rounded-2xl bg-[#f7f3eb] px-4 py-3">
                            <div>
                                <p className="font-semibold text-slate-900">{post.title}</p>
                                <p className="text-sm text-slate-500">
                                    {post.destination?.title ?? 'Geen bestemming'} • {post.category?.name ?? 'Geen categorie'}
                                </p>
                            </div>
                            <span className="rounded-full bg-[#e6f4f1] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#0f766e]">
                                {post.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
