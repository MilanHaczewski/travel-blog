import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useState } from 'react';

import { useI18n } from '@/lib/i18n';
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { ContentLanguage, LocalizedText } from '@/types';

const continentOptions = ['Europa', 'Zuid-Amerika', 'Noord-Amerika', 'Azie', 'Afrika', 'Oceanie'];

type Props = {
    destination: {
        id: number;
        title: string;
        title_translations?: LocalizedText | null;
        country: string;
        country_translations?: LocalizedText | null;
        continent: string | null;
        city: string | null;
        city_translations?: LocalizedText | null;
        description: string | null;
        description_translations?: LocalizedText | null;
        cover_image: string | null;
        latitude: number | null;
        longitude: number | null;
    } | null;
};

function emptyTranslations(value?: string | null): LocalizedText {
    return {
        nl: value ?? '',
        en: '',
        es: '',
    };
}

export default function DashboardDestinationForm({ destination }: Props) {
    const { continent, language, languageOptions, t } = useI18n();
    const [activeContentLanguage, setActiveContentLanguage] = useState<ContentLanguage>(language);

    const form = useForm({
        title_translations: destination?.title_translations ?? emptyTranslations(destination?.title),
        country_translations: destination?.country_translations ?? emptyTranslations(destination?.country),
        continent: destination?.continent ?? '',
        city_translations: destination?.city_translations ?? emptyTranslations(destination?.city),
        description_translations: destination?.description_translations ?? emptyTranslations(destination?.description),
        cover_image: destination?.cover_image ?? '',
        latitude: destination?.latitude?.toString() ?? '',
        longitude: destination?.longitude?.toString() ?? '',
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (destination) {
            form.put(`/dashboard/destinations/${destination.id}`);
            return;
        }

        form.post('/dashboard/destinations');
    };

    const updateTranslation = (field: 'title_translations' | 'country_translations' | 'city_translations' | 'description_translations', value: string) => {
        form.setData(field, {
            ...form.data[field],
            [activeContentLanguage]: value,
        });
    };

    const translationValue = (field: 'title_translations' | 'country_translations' | 'city_translations' | 'description_translations') =>
        form.data[field][activeContentLanguage] ?? '';

    const translationError = (field: 'title_translations' | 'country_translations' | 'city_translations' | 'description_translations') =>
        form.errors[`${field}.${activeContentLanguage}`] ?? form.errors[field];

    return (
        <DashboardLayout>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-900">{destination ? t('dashboardDestinations.editHeading') : t('dashboardDestinations.newHeading')}</h1>
                <p className="mt-2 max-w-2xl text-slate-600">{t('dashboardDestinations.body')}</p>
            </div>

            <form onSubmit={submit} className="space-y-6 rounded-3xl border border-white/70 bg-white p-8 shadow-sm">
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

                <div className="grid gap-6 md:grid-cols-2">
                    <label className="space-y-2">
                        <span className="text-sm font-semibold text-slate-700">{t('dashboardDestinations.title')}</span>
                        <input
                            value={translationValue('title_translations')}
                            onChange={(event) => updateTranslation('title_translations', event.target.value)}
                            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                        />
                        {translationError('title_translations') ? <p className="text-sm text-rose-600">{translationError('title_translations')}</p> : null}
                    </label>
                    <label className="space-y-2">
                        <span className="text-sm font-semibold text-slate-700">{t('dashboardDestinations.country')}</span>
                        <input
                            value={translationValue('country_translations')}
                            onChange={(event) => updateTranslation('country_translations', event.target.value)}
                            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                        />
                        {translationError('country_translations') ? <p className="text-sm text-rose-600">{translationError('country_translations')}</p> : null}
                    </label>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <label className="space-y-2">
                        <span className="text-sm font-semibold text-slate-700">{t('dashboardDestinations.continent')}</span>
                        <select
                            value={form.data.continent}
                            onChange={(event) => form.setData('continent', event.target.value)}
                            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                        >
                            <option value="">{t('dashboardDestinations.chooseContinent')}</option>
                            {continentOptions.map((option) => (
                                <option key={option} value={option}>
                                    {continent(option)}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="space-y-2">
                        <span className="text-sm font-semibold text-slate-700">{t('dashboardDestinations.city')}</span>
                        <input
                            value={translationValue('city_translations')}
                            onChange={(event) => updateTranslation('city_translations', event.target.value)}
                            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                        />
                        {translationError('city_translations') ? <p className="text-sm text-rose-600">{translationError('city_translations')}</p> : null}
                    </label>
                </div>

                <label className="block space-y-2">
                    <span className="text-sm font-semibold text-slate-700">{t('dashboardDestinations.description')}</span>
                    <textarea
                        value={translationValue('description_translations')}
                        onChange={(event) => updateTranslation('description_translations', event.target.value)}
                        className="min-h-40 w-full rounded-2xl border border-slate-200 px-4 py-3"
                    />
                    {translationError('description_translations') ? <p className="text-sm text-rose-600">{translationError('description_translations')}</p> : null}
                </label>

                <label className="block space-y-2">
                    <span className="text-sm font-semibold text-slate-700">{t('dashboardDestinations.coverUrl')}</span>
                    <input value={form.data.cover_image} onChange={(event) => form.setData('cover_image', event.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
                </label>

                <div className="rounded-3xl border border-[#0f766e]/10 bg-[#0f766e]/5 p-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <label className="space-y-2">
                            <span className="text-sm font-semibold text-slate-700">{t('dashboardDestinations.latitude')}</span>
                            <input
                                type="number"
                                step="any"
                                value={form.data.latitude}
                                onChange={(event) => form.setData('latitude', event.target.value)}
                                placeholder="52.3676"
                                className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                            />
                        </label>
                        <label className="space-y-2">
                            <span className="text-sm font-semibold text-slate-700">{t('dashboardDestinations.longitude')}</span>
                            <input
                                type="number"
                                step="any"
                                value={form.data.longitude}
                                onChange={(event) => form.setData('longitude', event.target.value)}
                                placeholder="4.9041"
                                className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                            />
                        </label>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{t('dashboardDestinations.coordinatesHelp')}</p>
                </div>

                <button type="submit" disabled={form.processing} className="rounded-full bg-[#0f766e] px-6 py-3 text-sm font-semibold text-white disabled:opacity-60">
                    {t('dashboardDestinations.save')}
                </button>
            </form>
        </DashboardLayout>
    );
}
