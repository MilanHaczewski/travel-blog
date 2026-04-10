import { Link } from '@inertiajs/react';

export default function DashboardLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#f7f3eb]">
            <div className="flex">
                <aside className="min-h-screen w-64 border-r border-[#d5cfc2] bg-white p-6">
                    <h2 className="mb-8 text-xl font-bold text-[#0f766e]">Dashboard</h2>

                    <nav className="space-y-3">
                        <Link href="/dashboard" className="block rounded-lg px-3 py-2 transition hover:bg-[#e6f4f1]">
                            Overzicht
                        </Link>
                        <Link href="/dashboard/posts" className="block rounded-lg px-3 py-2 transition hover:bg-[#e6f4f1]">
                            Posts
                        </Link>
                        <Link href="/dashboard/destinations" className="block rounded-lg px-3 py-2 transition hover:bg-[#e6f4f1]">
                            Bestemmingen
                        </Link>
                    </nav>
                </aside>

                <main className="flex-1 p-8">{children}</main>
            </div>
        </div>
    );
}
