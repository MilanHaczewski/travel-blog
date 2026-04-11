import { useI18n } from '@/lib/i18n';

export default function Footer() {
    const { t } = useI18n();

    return (
        <footer className="border-t border-[#ead8c4] bg-[#fff8ef]">
            <div className="mx-auto max-w-7xl px-6 py-8 text-sm text-slate-600">
                <p>{t('footer.text')}</p>
            </div>
        </footer>
    );
}
