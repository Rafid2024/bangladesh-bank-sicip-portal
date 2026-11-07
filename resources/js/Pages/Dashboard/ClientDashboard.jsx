import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import {
    Plus,
    Clock,
    CheckCircle2,
    FileText,
    Sparkles,
    ShieldCheck,
    CreditCard,
    ArrowRight,
    Send
} from 'lucide-react';
import AppLayout from '../../Layouts/AppLayout';
import BentoCard from '../../Components/Common/BentoCard';
import Badge from '../../Components/Common/Badge';
import Button from '../../Components/Common/Button';
import SlideOverDrawer from '../../Components/Common/SlideOverDrawer';
import EmptyState from '../../Components/Common/EmptyState';
import Input from '../../Components/Common/Input';

export default function ClientDashboard({ myRequests = [], stats = {} }) {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
        description: '',
        category: 'Infrastructure Provisioning',
        priority: 'medium',
        budget_estimate: '',
        tags: ['Client Portal Intake'],
    });

    const handleCreate = (e) => {
        e.preventDefault();
        post('/requests', {
            onSuccess: () => {
                reset();
                setDrawerOpen(false);
            },
        });
    };

    return (
        <AppLayout title="Enterprise Client Self-Service Portal">
            {/* Header with Quick Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-2">
                        <Badge variant="primary" size="md">
                            Client Intake Hub
                        </Badge>
                        <span className="text-xs text-zinc-400">Self-Service Lifecycle</span>
                    </div>
                    <h1 className="text-2xl font-black tracking-tight text-white mt-1">
                        Service Delivery & Status Engine
                    </h1>
                </div>

                <Button variant="primary" size="md" onClick={() => setDrawerOpen(true)}>
                    <Plus className="w-4 h-4 mr-1.5" />
                    Submit Service Request
                </Button>
            </div>

            {/* Client Stats Bento Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <BentoCard span="1x1" title="Total Requests" badge={<Badge variant="default" size="sm">All Time</Badge>}>
                    <div className="my-auto">
                        <span className="text-3xl font-extrabold text-white font-mono">{stats.total || 0}</span>
                        <p className="text-xs text-zinc-400 mt-1">Submitted service engagements</p>
                    </div>
                </BentoCard>

                <BentoCard span="1x1" title="In Triage / Review" badge={<Badge variant="warning" size="sm">Pending</Badge>}>
                    <div className="my-auto">
                        <span className="text-3xl font-extrabold text-white font-mono">{stats.pending || 0}</span>
                        <p className="text-xs text-zinc-400 mt-1">Reviewing architectural specs</p>
                    </div>
                </BentoCard>

                <BentoCard span="1x1" title="Active Delivery" badge={<Badge variant="primary" size="sm">Sprint</Badge>}>
                    <div className="my-auto">
                        <span className="text-3xl font-extrabold text-white font-mono">{stats.active || 0}</span>
                        <p className="text-xs text-zinc-400 mt-1">Ongoing engineering tasks</p>
                    </div>
                </BentoCard>

                <BentoCard span="1x1" title="Completed & Verified" badge={<Badge variant="success" size="sm">Delivered</Badge>}>
                    <div className="my-auto">
                        <span className="text-3xl font-extrabold text-white font-mono">{stats.completed || 0}</span>
                        <p className="text-xs text-zinc-400 mt-1">100% SLA compliance achieved</p>
                    </div>
                </BentoCard>
            </div>

            {/* My Requests List */}
            <div className="bento-tile rounded-3xl p-6 bg-[#1f1f23]">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
                    <div>
                        <h2 className="text-base font-bold text-white tracking-tight">
                            My Active Service Requests
                        </h2>
                        <p className="text-xs text-zinc-400 mt-0.5">
                            Real-time tracking of requests, status transitions, and assigned delivery managers.
                        </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setDrawerOpen(true)}>
                        <Plus className="w-3.5 h-3.5 mr-1" />
                        New Request
                    </Button>
                </div>

                {myRequests.length === 0 ? (
                    <EmptyState
                        title="No Requests Submitted Yet"
                        description="You haven't initiated any enterprise service requests. Click below to submit your first architecture or infrastructure requirement."
                        actionLabel="Create Service Request"
                        onAction={() => setDrawerOpen(true)}
                    />
                ) : (
                    <div className="space-y-4">
                        {myRequests.map((req) => (
                            <div
                                key={req.id}
                                className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                                    <div className="flex items-center gap-2.5">
                                        <span className="font-mono text-xs font-bold text-indigo-400">
                                            {req.tracking_code}
                                        </span>
                                        <Badge
                                            variant={
                                                req.status === 'completed'
                                                    ? 'success'
                                                    : req.status === 'in_progress'
                                                    ? 'primary'
                                                    : req.status === 'pending_review'
                                                    ? 'warning'
                                                    : 'default'
                                            }
                                            size="sm"
                                        >
                                            {req.status.replace('_', ' ').toUpperCase()}
                                        </Badge>
                                        <span className="text-xs text-zinc-400">{req.category}</span>
                                    </div>
                                    <span className="text-xs text-zinc-500 font-mono">
                                        Budget: <strong className="text-white">${Number(req.budget_estimate).toFixed(2)}</strong>
                                    </span>
                                </div>

                                <h3 className="text-sm font-bold text-white">{req.title}</h3>
                                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{req.description}</p>

                                {/* Visual State Timeline / Stepper */}
                                <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                        <span>Assigned Lead: <strong className="text-zinc-200">{req.assigned_manager?.name || 'In Triage Assignment'}</strong></span>
                                    </div>
                                    <div className="flex items-center gap-1.5 font-mono text-zinc-500">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>Target SLA: {req.sla_due_at ? new Date(req.sla_due_at).toLocaleDateString() : '7 Days'}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Slide-over Drawer for Entity Creation (Mandatory Screen State #5) */}
            <SlideOverDrawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title="Initiate Service Request"
                subtitle="Submit an architectural or infrastructure request for operational triage."
            >
                <form onSubmit={handleCreate} className="space-y-4">
                    <Input
                        label="Project / Service Title"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        error={errors.title}
                        placeholder="e.g. AWS EKS Kubernetes Cluster Setup"
                        required
                    />

                    <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1.5 uppercase tracking-wider">
                            Domain Category
                        </label>
                        <select
                            value={data.category}
                            onChange={(e) => setData('category', e.target.value)}
                            className="w-full bg-[#18181B] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
                        >
                            <option value="Infrastructure Provisioning">Infrastructure Provisioning</option>
                            <option value="Access Governance & IAM">Access Governance & IAM</option>
                            <option value="Security & Compliance Audit">Security & Compliance Audit</option>
                            <option value="Cloud Architecture Review">Cloud Architecture Review</option>
                            <option value="Enterprise Licensing">Enterprise Licensing</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-zinc-300 mb-1.5 uppercase tracking-wider">
                                Priority Level
                            </label>
                            <select
                                value={data.priority}
                                onChange={(e) => setData('priority', e.target.value)}
                                className="w-full bg-[#18181B] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
                            >
                                <option value="low">Low (Standard)</option>
                                <option value="medium">Medium (Priority)</option>
                                <option value="high">High (Urgent)</option>
                                <option value="critical">Critical (Blameless Outage)</option>
                            </select>
                        </div>

                        <Input
                            label="Target Budget ($ USD)"
                            type="number"
                            value={data.budget_estimate}
                            onChange={(e) => setData('budget_estimate', e.target.value)}
                            error={errors.budget_estimate}
                            placeholder="5000.00"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1.5 uppercase tracking-wider">
                            Scope & Architectural Description
                        </label>
                        <textarea
                            rows={4}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full bg-[#18181B] border border-zinc-800 rounded-xl p-3.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            placeholder="Describe high-level requirements, target cloud regions, and business deadlines..."
                            required
                        />
                        {errors.description && (
                            <p className="mt-1 text-xs text-rose-400">{errors.description}</p>
                        )}
                    </div>

                    <div className="pt-4 border-t border-zinc-800 flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="md"
                            onClick={() => setDrawerOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            size="md"
                            loading={processing}
                        >
                            <Send className="w-4 h-4 mr-1.5" />
                            Submit Request
                        </Button>
                    </div>
                </form>
            </SlideOverDrawer>
        </AppLayout>
    );
}

