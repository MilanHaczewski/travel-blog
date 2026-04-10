import { Link } from '@inertiajs/react';

import DashboardLayout from '@/Layouts/DashboardLayout';

type Props = {
    posts: Array<{
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

export default function DashboardPostsIndex({ posts }: Props) {
    return (
        <DashboardLayout>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Posts</h1>
                    <p className="mt-2 text-slate-600">Overzicht van alle reisverhalen.</p>
                </div>
                <Link href="/dashboard/posts/create" className="rounded-full bg-[#0f766e] px-5 py-3 text-sm font-semibold text-white">
                    Nieuwe post
                </Link>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/70 bg-white shadow-sm">
                {posts.map((post) => (
                    <div key={post.id} className="flex items-center justify-between border-b border-slate-100 px-6 py-4 last:border-b-0">
                        <div>
                            <p className="font-semibold text-slate-900">{post.title}</p>
                            <p className="text-sm text-slate-500">
                                {post.destination?.title ?? 'Geen bestemming'} • {post.category?.name ?? 'Geen categorie'}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#0f766e]">{post.status}</span>
                            <Link href={`/dashboard/posts/${post.id}/edit`} className="text-sm font-semibold text-slate-700">
                                Bewerken
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </DashboardLayout>
    );
}
