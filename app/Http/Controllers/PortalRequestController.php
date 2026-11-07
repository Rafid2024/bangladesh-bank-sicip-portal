<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePortalRequestRequest;
use App\Http\Requests\TransitionWorkflowRequest;
use App\Http\Requests\UpdatePortalRequestRequest;
use App\Models\PortalRequest;
use App\Models\User;
use App\Services\ActivityLogger;
use App\Services\WorkflowStateMachineService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PortalRequestController extends Controller
{
    public function __construct(
        protected WorkflowStateMachineService $stateMachine
    ) {}

    public function index(Request $request): Response
    {
        $user = Auth::user();
        $query = PortalRequest::query()->with(['client', 'assignedManager', 'transitions.actor']);

        // Scope to client if not staff
        if ($user->isClient()) {
            $query->where('client_id', $user->id);
        }

        // Search
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('tracking_code', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filters
        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($priority = $request->input('priority')) {
            $query->where('priority', $priority);
        }

        if ($category = $request->input('category')) {
            $query->where('category', $category);
        }

        // Sorting
        $sortField = $request->input('sort', 'created_at');
        $sortDir = $request->input('direction', 'desc');
        $allowedSorts = ['id', 'title', 'tracking_code', 'priority', 'status', 'budget_estimate', 'created_at', 'sla_due_at'];
        if (in_array($sortField, $allowedSorts)) {
            $query->orderBy($sortField, $sortDir === 'asc' ? 'asc' : 'desc');
        }

        $requests = $query->paginate(10)->withQueryString();

        $managers = User::whereIn('role', ['operations_manager', 'super_admin'])->get(['id', 'name', 'email']);

        return Inertia::render('Requests/Index', [
            'requests' => $requests,
            'filters' => $request->only(['search', 'status', 'priority', 'category', 'sort', 'direction']),
            'managers' => $managers,
            'categories' => [
                'Infrastructure Provisioning',
                'Access Governance & IAM',
                'Security & Compliance Audit',
                'Cloud Architecture Review',
                'Enterprise Licensing',
            ],
            'priorities' => ['low', 'medium', 'high', 'critical'],
            'statuses' => ['draft', 'pending_review', 'approved', 'rejected', 'in_progress', 'completed', 'cancelled'],
        ]);
    }

    public function store(StorePortalRequestRequest $request): RedirectResponse
    {
        $user = Auth::user();

        $portalRequest = DB::transaction(function () use ($request, $user) {
            $trackingCode = 'REQ-' . date('Y') . '-' . strtoupper(Str::random(5));

            $record = PortalRequest::create([
                'tracking_code' => $trackingCode,
                'title' => $request->title,
                'description' => $request->description,
                'category' => $request->category,
                'priority' => $request->priority,
                'status' => 'draft',
                'client_id' => $user->id,
                'budget_estimate' => $request->budget_estimate ?? 0.00,
                'sla_due_at' => $request->sla_due_at ?? now()->addDays(7),
                'tags' => $request->tags ?? ['Standard SLA'],
            ]);

            ActivityLogger::log(
                action: 'request.created',
                description: "Created service request [{$trackingCode}]: {$request->title}",
                subject: $record
            );

            // Auto-advance to pending_review if requested
            if ($request->boolean('submit_for_review', true)) {
                $this->stateMachine->transition($record, 'pending_review', $user, 'Initial request submission for review.');
            }

            return $record;
        });

        return back()->with('success', "Service Request {$portalRequest->tracking_code} submitted successfully!");
    }

    public function update(UpdatePortalRequestRequest $request, PortalRequest $portalRequest): RedirectResponse
    {
        $user = Auth::user();
        if ($user->isClient() && $portalRequest->client_id !== $user->id) {
            abort(403);
        }

        $oldData = $portalRequest->toArray();
        $portalRequest->update($request->validated());

        ActivityLogger::log(
            action: 'request.updated',
            description: "Updated request [{$portalRequest->tracking_code}]",
            subject: $portalRequest,
            metadata: [
                'diff' => array_diff_assoc($portalRequest->toArray(), $oldData)
            ]
        );

        return back()->with('success', "Request {$portalRequest->tracking_code} updated successfully.");
    }

    public function transition(TransitionWorkflowRequest $request, PortalRequest $portalRequest): RedirectResponse
    {
        $user = Auth::user();

        try {
            $this->stateMachine->transition(
                request: $portalRequest,
                toStatus: $request->to_status,
                actor: $user,
                reason: $request->reason
            );

            return back()->with('success', "Request {$portalRequest->tracking_code} transitioned to " . strtoupper($request->to_status));
        } catch (\Exception $e) {
            return back()->withErrors(['transition' => $e->getMessage()]);
        }
    }

    public function destroy(PortalRequest $portalRequest): RedirectResponse
    {
        $user = Auth::user();
        if ($user->isClient() && $portalRequest->client_id !== $user->id) {
            abort(403);
        }

        $tracking = $portalRequest->tracking_code;
        $portalRequest->delete();

        ActivityLogger::log(
            action: 'request.deleted',
            description: "Deleted request [{$tracking}]",
            subject: $portalRequest
        );

        return back()->with('success', "Request {$tracking} deleted successfully.");
    }

    public function bulkAction(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['exists:portal_requests,id'],
            'action' => ['required', 'in:delete,mark_completed,mark_in_progress,mark_approved'],
        ]);

        $user = Auth::user();
        if (!$user->isOperationsManager()) {
            abort(403, 'Bulk actions require operational manager privileges.');
        }

        $ids = $validated['ids'];
        $action = $validated['action'];

        DB::transaction(function () use ($ids, $action, $user) {
            if ($action === 'delete') {
                PortalRequest::whereIn('id', $ids)->delete();
                ActivityLogger::log('request.bulk_deleted', "Bulk deleted " . count($ids) . " requests.");
            } else {
                $targetStatus = match ($action) {
                    'mark_completed' => 'completed',
                    'mark_in_progress' => 'in_progress',
                    'mark_approved' => 'approved',
                };

                $requests = PortalRequest::whereIn('id', $ids)->get();
                foreach ($requests as $item) {
                    try {
                        $this->stateMachine->transition($item, $targetStatus, $user, 'Bulk transition execution');
                    } catch (\Exception $e) {
                        // Skip disallowed items
                    }
                }
            }
        });

        return back()->with('success', 'Bulk operation completed.');
    }
}

