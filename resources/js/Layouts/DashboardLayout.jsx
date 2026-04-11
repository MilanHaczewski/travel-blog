import { Link, router, usePage } from '@inertiajs/react';

import FlashBanner from '@/components/FlashBanner';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useI18n } from '@/lib/i18n';

export default function DashboardLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const { t } = useI18n();

    return (
        <div className="min-h-screen bg-[#f7f3eb]">
            <div className="flex min-h-screen">
                <aside className="flex min-h-screen w-72 flex-col border-r border-[#d5cfc2] bg-white p-6">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#0f766e]">{t('dashboardLayout.brand')}</p>
                        <h2 className="mt-3 text-2xl font-bold text-slate-900">{t('dashboardLayout.dashboard')}</h2>
                        {user && (
                            <div className="mt-4 rounded-2xl bg-[#f7f3eb] p-4 text-sm text-slate-600">
                                <p className="font-semibold text-slate-900">{user.name}</p>
                                <p>{user.role === 'master' ? t('dashboardLayout.masterRole') : t('dashboardLayout.administratorRole')}</p>
                            </div>
                        )}
                    </div>

                    <nav className="mt-8 space-y-3 text-sm font-semibold text-slate-700">
                        <Link href="/dashboard" className="block rounded-xl px-4 py-3 transition hover:bg-[#e6f4f1]">
                            {t('dashboardLayout.overview')}
                        </Link>
                        <Link href="/dashboard/posts" className="block rounded-xl px-4 py-3 transition hover:bg-[#e6f4f1]">
                            {t('dashboardLayout.posts')}
                        </Link>
                        <Link href="/dashboard/destinations" className="block rounded-xl px-4 py-3 transition hover:bg-[#e6f4f1]">
                            {t('dashboardLayout.destinations')}
                        </Link>
                        <Link href="/dashboard/invitations" className="block rounded-xl px-4 py-3 transition hover:bg-[#e6f4f1]">
                            {t('dashboardLayout.invites')}
                        </Link>
                        <Link href="/dashboard/tags" className="block rounded-xl px-4 py-3 transition hover:bg-[#e6f4f1]">
                            {t('dashboardLayout.tags')}
                        </Link>
                        {user?.role === 'master' ? (
                            <Link href="/dashboard/admin-users" className="block rounded-xl px-4 py-3 transition hover:bg-[#e6f4f1]">
                                {t('dashboardLayout.administrators')}
                            </Link>
                        ) : null}
                    </nav>

                    <div className="mt-auto space-y-3">
                        <LanguageSwitcher />
                        <Link href="/" className="block rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
                            {t('dashboardLayout.toSite')}
                        </Link>
                        <button
                            type="button"
                            onClick={() => router.post('/logout')}
                            className="block w-full rounded-xl bg-[#0f766e] px-4 py-3 text-sm font-semibold text-white"
                        >
                            {t('dashboardLayout.logout')}
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
