import AppLayout from '@/Layouts/AppLayout';

export default function Home() {
    return (
        <AppLayout>
            <section className="bg-sky-50">
                <div className="mx-auto max-w-7xl px-6 py-20">
                    <h1 className="mb-4 text-5xl font-bold text-gray-900">
                        Ontdek de wereld, één reis tegelijk
                    </h1>
                    <p className="max-w-2xl text-lg text-gray-600">
                        Reisverhalen, tips, foto’s en video’s van bijzondere bestemmingen.
                    </p>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-6 py-16">
                <h2 className="mb-6 text-2xl font-semibold">Nieuwste verhalen</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-2xl border p-6 shadow-sm">
                        Voorbeeld blogkaart
                    </div>
                    <div className="rounded-2xl border p-6 shadow-sm">
                        Voorbeeld blogkaart
                    </div>
                    <div className="rounded-2xl border p-6 shadow-sm">
                        Voorbeeld blogkaart
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}