import { Link } from '@inertiajs/react';

export default function Navbar() {
    return (
        <header className="sticky top-0 z-30 border-b border-white/40 bg-[#f4efe6]/90 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <Link href="/" className="text-2xl font-black uppercase tracking-[0.2em] text-[#0f766e]">
                    Roamlog
                </Link>

                <nav className="flex items-center gap-6 text-sm font-semibold text-slate-700">
                    <Link href="/" className="transition hover:text-[#0f766e]">
                        Home
                    </Link>
                    <Link href="/posts" className="transition hover:text-[#0f766e]">
                        Verhalen
                    </Link>
                    <Link href="/destinations" className="transition hover:text-[#0f766e]">
                        Bestemmingen
                    </Link>
                    <Link href="/about" className="transition hover:text-[#0f766e]">
                        Over
                    </Link>
                </nav>
            </div>
        </header>
    );
}
