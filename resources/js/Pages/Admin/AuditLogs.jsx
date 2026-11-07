import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import {
    Terminal,
    Search,
    ShieldAlert,
    Calendar,
    Globe,
    User as UserIcon,
    Code2,
    Eye
} from 'lucide-react';
import AppLayout from '../../Layouts/AppLayout';
import BentoCard from '../../Components/Common/BentoCard';
import Badge from '../../Components/Common/Badge';
import Modal from '../../Components/Common/Modal';

export default function AuditLogs({ logs, filters = {}, availableActions = [] }) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedAction, setSelectedAction] = useState(filters.action || '');
    const [inspectedLog, setInspectedLog] = useState(null);

    const applyFilters = (newFilters = {}) => {
        router.get(
            '/admin/audit-logs',
            {
                search,
                action: selectedAction,
                ...newFilters,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        applyFilters({ search });
    };

    return (
        <AppLayout title="Audit Trails & Security Telemetry Logs">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-2">
                        <Badge variant="purple" size="md">
                            Security Hardened
                        </Badge>
                        <span className="text-xs text-zinc-400">Cryptographic Activity Logs</span>
                    </div>
                    <h1 className="text-2xl font-black tracking-tight text-white mt-1">
                        System Audit Trails & JSON Diffs
                    </h1>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bento-tile rounded-3xl p-5 mb-6 bg-[#1f1f23]">
                <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="relative md:col-span-2">
                        <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by action, description, or IP address..."
                            className="w-full bg-[#18181B] border border-zinc-800 rounded-xl pl-10 pr-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <select
                            value={selectedAction}
                            onChange={(e) => {
                                setSelectedAction(e.target.value);
                                applyFilters({ action: e.target.value });
                            }}
                            className="w-full bg-[#18181B] border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
                        >
                            <option value="">All Action Types</option>
                            {availableActions.map((act) => (
                                <option key={act} value={act}>{act}</option>
                            ))}
                        </select>
                    </div>
                </form>
            </div>

            {/* Audit Log Table */}
            <div className="bento-tile rounded-3xl overflow-hidden bg-[#1f1f23]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="border-b border-zinc-800 bg-zinc-900/60 text-zinc-400 font-bold uppercase tracking-wider">
                                <th className="p-4">Timestamp</th>
                                <th className="p-4">Action Event</th>
                                <th className="p-4">Actor</th>
                                <th className="p-4">Audit Description</th>
                                <th className="p-4 font-mono">Origin IP</th>
                                <th className="p-4 text-right">Payload</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/60 font-mono">
                            {logs.data.map((log) => (
                                <tr key={log.id} className="hover:bg-zinc-800/40 transition">
                                    <td className="p-4 text-zinc-400 whitespace-nowrap text-[11px]">
                                        {new Date(log.created_at).toLocaleString()}
                                    </td>
                                    <td className="p-4">
                                        <Badge variant="primary" size="sm">
                                            {log.action}
                                        </Badge>
                                    </td>
                                    <td className="p-4 font-sans font-semibold text-zinc-200">
                                        {log.user?.name || 'System Daemon'}
                                    </td>
                                    <td className="p-4 font-sans text-zinc-300 max-w-md truncate">
                                        {log.description}
                                    </td>
                                    <td className="p-4 text-zinc-400 text-[11px]">
                                        {log.ip_address || '127.0.0.1'}
                                    </td>
                                    <td className="p-4 text-right font-sans">
                                        <button
                                            type="button"
                                            onClick={() => setInspectedLog(log)}
                                            className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ml-auto"
                                        >
                                            <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                                            Diff Inspect
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {logs.links && logs.links.length > 3 && (
                    <div className="p-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                        <span>Showing {logs.from} to {logs.to} of {logs.total} logs</span>
                        <div className="flex gap-1">
                            {logs.links.map((link, idx) => (
                                <button
                                    key={idx}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                                        link.active
                                            ? 'bg-indigo-600 text-white font-bold'
                                            : link.url
                                            ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                                            : 'opacity-30 pointer-events-none'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* JSON Metadata Diff Modal */}
            <Modal
                isOpen={!!inspectedLog}
                onClose={() => setInspectedLog(null)}
                title={`Audit Payload: ${inspectedLog?.action}`}
                description={`Recorded at ${inspectedLog ? new Date(inspectedLog.created_at).toLocaleString() : ''} by ${inspectedLog?.user?.name || 'System'}`}
                maxWidth="max-w-2xl"
            >
                <div className="space-y-3">
                    <p className="text-xs text-zinc-300 bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                        {inspectedLog?.description}
                    </p>
                    <div>
                        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                            Raw JSON Metadata Diff
                        </span>
                        <pre className="p-4 rounded-xl bg-[#121215] border border-zinc-800 font-mono text-xs text-emerald-400 overflow-x-auto max-h-72">
                            {JSON.stringify(inspectedLog?.metadata || {}, null, 2)}
                        </pre>
                    </div>
                </div>
            </Modal>
        </AppLayout>
    );
}

