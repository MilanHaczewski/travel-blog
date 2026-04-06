import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

export default function AppLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col bg-white text-gray-900">
            <Navbar />

            <main className="flex-1">
                {children}
            </main>

            <Footer />
        </div>
    );
}