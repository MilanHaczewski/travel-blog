import { Head } from '@inertiajs/react';

import Container from '@/components/container';
import AppLayout from '@/Layouts/AppLayout';

export default function About() {
    return (
        <AppLayout>
            <Head title="Over" />

            <section className="py-20">
                <Container className="max-w-4xl">
                    <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#0f766e]">Over Roamlog</p>
                    <h1 className="mt-4 text-5xl font-black text-slate-900">Een travel blog dat voelt als een zorgvuldig bijgehouden reisdagboek.</h1>
                    <p className="mt-6 text-lg leading-8 text-slate-600">
                        Deze site is opgezet om reisverhalen, route-inspiratie en bestemmingengidsen te bundelen op een manier die persoonlijk
                        en overzichtelijk blijft. Je kunt hier posts publiceren, bestemmingen koppelen en later eenvoudig verder uitbouwen.
                    </p>
                </Container>
            </section>
        </AppLayout>
    );
}
