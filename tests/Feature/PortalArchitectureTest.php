<?php

namespace Tests\Feature;

use App\Models\PortalRequest;
use App\Models\User;
use App\Services\Payment\PaymentGatewayService;
use App\Services\WorkflowStateMachineService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PortalArchitectureTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_guests_cannot_access_protected_dashboard_routes(): void
    {
        $response = $this->get('/dashboard');
        $response->assertRedirect('/login');
    }

    public function test_super_admin_can_access_dashboard_and_governance(): void
    {
        $admin = User::where('email', 'admin@novaportal.io')->first();
        $response = $this->actingAs($admin)->get('/dashboard');
        $response->assertStatus(200);

        $usersResponse = $this->actingAs($admin)->get('/admin/users');
        $usersResponse->assertStatus(200);
    }

    public function test_client_cannot_access_super_admin_governance(): void
    {
        $client = User::where('email', 'client@novaportal.io')->first();
        $response = $this->actingAs($client)->get('/admin/users');
        $response->assertStatus(403);
    }

    public function test_dynamic_crud_intake_creates_request_and_audit_trail(): void
    {
        $client = User::where('email', 'client@novaportal.io')->first();

        $response = $this->actingAs($client)->post('/requests', [
            'title' => 'Test Cluster Deployment Specification',
            'description' => 'Automated deployment of test infrastructure across us-east-1.',
            'category' => 'Infrastructure Provisioning',
            'priority' => 'high',
            'budget_estimate' => 3500.00,
            'submit_for_review' => true,
        ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('portal_requests', [
            'title' => 'Test Cluster Deployment Specification',
            'client_id' => $client->id,
            'status' => 'pending_review',
        ]);

        $this->assertDatabaseHas('activity_logs', [
            'action' => 'request.created',
        ]);
    }

    public function test_workflow_state_machine_guarded_transition(): void
    {
        $manager = User::where('email', 'manager@novaportal.io')->first();
        $request = PortalRequest::where('status', 'pending_review')->first();

        $stateMachine = app(WorkflowStateMachineService::class);
        $updated = $stateMachine->transition($request, 'approved', $manager, 'Architectural review passed.');

        $this->assertEquals('approved', $updated->status);
        $this->assertDatabaseHas('workflow_transitions', [
            'portal_request_id' => $request->id,
            'from_status' => 'pending_review',
            'to_status' => 'approved',
            'actor_id' => $manager->id,
        ]);
    }

    public function test_workflow_state_machine_blocks_illegal_transition(): void
    {
        $client = User::where('email', 'client@novaportal.io')->first();
        $request = PortalRequest::where('status', 'pending_review')->first();

        $stateMachine = app(WorkflowStateMachineService::class);

        $this->expectException(\InvalidArgumentException::class);
        $stateMachine->transition($request, 'completed', $client);
    }

    public function test_payment_initiation_and_webhook_idempotency(): void
    {
        $client = User::where('email', 'client@novaportal.io')->first();
        $paymentService = app(PaymentGatewayService::class);

        $result = $paymentService->initiatePayment($client, 2500.00, 'USD', [
            'gateway' => 'stripe',
        ]);

        $this->assertNotNull($result['transaction_ref']);

        // Process webhook
        $webhookData = [
            'gateway' => 'stripe',
            'event_id' => 'evt_test_unique_999',
            'event_type' => 'payment_intent.succeeded',
            'transaction_ref' => $result['transaction_ref'],
        ];

        $txn = $paymentService->handleWebhook($webhookData);
        $this->assertEquals('successful', $txn->status);

        // Process duplicate webhook (Idempotency test)
        $duplicateTxn = $paymentService->handleWebhook($webhookData);
        $this->assertEquals('successful', $duplicateTxn->status);
    }
}

