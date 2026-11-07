import React from 'react';

export default function BentoCard({
    title,
    subtitle,
    badge,
    action,
    span = '1x1', // '1x1', '2x1', '2x2', '3x1', 'full'
    className = '',
    children,
    ...props
}) {
    const spanClasses = {
        '1x1': 'col-span-1 row-span-1',
        '2x1': 'col-span-1 md:col-span-2 row-span-1',
        '2x2': 'col-span-1 md:col-span-2 row-span-2',
        '3x1': 'col-span-1 md:col-span-3 row-span-1',
        'full': 'col-span-1 md:col-span-3 lg:col-span-4',
    };

    return (
        <div
            className={`bento-tile rounded-3xl p-6 flex flex-col justify-between ${spanClasses[span] || spanClasses['1x1']} ${className}`}
            {...props}
        >
            {(title || subtitle || badge || action) && (
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                        <div className="flex items-center gap-2">
                            {title && <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">{title}</h3>}
                            {badge}
                        </div>
                        {subtitle && <p className="text-xs text-zinc-400 mt-0.5">{subtitle}</p>}
                    </div>
                    {action && <div>{action}</div>}
                </div>
            )}
            <div className="flex-1 flex flex-col justify-center">{children}</div>
        </div>
    );
}

