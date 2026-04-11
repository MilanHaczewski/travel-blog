export type ContentLanguage = 'nl' | 'en' | 'es';

export type LocalizedText = Partial<Record<ContentLanguage, string | null>>;
