import { Link, router, useForm } from '@inertiajs/react';
import type { ChangeEvent, FormEvent } from 'react';
import { useEffect, useState } from 'react';

import { useI18n } from '@/lib/i18n';
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { ContentLanguage, LocalizedText } from '@/types';

type Option = {
    id: number;
    title?: string;
    title_translations?: LocalizedText | null;
    name?: string;
    name_translations?: LocalizedText | null;
    slug?: string;
};

type ExistingMedia = {
    id: number;
    type: 'image' | 'video';
    path: string;
    original_name: string | null;
};

type Props = {
    post: {
        id: number;
        destination_id: number;
        category_id: number;
        title: string;
        title_translations?: LocalizedText | null;
        excerpt: string | null;
        excerpt_translations?: LocalizedText | null;
        body: string;
        body_translations?: LocalizedText | null;
        cover_image: string | null;
        status: string;
        published_at: string | null;
        tag_ids?: number[];
        existing_media?: ExistingMedia[];
    } | null;
    destinations: Option[];
    categories: Option[];
    tags: Option[];
};

function emptyTranslations(value?: string | null): LocalizedText {
    return {
        nl: value ?? '',
        en: '',
        es: '',
    };
}

export default function DashboardPostForm({ post, destinations, categories, tags }: Props) {
    const { categoryName, language, languageOptions, status, t, translated } = useI18n();
    const [activeContentLanguage, setActiveContentLanguage] = useState<ContentLanguage>(language);
    const [newTagName, setNewTagName] = useState('');
    const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
    const [mediaPreviewUrls, setMediaPreviewUrls] = useState<Array<{ url: string; type: 'image' | 'video'; name: string }>>([]);

    const form = useForm({
        destination_id: post?.destination_id ?? destinations[0]?.id ?? '',
        category_id: post?.category_id ?? categories[0]?.id ?? '',
        title_translations: post?.title_translations ?? emptyTranslations(post?.title),
        excerpt_translations: post?.excerpt_translations ?? emptyTranslations(post?.excerpt),
        body_translations: post?.body_translations ?? emptyTranslations(post?.body),
        cover_image_url: '',
        cover_image_upload: null as File | null,
        status: post?.status ?? 'draft',
        published_at: post?.published_at ? post.published_at.slice(0, 16) : '',
        tag_ids: post?.tag_ids ?? [],
        media_uploads: [] as File[],
        remove_media_ids: [] as number[],
    });

    useEffect(() => {
        return () => {
            if (coverPreviewUrl) {
                URL.revokeObjectURL(coverPreviewUrl);
            }

            mediaPreviewUrls.forEach((item) => URL.revokeObjectURL(item.url));
        };
    }, [coverPreviewUrl, mediaPreviewUrls]);

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (post) {
            form.put(`/dashboard/posts/${post.id}`, {
                forceFormData: true,
                preserveScroll: true,
            });

            return;
        }

        form.post('/dashboard/posts', {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const updateTranslation = (field: 'title_translations' | 'excerpt_translations' | 'body_translations', value: string) => {
        form.setData(field, {
            ...form.data[field],
            [activeContentLanguage]: value,
        });
    };

    const translationValue = (field: 'title_translations' | 'excerpt_translations' | 'body_translations') =>
        form.data[field][activeContentLanguage] ?? '';

    const translationError = (field: 'title_translations' | 'excerpt_translations' | 'body_translations') =>
        form.errors[`${field}.${activeContentLanguage}`] ?? form.errors[field];

    const previewTranslation = (value: LocalizedText | null | undefined, fallback: string) => {
        const activeValue = value?.[activeContentLanguage];

        if (typeof activeValue === 'string' && activeValue.trim() !== '') {
            return activeValue;
        }

        return translated(value, fallback);
    };

    const handleCoverUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const nextFile = event.target.files?.[0] ?? null;

        form.setData('cover_image_upload', nextFile);

        if (coverPreviewUrl) {
            URL.revokeObjectURL(coverPreviewUrl);
        }

        setCoverPreviewUrl(nextFile ? URL.createObjectURL(nextFile) : null);
    };

    const handleMediaUpload = (event: ChangeEvent<HTMLInputElement>) => {
        mediaPreviewUrls.forEach((item) => URL.revokeObjectURL(item.url));

        const files = Array.from(event.target.files ?? []);
        form.setData('media_uploads', files);

        setMediaPreviewUrls(
            files.map((file) => ({
                url: URL.createObjectURL(file),
                type: file.type.startsWith('video/') ? 'video' : 'image',
                name: file.name,
            })),
        );
    };

    const selectedDestination = destinations.find((destination) => destination.id === Number(form.data.destination_id));
    const selectedCategory = categories.find((category) => category.id === Number(form.data.category_id));
    const currentCover = coverPreviewUrl ?? (form.data.cover_image_url || post?.cover_image || null);
    const visibleExistingMedia = (post?.existing_media ?? []).filter((media) => !form.data.remove_media_ids.includes(media.id));

    return (
        <DashboardLayout>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">{post ? t('dashboardPosts.editHeading') : t('dashboardPosts.newHeading')}</h1>
                    <p className="mt-2 max-w-2xl text-slate-600">{t('dashboardPosts.storyBody')}</p>
                </div>
                <Link href="/dashboard/tags" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
                    {t('dashboardPosts.manageTags')}
                </Link>
            </div>

            <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_460px]">
                <form onSubmit={submit} className="space-y-6 rounded-3xl border border-white/70 bg-white p-8 shadow-sm">
                    <div className="grid gap-6 md:grid-cols-2">
                        <label className="space-y-2">
                            <span className="text-sm font-semibold text-slate-700">{t('dashboardPosts.status')}</span>
                            <select value={form.data.status} onChange={(event) => form.setData('status', event.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3">
                                <option value="draft">{status('post', 'draft')}</option>
                                <option value="published">{status('post', 'published')}</option>
                            </select>
                        </label>

                        <label className="space-y-2">
                            <span className="text-sm font-semibold text-slate-700">{t('dashboardPosts.destination')}</span>
                            <select value={form.data.destination_id} onChange={(event) => form.setData('destination_id', Number(event.target.value))} className="w-full rounded-2xl border border-slate-200 px-4 py-3">
                                {destinations.map((destination) => (
                                    <option key={destination.id} value={destination.id}>
                                        {translated(destination.title_translations, destination.title)}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="space-y-2">
                            <span className="text-sm font-semibold text-slate-700">{t('dashboardPosts.category')}</span>
                            <select value={form.data.category_id} onChange={(event) => form.setData('category_id', Number(event.target.value))} className="w-full rounded-2xl border border-slate-200 px-4 py-3">
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {categoryName(category.slug, category.name)}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="space-y-2">
                            <span className="text-sm font-semibold text-slate-700">{t('dashboardPosts.publishMoment')}</span>
                            <input type="datetime-local" value={form.data.published_at} onChange={(event) => form.setData('published_at', event.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
                        </label>
                    </div>

                    <div className="rounded-3xl border border-[#0f766e]/10 bg-[#f4faf9] p-5">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#0f766e]">{t('language.label')}</p>
                                <p className="mt-1 text-sm text-slate-600">NL / EN / ES</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {languageOptions.map((option) => (
                                    <button
                                        key={option.code}
                                        type="button"
                                        onClick={() => setActiveContentLanguage(option.code)}
                                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                                            activeContentLanguage === option.code
                                                ? 'bg-[#0f766e] text-white'
                                                : 'border border-slate-200 bg-white text-slate-700'
                                        }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <label className="block space-y-2">
                        <span className="text-sm font-semibold text-slate-700">{t('dashboardPosts.title')}</span>
                        <input
                            value={translationValue('title_translations')}
                            onChange={(event) => updateTranslation('title_translations', event.target.value)}
                            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                        />
                        {translationError('title_translations') ? <p className="text-sm text-rose-600">{translationError('title_translations')}</p> : null}
                    </label>

                    <label className="block space-y-2">
                        <span className="text-sm font-semibold text-slate-700">{t('dashboardPosts.summary')}</span>
                        <textarea
                            value={translationValue('excerpt_translations')}
                            onChange={(event) => updateTranslation('excerpt_translations', event.target.value)}
                            className="min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3"
                        />
                        {translationError('excerpt_translations') ? <p className="text-sm text-rose-600">{translationError('excerpt_translations')}</p> : null}
                    </label>

                    <label className="block space-y-2">
                        <span className="text-sm font-semibold text-slate-700">{t('dashboardPosts.story')}</span>
                        <textarea
                            value={translationValue('body_translations')}
                            onChange={(event) => updateTranslation('body_translations', event.target.value)}
                            className="min-h-64 w-full rounded-2xl border border-slate-200 px-4 py-3"
                        />
                        {translationError('body_translations') ? <p className="text-sm text-rose-600">{translationError('body_translations')}</p> : null}
                    </label>

                    <div className="grid gap-6 xl:grid-cols-2">
                        <label className="space-y-2">
                            <span className="text-sm font-semibold text-slate-700">{t('dashboardPosts.coverUpload')}</span>
                            <input type="file" accept="image/*" onChange={handleCoverUpload} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
                        </label>

                        <label className="space-y-2">
                            <span className="text-sm font-semibold text-slate-700">{t('dashboardPosts.externalCover')}</span>
                            <input value={form.data.cover_image_url} onChange={(event) => form.setData('cover_image_url', event.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
                        </label>
                    </div>

                    <label className="block space-y-2">
                        <span className="text-sm font-semibold text-slate-700">{t('dashboardPosts.storyMedia')}</span>
                        <input type="file" accept="image/*,video/*" multiple onChange={handleMediaUpload} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
                        <p className="text-sm text-slate-500">{t('dashboardPosts.storyMediaHelp')}</p>
                    </label>

                    {visibleExistingMedia.length > 0 ? (
                        <div className="space-y-3">
                            <p className="text-sm font-semibold text-slate-700">{t('dashboardPosts.existingMedia')}</p>
                            <div className="grid gap-4 md:grid-cols-2">
                                {visibleExistingMedia.map((media) => (
                                    <div key={media.id} className="rounded-3xl border border-slate-200 p-4">
                                        {media.type === 'image' ? (
                                            <img src={media.path} alt={media.original_name ?? t('dashboardPosts.existingMedia')} className="h-40 w-full rounded-2xl object-cover" />
                                        ) : (
                                            <video src={media.path} controls className="h-40 w-full rounded-2xl object-cover" />
                                        )}
                                        <div className="mt-3 flex items-center justify-between gap-3">
                                            <p className="truncate text-sm text-slate-500">{media.original_name ?? t('dashboardPosts.existingMedia')}</p>
                                            <button
                                                type="button"
                                                onClick={() => form.setData('remove_media_ids', [...form.data.remove_media_ids, media.id])}
                                                className="rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-700"
                                            >
                                                {t('dashboardPosts.remove')}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    <div className="space-y-4">
                        <div className="flex items-end justify-between gap-4">
                            <p className="text-sm font-semibold text-slate-700">{t('dashboardPosts.tags')}</p>
                            <div className="flex flex-wrap items-center gap-3">
                                <input
                                    value={newTagName}
                                    onChange={(event) => setNewTagName(event.target.value)}
                                    placeholder={t('dashboardPosts.newTag')}
                                    className="rounded-full border border-slate-200 px-4 py-2 text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        router.post(
                                            '/dashboard/tags',
                                            {
                                                name: newTagName,
                                                name_translations: {
                                                    [activeContentLanguage]: newTagName,
                                                },
                                            },
                                            {
                                                preserveScroll: true,
                                                preserveState: true,
                                                onSuccess: () => setNewTagName(''),
                                            },
                                        )
                                    }
                                    disabled={!newTagName.trim()}
                                    className="rounded-full border border-[#0f766e]/20 px-4 py-2 text-sm font-semibold text-[#0f766e] disabled:opacity-50"
                                >
                                    {t('dashboardPosts.addTag')}
                                </button>
                            </div>
                        </div>

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
                                        {translated(tag.name_translations, tag.name)}
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    <button type="submit" disabled={form.processing} className="rounded-full bg-[#0f766e] px-6 py-3 text-sm font-semibold text-white disabled:opacity-60">
                        {post ? t('dashboardPosts.saveChanges') : t('dashboardPosts.saveStory')}
                    </button>
                </form>

                <div className="rounded-3xl border border-white/70 bg-white p-6 shadow-sm xl:sticky xl:top-6 xl:self-start">
                    <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#0f766e]">{t('dashboardPosts.livePreview')}</p>
                    <h2 className="mt-3 text-2xl font-bold text-slate-900">{previewTranslation(form.data.title_translations, t('dashboardPosts.previewTitle'))}</h2>
                    <p className="mt-3 text-sm text-slate-500">
                        {selectedDestination ? previewTranslation(selectedDestination.title_translations, selectedDestination.title ?? t('dashboardPosts.previewDestination')) : t('dashboardPosts.previewDestination')} / {selectedCategory?.name ? categoryName(selectedCategory.slug, selectedCategory.name) : t('dashboardPosts.previewCategory')}
                    </p>

                    {currentCover ? (
                        <img src={currentCover} alt={t('dashboardPosts.coverUpload')} className="mt-5 h-64 w-full rounded-[1.5rem] object-cover" />
                    ) : (
                        <div className="mt-5 flex h-64 items-center justify-center rounded-[1.5rem] bg-[#f7f3eb] text-sm text-slate-500">
                            {t('dashboardPosts.previewCover')}
                        </div>
                    )}

                    <p className="mt-5 text-sm leading-7 text-slate-600">{previewTranslation(form.data.excerpt_translations, t('dashboardPosts.previewExcerpt'))}</p>

                    <div className="mt-6 space-y-4 text-sm leading-7 text-slate-700">
                        {(previewTranslation(form.data.body_translations, t('dashboardPosts.previewBody')))
                            .split('\n')
                            .filter(Boolean)
                            .slice(0, 4)
                            .map((paragraph, index) => (
                                <p key={`${paragraph}-${index}`}>{paragraph}</p>
                            ))}
                    </div>

                    {(visibleExistingMedia.length > 0 || mediaPreviewUrls.length > 0) ? (
                        <div className="mt-6 grid gap-3">
                            {visibleExistingMedia.map((media) =>
                                media.type === 'image' ? (
                                    <img key={`existing-${media.id}`} src={media.path} alt={media.original_name ?? t('dashboardPosts.existingMedia')} className="h-40 w-full rounded-2xl object-cover" />
                                ) : (
                                    <video key={`existing-${media.id}`} src={media.path} controls className="h-40 w-full rounded-2xl object-cover" />
                                ),
                            )}

                            {mediaPreviewUrls.map((media) =>
                                media.type === 'image' ? (
                                    <img key={media.url} src={media.url} alt={media.name} className="h-40 w-full rounded-2xl object-cover" />
                                ) : (
                                    <video key={media.url} src={media.url} controls className="h-40 w-full rounded-2xl object-cover" />
                                ),
                            )}
                        </div>
                    ) : null}
                </div>
            </div>
        </DashboardLayout>
    );
}
