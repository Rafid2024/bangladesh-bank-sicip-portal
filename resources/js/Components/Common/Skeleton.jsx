import React from 'react';

export default function Skeleton({
    className = '',
    variant = 'rect',
    count = 1
}) {
    const baseClass = 'bg-zinc-800/80 rounded-xl shimmer-animation';

    if (count > 1) {
        return (
            <div className="space-y-3">
                {Array.from({ length: count }).map((_, idx) => (
                    <div
                        key={idx}
                        className={`${baseClass} ${className || 'h-6 w-full'}`}
                    />
                ))}
            </div>
        );
    }

    if (variant === 'circle') {
        return <div className={`${baseClass} rounded-full ${className || 'h-10 w-10'}`} />;
    }

    return <div className={`${baseClass} ${className || 'h-6 w-full'}`} />;
}

