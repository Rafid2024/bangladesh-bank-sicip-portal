<?php

namespace Database\Seeders;

use App\Models\ActivityLog;
use App\Models\NotificationLog;
use App\Models\PaymentTransaction;
use App\Models\Permission;
use App\Models\PortalRequest;
use App\Models\Role;
use App\Models\User;
use App\Models\WorkflowTransition;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Roles & Permissions
        $rolesData = [
            ['name' => 'Super Administrator', 'slug' => 'super_admin', 'description' => 'Full administrative access and platform governance'],
            ['name' => 'Operations Manager', 'slug' => 'operations_manager', 'description' => 'Workflow management, service approvals, and state machine dispatch'],
            ['name' => 'Client / Portal User', 'slug' => 'client_user', 'description' => 'Self-service request intake, status tracking, and account management'],
        ];

        $createdRoles = [];
        foreach ($rolesData as $role) {
            $createdRoles[$role['slug']] = Role::create($role);
        }

        $permissionsData = [
            ['name' => 'Manage Users', 'slug' => 'users.manage', 'group' => 'Governance'],
            ['name' => 'Impersonate Users', 'slug' => 'users.impersonate', 'group' => 'Governance'],
            ['name' => 'View Audit Logs', 'slug' => 'audit.view', 'group' => 'Governance'],
            ['name' => 'Approve Workflows', 'slug' => 'workflow.approve', 'group' => 'Operations'],
            ['name' => 'Assign Service Requests', 'slug' => 'requests.assign', 'group' => 'Operations'],
            ['name' => 'Create Service Request', 'slug' => 'requests.create', 'group' => 'Intake'],
            ['name' => 'View Invoices', 'slug' => 'invoices.view', 'group' => 'Billing'],
        ];

        foreach ($permissionsData as $perm) {
            $p = Permission::create($perm);
            // Assign all to super admin
            $createdRoles['super_admin']->permissions()->attach($p);
            if (in_array($perm['group'], ['Operations', 'Intake', 'Billing'])) {
                $createdRoles['operations_manager']->permissions()->attach($p);
            }
            if (in_array($perm['group'], ['Intake', 'Billing'])) {
                $createdRoles['client_user']->permissions()->attach($p);
            }
        }

        // 2. Seed Explicit Stakeholder Users
        $admin = User::create([
            'name' => 'Elena Rostova',
            'email' => 'admin@novaportal.io',
            'phone' => '+1-555-0199',
            'role' => 'super_admin',
            'status' => 'active',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
            'company_name' => 'Nova Systems HQ',
            'department' => 'Executive Office',
            'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        ]);
        $admin->roles()->attach($createdRoles['super_admin']);

        $manager = User::create([
            'name' => 'Marcus Vance',
            'email' => 'manager@novaportal.io',
            'phone' => '+1-555-0142',
            'role' => 'operations_manager',
            'status' => 'active',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
            'company_name' => 'Nova Systems Operations',
            'department' => 'Cloud Delivery',
            'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        ]);
        $manager->roles()->attach($createdRoles['operations_manager']);

        $client1 = User::create([
            'name' => 'Sophia Chen',
            'email' => 'client@novaportal.io',
            'phone' => '+1-555-0188',
            'role' => 'client_user',
            'status' => 'active',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
            'company_name' => 'Starlight BioTech',
            'department' => 'Engineering Ops',
            'avatar' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        ]);
        $client1->roles()->attach($createdRoles['client_user']);

        $client2 = User::create([
            'name' => 'Liam Gallagher',
            'email' => 'liam@fintechlabs.io',
            'phone' => '+1-555-0163',
            'role' => 'client_user',
            'status' => 'active',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
            'company_name' => 'FinTech Labs Global',
            'department' => 'Security Compliance',
            'avatar' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        ]);
        $client2->roles()->attach($createdRoles['client_user']);

        $client3 = User::create([
            'name' => 'Amira Al-Mansoor',
            'email' => 'amira@apexcloud.co',
            'phone' => '+1-555-0177',
            'role' => 'client_user',
            'status' => 'pending_verification',
            'password' => Hash::make('password123'),
            'company_name' => 'Apex Cloud Logistics',
            'department' => 'Procurement',
            'avatar' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
        ]);
        $client3->roles()->attach($createdRoles['client_user']);

        // 3. Seed Realistic Portal Requests across all states
        $requestsData = [
            [
                'tracking_code' => 'REQ-2026-9011',
                'title' => 'Multi-Region Kubernetes Cluster Provisioning & Disaster Recovery',
                'description' => 'Automated deployment of redundant EKS clusters across us-east-1 and eu-central-1 with cross-region replication and automated failover DNS.',
                'category' => 'Infrastructure Provisioning',
                'priority' => 'critical',
                'status' => 'in_progress',
                'client_id' => $client1->id,
                'assigned_manager_id' => $manager->id,
                'budget_estimate' => 14500.00,
                'tags' => ['AWS', 'Terraform', 'Zero-Downtime', 'SLA: 24h'],
                'sla_due_at' => now()->addDays(2),
            ],
            [
                'tracking_code' => 'REQ-2026-9012',
                'title' => 'SOC2 Type II Access Governance & Automated IAM RBAC Audit',
                'description' => 'Comprehensive evaluation of identity boundaries, privileged role lifecycle, and cryptographic audit log immutability for enterprise compliance.',
                'category' => 'Access Governance & IAM',
                'priority' => 'high',
                'status' => 'pending_review',
                'client_id' => $client1->id,
                'assigned_manager_id' => null,
                'budget_estimate' => 8200.00,
                'tags' => ['SOC2', 'Audit', 'Security-Guard'],
                'sla_due_at' => now()->addDays(5),
            ],
            [
                'tracking_code' => 'REQ-2026-9013',
                'title' => 'PostgreSQL 17 Aurora Migration & Index Optimization Plan',
                'description' => 'Schema migration, foreign key refactoring, composite index tuning, and zero-loss read replica load balancing setup.',
                'category' => 'Cloud Architecture Review',
                'priority' => 'medium',
                'status' => 'approved',
                'client_id' => $client2->id,
                'assigned_manager_id' => $manager->id,
                'budget_estimate' => 5900.00,
                'tags' => ['PostgreSQL', 'Performance Tuning'],
                'sla_due_at' => now()->addDays(8),
            ],
            [
                'tracking_code' => 'REQ-2026-9014',
                'title' => 'Kafka Streaming Consumer Auto-Scaling & Latency Optimization',
                'description' => 'High-throughput message pipeline ingestion fine-tuning with backpressure handling and dead-letter queue routing.',
                'category' => 'Infrastructure Provisioning',
                'priority' => 'medium',
                'status' => 'completed',
                'client_id' => $client2->id,
                'assigned_manager_id' => $manager->id,
                'budget_estimate' => 7400.00,
                'tags' => ['Event-Driven', 'Kafka', 'Throughput'],
                'sla_due_at' => now()->subDays(1),
                'completed_at' => now()->subHours(6),
            ],
            [
                'tracking_code' => 'REQ-2026-9015',
                'title' => 'Zero-Trust Cloudflare Access & Okta SSO Integration',
                'description' => 'Implementation of device posture checks, MFA hardware token enforcement, and conditional access policies across internal tools.',
                'category' => 'Security & Compliance Audit',
                'priority' => 'high',
                'status' => 'pending_review',
                'client_id' => $client3->id,
                'assigned_manager_id' => null,
                'budget_estimate' => 6100.00,
                'tags' => ['Zero-Trust', 'Cloudflare', 'Okta'],
                'sla_due_at' => now()->addDays(4),
            ],
            [
                'tracking_code' => 'REQ-2026-9016',
                'title' => 'Global CDN Edge Cache Invalidation & Brotli Dynamic Compression',
                'description' => 'Dynamic edge compute rules configuration for sub-100ms TTFB globally across mobile and desktop clients.',
                'category' => 'Enterprise Licensing',
                'priority' => 'low',
                'status' => 'draft',
                'client_id' => $client1->id,
                'assigned_manager_id' => null,
                'budget_estimate' => 2400.00,
                'tags' => ['Edge Compute', 'LCP Optimization'],
                'sla_due_at' => now()->addDays(14),
            ],
        ];

        foreach ($requestsData as $reqData) {
            $req = PortalRequest::create($reqData);

            // Record initial workflow transition
            WorkflowTransition::create([
                'portal_request_id' => $req->id,
                'from_status' => 'draft',
                'to_status' => $req->status === 'draft' ? 'draft' : 'pending_review',
                'actor_id' => $req->client_id,
                'reason_or_notes' => 'Initial submission into pipeline.',
            ]);

            if (in_array($req->status, ['approved', 'in_progress', 'completed'])) {
                WorkflowTransition::create([
                    'portal_request_id' => $req->id,
                    'from_status' => 'pending_review',
                    'to_status' => 'approved',
                    'actor_id' => $manager->id,
                    'reason_or_notes' => 'Scope verified and architectural budget approved.',
                ]);
            }

            if (in_array($req->status, ['in_progress', 'completed'])) {
                WorkflowTransition::create([
                    'portal_request_id' => $req->id,
                    'from_status' => 'approved',
                    'to_status' => 'in_progress',
                    'actor_id' => $manager->id,
                    'reason_or_notes' => 'Engineering sprint commenced.',
                ]);
            }

            if ($req->status === 'completed') {
                WorkflowTransition::create([
                    'portal_request_id' => $req->id,
                    'from_status' => 'in_progress',
                    'to_status' => 'completed',
                    'actor_id' => $manager->id,
                    'reason_or_notes' => 'All validation tests passed. Deliverables handed over.',
                ]);
            }
        }

        // 4. Seed Payments & Transactions
        PaymentTransaction::create([
            'transaction_ref' => 'TXN-STRIPE-891024',
            'portal_request_id' => 1,
            'user_id' => $client1->id,
            'gateway' => 'stripe',
            'amount' => 14500.00,
            'currency' => 'USD',
            'status' => 'successful',
            'idempotency_key' => Str::uuid()->toString(),
            'payload' => ['card_brand' => 'visa', 'last4' => '4242'],
        ]);

        PaymentTransaction::create([
            'transaction_ref' => 'TXN-BKASH-771920',
            'portal_request_id' => 4,
            'user_id' => $client2->id,
            'gateway' => 'bkash',
            'amount' => 7400.00,
            'currency' => 'USD',
            'status' => 'successful',
            'idempotency_key' => Str::uuid()->toString(),
            'payload' => ['wallet' => '017XXXXXXXX', 'trx_id' => 'BKS991244'],
        ]);

        PaymentTransaction::create([
            'transaction_ref' => 'TXN-PAYPAL-110943',
            'portal_request_id' => 3,
            'user_id' => $client2->id,
            'gateway' => 'paypal',
            'amount' => 5900.00,
            'currency' => 'USD',
            'status' => 'pending',
            'idempotency_key' => Str::uuid()->toString(),
            'payload' => ['paypal_payer_id' => 'PAYER-9912'],
        ]);

        // 5. Seed Activity Logs
        ActivityLog::create([
            'user_id' => $admin->id,
            'action' => 'system.bootstrapped',
            'subject_type' => 'App\Models\User',
            'subject_id' => $admin->id,
            'description' => 'Platform initialized with Role-Based Access Controls.',
            'metadata' => ['environment' => 'production_grade', 'version' => '13.40.0'],
            'ip_address' => '192.168.1.10',
        ]);

        ActivityLog::create([
            'user_id' => $manager->id,
            'action' => 'workflow.approved',
            'subject_type' => 'App\Models\PortalRequest',
            'subject_id' => 1,
            'description' => 'Manager Marcus Vance approved REQ-2026-9011 for engineering.',
            'metadata' => ['budget' => '$14,500.00'],
            'ip_address' => '192.168.1.14',
        ]);

        // 6. Seed In-App Notifications
        NotificationLog::create([
            'user_id' => $client1->id,
            'channel' => 'in_app',
            'title' => 'Request REQ-2026-9011 In Progress',
            'message' => 'Engineering sprint has commenced on your Kubernetes cluster provisioning.',
            'status' => 'sent',
            'recipient' => $client1->email,
            'read_at' => null,
        ]);

        NotificationLog::create([
            'user_id' => $client1->id,
            'channel' => 'email',
            'title' => 'Invoice #TXN-STRIPE-891024 Paid',
            'message' => 'Thank you for your payment of $14,500.00 USD. Invoice is available for download.',
            'status' => 'sent',
            'recipient' => $client1->email,
            'read_at' => now(),
        ]);
    }
}
