<?php

namespace App\Services;

use App\Models\PortalRequest;
use App\Models\User;
use App\Models\WorkflowTransition;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class WorkflowStateMachineService
{
    /**
     * State transition adjacency matrix
     */
    protected array $transitions = [
        'draft' => ['pending_review'],
        'pending_review' => ['approved', 'rejected', 'draft'],
        'approved' => ['in_progress', 'cancelled'],
        'in_progress' => ['completed', 'cancelled'],
        'rejected' => ['draft'],
        'completed' => [],
        'cancelled' => ['pending_review'],
    ];

    public function canTransition(PortalRequest $request, string $toStatus, User $actor): bool
    {
        $currentStatus = $request->status;

        // Check if transition is defined in matrix
        if (!isset($this->transitions[$currentStatus]) || !in_array($toStatus, $this->transitions[$currentStatus])) {
            return false;
        }

        // Authorization checks
        if ($actor->isSuperAdmin()) {
            return true;
        }

        // Client can submit draft for review, or edit rejected into draft
        if ($actor->isClient()) {
            if ($request->client_id !== $actor->id) {
                return false;
            }
            return in_array($toStatus, ['pending_review', 'draft']);
        }

        // Operations manager can approve, reject, start progress, complete or cancel
        if ($actor->isOperationsManager()) {
            return true;
        }

        return false;
    }

    public function transition(
        PortalRequest $request,
        string $toStatus,
        User $actor,
        ?string $reason = null,
        array $metadata = []
    ): PortalRequest {
        if (!$this->canTransition($request, $toStatus, $actor)) {
            throw new InvalidArgumentException("Illegal state transition from '{$request->status}' to '{$toStatus}' for user [{$actor->name}].");
        }

        return DB::transaction(function () use ($request, $toStatus, $actor, $reason, $metadata) {
            $fromStatus = $request->status;

            $request->status = $toStatus;
            if ($toStatus === 'completed') {
                $request->completed_at = now();
            }
            $request->save();

            WorkflowTransition::create([
                'portal_request_id' => $request->id,
                'from_status' => $fromStatus,
                'to_status' => $toStatus,
                'actor_id' => $actor->id,
                'reason_or_notes' => $reason,
                'metadata' => $metadata,
            ]);

            ActivityLogger::log(
                action: 'workflow.transition',
                description: "Request [{$request->tracking_code}] transitioned from '{$fromStatus}' to '{$toStatus}' by {$actor->name}.",
                subject: $request,
                metadata: [
                    'from' => $fromStatus,
                    'to' => $toStatus,
                    'reason' => $reason,
                ]
            );

            // Trigger notification
            $notificationDispatcher = app(NotificationDispatcherService::class);
            $notificationDispatcher->dispatchWorkflowNotification($request, $fromStatus, $toStatus, $actor);

            return $request->fresh(['client', 'assignedManager', 'transitions.actor']);
        });
    }

    public function getAvailableTransitions(PortalRequest $request, User $actor): array
    {
        $current = $request->status;
        $possible = $this->transitions[$current] ?? [];
        $allowed = [];

        foreach ($possible as $candidate) {
            if ($this->canTransition($request, $candidate, $actor)) {
                $allowed[] = $candidate;
            }
        }

        return $allowed;
    }
}

