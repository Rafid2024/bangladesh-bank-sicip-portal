import React, { useState } from 'react';
import { router, usePage, useForm } from '@inertiajs/react';
import {
    Plus,
    Search,
    Filter,
    ArrowUpDown,
    CheckCircle,
    XCircle,
    Trash2,
    Eye,
    Edit,
    ArrowRight,
    Play,
    Send,
    Layers,
    SlidersHorizontal,
    RefreshCw
} from 'lucide-react';
import AppLayout from '../../Layouts/AppLayout';
import BentoCard from '../../Components/Common/BentoCard';
import Badge from '../../Components/Common/Badge';
import Button from '../../Components/Common/Button';
import SlideOverDrawer from '../../Components/Common/SlideOverDrawer';
import Modal from '../../Components/Common/Modal';
import EmptyState from '../../Components/Common/EmptyState';
import ErrorAlert from '../../Components/Common/ErrorAlert';
import Input from '../../Components/Common/Input';

export default function Index({
    requests,
    filters = {},
    categories = [],
    priorities = [],
    statuses = [],
    managers = []
}) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const [search, setSearch] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [selectedPriority, setSelectedPriority] = useState(filters.priority || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');

    // Bulk selection state
    const [selectedIds, setSelectedIds] = useState([]);

    // Drawer state (Create / Edit)
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingRequest, setEditingRequest] = useState(null);

    // State machine modal
    const [transitionModalOpen, setTransitionModalOpen] = useState(false);
    const [targetRequest, setTargetRequest] = useState(null);
    const [targetStatus, setTargetStatus] = useState('');
    const [transitionReason, setTransitionReason] = useState('');

    // Error simulation for state #4
    const [errorBanner, setErrorBanner] = useState(null);

    // Form for create/edit
    const { data, setData, post, put, processing, reset, errors } = useForm({
        title: '',
        description: '',
        category: categories[0] || 'Infrastructure Provisioning',
        priority: 'medium',
        budget_estimate: '',
        assigned_manager_id: '',
        tags: ['Dynamic CRUD'],
    });

    const applyFilters = (newFilters = {}) => {
        router.get(
            '/requests',
            {
                search,
                status: selectedStatus,
                priority: selectedPriority,
                category: selectedCategory,
                ...newFilters,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        applyFilters({ search });
    };

    const handleSort = (field) => {
        const currentDir = filters.direction === 'asc' ? 'desc' : 'asc';
        applyFilters({ sort: field, direction: currentDir });
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(requests.data.map((r) => r.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectRow = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleBulkAction = (action) => {
        if (selectedIds.length === 0) return;
        router.post(
            '/requests/bulk-action',
            { ids: selectedIds, action },
            {
                onSuccess: () => setSelectedIds([]),
                onError: (err) => setErrorBanner(err.transition || 'Bulk action failed.'),
            }
        );
    };

    const openCreateDrawer = () => {
        setIsEditing(false);
        setEditingRequest(null);
        reset({
            title: '',
            description: '',
            category: categories[0] || 'Infrastructure Provisioning',
            priority: 'medium',
            budget_estimate: '',
            assigned_manager_id: '',
            tags: ['Dynamic CRUD'],
        });
        setDrawerOpen(true);
    };

    const openEditDrawer = (request) => {
        setIsEditing(true);
        setEditingRequest(request);
        setData({
            title: request.title,
            description: request.description,
            category: request.category,
            priority: request.priority,
            budget_estimate: request.budget_estimate,
            assigned_manager_id: request.assigned_manager_id || '',
            tags: request.tags || [],
        });
        setDrawerOpen(true);
    };

    const handleDrawerSubmit = (e) => {
        e.preventDefault();
        if (isEditing && editingRequest) {
            put(`/requests/${editingRequest.id}`, {
                onSuccess: () => setDrawerOpen(false),
            });
        } else {
            post('/requests', {
                onSuccess: () => setDrawerOpen(false),
            });
        }
    };

    const openTransitionModal = (request, status) => {
        setTargetRequest(request);
        setTargetStatus(status);
        setTransitionReason('');
        setTransitionModalOpen(true);
    };

    const handleExecuteTransition = (e) => {
        e.preventDefault();
        if (!targetRequest) return;

        router.post(
            `/requests/${targetRequest.id}/transition`,
            {
                to_status: targetStatus,
                reason: transitionReason || `Transitioned to ${targetStatus}`,
            },
            {
                onSuccess: () => {
                    setTransitionModalOpen(false);
                    setTargetRequest(null);
                },
                onError: (err) => {
                    setTransitionModalOpen(false);
                    setErrorBanner(err.transition || 'Illegal state transition violation.');
                },
            }
        );
    };

    const handleDelete = (request) => {
        if (confirm(`Are you sure you want to delete ${request.tracking_code}?`)) {
            router.delete(`/requests/${request.id}`);
        }
    };

    return (
        <AppLayout title="Dynamic Data Management & CRUD Engine">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-2">
                        <Badge variant="primary" size="md">
                            CRUD & State Machine Engine
                        </Badge>
                        <span className="text-xs text-zinc-400">Atomic Transitions & Granular Filters</span>
                    </div>
                    <h1 className="text-2xl font-black tracking-tight text-white mt-1">
                        Enterprise Service Requests
                    </h1>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="primary" size="md" onClick={openCreateDrawer}>
                        <Plus className="w-4 h-4 mr-1.5" />
                        Create Service Request
                    </Button>
                </div>
            </div>

            {/* Error Banner (Screen State #4) */}
            {errorBanner && (
                <div className="mb-6">
                    <ErrorAlert
                        title="State Machine Warning"
                        message={errorBanner}
                        onRetry={() => setErrorBanner(null)}
                    />
                </div>
            )}

            {/* Search & Dynamic Filter Bar */}
            <div className="bento-tile rounded-3xl p-5 mb-6 bg-[#1f1f23]">
                <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                    <div className="relative md:col-span-2">
                        <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by title, tracking code or description..."
                            className="w-full bg-[#18181B] border border-zinc-800 rounded-xl pl-10 pr-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                        />
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
                            {statuses.map((s) => (
                                <option key={s} value={s}>
                                    {s.replace('_', ' ').toUpperCase()}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <select
                            value={selectedPriority}
                            onChange={(e) => {
                                setSelectedPriority(e.target.value);
                                applyFilters({ priority: e.target.value });
                            }}
                            className="w-full bg-[#18181B] border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
                        >
                            <option value="">All Priorities</option>
                            {priorities.map((p) => (
                                <option key={p} value={p}>
                                    {p.toUpperCase()}
                                </option>
                            ))}
                        </select>
                    </div>
                </form>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-800/80 text-xs">
                    <div className="flex items-center gap-2">
                        <span className="text-zinc-400">Total matched:</span>
                        <strong className="text-white font-mono">{requests.total}</strong>
                    </div>

                    {/* Bulk Action Controls */}
                    {selectedIds.length > 0 && user?.is_operations_manager && (
                        <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1.5 rounded-xl animate-in fade-in">
                            <span className="text-indigo-300 font-bold">{selectedIds.length} Selected:</span>
                            <button
                                type="button"
                                onClick={() => handleBulkAction('mark_approved')}
                                className="px-2 py-0.5 rounded bg-indigo-600 text-white font-medium hover:bg-indigo-500"
                            >
                                Bulk Approve
                            </button>
                            <button
                                type="button"
                                onClick={() => handleBulkAction('mark_completed')}
                                className="px-2 py-0.5 rounded bg-emerald-600 text-white font-medium hover:bg-emerald-500"
                            >
                                Bulk Complete
                            </button>
                            <button
                                type="button"
                                onClick={() => handleBulkAction('delete')}
                                className="px-2 py-0.5 rounded bg-rose-600 text-white font-medium hover:bg-rose-500"
                            >
                                Bulk Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Dynamic Table or Empty State (Screen State #1 & #3) */}
            {requests.data.length === 0 ? (
                <EmptyState
                    title="No Matching Service Requests Found"
                    description="No records match your active query or filter criteria. Reset your search or create a new request."
                    actionLabel="Create Service Request"
                    onAction={openCreateDrawer}
                />
            ) : (
                <div className="bento-tile rounded-3xl overflow-hidden bg-[#1f1f23]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-zinc-800 bg-zinc-900/60 text-zinc-400 font-bold uppercase tracking-wider">
                                    <th className="p-4 w-10">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.length === requests.data.length && requests.data.length > 0}
                                            onChange={handleSelectAll}
                                            className="rounded border-zinc-700 bg-zinc-900 text-indigo-600 focus:ring-indigo-500"
                                        />
                                    </th>
                                    <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('tracking_code')}>
                                        <div className="flex items-center gap-1">
                                            Tracking <ArrowUpDown className="w-3 h-3" />
                                        </div>
                                    </th>
                                    <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('title')}>
                                        <div className="flex items-center gap-1">
                                            Title & Category <ArrowUpDown className="w-3 h-3" />
                                        </div>
                                    </th>
                                    <th className="p-4">Stakeholder</th>
                                    <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('priority')}>
                                        <div className="flex items-center gap-1">
                                            Priority <ArrowUpDown className="w-3 h-3" />
                                        </div>
                                    </th>
                                    <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('status')}>
                                        <div className="flex items-center gap-1">
                                            Workflow Status <ArrowUpDown className="w-3 h-3" />
                                        </div>
                                    </th>
                                    <th className="p-4 cursor-pointer hover:text-white text-right" onClick={() => handleSort('budget_estimate')}>
                                        <div className="flex items-center justify-end gap-1">
                                            Estimate ($) <ArrowUpDown className="w-3 h-3" />
                                        </div>
                                    </th>
                                    <th className="p-4 text-right">State Machine Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/60">
                                {requests.data.map((req) => {
                                    const isSelected = selectedIds.includes(req.id);
                                    return (
                                        <tr
                                            key={req.id}
                                            className={`transition ${isSelected ? 'bg-indigo-950/20' : 'hover:bg-zinc-800/40'}`}
                                        >
                                            <td className="p-4">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => handleSelectRow(req.id)}
                                                    className="rounded border-zinc-700 bg-zinc-900 text-indigo-600 focus:ring-indigo-500"
                                                />
                                            </td>
                                            <td className="p-4 font-mono font-bold text-indigo-400">
                                                {req.tracking_code}
                                            </td>
                                            <td className="p-4">
                                                <p className="font-semibold text-white line-clamp-1">{req.title}</p>
                                                <p className="text-[10px] text-zinc-400 mt-0.5">{req.category}</p>
                                            </td>
                                            <td className="p-4">
                                                <span className="font-medium text-zinc-200">{req.client?.name}</span>
                                                <span className="block text-[10px] text-zinc-500">{req.client?.company_name || 'Client'}</span>
                                            </td>
                                            <td className="p-4">
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
                                            <td className="p-4">
                                                <Badge
                                                    variant={
                                                        req.status === 'completed'
                                                            ? 'success'
                                                            : req.status === 'in_progress'
                                                            ? 'primary'
                                                            : req.status === 'pending_review'
                                                            ? 'warning'
                                                            : req.status === 'rejected'
                                                            ? 'danger'
                                                            : 'default'
                                                    }
                                                    size="sm"
                                                >
                                                    {req.status.replace('_', ' ').toUpperCase()}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-right font-mono font-semibold text-emerald-400">
                                                ${Number(req.budget_estimate).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    {/* State Transitions based on current state */}
                                                    {req.status === 'pending_review' && user?.is_operations_manager && (
                                                        <>
                                                            <button
                                                                type="button"
                                                                onClick={() => openTransitionModal(req, 'approved')}
                                                                className="p-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/40 transition cursor-pointer"
                                                                title="Approve Request"
                                                            >
                                                                <CheckCircle className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => openTransitionModal(req, 'rejected')}
                                                                className="p-1.5 rounded-lg bg-rose-600/20 text-rose-400 hover:bg-rose-600/40 transition cursor-pointer"
                                                                title="Reject Request"
                                                            >
                                                                <XCircle className="w-3.5 h-3.5" />
                                                            </button>
                                                        </>
                                                    )}

                                                    {req.status === 'approved' && user?.is_operations_manager && (
                                                        <button
                                                            type="button"
                                                            onClick={() => openTransitionModal(req, 'in_progress')}
                                                            className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/40 transition cursor-pointer"
                                                            title="Start Engineering Sprint"
                                                        >
                                                            <Play className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}

                                                    {req.status === 'in_progress' && user?.is_operations_manager && (
                                                        <button
                                                            type="button"
                                                            onClick={() => openTransitionModal(req, 'completed')}
                                                            className="p-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/40 transition cursor-pointer"
                                                            title="Mark Complete"
                                                        >
                                                            <CheckCircle className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}

                                                    {/* Edit Button */}
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditDrawer(req)}
                                                        className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition cursor-pointer"
                                                        title="Edit Entity"
                                                    >
                                                        <Edit className="w-3.5 h-3.5" />
                                                    </button>

                                                    {/* Delete Button */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(req)}
                                                        className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:bg-rose-600/20 hover:text-rose-400 transition cursor-pointer"
                                                        title="Soft Delete"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {requests.links && requests.links.length > 3 && (
                        <div className="p-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                            <span>Showing {requests.from} to {requests.to} of {requests.total} results</span>
                            <div className="flex gap-1">
                                {requests.links.map((link, idx) => (
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
            )}

            {/* Slide-over Drawer for Entity Creation & Editing (Screen State #5) */}
            <SlideOverDrawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title={isEditing ? `Edit Request: ${editingRequest?.tracking_code}` : 'New Service Request'}
                subtitle="Fill out the schema parameters below to create or update the service entity."
            >
                <form onSubmit={handleDrawerSubmit} className="space-y-4">
                    <Input
                        label="Entity Title"
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
                            {categories.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
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
                                {priorities.map((p) => (
                                    <option key={p} value={p}>{p.toUpperCase()}</option>
                                ))}
                            </select>
                        </div>

                        <Input
                            label="Target Budget ($)"
                            type="number"
                            value={data.budget_estimate}
                            onChange={(e) => setData('budget_estimate', e.target.value)}
                            error={errors.budget_estimate}
                            placeholder="5000.00"
                        />
                    </div>

                    {user?.is_operations_manager && (
                        <div>
                            <label className="block text-xs font-medium text-zinc-300 mb-1.5 uppercase tracking-wider">
                                Assign Lead Manager
                            </label>
                            <select
                                value={data.assigned_manager_id}
                                onChange={(e) => setData('assigned_manager_id', e.target.value)}
                                className="w-full bg-[#18181B] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
                            >
                                <option value="">Unassigned (In Triage)</option>
                                {managers.map((m) => (
                                    <option key={m.id} value={m.id}>{m.name} ({m.email})</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1.5 uppercase tracking-wider">
                            Detailed Scope & Acceptance Criteria
                        </label>
                        <textarea
                            rows={5}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full bg-[#18181B] border border-zinc-800 rounded-xl p-3.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            placeholder="Provide explicit architectural deliverables, regions, and compliance requirements..."
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
                            {isEditing ? 'Save Changes' : 'Create Record'}
                        </Button>
                    </div>
                </form>
            </SlideOverDrawer>

            {/* State Transition Reason Modal */}
            <Modal
                isOpen={transitionModalOpen}
                onClose={() => setTransitionModalOpen(false)}
                title={`Advance State: ${targetStatus.toUpperCase()}`}
                description={`You are transitioning [${targetRequest?.tracking_code}] to status ${targetStatus}. An event will fire and audit trail logged.`}
            >
                <form onSubmit={handleExecuteTransition} className="space-y-4">
                    <Input
                        label="Transition Audit Justification"
                        type="text"
                        value={transitionReason}
                        onChange={(e) => setTransitionReason(e.target.value)}
                        placeholder="e.g. Scope verified and approved for development"
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
                        >
                            Confirm Transition
                        </Button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}

