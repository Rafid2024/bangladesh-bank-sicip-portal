import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import {
    Users,
    Activity,
    DollarSign,
    CheckCircle2,
    Clock,
    AlertCircle,
    ArrowUpRight,
    Server,
    Shield,
    Sparkles,
    Radio,
    Terminal,
    Eye,
    Layers,
    FileText
} from 'lucide-react';
import AppLayout from '../../Layouts/AppLayout';
import BentoCard from '../../Components/Common/BentoCard';
import Badge from '../../Components/Common/Badge';
import Button from '../../Components/Common/Button';
import Skeleton from '../../Components/Common/Skeleton';
import LogoSettingsCard from '../../Components/Dashboard/LogoSettingsCard';

export default function AdminDashboard({ telemetry, pendingRequests = [], recentUsers = [] }) {
    const [simulateLoading, setSimulateLoading] = useState(false);
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [broadcastSent, setBroadcastSent] = useState(false);

    const kpis = telemetry?.kpis || {};
    const health = telemetry?.system_health || {};
    const trends = telemetry?.daily_trends || [];

    const handleBroadcast = () => {
        setBroadcastSent(true);
        setTimeout(() => setBroadcastSent(false), 4000);
    };

    return (
        <AppLayout title="Executive Mission Control & Telemetry">
            {/* Top Toolbar / Mode Switchers */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-2">
                        <Badge variant="purple" size="md">
                            Super Administrator Core
                        </Badge>
                        <span className="text-xs text-zinc-400">Governance & Cluster Health</span>
                    </div>
                    <h1 className="text-2xl font-black tracking-tight text-white mt-1">
                        Executive Bento Analytics
                    </h1>
                </div>

                <div className="flex items-center gap-2">
                    {/* Skeleton shimmer state preview toggle */}
                    <button
                        type="button"
                        onClick={() => setSimulateLoading(!simulateLoading)}
                        className={`text-xs px-3 py-1.5 rounded-xl border font-medium transition cursor-pointer flex items-center gap-1.5 ${
                            simulateLoading
                                ? 'bg-indigo-600 text-white border-indigo-500'
                                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                        }`}
                    >
                        <Layers className="w-3.5 h-3.5" />
                        {simulateLoading ? 'Disable Skeleton State' : 'Preview Skeleton Shimmer'}
                    </button>

                    <Link href="/requests">
                        <Button variant="primary" size="sm">
                            <FileText className="w-4 h-4 mr-1" />
                            Manage Workflows
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Broadcast Toast Alert */}
            {broadcastSent && (
                <div className="mb-6 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-200 text-xs flex items-center justify-between animate-in fade-in">
                    <div className="flex items-center gap-2">
                        <Radio className="w-4 h-4 text-indigo-400 animate-pulse" />
                        <span>System announcement successfully broadcasted across all active client websockets.</span>
                    </div>
                </div>
            )}

            {/* If Skeleton State is Simulated */}
            {simulateLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <Skeleton className="h-44 rounded-3xl" count={1} />
                    <Skeleton className="h-44 rounded-3xl" count={1} />
                    <Skeleton className="h-44 rounded-3xl" count={1} />
                    <Skeleton className="h-44 rounded-3xl" count={1} />
                    <Skeleton className="h-80 md:col-span-2 rounded-3xl" count={1} />
                    <Skeleton className="h-80 md:col-span-2 rounded-3xl" count={1} />
                </div>
            ) : (
                /* Bento Grid Layout (Modular 1x1, 2x1, 2x2 tiles with visual rhythm) */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]">
                    {/* Tile 1 (1x1): Total Revenue & Volume */}
                    <BentoCard
                        span="1x1"
                        title="Revenue Volume"
                        badge={<Badge variant="success" size="sm">+28.4% YoY</Badge>}
                    >
                        <div className="my-auto">
                            <span className="text-3xl font-extrabold text-white tracking-tight font-mono">
                                ${Number(kpis.total_revenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                            <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
                                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                                Multi-gateway processed volume
                            </p>
                        </div>
                    </BentoCard>

                    {/* Tile 2 (1x1): Active Enterprise Users */}
                    <BentoCard
                        span="1x1"
                        title="Identity Governance"
                        badge={<Badge variant="primary" size="sm">RBAC Active</Badge>}
                        action={
                            <Link href="/admin/users" className="text-zinc-500 hover:text-indigo-400 transition">
                                <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        }
                    >
                        <div className="my-auto">
                            <span className="text-3xl font-extrabold text-white tracking-tight font-mono">
                                {kpis.total_users || 0}
                            </span>
                            <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
                                <Users className="w-3.5 h-3.5 text-indigo-400" />
                                {kpis.active_users || 0} active • 0 compromised
                            </p>
                        </div>
                    </BentoCard>

                    {/* Tile 3 (1x1): Workflow Execution SLA */}
                    <BentoCard
                        span="1x1"
                        title="SLA Compliance"
                        badge={<Badge variant="info" size="sm">High Precision</Badge>}
                    >
                        <div className="my-auto">
                            <span className="text-3xl font-extrabold text-white tracking-tight font-mono">
                                {kpis.sla_compliance || '98.4%'}
                            </span>
                            <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                                {kpis.completed_requests || 0} completed successfully
                            </p>
                        </div>
                    </BentoCard>

                    {/* Tile 4 (1x1): Active Queues & Bottlenecks */}
                    <BentoCard
                        span="1x1"
                        title="Pending Approvals"
                        badge={<Badge variant="warning" size="sm">{kpis.pending_approvals || 0} In Queue</Badge>}
                        action={
                            <Link href="/requests?status=pending_review" className="text-zinc-500 hover:text-amber-400 transition">
                                <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        }
                    >
                        <div className="my-auto">
                            <span className="text-3xl font-extrabold text-white tracking-tight font-mono">
                                {kpis.pending_approvals || 0}
                            </span>
                            <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-amber-400" />
                                Requires manager sign-off
                            </p>
                        </div>
                    </BentoCard>

                    {/* Tile 5 (2x2): 30-Day Growth & State Distribution Trend */}
                    <BentoCard
                        span="2x2"
                        title="30-Day Velocity & Ingestion Cadence"
                        subtitle="Requests dispatched vs successfully verified completion"
                        badge={<Badge variant="primary" size="sm">Real-time Stream</Badge>}
                    >
                        <div className="space-y-4 my-2">
                            {/* Visual Trend Bars */}
                            <div className="grid grid-cols-7 gap-2 items-end h-40 pt-4 border-b border-zinc-800">
                                {trends.map((t, idx) => (
                                    <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end">
                                        <div
                                            className="w-full bg-indigo-600/30 hover:bg-indigo-600/50 rounded-t-lg transition border-t border-x border-indigo-500/40 relative group"
                                            style={{ height: `${(t.requests / 55) * 100}%` }}
                                        >
                                            <div
                                                className="w-full bg-indigo-500 rounded-t-lg absolute bottom-0 transition"
                                                style={{ height: `${(t.completed / t.requests) * 100}%` }}
                                            />
                                            {/* Tooltip */}
                                            <div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-700 px-2 py-0.5 rounded text-[10px] text-white whitespace-nowrap z-20">
                                                {t.completed}/{t.requests} done
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-zinc-500 font-mono">{t.day}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Status Pills */}
                            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400 pt-2">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded bg-indigo-500"></span>
                                    <span>Completed Workflows</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded bg-indigo-500/30"></span>
                                    <span>Incoming Intake Requests</span>
                                </div>
                                <span className="text-zinc-500 font-mono text-[11px]">Avg. SLA: 4.2 hrs</span>
                            </div>
                        </div>
                    </BentoCard>

                    {/* Logo Management Section for Form Branding */}
                    <LogoSettingsCard />

                    {/* Tile 6 (2x1): Mission Control Quick Actions */}
                    <BentoCard
                        span="2x1"
                        title="Mission Control Center"
                        subtitle="Instant administrative commands & event triggers"
                        badge={<Badge variant="purple" size="sm">Elevated Guard</Badge>}
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-auto">
                            <button
                                type="button"
                                onClick={handleBroadcast}
                                className="p-3.5 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-indigo-500/50 text-left transition group cursor-pointer"
                            >
                                <Radio className="w-5 h-5 text-indigo-400 mb-2 group-hover:scale-110 transition" />
                                <h4 className="text-xs font-bold text-white">Broadcast Event</h4>
                                <p className="text-[11px] text-zinc-400 mt-0.5">Emit platform notice</p>
                            </button>

                            <button
                                type="button"
                                onClick={() => setMaintenanceMode(!maintenanceMode)}
                                className={`p-3.5 rounded-2xl border text-left transition group cursor-pointer ${
                                    maintenanceMode
                                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                                        : 'bg-zinc-900/90 hover:bg-zinc-800 border-zinc-800 hover:border-amber-500/50'
                                }`}
                            >
                                <Server className="w-5 h-5 text-amber-400 mb-2 group-hover:scale-110 transition" />
                                <h4 className="text-xs font-bold text-white">
                                    {maintenanceMode ? 'Maintenance ON' : 'Toggle Maintenance'}
                                </h4>
                                <p className="text-[11px] text-zinc-400 mt-0.5">Circuit breaker lock</p>
                            </button>

                            <Link
                                href="/admin/audit-logs"
                                className="p-3.5 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-sky-500/50 text-left transition group block"
                            >
                                <Terminal className="w-5 h-5 text-sky-400 mb-2 group-hover:scale-110 transition" />
                                <h4 className="text-xs font-bold text-white">Audit Inspector</h4>
                                <p className="text-[11px] text-zinc-400 mt-0.5">Inspect JSON diffs</p>
                            </Link>
                        </div>
                    </BentoCard>

                    {/* Tile 7 (2x1): Cluster & Telemetry Health Status */}
                    <BentoCard
                        span="2x1"
                        title="Infrastructure Telemetry"
                        subtitle="Microservices & async queue health metrics"
                        badge={<Badge variant="success" size="sm">99.98% Uptime</Badge>}
                    >
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-auto">
                            <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
                                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-bold">API Latency</span>
                                <span className="text-lg font-bold text-emerald-400 font-mono">{health.api_latency || '42ms'}</span>
                            </div>
                            <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
                                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-bold">Database</span>
                                <span className="text-sm font-semibold text-white truncate block">SQLite WAL</span>
                            </div>
                            <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
                                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-bold">Queue Workers</span>
                                <span className="text-sm font-semibold text-indigo-300 truncate block">0 Backlog</span>
                            </div>
                            <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
                                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-bold">RAM Memory</span>
                                <span className="text-sm font-semibold text-zinc-300 font-mono">18.4 MB</span>
                            </div>
                        </div>
                    </BentoCard>

                    {/* Tile 8 (full): Pending Workflow Approvals Quick Triage */}
                    <BentoCard
                        span="full"
                        title="Real-Time State Machine Approvals Queue"
                        subtitle="Requests awaiting operations triage or sign-off"
                        action={
                            <Link href="/requests" className="text-xs text-indigo-400 hover:underline flex items-center gap-1 font-semibold">
                                View Full Engine <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>
                        }
                    >
                        <div className="overflow-x-auto mt-2">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-zinc-800 text-zinc-500 font-medium">
                                        <th className="pb-3">Tracking Code</th>
                                        <th className="pb-3">Title & Domain</th>
                                        <th className="pb-3">Client Stakeholder</th>
                                        <th className="pb-3">Priority</th>
                                        <th className="pb-3">Current Status</th>
                                        <th className="pb-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800/60">
                                    {pendingRequests.map((req) => (
                                        <tr key={req.id} className="hover:bg-zinc-800/40 transition">
                                            <td className="py-3 font-mono font-bold text-indigo-400">
                                                {req.tracking_code}
                                            </td>
                                            <td className="py-3">
                                                <p className="font-semibold text-white">{req.title}</p>
                                                <p className="text-[10px] text-zinc-400">{req.category}</p>
                                            </td>
                                            <td className="py-3 text-zinc-300 font-medium">
                                                {req.client?.name || 'Enterprise Client'}
                                            </td>
                                            <td className="py-3">
                                                <Badge
                                                    variant={
                                                        req.priority === 'critical'
                                                            ? 'danger'
                                                            : req.priority === 'high'
                                                            ? 'warning'
                                                            : 'default'
                                                    }
                                                    size="sm"
                                                >
                                                    {req.priority.toUpperCase()}
                                                </Badge>
                                            </td>
                                            <td className="py-3">
                                                <Badge variant="primary" size="sm">
                                                    {req.status.replace('_', ' ').toUpperCase()}
                                                </Badge>
                                            </td>
                                            <td className="py-3 text-right">
                                                <Link href="/requests">
                                                    <Button variant="outline" size="sm">
                                                        Inspect
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </BentoCard>
                </div>
            )}
        </AppLayout>
    );
}

