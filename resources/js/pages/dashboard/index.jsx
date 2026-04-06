import DashboardLayout from '@/Layouts/DashboardLayout';

export default function DashboardIndex() {
    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-2 text-gray-600">
                    Welkom terug. Beheer hier je travel blog.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border bg-white p-6 shadow-sm">
                    <p className="text-sm text-gray-500">Totaal posts</p>
                    <h2 className="mt-2 text-3xl font-bold text-gray-900">0</h2>
                </div>

                <div className="rounded-2xl border bg-white p-6 shadow-sm">
                    <p className="text-sm text-gray-500">Bestemmingen</p>
                    <h2 className="mt-2 text-3xl font-bold text-gray-900">0</h2>
                </div>

                <div className="rounded-2xl border bg-white p-6 shadow-sm">
                    <p className="text-sm text-gray-500">Categorieën</p>
                    <h2 className="mt-2 text-3xl font-bold text-gray-900">0</h2>
                </div>

                <div className="rounded-2xl border bg-white p-6 shadow-sm">
                    <p className="text-sm text-gray-500">Tags</p>
                    <h2 className="mt-2 text-3xl font-bold text-gray-900">0</h2>
                </div>
            </div>

            <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900">
                    Snel overzicht
                </h3>
                <p className="mt-3 text-gray-600">
                    Hier kun je later statistieken, recente posts en drafts tonen.
                </p>
            </div>
        </DashboardLayout>
    );
}