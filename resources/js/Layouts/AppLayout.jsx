import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import {
    LayoutDashboard,
    FileSpreadsheet,
    Users,
    ShieldAlert,
    CreditCard,
    Bell,
    LogOut,
    CheckCircle2,
    XCircle,
    Menu,
    X,
    Sparkles,
    ChevronDown,
    Zap,
    LifeBuoy,
    FileText
} from 'lucide-react';
import ImpersonationBanner from '../Components/Common/ImpersonationBanner';
import Badge from '../Components/Common/Badge';

export default function AppLayout({ children, title }) {
    const { auth, flash, notifications } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [personaMenuOpen, setPersonaMenuOpen] = useState(false);

    const user = auth?.user;

    const navItems = [
        {
            label: 'Executive Dashboard',
            href: '/dashboard',
            icon: LayoutDashboard,
            roles: ['super_admin', 'operations_manager', 'client_user'],
        },
        {
            label: 'SICIP Feasibility Reports',
            href: '/sicip/reports',
            icon: FileText,
            roles: ['super_admin', 'operations_manager', 'client_user'],
        },
        {
            label: 'Dynamic CRUD & Workflows',
            href: '/requests',
            icon: FileSpreadsheet,
            roles: ['super_admin', 'operations_manager', 'client_user'],
        },
        {
            label: 'Payments & Gateways',
            href: '/payments',
            icon: CreditCard,
            roles: ['super_admin', 'operations_manager', 'client_user'],
        },
        {
            label: 'User & Role Governance',
            href: '/admin/users',
            icon: Users,
            roles: ['super_admin'],
        },
        {
            label: 'Audit Trails & Telemetry',
            href: '/admin/audit-logs',
            icon: ShieldAlert,
            roles: ['super_admin'],
        },
    ];

    const filteredNav = navItems.filter((item) => !user || item.roles.includes(user.role));

    const handleQuickSwitch = (role) => {
        router.get(`/auth/quick/${role}`);
        setPersonaMenuOpen(false);
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    const currentPath = window.location.pathname;

    return (
        <div className="min-h-screen bg-[#18181B] text-[#F4F4F5] flex flex-col font-sans">
            <ImpersonationBanner />

            {/* Flash Message Banner */}
            {flash?.success && (
                <div className="bg-emerald-500/10 border-b border-emerald-500/20 text-emerald-300 px-6 py-2.5 text-xs font-medium flex items-center justify-between animate-in slide-in-from-top">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>{flash.success}</span>
                    </div>
                </div>
            )}
            {flash?.error && (
                <div className="bg-rose-500/10 border-b border-rose-500/20 text-rose-300 px-6 py-2.5 text-xs font-medium flex items-center justify-between animate-in slide-in-from-top">
                    <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-rose-400" />
                        <span>{flash.error}</span>
                    </div>
                </div>
            )}

            <div className="flex-1 flex flex-col lg:flex-row">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:flex w-72 flex-col justify-between bg-[#151518] border-r border-zinc-800/80 p-5 shrink-0">
                    <div>
                        {/* Brand Header */}
                        <div className="flex items-center gap-3 px-2 py-3 mb-6">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-600/30 border border-indigo-400/30">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
                                    NovaPortal
                                    <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                                        v13
                                    </span>
                                </h1>
                                <p className="text-[11px] text-zinc-400 font-medium">Enterprise Orchestration</p>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <nav className="space-y-1.5">
                            {filteredNav.map((item) => {
                                const Icon = item.icon;
                                const isActive = currentPath === item.href || (item.href !== '/dashboard' && currentPath.startsWith(item.href));
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                            isActive
                                                ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm'
                                                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
                                        }`}
                                    >
                                        <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-zinc-400'}`} />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Quick Demo Persona Switcher & User Profile */}
                    <div className="space-y-4 pt-4 border-t border-zinc-800/80">
                        {/* One-Click Persona Switcher Pill */}
                        <div className="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                                    <Zap className="w-3 h-3 text-amber-400" /> Role Sandbox
                                </span>
                                <Badge variant="primary" size="sm">
                                    {user?.role === 'super_admin' ? 'Admin' : user?.role === 'operations_manager' ? 'Manager' : 'Client'}
                                </Badge>
                            </div>
                            <div className="grid grid-cols-3 gap-1">
                                <button
                                    type="button"
                                    onClick={() => handleQuickSwitch('super_admin')}
                                    className={`text-[10px] py-1 px-1.5 rounded-lg font-medium transition cursor-pointer text-center ${
                                        user?.role === 'super_admin' ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                                    }`}
                                >
                                    Admin
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleQuickSwitch('operations_manager')}
                                    className={`text-[10px] py-1 px-1.5 rounded-lg font-medium transition cursor-pointer text-center ${
                                        user?.role === 'operations_manager' ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                                    }`}
                                >
                                    Manager
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleQuickSwitch('client_user')}
                                    className={`text-[10px] py-1 px-1.5 rounded-lg font-medium transition cursor-pointer text-center ${
                                        user?.role === 'client_user' ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                                    }`}
                                >
                                    Client
                                </button>
                            </div>
                        </div>

                        {/* User Card */}
                        {user && (
                            <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/40">
                                <div className="flex items-center gap-2.5 overflow-hidden">
                                    <img
                                        src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366F1&color=fff`}
                                        alt={user.name}
                                        className="w-9 h-9 rounded-full object-cover border border-zinc-700"
                                    />
                                    <div className="overflow-hidden">
                                        <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                                        <p className="text-[10px] text-zinc-400 truncate">{user.email}</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    title="Sign Out"
                                    className="text-zinc-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-zinc-800 transition cursor-pointer"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Header */}
                    <header className="h-16 bg-[#18181B]/80 backdrop-blur-md border-b border-zinc-800/80 px-6 flex items-center justify-between sticky top-0 z-30">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="lg:hidden text-zinc-400 hover:text-white p-2 rounded-xl bg-zinc-900 border border-zinc-800"
                            >
                                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                            <h2 className="text-base font-bold text-white tracking-tight">{title || 'Enterprise Portal'}</h2>
                        </div>

                        {/* Right Action Icons */}
                        <div className="flex items-center gap-3">
                            {/* Notification Bell with Badge & Dropdown */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                                    className="relative p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition cursor-pointer"
                                >
                                    <Bell className="w-4 h-4" />
                                    {notifications?.unread_count > 0 && (
                                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-600 text-[10px] font-bold text-white flex items-center justify-center border border-[#18181B]">
                                            {notifications.unread_count}
                                        </span>
                                    )}
                                </button>

                                {notificationsOpen && (
                                    <div className="absolute right-0 mt-2 w-80 bg-[#1f1f23] border border-zinc-700/80 rounded-2xl shadow-2xl p-4 text-xs z-50 animate-in fade-in zoom-in-95">
                                        <div className="flex items-center justify-between pb-2 border-b border-zinc-800 mb-2">
                                            <span className="font-bold text-white">Notifications ({notifications?.unread_count || 0})</span>
                                            <span className="text-[10px] text-indigo-400 font-medium">Multi-Channel Log</span>
                                        </div>
                                        <div className="space-y-2 max-h-64 overflow-y-auto">
                                            {notifications?.recent && notifications.recent.length > 0 ? (
                                                notifications.recent.map((n) => (
                                                    <div key={n.id} className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="font-semibold text-zinc-200">{n.title}</span>
                                                            <Badge variant="primary" size="sm">
                                                                {n.channel}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-[11px] text-zinc-400">{n.message}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-zinc-500 text-center py-4">No recent notifications</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* System Status Indicator Pill */}
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                <span>Cluster Active</span>
                            </div>
                        </div>
                    </header>

                    {/* Mobile Navigation Drawer */}
                    {mobileMenuOpen && (
                        <div className="lg:hidden bg-[#151518] border-b border-zinc-800 p-4 space-y-2">
                            {filteredNav.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-300 hover:bg-zinc-800"
                                    >
                                        <Icon className="w-4 h-4 text-indigo-400" />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                            <div className="pt-2 border-t border-zinc-800 flex justify-between items-center">
                                <span className="text-xs text-zinc-400">{user?.name} ({user?.role})</span>
                                <button onClick={handleLogout} className="text-xs text-rose-400 font-semibold">Logout</button>
                            </div>
                        </div>
                    )}

                    {/* Page Content */}
                    <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
