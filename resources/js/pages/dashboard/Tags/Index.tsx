import { router, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useState } from 'react';

import { useI18n } from '@/lib/i18n';
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { ContentLanguage, LocalizedText } from '@/types';

type Tag = {
    id: number;
    name: string;
    name_translations?: LocalizedText | null;
    posts_count: number;
};

type Props = {
    tags: Tag[];
};

function emptyTranslations(value?: string | null): LocalizedText {
    return {
        nl: value ?? '',
        en: '',
        es: '',
    };
}

export default function DashboardTagsIndex({ tags }: Props) {
    const { count, language, languageOptions, t, translated } = useI18n();
    const [activeContentLanguage, setActiveContentLanguage] = useState<ContentLanguage>(language);
    const createForm = useForm({
        name: '',
        name_translations: emptyTranslations(''),
    });
    const [editingTagId, setEditingTagId] = useState<number | null>(null);
    const [editingTranslations, setEditingTranslations] = useState<LocalizedText>(emptyTranslations(''));

    const createTag = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const name = translated(createForm.data.name_translations, createValue);

        createForm.transform((data) => ({
            ...data,
            name,
        }));

        createForm.post('/dashboard/tags', {
            preserveScroll: true,
            onSuccess: () => {
                createForm.transform((data) => data);
                createForm.setData({
                    name: '',
                    name_translations: emptyTranslations(''),
                });
            },
        });
    };

    const createValue = createForm.data.name_translations[activeContentLanguage] ?? '';
    const createError = createForm.errors[`name_translations.${activeContentLanguage}`] ?? createForm.errors.name_translations ?? createForm.errors.name;

    return (
        <DashboardLayout>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-900">{t('dashboardTags.heading')}</h1>
                <p className="mt-2 text-slate-600">{t('dashboardTags.body')}</p>
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

            <div className="mt-8 grid gap-8 xl:grid-cols-[360px_minmax(0,1fr)]">
                <form onSubmit={createTag} className="rounded-3xl border border-white/70 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-slate-900">{t('dashboardTags.newTag')}</h2>
                    <label className="mt-5 block space-y-2">
                        <span className="text-sm font-semibold text-slate-700">{t('dashboardTags.name')}</span>
                        <input
                            value={createValue}
                            onChange={(event) =>
                                createForm.setData('name_translations', {
                                    ...createForm.data.name_translations,
                                    [activeContentLanguage]: event.target.value,
                                })
                            }
                            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                        />
                        {createError ? <p className="text-sm text-rose-600">{createError}</p> : null}
                    </label>

                    <button type="submit" disabled={createForm.processing} className="mt-5 rounded-full bg-[#0f766e] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
                        {t('dashboardTags.add')}
                    </button>
                </form>

                <div className="space-y-4">
                    {tags.map((tag) => (
                        <div key={tag.id} className="rounded-3xl border border-white/70 bg-white p-5 shadow-sm">
                            {editingTagId === tag.id ? (
                                <div className="flex flex-wrap items-center gap-3">
                                    <input
                                        value={editingTranslations[activeContentLanguage] ?? ''}
                                        onChange={(event) =>
                                            setEditingTranslations({
                                                ...editingTranslations,
                                                [activeContentLanguage]: event.target.value,
                                            })
                                        }
                                        className="rounded-2xl border border-slate-200 px-4 py-3"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            router.put(
                                                `/dashboard/tags/${tag.id}`,
                                                {
                                                    name: translated(editingTranslations, editingTranslations[activeContentLanguage] ?? tag.name),
                                                    name_translations: editingTranslations,
                                                },
                                                {
                                                    preserveScroll: true,
                                                    onSuccess: () => {
                                                        setEditingTagId(null);
                                                        setEditingTranslations(emptyTranslations(''));
                                                    },
                                                },
                                            )
                                        }
                                        className="rounded-full bg-[#0f766e] px-4 py-2 text-sm font-semibold text-white"
                                    >
                                        {t('dashboardTags.save')}
                                    </button>
                                    <button type="button" onClick={() => setEditingTagId(null)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
                                        {t('dashboardTags.cancel')}
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-lg font-semibold text-slate-900">{translated(tag.name_translations, tag.name)}</h2>
                                        <p className="text-sm text-slate-500">{count('post', tag.posts_count)}</p>
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingTagId(tag.id);
                                                setEditingTranslations(tag.name_translations ?? emptyTranslations(tag.name));
                                            }}
                                            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                                        >
                                            {t('dashboardTags.edit')}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => router.delete(`/dashboard/tags/${tag.id}`, { preserveScroll: true })}
                                            className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700"
                                        >
                                            {t('dashboardTags.delete')}
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
