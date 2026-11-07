import React from 'react';

export default function Input({
    label,
    error,
    id,
    type = 'text',
    className = '',
    helper,
    ...props
}) {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={inputId} className="block text-xs font-medium text-zinc-300 mb-1.5 uppercase tracking-wider">
                    {label}
                </label>
            )}
            <input
                id={inputId}
                type={type}
                className={`w-full bg-[#18181B] border ${
                    error ? 'border-rose-500 focus:ring-rose-500' : 'border-zinc-800 focus:border-indigo-500 focus:ring-indigo-500/20'
                } rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 shadow-inner focus:outline-none focus:ring-2 transition-all ${className}`}
                {...props}
            />
            {helper && !error && (
                <p className="mt-1 text-xs text-zinc-500">{helper}</p>
            )}
            {error && (
                <p className="mt-1.5 text-xs text-rose-400 font-medium flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-rose-400"></span>
                    {error}
                </p>
            )}
        </div>
    );
}

