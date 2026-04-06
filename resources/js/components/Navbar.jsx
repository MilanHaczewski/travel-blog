import { Link } from '@inertiajs/react';

export default function Navbar() {
    return (
        <header className="border-b bg-white shadow-sm">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <Link href="/" className="text-2xl font-bold text-sky-600">
                    TravelBlog
                </Link>

                <nav className="flex items-center gap-6 text-sm font-medium">
                    <Link href="/" className="hover:text-sky-600">
                        Home
                    </Link>
                    <Link href="/posts" className="hover:text-sky-600">
                        Blogs
                    </Link>
                    <Link href="/destinations" className="hover:text-sky-600">
                        Bestemmingen
                    </Link>
                    <Link href="/about" className="hover:text-sky-600">
                        Over
                    </Link>
                </nav>
            </div>
        </header>
    );
}