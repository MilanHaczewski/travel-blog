import { usePage } from '@inertiajs/react';

export default function FlashBanner() {
    const { flash } = usePage().props as {
        flash: {
            success?: string | null;
            error?: string | null;
        };
    };

    if (flash?.success) {
        return (
            <div className="border-b border-emerald-200 bg-emerald-50 px-6 py-3 text-sm font-medium text-emerald-800">
                {flash.success}
            </div>
        );
    }

    if (flash?.error) {
        return (
            <div className="border-b border-rose-200 bg-rose-50 px-6 py-3 text-sm font-medium text-rose-800">
                {flash.error}
            </div>
        );
    }

    return null;
}
