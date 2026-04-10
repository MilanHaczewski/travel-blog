import DashboardLayout from '@/Layouts/DashboardLayout';

type Props = {
    stats: {
        posts: number;
        destinations: number;
        categories: number;
        tags: number;
        publishedPosts: number;
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

export default function DashboardIndex({ stats, recentPosts }: Props) {
    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                <p className="mt-2 text-slate-600">Beheer hier de content en houd overzicht over je travel blog.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-3xl border border-white/70 bg-white p-6 shadow-sm">
                    <p className="text-sm text-slate-500">Totaal posts</p>
                    <h2 className="mt-2 text-3xl font-bold text-slate-900">{stats.posts}</h2>
                </div>
                <div className="rounded-3xl border border-white/70 bg-white p-6 shadow-sm">
                    <p className="text-sm text-slate-500">Bestemmingen</p>
                    <h2 className="mt-2 text-3xl font-bold text-slate-900">{stats.destinations}</h2>
                </div>
                <div className="rounded-3xl border border-white/70 bg-white p-6 shadow-sm">
                    <p className="text-sm text-slate-500">Categorieen</p>
                    <h2 className="mt-2 text-3xl font-bold text-slate-900">{stats.categories}</h2>
                </div>
                <div className="rounded-3xl border border-white/70 bg-white p-6 shadow-sm">
                    <p className="text-sm text-slate-500">Gepubliceerd</p>
                    <h2 className="mt-2 text-3xl font-bold text-slate-900">{stats.publishedPosts}</h2>
                </div>
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
