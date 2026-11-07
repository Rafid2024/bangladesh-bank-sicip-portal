import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function SlideOverDrawer({
    isOpen,
    onClose,
    title,
    subtitle,
    children,
    width = 'max-w-xl'
}) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
                <div className={`w-screen ${width} bg-[#1a1a1e] border-l border-zinc-700/80 shadow-2xl flex flex-col justify-between text-zinc-100 transform transition ease-in-out duration-300 animate-in slide-in-from-right`}>
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-zinc-800/80 flex items-center justify-between bg-[#1f1f23]">
                        <div>
                            <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
                            {subtitle && <p className="text-xs text-zinc-400 mt-1">{subtitle}</p>}
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-zinc-400 hover:text-white p-2 rounded-xl hover:bg-zinc-800 transition cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Scrollable Body */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

