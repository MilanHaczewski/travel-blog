import { Link, router, usePage } from '@inertiajs/react';

import FlashBanner from '@/components/FlashBanner';

export default function DashboardLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <div className="min-h-screen bg-[#f7f3eb]">
            <div className="flex min-h-screen">
                <aside className="flex min-h-screen w-72 flex-col border-r border-[#d5cfc2] bg-white p-6">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#0f766e]">Roamlog Admin</p>
                        <h2 className="mt-3 text-2xl font-bold text-slate-900">Dashboard</h2>
                        {user && (
                            <div className="mt-4 rounded-2xl bg-[#f7f3eb] p-4 text-sm text-slate-600">
                                <p className="font-semibold text-slate-900">{user.name}</p>
                                <p>{user.role === 'master' ? 'Master admin' : 'Administrator'}</p>
                            </div>
                        )}
                    </div>

                    <nav className="mt-8 space-y-3 text-sm font-semibold text-slate-700">
                        <Link href="/dashboard" className="block rounded-xl px-4 py-3 transition hover:bg-[#e6f4f1]">
                            Overzicht
                        </Link>
                        <Link href="/dashboard/posts" className="block rounded-xl px-4 py-3 transition hover:bg-[#e6f4f1]">
                            Posts
                        </Link>
                        <Link href="/dashboard/destinations" className="block rounded-xl px-4 py-3 transition hover:bg-[#e6f4f1]">
                            Bestemmingen
                        </Link>
                        <Link href="/dashboard/invitations" className="block rounded-xl px-4 py-3 transition hover:bg-[#e6f4f1]">
                            Invite links
                        </Link>
                        <Link href="/dashboard/tags" className="block rounded-xl px-4 py-3 transition hover:bg-[#e6f4f1]">
                            Tags
                        </Link>
                        {user?.role === 'master' ? (
                            <Link href="/dashboard/admin-users" className="block rounded-xl px-4 py-3 transition hover:bg-[#e6f4f1]">
                                Administrators
                            </Link>
                        ) : null}
                    </nav>

                    <div className="mt-auto space-y-3">
                        <Link href="/" className="block rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
                            Naar de site
                        </Link>
                        <button
                            type="button"
                            onClick={() => router.post('/logout')}
                            className="block w-full rounded-xl bg-[#0f766e] px-4 py-3 text-sm font-semibold text-white"
                        >
                            Uitloggen
                        </button>
                    </div>
                </aside>

                <div className="flex-1">
                    <FlashBanner />
                    <main className="p-8">{children}</main>
                </div>
            </div>
        </div>
    );
}
