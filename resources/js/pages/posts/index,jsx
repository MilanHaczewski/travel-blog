import AppLayout from '@/Layouts/AppLayout';
import Container from '@/Components/Container';
import { Link } from '@inertiajs/react';

export default function PostsIndex({ posts = [] }) {
    return (
        <AppLayout>
            <section className="bg-sky-50 py-16">
                <Container>
                    <h1 className="text-4xl font-bold text-gray-900">Blogs</h1>
                    <p className="mt-3 max-w-2xl text-gray-600">
                        Ontdek reisverhalen, tips, foto’s en inspiratie van verschillende bestemmingen.
                    </p>
                </Container>
            </section>

            <section className="py-16">
                <Container>
                    {posts.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {posts.map((post) => (
                                <article
                                    key={post.id}
                                    className="overflow-hidden rounded-2xl border bg-white shadow-sm"
                                >
                                    {post.cover_image && (
                                        <img
                                            src={post.cover_image}
                                            alt={post.title}
                                            className="h-56 w-full object-cover"
                                        />
                                    )}

                                    <div className="p-6">
                                        <p className="mb-2 text-sm text-sky-600">
                                            {post.destination?.title ?? 'Bestemming onbekend'}
                                        </p>

                                        <h2 className="mb-3 text-xl font-semibold text-gray-900">
                                            {post.title}
                                        </h2>

                                        <p className="mb-4 text-sm text-gray-600">
                                            {post.excerpt ?? 'Geen samenvatting beschikbaar.'}
                                        </p>

                                        <Link
                                            href={`/posts/${post.slug}`}
                                            className="font-medium text-sky-600 hover:text-sky-700"
                                        >
                                            Lees meer
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed bg-white p-10 text-center text-gray-500">
                            Er zijn nog geen posts beschikbaar.
                        </div>
                    )}
                </Container>
            </section>
        </AppLayout>
    );
}