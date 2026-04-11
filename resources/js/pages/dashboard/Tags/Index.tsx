import { router, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useState } from 'react';

import DashboardLayout from '@/Layouts/DashboardLayout';

type Tag = {
    id: number;
    name: string;
    posts_count: number;
};

type Props = {
    tags: Tag[];
};

export default function DashboardTagsIndex({ tags }: Props) {
    const createForm = useForm({
        name: '',
    });
    const [editingTagId, setEditingTagId] = useState<number | null>(null);
    const [editingName, setEditingName] = useState('');

    const createTag = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        createForm.post('/dashboard/tags', {
            preserveScroll: true,
            onSuccess: () => createForm.reset(),
        });
    };

    return (
        <DashboardLayout>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-900">Tags</h1>
                <p className="mt-2 text-slate-600">Maak tags aan zoals `interrail`, `medellin`, `couple travel` of `colombia`, zodat verhalen makkelijk terug te vinden zijn.</p>
            </div>

            <div className="grid gap-8 xl:grid-cols-[360px_minmax(0,1fr)]">
                <form onSubmit={createTag} className="rounded-3xl border border-white/70 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-slate-900">Nieuwe tag</h2>
                    <label className="mt-5 block space-y-2">
                        <span className="text-sm font-semibold text-slate-700">Naam</span>
                        <input value={createForm.data.name} onChange={(event) => createForm.setData('name', event.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
                        {createForm.errors.name ? <p className="text-sm text-rose-600">{createForm.errors.name}</p> : null}
                    </label>

                    <button type="submit" disabled={createForm.processing} className="mt-5 rounded-full bg-[#0f766e] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
                        Tag toevoegen
                    </button>
                </form>

                <div className="space-y-4">
                    {tags.map((tag) => (
                        <div key={tag.id} className="rounded-3xl border border-white/70 bg-white p-5 shadow-sm">
                            {editingTagId === tag.id ? (
                                <div className="flex flex-wrap items-center gap-3">
                                    <input value={editingName} onChange={(event) => setEditingName(event.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3" />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            router.put(
                                                `/dashboard/tags/${tag.id}`,
                                                { name: editingName },
                                                {
                                                    preserveScroll: true,
                                                    onSuccess: () => {
                                                        setEditingTagId(null);
                                                        setEditingName('');
                                                    },
                                                },
                                            )
                                        }
                                        className="rounded-full bg-[#0f766e] px-4 py-2 text-sm font-semibold text-white"
                                    >
                                        Opslaan
                                    </button>
                                    <button type="button" onClick={() => setEditingTagId(null)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
                                        Annuleren
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-lg font-semibold text-slate-900">{tag.name}</h2>
                                        <p className="text-sm text-slate-500">{tag.posts_count} posts</p>
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingTagId(tag.id);
                                                setEditingName(tag.name);
                                            }}
                                            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                                        >
                                            Bewerken
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => router.delete(`/dashboard/tags/${tag.id}`, { preserveScroll: true })}
                                            className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700"
                                        >
                                            Verwijderen
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
