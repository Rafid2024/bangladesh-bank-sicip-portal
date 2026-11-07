import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import {
    CheckCircle,
    XCircle,
    Play,
    Clock,
    FileSpreadsheet,
    ArrowUpRight,
    Filter,
    Shield,
    AlertCircle,
    User
} from 'lucide-react';
import AppLayout from '../../Layouts/AppLayout';
import BentoCard from '../../Components/Common/BentoCard';
import Badge from '../../Components/Common/Badge';
import Button from '../../Components/Common/Button';
import Modal from '../../Components/Common/Modal';
import Input from '../../Components/Common/Input';

export default function ManagerDashboard({ queue = [], inProgress = [], telemetry }) {
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [transitionModalOpen, setTransitionModalOpen] = useState(false);
    const [targetStatus, setTargetStatus] = useState('');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    const openTransition = (request, status) => {
        setSelectedRequest(request);
        setTargetStatus(status);
        setReason('');
        setTransitionModalOpen(true);
    };

    const handleExecuteTransition = (e) => {
        e.preventDefault();
        if (!selectedRequest) return;
        setLoading(true);

        router.post(
            `/requests/${selectedRequest.id}/transition`,
            {
                to_status: targetStatus,
                reason: reason || `Manager executed state transition to ${targetStatus}`,
            },
            {
                onFinish: () => {
                    setLoading(false);
                    setTransitionModalOpen(false);
                    setSelectedRequest(null);
                },
            }
        );
    };

    return (
        <AppLayout title="Operations & Workflow State Machine Dispatcher">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-2">
                        <Badge variant="warning" size="md">
                            Operations Dispatcher
                        </Badge>
                        <span className="text-xs text-zinc-400">Guarded State Machine Approvals</span>
                    </div>
                    <h1 className="text-2xl font-black tracking-tight text-white mt-1">
                        Workflow Triage & Transition Engine
                    </h1>
                </div>

                <Link href="/requests">
                    <Button variant="primary" size="sm">
                        <FileSpreadsheet className="w-4 h-4 mr-1.5" />
                        Full Dynamic CRUD Engine
                    </Button>
                </Link>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <BentoCard span="1x1" title="Awaiting Triage" badge={<Badge variant="warning" size="sm">Pending Sign-off</Badge>}>
                    <div className="my-auto">
                        <span className="text-3xl font-extrabold text-white font-mono">{queue.length}</span>
                        <p className="text-xs text-zinc-400 mt-1">Ready for architectural approval</p>
                    </div>
                </BentoCard>

                <BentoCard span="1x1" title="In Active Engineering" badge={<Badge variant="primary" size="sm">Sprint Underway</Badge>}>
                    <div className="my-auto">
                        <span className="text-3xl font-extrabold text-white font-mono">{inProgress.length}</span>
                        <p className="text-xs text-zinc-400 mt-1">Assigned engineering tasks</p>
                    </div>
                </BentoCard>

                <BentoCard span="1x1" title="Dispatched This Week" badge={<Badge variant="success" size="sm">SLA Met</Badge>}>
                    <div className="my-auto">
                        <span className="text-3xl font-extrabold text-white font-mono">14</span>
                        <p className="text-xs text-zinc-400 mt-1">Zero state machine deadlocks</p>
                    </div>
                </BentoCard>
            </div>

            {/* Section 1: Pending Approvals Queue */}
            <div className="bento-tile rounded-3xl p-6 mb-8 bg-[#1f1f23]">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                            <Clock className="w-4 h-4 text-amber-400" />
                            Pending Review Queue ({queue.length})
                        </h2>
                        <p className="text-xs text-zinc-400 mt-0.5">
                            Verify scope, estimate budget, and advance workflow to Approved or return to Draft.
                        </p>
                    </div>
                </div>

                {queue.length === 0 ? (
                    <div className="py-8 text-center text-xs text-zinc-500">
                        No pending requests in triage queue. All workflows up to date!
                    </div>
                ) : (
                    <div className="space-y-3">
                        {queue.map((req) => (
                            <div
                                key={req.id}
                                className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                            >
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2.5">
                                        <span className="text-xs font-mono font-bold text-indigo-400">
                                            {req.tracking_code}
                                        </span>
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
                                        <span className="text-[11px] text-zinc-400">{req.category}</span>
                                    </div>
                                    <h3 className="text-sm font-bold text-white">{req.title}</h3>
                                    <p className="text-xs text-zinc-400 line-clamp-1">{req.description}</p>
                                    <div className="text-[11px] text-zinc-500 flex items-center gap-3 pt-1">
                                        <span>Client: <strong className="text-zinc-300">{req.client?.name}</strong></span>
                                        <span>•</span>
                                        <span>Estimate: <strong className="text-emerald-400 font-mono">${Number(req.budget_estimate).toFixed(2)}</strong></span>
                                    </div>
                                </div>

                                {/* Guarded State Machine Action Buttons */}
                                <div className="flex items-center gap-2 shrink-0">
                                    <Button
                                        variant="success"
                                        size="sm"
                                        onClick={() => openTransition(req, 'approved')}
                                    >
                                        <CheckCircle className="w-3.5 h-3.5 mr-1" />
                                        Approve
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => openTransition(req, 'rejected')}
                                    >
                                        <XCircle className="w-3.5 h-3.5 mr-1" />
                                        Reject
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Section 2: In-Progress Engineering Workflows */}
            <div className="bento-tile rounded-3xl p-6 bg-[#1f1f23]">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                            <Play className="w-4 h-4 text-indigo-400" />
                            Active Engineering Workflows ({inProgress.length})
                        </h2>
                        <p className="text-xs text-zinc-400 mt-0.5">
                            Track ongoing tasks and transition to Completed upon verification.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {inProgress.map((req) => (
                        <div
                            key={req.id}
                            className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between space-y-3"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="font-mono text-xs font-bold text-indigo-400">
                                        {req.tracking_code}
                                    </span>
                                    <Badge variant="primary" size="sm">
                                        IN PROGRESS
                                    </Badge>
                                </div>
                                <h4 className="text-sm font-bold text-white line-clamp-1">{req.title}</h4>
                                <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{req.description}</p>
                            </div>

                            <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                                <span className="text-[11px] text-zinc-400">
                                    Client: <strong className="text-zinc-200">{req.client?.name}</strong>
                                </span>
                                <Button
                                    variant="success"
                                    size="sm"
                                    onClick={() => openTransition(req, 'completed')}
                                >
                                    <CheckCircle className="w-3.5 h-3.5 mr-1" />
                                    Mark Complete
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Transition Reason Modal */}
            <Modal
                isOpen={transitionModalOpen}
                onClose={() => setTransitionModalOpen(false)}
                title={`Confirm Transition: ${targetStatus.toUpperCase()}`}
                description={`State change for [${selectedRequest?.tracking_code}]. An event will be fired and notifications dispatched.`}
            >
                <form onSubmit={handleExecuteTransition} className="space-y-4">
                    <Input
                        label="Transition Audit Reason / Notes"
                        type="text"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="e.g. Scope approved by operations architect."
                        required
                    />

                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="md"
                            onClick={() => setTransitionModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant={targetStatus === 'rejected' ? 'danger' : 'primary'}
                            size="md"
                            loading={loading}
                        >
                            Execute Transition
                        </Button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}

