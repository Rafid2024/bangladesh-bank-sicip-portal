<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('business_feasibility_reports', function (Blueprint $table) {
            $table->text('admin_notes')->nullable()->after('status');
            $table->timestamp('reviewed_at')->nullable()->after('admin_notes');
            $table->foreignId('reviewer_id')->nullable()->constrained('users')->nullOnDelete()->after('reviewed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('business_feasibility_reports', function (Blueprint $table) {
            $table->dropForeign(['reviewer_id']);
            $table->dropColumn(['admin_notes', 'reviewed_at', 'reviewer_id']);
        });
    }
};
