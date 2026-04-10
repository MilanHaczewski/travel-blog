import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

import DashboardLayout from '@/Layouts/DashboardLayout';

type Option = {
    id: number;
    title?: string;
    name?: string;
};

type Props = {
    post: {
        id: number;
        destination_id: number;
        category_id: number;
        title: string;
        excerpt: string | null;
        body: string;
        cover_image: string | null;
        video_url: string | null;
        status: string;
        published_at: string | null;
        tag_ids?: number[];
    } | null;
    destinations: Option[];
    categories: Option[];
    tags: Option[];
};

export default function DashboardPostForm({ post, destinations, categories, tags }: Props) {
    const form = useForm({
        destination_id: post?.destination_id ?? destinations[0]?.id ?? '',
        category_id: post?.category_id ?? categories[0]?.id ?? '',
        title: post?.title ?? '',
        excerpt: post?.excerpt ?? '',
        body: post?.body ?? '',
        cover_image: post?.cover_image ?? '',
        video_url: post?.video_url ?? '',
        status: post?.status ?? 'draft',
        published_at: post?.published_at ? post.published_at.slice(0, 16) : '',
        tag_ids: post?.tag_ids ?? [],
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (post) {
            form.put(`/dashboard/posts/${post.id}`);
            return;
        }

        form.post('/dashboard/posts');
    };

    return (
        <DashboardLayout>
            <h1 className="text-3xl font-bold text-slate-900">{post ? 'Post bewerken' : 'Nieuwe post'}</h1>

            <form onSubmit={submit} className="mt-8 space-y-6 rounded-3xl border border-white/70 bg-white p-8 shadow-sm">
                <div className="grid gap-6 md:grid-cols-2">
                    <label className="space-y-2">
                        <span className="text-sm font-semibold text-slate-700">Titel</span>
                        <input value={form.data.title} onChange={(event) => form.setData('title', event.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
                    </label>
                    <label className="space-y-2">
                        <span className="text-sm font-semibold text-slate-700">Status</span>
                        <select value={form.data.status} onChange={(event) => form.setData('status', event.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3">
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </select>
                    </label>
                    <label className="space-y-2">
                        <span className="text-sm font-semibold text-slate-700">Bestemming</span>
                        <select value={form.data.destination_id} onChange={(event) => form.setData('destination_id', Number(event.target.value))} className="w-full rounded-2xl border border-slate-200 px-4 py-3">
                            {destinations.map((destination) => (
                                <option key={destination.id} value={destination.id}>{destination.title}</option>
                            ))}
                        </select>
                    </label>
                    <label className="space-y-2">
                        <span className="text-sm font-semibold text-slate-700">Categorie</span>
                        <select value={form.data.category_id} onChange={(event) => form.setData('category_id', Number(event.target.value))} className="w-full rounded-2xl border border-slate-200 px-4 py-3">
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                    </label>
                </div>

                <label className="block space-y-2">
                    <span className="text-sm font-semibold text-slate-700">Samenvatting</span>
                    <textarea value={form.data.excerpt} onChange={(event) => form.setData('excerpt', event.target.value)} className="min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3" />
                </label>

                <label className="block space-y-2">
                    <span className="text-sm font-semibold text-slate-700">Verhaal</span>
                    <textarea value={form.data.body} onChange={(event) => form.setData('body', event.target.value)} className="min-h-56 w-full rounded-2xl border border-slate-200 px-4 py-3" />
                </label>

                <div className="grid gap-6 md:grid-cols-2">
                    <label className="space-y-2">
                        <span className="text-sm font-semibold text-slate-700">Cover image URL</span>
                        <input value={form.data.cover_image} onChange={(event) => form.setData('cover_image', event.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
                    </label>
                    <label className="space-y-2">
                        <span className="text-sm font-semibold text-slate-700">Video URL</span>
                        <input value={form.data.video_url} onChange={(event) => form.setData('video_url', event.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
                    </label>
                </div>

                <label className="block space-y-2">
                    <span className="text-sm font-semibold text-slate-700">Publicatiemoment</span>
                    <input type="datetime-local" value={form.data.published_at} onChange={(event) => form.setData('published_at', event.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 md:max-w-sm" />
                </label>

                <fieldset className="space-y-3">
                    <legend className="text-sm font-semibold text-slate-700">Tags</legend>
                    <div className="flex flex-wrap gap-3">
                        {tags.map((tag) => {
                            const checked = form.data.tag_ids.includes(tag.id);

                            return (
                                <label key={tag.id} className="flex items-center gap-2 rounded-full bg-[#f7f3eb] px-4 py-2 text-sm text-slate-700">
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() =>
                                            form.setData(
                                                'tag_ids',
                                                checked
                                                    ? form.data.tag_ids.filter((value) => value !== tag.id)
                                                    : [...form.data.tag_ids, tag.id],
                                            )
                                        }
                                    />
                                    {tag.name}
                                </label>
                            );
                        })}
                    </div>
                </fieldset>

                <button type="submit" disabled={form.processing} className="rounded-full bg-[#0f766e] px-6 py-3 text-sm font-semibold text-white disabled:opacity-60">
                    Opslaan
                </button>
            </form>
        </DashboardLayout>
    );
}
