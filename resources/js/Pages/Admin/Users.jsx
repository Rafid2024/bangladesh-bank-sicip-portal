import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import {
    Users as UsersIcon,
    Shield,
    CheckCircle2,
    XCircle,
    UserCheck,
    Search,
    Filter,
    Key,
    Lock,
    Eye
} from 'lucide-react';
import AppLayout from '../../Layouts/AppLayout';
import BentoCard from '../../Components/Common/BentoCard';
import Badge from '../../Components/Common/Badge';
import Button from '../../Components/Common/Button';
import Modal from '../../Components/Common/Modal';

export default function Users({ users, roles = [], permissions = {}, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedRole, setSelectedRole] = useState(filters.role || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [matrixModalOpen, setMatrixModalOpen] = useState(false);

    const applyFilters = (newFilters = {}) => {
        router.get(
            '/admin/users',
            {
                search,
                role: selectedRole,
                status: selectedStatus,
                ...newFilters,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        applyFilters({ search });
    };

    const handleToggleStatus = (user, newStatus) => {
        router.post(`/admin/users/${user.id}/status`, { status: newStatus });
    };

    const handleRoleChange = (user, newRole) => {
        router.post(`/admin/users/${user.id}/role`, { role: newRole });
    };

    const handleImpersonate = (user) => {
        if (confirm(`Do you wish to enter impersonation mode as ${user.name}?`)) {
            router.post(`/auth/impersonate/${user.id}`);
        }
    };

    return (
        <AppLayout title="Access Governance & Role-Based Access Control (RBAC)">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-2">
                        <Badge variant="purple" size="md">
                            Super Admin Governance
                        </Badge>
                        <span className="text-xs text-zinc-400">User Lifecycle & Impersonation Guard</span>
                    </div>
                    <h1 className="text-2xl font-black tracking-tight text-white mt-1">
                        Enterprise User Governance & RBAC
                    </h1>
                </div>

                <Button variant="outline" size="sm" onClick={() => setMatrixModalOpen(true)}>
                    <Key className="w-4 h-4 mr-1.5 text-indigo-400" />
                    Inspect Permission Matrix
                </Button>
            </div>

            {/* Filter Bar */}
            <div className="bento-tile rounded-3xl p-5 mb-6 bg-[#1f1f23]">
                <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name, email, or company..."
                            className="w-full bg-[#18181B] border border-zinc-800 rounded-xl pl-10 pr-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <select
                            value={selectedRole}
                            onChange={(e) => {
                                setSelectedRole(e.target.value);
                                applyFilters({ role: e.target.value });
                            }}
                            className="w-full bg-[#18181B] border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
                        >
                            <option value="">All Roles</option>
                            <option value="super_admin">Super Administrator</option>
                            <option value="operations_manager">Operations Manager</option>
                            <option value="client_user">Client / Portal User</option>
                        </select>
                    </div>

                    <div>
                        <select
                            value={selectedStatus}
                            onChange={(e) => {
                                setSelectedStatus(e.target.value);
                                applyFilters({ status: e.target.value });
                            }}
                            className="w-full bg-[#18181B] border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
                        >
                            <option value="">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="suspended">Suspended</option>
                            <option value="pending_verification">Pending Verification</option>
                        </select>
                    </div>
                </form>
            </div>

            {/* Users Table */}
            <div className="bento-tile rounded-3xl overflow-hidden bg-[#1f1f23]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="border-b border-zinc-800 bg-zinc-900/60 text-zinc-400 font-bold uppercase tracking-wider">
                                <th className="p-4">User Stakeholder</th>
                                <th className="p-4">Contact & Phone</th>
                                <th className="p-4">Organization & Dept</th>
                                <th className="p-4">RBAC Role</th>
                                <th className="p-4">Lifecycle Status</th>
                                <th className="p-4 text-right">Administrative Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/60">
                            {users.data.map((u) => (
                                <tr key={u.id} className="hover:bg-zinc-800/40 transition">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=6366F1&color=fff`}
                                                alt={u.name}
                                                className="w-9 h-9 rounded-full object-cover border border-zinc-700"
                                            />
                                            <div>
                                                <p className="font-bold text-white">{u.name}</p>
                                                <p className="text-[11px] text-zinc-400">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 font-mono text-zinc-300">
                                        {u.phone || 'No phone set'}
                                    </td>
                                    <td className="p-4">
                                        <p className="font-semibold text-zinc-200">{u.company_name || 'Individual'}</p>
                                        <p className="text-[10px] text-zinc-500">{u.department || 'General'}</p>
                                    </td>
                                    <td className="p-4">
                                        <select
                                            value={u.role}
                                            onChange={(e) => handleRoleChange(u, e.target.value)}
                                            className="bg-[#18181B] border border-zinc-700/80 rounded-lg px-2 py-1 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                                        >
                                            <option value="super_admin">Super Administrator</option>
                                            <option value="operations_manager">Operations Manager</option>
                                            <option value="client_user">Client / Portal User</option>
                                        </select>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-1.5">
                                            <Badge
                                                variant={
                                                    u.status === 'active'
                                                        ? 'success'
                                                        : u.status === 'suspended'
                                                        ? 'danger'
                                                        : 'warning'
                                                }
                                                size="sm"
                                            >
                                                {u.status.toUpperCase()}
                                            </Badge>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {/* Status Toggles */}
                                            {u.status === 'active' ? (
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleStatus(u, 'suspended')}
                                                    className="px-2 py-1 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-[11px] font-semibold transition cursor-pointer"
                                                >
                                                    Suspend
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleStatus(u, 'active')}
                                                    className="px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-[11px] font-semibold transition cursor-pointer"
                                                >
                                                    Activate
                                                </button>
                                            )}

                                            {/* Impersonation Mode Action */}
                                            {u.role !== 'super_admin' && (
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => handleImpersonate(u)}
                                                    className="py-1 px-2.5 text-[11px]"
                                                >
                                                    <UserCheck className="w-3.5 h-3.5 mr-1 text-indigo-400" />
                                                    Login As User
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Permission Matrix Modal */}
            <Modal
                isOpen={matrixModalOpen}
                onClose={() => setMatrixModalOpen(false)}
                title="Granular RBAC Authorization Matrix"
                description="Mapped platform permissions across role boundaries."
                maxWidth="max-w-2xl"
            >
                <div className="space-y-4">
                    {Object.entries(permissions).map(([group, perms]) => (
                        <div key={group} className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800">
                            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">
                                {group} Domain
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {perms.map((p) => (
                                    <div key={p.id} className="p-2 rounded-xl bg-zinc-800/50 border border-zinc-700/40 text-xs">
                                        <p className="font-semibold text-white">{p.name}</p>
                                        <p className="text-[10px] text-zinc-400 font-mono">{p.slug}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </Modal>
        </AppLayout>
    );
}

