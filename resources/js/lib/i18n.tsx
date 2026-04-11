import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import en from '@/lib/locales/en';
import es from '@/lib/locales/es';
import nl from '@/lib/locales/nl';
import type { ContentLanguage, LocalizedText } from '@/types/localized';

export type Language = ContentLanguage;

type TranslationValue = string | string[] | { [key: string]: TranslationValue };
type TranslationTable = { [key: string]: TranslationValue };
type ReplacementMap = Record<string, number | string>;
type CountKind = 'comment' | 'pin' | 'post' | 'story';
type StatusKind = 'admin' | 'invitation' | 'post' | 'role';

type ContextValue = {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (path: string, replacements?: ReplacementMap) => string;
    tArray: (path: string) => string[];
    translated: (value?: LocalizedText | null, fallback?: string | null) => string;
    continent: (value?: string | null) => string;
    categoryName: (slug?: string | null, fallback?: string | null) => string;
    status: (kind: StatusKind, value?: string | null) => string;
    count: (kind: CountKind, value: number) => string;
    formatDate: (value: string | number | Date) => string;
    languageOptions: Array<{ code: Language; label: string }>;
};

const STORAGE_KEY = 'tulips-and-arepas-language';

const localeMap: Record<Language, string> = {
    nl: 'nl-NL',
    en: 'en-US',
    es: 'es-CO',
};

const continentKeyMap: Record<string, string> = {
    Afrika: 'africa',
    Azie: 'asia',
    Europa: 'europe',
    Oceanie: 'oceania',
    'Noord-Amerika': 'northAmerica',
    'Zuid-Amerika': 'southAmerica',
};

const countWords: Record<Language, Record<CountKind, [string, string]>> = {
    nl: {
        comment: ['comment', 'comments'],
        pin: ['pin', 'pins'],
        post: ['post', 'posts'],
        story: ['verhaal', 'verhalen'],
    },
    en: {
        comment: ['comment', 'comments'],
        pin: ['pin', 'pins'],
        post: ['post', 'posts'],
        story: ['story', 'stories'],
    },
    es: {
        comment: ['comentario', 'comentarios'],
        pin: ['pin', 'pins'],
        post: ['post', 'posts'],
        story: ['historia', 'historias'],
    },
};

const translations: Record<Language, TranslationTable> = { nl, en, es };

const languageOptions: Array<{ code: Language; label: string }> = [
    { code: 'nl', label: 'NL' },
    { code: 'en', label: 'EN' },
    { code: 'es', label: 'ES' },
];

const LanguageContext = createContext<ContextValue | null>(null);

function detectLanguage(): Language {
    if (typeof window === 'undefined') {
        return 'nl';
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (stored === 'nl' || stored === 'en' || stored === 'es') {
        return stored;
    }

    const browser = window.navigator.language.toLowerCase();

    if (browser.startsWith('es')) {
        return 'es';
    }

    if (browser.startsWith('en')) {
        return 'en';
    }

    return 'nl';
}

function resolvePath(table: TranslationTable, path: string): TranslationValue | undefined {
    const keys = path.split('.');
    let current: TranslationValue | undefined = table;

    for (const key of keys) {
        if (!current || typeof current !== 'object' || Array.isArray(current)) {
            return undefined;
        }

        current = (current as TranslationTable)[key];
    }

    return current;
}

function applyReplacements(value: string, replacements: ReplacementMap = {}) {
    return Object.entries(replacements).reduce(
        (output, [key, replacement]) => output.replaceAll(`{{${key}}}`, String(replacement)),
        value,
    );
}

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>(detectLanguage);

    useEffect(() => {
        window.localStorage.setItem(STORAGE_KEY, language);
        document.documentElement.lang = localeMap[language];
    }, [language]);

    const value: ContextValue = {
        language,
        setLanguage,
        t: (path, replacements) => {
            const resolved = resolvePath(translations[language], path);

            if (typeof resolved !== 'string') {
                return path;
            }

            return applyReplacements(resolved, replacements);
        },
        tArray: (path) => {
            const resolved = resolvePath(translations[language], path);
            return Array.isArray(resolved) ? resolved : [];
        },
        translated: (value, fallback) => {
            if (value) {
                const preferredLanguages = [language, 'nl', 'en', 'es'].filter(
                    (code, index, values): code is Language => values.indexOf(code) === index,
                );

                for (const preferredLanguage of preferredLanguages) {
                    const candidate = value[preferredLanguage];

                    if (typeof candidate === 'string' && candidate.trim() !== '') {
                        return candidate;
                    }
                }
            }

            return typeof fallback === 'string' ? fallback : '';
        },
        continent: (value) => {
            if (!value) {
                return '';
            }

            if (value === 'Alles') {
                return (resolvePath(translations[language], 'continents.all') as string) ?? value;
            }

            const key = continentKeyMap[value];

            if (!key) {
                return value;
            }

            return (resolvePath(translations[language], `continents.${key}`) as string) ?? value;
        },
        categoryName: (slug, fallback) => {
            if (!slug) {
                return fallback ?? '';
            }

            const resolved = resolvePath(translations[language], `categoryNames.${slug}`);

            return typeof resolved === 'string' ? resolved : (fallback ?? slug);
        },
        status: (kind, value) => {
            if (!value) {
                return '';
            }

            const resolved = resolvePath(translations[language], `statuses.${kind}.${value}`);

            return typeof resolved === 'string' ? resolved : value;
        },
        count: (kind, value) => {
            const [singular, plural] = countWords[language][kind];
            return `${value} ${value === 1 ? singular : plural}`;
        },
        formatDate: (value) =>
            new Intl.DateTimeFormat(localeMap[language], {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            }).format(new Date(value)),
        languageOptions,
    };

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n() {
    const context = useContext(LanguageContext);

    if (!context) {
        throw new Error('useI18n must be used inside LanguageProvider');
    }

    return context;
}
