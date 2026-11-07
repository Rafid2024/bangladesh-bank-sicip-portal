import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({
    isOpen,
    onClose,
    title,
    description,
    children,
    maxWidth = 'max-w-xl',
}) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Box */}
            <div className={`relative w-full ${maxWidth} bg-[#1f1f23] border border-zinc-700/80 rounded-2xl shadow-2xl p-6 text-zinc-100 z-10 animate-in fade-in zoom-in-95 duration-200`}>
                <div className="flex items-start justify-between pb-4 border-b border-zinc-800/80">
                    <div>
                        {title && <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>}
                        {description && <p className="text-xs text-zinc-400 mt-1">{description}</p>}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="mt-4">{children}</div>
            </div>
        </div>
    );
}

