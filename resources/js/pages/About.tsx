import { Head } from '@inertiajs/react';

import Container from '@/components/container';
import { useI18n } from '@/lib/i18n';
import AppLayout from '@/Layouts/AppLayout';

export default function About() {
    const { t } = useI18n();

    return (
        <AppLayout>
            <Head title={t('about.title')} />

            <section className="py-20">
                <Container className="max-w-5xl">
                    <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#cb5b4c]">{t('about.label')}</p>
                    <h1 className="mt-4 text-5xl font-black text-slate-900">{t('about.heading')}</h1>
                    <div className="mt-6 space-y-6 text-lg leading-8 text-slate-600">
                        <p>{t('about.bodyOne')}</p>
                        <p>{t('about.bodyTwo')}</p>
                    </div>
                </Container>
            </section>
        </AppLayout>
    );
}
