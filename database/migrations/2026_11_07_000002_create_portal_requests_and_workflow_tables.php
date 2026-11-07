<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('portal_requests', function (Blueprint $table) {
            $table->id();
            $table->string('tracking_code')->unique()->index();
            $table->string('title');
            $table->text('description');
            $table->string('category')->index(); // 'Infrastructure', 'Access Governance', 'Security Audit', 'Cloud Provisioning', 'Billing & Licensing'
            $table->enum('priority', ['low', 'medium', 'high', 'critical'])->default('medium')->index();
            $table->enum('status', [
                'draft',
                'pending_review',
                'approved',
                'rejected',
                'in_progress',
                'completed',
                'cancelled'
            ])->default('draft')->index();
            $table->foreignId('client_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('assigned_manager_id')->nullable()->constrained('users')->nullOnDelete();
            $table->decimal('budget_estimate', 12, 2)->default(0.00);
            $table->json('metadata')->nullable();
            $table->json('tags')->nullable();
            $table->timestamp('sla_due_at')->nullable()->index();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['client_id', 'status', 'created_at']);
            $table->index(['assigned_manager_id', 'status']);
        });

        Schema::create('workflow_transitions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('portal_request_id')->constrained('portal_requests')->cascadeOnDelete();
            $table->string('from_status');
            $table->string('to_status');
            $table->foreignId('actor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->text('reason_or_notes')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['portal_request_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('workflow_transitions');
        Schema::dropIfExists('portal_requests');
    }
};

