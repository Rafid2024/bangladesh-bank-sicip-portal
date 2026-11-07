import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';

export default function ErrorAlert({
    title = 'Action Required',
    message,
    onRetry,
    className = ''
}) {
    if (!message) return null;

    return (
        <div className={`p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 flex items-start justify-between gap-4 animate-in fade-in ${className}`}>
            <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 mt-0.5">
                    <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-rose-100">{title}</h4>
                    <p className="text-xs text-rose-300/90 mt-0.5 leading-relaxed">{message}</p>
                </div>
            </div>
            {onRetry && (
                <Button
                    variant="danger"
                    size="sm"
                    onClick={onRetry}
                    className="shrink-0 text-xs py-1 px-3"
                >
                    <RefreshCw className="w-3.5 h-3.5 mr-1" />
                    Retry
                </Button>
            )}
        </div>
    );
}

