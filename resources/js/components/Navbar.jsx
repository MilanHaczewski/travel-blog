import { Link, router, usePage } from '@inertiajs/react';

import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useI18n } from '@/lib/i18n';

export default function Navbar() {
    const { auth } = usePage().props;
    const user = auth?.user;
    const { t } = useI18n();

    return (
        <header className="sticky top-0 z-30 border-b border-white/40 bg-[#fff8ef]/90 backdrop-blur">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
                <Link href="/" className="flex items-center gap-3 text-xl font-black uppercase tracking-[0.18em] text-[#cb5b4c]">
                    <img src="/tulips-and-arepas.png" alt="Tulips and Arepas logo" className="h-12 w-12 rounded-2xl object-cover shadow-sm" />
                    <span>Tulips & Arepas</span>
                </Link>

                <nav className="flex items-center gap-6 text-sm font-semibold text-slate-700">
                    <Link href="/" className="transition hover:text-[#cb5b4c]">
                        {t('navbar.home')}
                    </Link>
                    <Link href="/posts" className="transition hover:text-[#cb5b4c]">
                        {t('navbar.stories')}
                    </Link>
                    <Link href="/destinations" className="transition hover:text-[#cb5b4c]">
                        {t('navbar.destinations')}
                    </Link>
                    <Link href="/about" className="transition hover:text-[#cb5b4c]">
                        {t('navbar.about')}
                    </Link>
                </nav>

                <div className="flex items-center gap-3">
                    <LanguageSwitcher />
                    {user ? (
                        <>
                            <Link
                                href="/dashboard"
                                className="rounded-full border border-[#cb5b4c]/20 bg-white/70 px-4 py-2 text-sm font-semibold text-[#cb5b4c]"
                            >
                                {t('navbar.dashboard')}
                            </Link>
                            <button
                                type="button"
                                onClick={() => router.post('/logout')}
                                className="rounded-full bg-[#cb5b4c] px-4 py-2 text-sm font-semibold text-white"
                            >
                                {t('navbar.logout')}
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="rounded-full bg-[#cb5b4c] px-4 py-2 text-sm font-semibold text-white"
                        >
                            {t('navbar.login')}
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
