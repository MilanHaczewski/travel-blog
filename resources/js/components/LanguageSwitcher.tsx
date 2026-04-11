import { useI18n } from '@/lib/i18n';

export default function LanguageSwitcher() {
    const { language, languageOptions, setLanguage, t } = useI18n();

    return (
        <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/85 p-1 shadow-sm">
            <span className="px-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">{t('language.label')}</span>
            {languageOptions.map((option) => {
                const active = option.code === language;

                return (
                    <button
                        key={option.code}
                        type="button"
                        onClick={() => setLanguage(option.code)}
                        className={`rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] transition ${
                            active ? 'bg-[#0f766e] text-white shadow-sm' : 'text-slate-600 hover:bg-[#f7f3eb]'
                        }`}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}
