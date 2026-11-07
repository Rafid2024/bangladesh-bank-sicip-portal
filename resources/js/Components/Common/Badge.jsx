import React from 'react';

export default function Badge({
    children,
    variant = 'default',
    size = 'md',
    className = ''
}) {
    const variants = {
        default: 'bg-zinc-800 text-zinc-300 border-zinc-700/60',
        primary: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
        success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        danger: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
        info: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
        purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    };

    const sizes = {
        sm: 'text-[10px] px-2 py-0.5 font-medium tracking-wide',
        md: 'text-xs px-2.5 py-1 font-medium',
        lg: 'text-sm px-3 py-1 font-semibold',
    };

    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full border ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`}>
            {children}
        </span>
    );
}

