import React from 'react';
import { Inbox, Plus } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
    title = 'No Records Found',
    description = 'Get started by creating your first record or adjust your search filters.',
    icon: Icon = Inbox,
    actionLabel,
    onAction,
    className = ''
}) {
    return (
        <div className={`flex flex-col items-center justify-center p-12 text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/40 ${className}`}>
            <div className="w-16 h-16 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-400 mb-4 shadow-inner">
                <Icon className="w-8 h-8 text-indigo-400" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
            <p className="text-xs text-zinc-400 max-w-sm mt-1 mb-6 leading-relaxed">
                {description}
            </p>
            {actionLabel && onAction && (
                <Button variant="primary" size="md" onClick={onAction}>
                    <Plus className="w-4 h-4 mr-1.5" />
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}

