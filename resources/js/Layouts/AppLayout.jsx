import FlashBanner from '@/components/FlashBanner';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

export default function AppLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col bg-[#f7f3eb] text-slate-900">
            <Navbar />
            <FlashBanner />

            <main className="flex-1">{children}</main>

            <Footer />
        </div>
    );
}
