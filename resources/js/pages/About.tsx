import { Head } from '@inertiajs/react';

import Container from '@/components/container';
import AppLayout from '@/Layouts/AppLayout';

export default function About() {
    return (
        <AppLayout>
            <Head title="Over ons" />

            <section className="py-20">
                <Container className="max-w-5xl">
                    <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#cb5b4c]">Over ons</p>
                    <h1 className="mt-4 text-5xl font-black text-slate-900">Tulips & Arepas is het gezamenlijke reisverhaal van Milan en Juliana.</h1>
                    <div className="mt-6 space-y-6 text-lg leading-8 text-slate-600">
                        <p>
                            Milan is Nederlands-Pools, Juliana is Colombiaans, en samen delen we ons leven tussen verschillende landen,
                            talen, smaken en manieren van reizen. Ons YouTube-kanaal heet <span className="font-semibold text-slate-900">Tulips & Arepas</span>,
                            en deze site wordt het geschreven en visuele archief daarvan.
                        </p>
                        <p>
                            Hier willen we persoonlijke verhalen verzamelen over interrailreizen door Duitsland en Tsjechie, herinneringen aan
                            Medellin, dagen op Isla Fuerte en alle spontane uitstapjes die ons samen gevormd hebben.
                        </p>
                    </div>
                </Container>
            </section>
        </AppLayout>
    );
}
