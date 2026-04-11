import { Link, router, usePage } from '@inertiajs/react';

export default function Navbar() {
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <header className="sticky top-0 z-30 border-b border-white/40 bg-[#fff8ef]/90 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <Link href="/" className="flex items-center gap-3 text-xl font-black uppercase tracking-[0.18em] text-[#cb5b4c]">
                    <img src="/tulips-and-arepas.png" alt="Tulips and Arepas logo" className="h-12 w-12 rounded-2xl object-cover shadow-sm" />
                    <span>Tulips & Arepas</span>
                </Link>

                <nav className="flex items-center gap-6 text-sm font-semibold text-slate-700">
                    <Link href="/" className="transition hover:text-[#cb5b4c]">
                        Home
                    </Link>
                    <Link href="/posts" className="transition hover:text-[#cb5b4c]">
                        Verhalen
                    </Link>
                    <Link href="/destinations" className="transition hover:text-[#cb5b4c]">
                        Bestemmingen
                    </Link>
                    <Link href="/about" className="transition hover:text-[#cb5b4c]">
                        Over ons
                    </Link>
                </nav>

                <div className="flex items-center gap-3">
                    {user ? (
                        <>
                            <Link
                                href="/dashboard"
                                className="rounded-full border border-[#cb5b4c]/20 bg-white/70 px-4 py-2 text-sm font-semibold text-[#cb5b4c]"
                            >
                                Dashboard
                            </Link>
                            <button
                                type="button"
                                onClick={() => router.post('/logout')}
                                className="rounded-full bg-[#cb5b4c] px-4 py-2 text-sm font-semibold text-white"
                            >
                                Uitloggen
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="rounded-full bg-[#cb5b4c] px-4 py-2 text-sm font-semibold text-white"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
