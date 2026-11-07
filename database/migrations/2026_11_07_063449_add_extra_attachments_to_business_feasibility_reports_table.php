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
            $table->json('extra_attachments')->nullable()->after('education_certificate_path');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('business_feasibility_reports', function (Blueprint $table) {
            $table->dropColumn('extra_attachments');
        });
    }
};
