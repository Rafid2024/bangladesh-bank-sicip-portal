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
        Schema::create('business_feasibility_reports', function (Blueprint $table) {
            $table->id();
            $table->string('tracking_number')->unique();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('status')->default('submitted'); // draft, submitted, verified, approved
            $table->date('submission_date')->nullable();

            // PART I: ব্যক্তিগত তথ্যাবলী (Personal Info)
            $table->string('applicant_name_bn')->nullable();
            $table->string('applicant_name_en')->nullable();
            $table->string('father_name_bn')->nullable();
            $table->string('father_name_en')->nullable();
            $table->string('mother_name_bn')->nullable();
            $table->string('mother_name_en')->nullable();
            $table->string('guardian_name')->nullable();
            $table->string('guardian_relation')->nullable();
            $table->string('guardian_phone')->nullable();
            $table->string('nid_number')->nullable();
            $table->date('dob')->nullable();
            $table->integer('age')->nullable();
            $table->string('marital_status')->nullable();
            $table->string('phone')->nullable();
            $table->string('alt_phone')->nullable();
            $table->string('email')->nullable();

            // Addresses
            $table->json('present_address')->nullable(); // house, road, thana, post_code, district, division
            $table->json('permanent_address')->nullable();

            // Dynamic tables (Part I)
            $table->json('education_history')->nullable(); // [ { degree, result, passing_year, subject, board } ]
            $table->json('training_history')->nullable();  // [ { sl, subject, institute, duration, completion_date } ]
            $table->json('experience_history')->nullable();// [ { sl, organization, designation, duration, type } ]
            $table->string('info_source')->nullable();     // bank, social_media, bb_website, advertisement, relatives

            // PART II: নতুন ব্যবসায়িক আইডিয়া এবং পরিকল্পনা সংক্রান্ত তথ্যাদি
            // ক. নতুন ব্যবসায়িক আইডিয়া সংক্রান্ত তথ্যাদি
            $table->text('idea_description')->nullable();
            $table->string('business_start_timeline')->nullable();
            $table->text('capital_financing_plan')->nullable();
            $table->string('business_category')->nullable(); // manufacturing, services, trading
            $table->text('business_category_details')->nullable();
            $table->string('expected_location')->nullable();
            $table->string('product_type')->nullable(); // import_substitute, exportable, regular
            $table->string('market_scope')->nullable(); // domestic, international, both

            // খ. ব্যবসায়িক পরিকল্পনা সংক্রান্ত তথ্যাদি
            $table->text('ongoing_business_details')->nullable();
            $table->text('plan_expand_employees')->nullable();
            $table->text('plan_increase_financial_involvement')->nullable();
            $table->text('way_to_increase_finance')->nullable();
            $table->text('plan_product_quality_change')->nullable();
            $table->text('plan_maintain_financial_records')->nullable();

            // PART III: ব্যবসায় সম্পর্কিত তথ্যাবলী
            $table->string('existing_business_type')->nullable();
            $table->boolean('has_trade_license')->default(false);
            $table->date('trade_license_date')->nullable();
            $table->decimal('avg_selling_price', 15, 2)->nullable();
            $table->decimal('daily_sales_amount', 15, 2)->nullable();
            $table->decimal('monthly_sales_amount', 15, 2)->nullable();
            $table->decimal('monthly_raw_operational_cost', 15, 2)->nullable();
            $table->decimal('monthly_estimated_profit', 15, 2)->nullable();
            $table->text('business_involvement_reason')->nullable();
            $table->decimal('total_investment_amount', 15, 2)->nullable();
            $table->string('raw_material_source')->nullable();
            $table->string('potential_buyers')->nullable();
            $table->text('competitor_names')->nullable();
            $table->string('marketing_area')->nullable();
            $table->json('competitor_analysis')->nullable(); // [ { sl, name, location, daily_production, daily_sales, price, customer_count, coverage } ]
            $table->text('reason_buyers_choose_you')->nullable();
            $table->text('price_and_quality_difference')->nullable();
            $table->text('existing_business_challenges')->nullable();
            $table->text('training_participation_reason')->nullable();

            // PART IV: অন্যান্য ও সংযুক্তি
            $table->string('father_education')->nullable();
            $table->string('father_occupation')->nullable();
            $table->string('mother_education')->nullable();
            $table->string('mother_occupation')->nullable();
            $table->decimal('family_monthly_income', 15, 2)->nullable();
            $table->boolean('has_own_house')->default(false);
            $table->integer('siblings_count')->nullable();
            $table->string('physical_disability')->nullable();

            // Banking
            $table->string('bank_account_number')->nullable();
            $table->string('bank_and_branch_name')->nullable();
            $table->string('bank_routing_number')->nullable();

            // Attachments File Paths
            $table->string('photo_path')->nullable();
            $table->string('nid_attachment_path')->nullable();
            $table->string('trade_license_attachment_path')->nullable();
            $table->string('education_certificate_path')->nullable();
            $table->string('signature_path')->nullable();
            $table->date('signature_date')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('business_feasibility_reports');
    }
};
