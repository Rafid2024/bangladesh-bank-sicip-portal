import React from 'react';
import { router, usePage } from '@inertiajs/react';
import { UserCheck, LogOut } from 'lucide-react';
import Button from './Button';

export default function ImpersonationBanner() {
    const { auth } = usePage().props;

    if (!auth?.impersonator) return null;

    const handleRevert = () => {
        router.post('/auth/impersonate/revert');
    };

    return (
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-lg sticky top-0 z-50 animate-in slide-in-from-top">
            <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 animate-pulse" />
                <span>
                    <strong>Impersonation Active:</strong> You are viewing the platform as <strong>{auth.user?.name}</strong> ({auth.user?.role}).
                </span>
            </div>
            <Button
                variant="secondary"
                size="sm"
                onClick={handleRevert}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 py-1 text-xs"
            >
                <LogOut className="w-3.5 h-3.5 mr-1" />
                Return to {auth.impersonator.name}
            </Button>
        </div>
    );
}

