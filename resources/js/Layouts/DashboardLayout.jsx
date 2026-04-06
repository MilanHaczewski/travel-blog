import { Link } from '@inertiajs/react';

export default function DashboardLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-100">
            <div className="flex">
                <aside className="min-h-screen w-64 bg-white border-r p-6">
                    <h2 className="mb-8 text-xl font-bold text-sky-600">Dashboard</h2>

                    <nav className="space-y-3">
                        <Link href="/dashboard" className="block rounded-lg px-3 py-2 hover:bg-sky-50">
                            Overzicht
                        </Link>
                        <Link href="/dashboard/posts" className="block rounded-lg px-3 py-2 hover:bg-sky-50">
                            Posts
                        </Link>
                        <Link href="/dashboard/destinations" className="block rounded-lg px-3 py-2 hover:bg-sky-50">
                            Bestemmingen
                        </Link>
                        <Link href="/dashboard/categories" className="block rounded-lg px-3 py-2 hover:bg-sky-50">
                            Categorieën
                        </Link>
                        <Link href="/dashboard/tags" className="block rounded-lg px-3 py-2 hover:bg-sky-50">
                            Tags
                        </Link>
                    </nav>
                </aside>

                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}