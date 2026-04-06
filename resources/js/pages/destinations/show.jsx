import AppLayout from '@/Layouts/AppLayout';
import Container from '@/Components/Container';
import { Link } from '@inertiajs/react';

export default function DestinationsShow({ destination }) {
    return (
        <AppLayout>
            <section className="bg-sky-50 py-16">
                <Container>
                    <p className="mb-3 text-sm font-medium text-sky-600">
                        {destination.country}
                    </p>

                    <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">
                        {destination.title}
                    </h1>

                    {destination.description && (
                        <p className="mt-4 max-w-3xl text-lg text-gray-600">
                            {destination.description}
                        </p>
                    )}
                </Container>
            </section>

            {destination.cover_image && (
                <section className="py-10">
                    <Container>
                        <img
                            src={destination.cover_image}
                            alt={destination.title}
                            className="h-[450px] w-full rounded-3xl object-cover shadow-sm"
                        />
                    </Container>
                </section>
            )}

            <section className="py-10">
                <Container>
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900">
                            Verhalen over {destination.title}
                        </h2>
                    </div>

                    {destination.posts?.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {destination.posts.map((post) => (
                                <article
                                    key={post.id}
                                    className="rounded-2xl border bg-white p-6 shadow-sm"
                                >
                                    <h3 className="mb-3 text-lg font-semibold text-gray-900">
                                        {post.title}
                                    </h3>

                                    <p className="mb-4 text-sm text-gray-600">
                                        {post.excerpt ?? 'Geen samenvatting beschikbaar.'}
                                    </p>

                                    <Link
                                        href={`/posts/${post.slug}`}
                                        className="font-medium text-sky-600 hover:text-sky-700"
                                    >
                                        Lees verhaal
                                    </Link>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed bg-white p-10 text-center text-gray-500">
                            Er zijn nog geen posts gekoppeld aan deze bestemming.
                        </div>
                    )}
                </Container>
            </section>
        </AppLayout>
    );
}