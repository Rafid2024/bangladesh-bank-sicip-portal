<?php

namespace Tests\Feature;

use App\Models\BusinessFeasibilityReport;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SicipEndToEndFlowTest extends TestCase
{
    use RefreshDatabase;

    /**
     * 1. Guest Journey: Unauthenticated user is properly gated and redirected.
     */
    public function test_e2e_guest_gating_and_redirection(): void
    {
        // Visiting root redirects to sicip.create
        $rootResponse = $this->get('/');
        $rootResponse->assertRedirect('/sicip/feasibility-report');

        // Unauthenticated visitor to application form is redirected to applicant login
        $formResponse = $this->get('/sicip/feasibility-report');
        $formResponse->assertRedirect('/sicip/login');

        // Unauthenticated visitor to admin reports list is redirected to admin login
        $adminResponse = $this->get('/sicip/reports');
        $adminResponse->assertRedirect('/login');

        // Unauthenticated POST submission is redirected to applicant login
        $postResponse = $this->post('/sicip/feasibility-report', ['applicant_name_bn' => 'চেষ্টা']);
        $postResponse->assertRedirect('/sicip/login');
    }

    /**
     * 2. Applicant Lifecycle: Registration, Login by Phone, Login by Email, and Logout.
     */
    public function test_e2e_applicant_registration_login_and_logout(): void
    {
        // Step A: Register new applicant
        $regResponse = $this->post('/sicip/register', [
            'name' => 'রাশেদুল ইসলাম',
            'phone' => '01819876543',
            'email' => 'rashed@example.com',
            'password' => 'pass1234',
            'password_confirmation' => 'pass1234',
        ]);

        $regResponse->assertRedirect('/sicip/feasibility-report');
        $this->assertAuthenticated();

        $user = User::where('phone', '01819876543')->first();
        $this->assertNotNull($user);
        $this->assertEquals('client_user', $user->role);
        $this->assertEquals('রাশেদুল ইসলাম', $user->name);

        // Step B: Logout
        $logoutResponse = $this->post('/sicip/logout');
        $logoutResponse->assertRedirect('/sicip/login');
        $this->assertGuest();

        // Step C: Login using Phone Number
        $loginPhoneResponse = $this->post('/sicip/login', [
            'login' => '01819876543',
            'password' => 'pass1234',
        ]);
        $loginPhoneResponse->assertRedirect('/sicip/feasibility-report');
        $this->assertAuthenticatedAs($user);

        // Step D: Logout & Login using Email
        $this->post('/sicip/logout');
        $loginEmailResponse = $this->post('/sicip/login', [
            'login' => 'rashed@example.com',
            'password' => 'pass1234',
        ]);
        $loginEmailResponse->assertRedirect('/sicip/feasibility-report');
        $this->assertAuthenticatedAs($user);
    }

    /**
     * 3. Draft & Auto-Resume: Save a draft and verify auto-reload on next form open.
     */
    public function test_e2e_applicant_draft_save_and_auto_resume(): void
    {
        $applicant = User::create([
            'name' => 'কামরুল হাসান',
            'email' => 'kamrul@example.com',
            'phone' => '01712345678',
            'role' => 'client_user',
            'password' => 'secret123',
        ]);

        // Save a minimal draft
        $draftResponse = $this->actingAs($applicant)->post('/sicip/feasibility-report', [
            'save_action' => 'draft',
            'applicant_name_bn' => 'কামরুল হাসান (খসড়া)',
            'applicant_name_en' => 'Kamrul Hasan Draft',
            'phone' => '01712345678',
            'idea_description' => 'প্রারম্ভিক ডেইরি ফার্মিং ধারণা',
        ]);

        $draft = BusinessFeasibilityReport::where('user_id', $applicant->id)->where('status', 'draft')->first();
        $this->assertNotNull($draft);
        $this->assertEquals($applicant->id, $draft->user_id);
        $draftResponse->assertRedirect('/sicip/feasibility-report?draft=' . $draft->tracking_number);

        // Applicant opens /sicip/feasibility-report without draft parameter: existing draft is automatically loaded
        $formResponse = $this->actingAs($applicant)->get('/sicip/feasibility-report');
        $formResponse->assertStatus(200);
        $formResponse->assertInertia(fn ($page) => $page
            ->component('Sicip/FeasibilityReportForm')
            ->where('initialReport.tracking_number', $draft->tracking_number)
            ->where('initialReport.applicant_name_bn', 'কামরুল হাসান (খসড়া)')
        );
    }

    /**
     * 4. Full Submission with Attachments & Real-Time Date Enforcement.
     */
    public function test_e2e_full_submission_with_files_and_real_date_enforcement(): void
    {
        Storage::fake('public');

        $applicant = User::create([
            'name' => 'মাহমুদুল হক',
            'email' => 'mahmud@example.com',
            'phone' => '01911223344',
            'role' => 'client_user',
            'password' => 'secret123',
        ]);

        $photo = UploadedFile::fake()->create('passport.jpg', 200, 'image/jpeg');
        $sig = UploadedFile::fake()->create('sig.png', 100, 'image/png');

        $submitResponse = $this->actingAs($applicant)->post('/sicip/feasibility-report', [
            'save_action' => 'submit',
            'applicant_name_bn' => 'মাহমুদুল হক',
            'applicant_name_en' => 'Mahmudul Haque',
            'father_name_bn' => 'আনোয়ারুল হক',
            'mother_name_bn' => 'রোকেয়া বেগম',
            'nid_number' => '19922678901234567',
            'dob' => '1992-06-15',
            'phone' => '01911223344',
            'submission_date' => '2019-01-01', // Outdated date passed maliciously
            'idea_description' => 'হাই-টেক হাইড্রোপনিক ভেজিটেবল ফার্মিং ও আধুনিক গ্রিনহাউস',
            'capital_financing_plan' => 'মোট ১২ লক্ষ টাকা, নিজস্ব ৪ লক্ষ এবং ব্যাংক ঋণ ৮ লক্ষ',
            'business_category' => 'কৃষি/অ্যাগ্রো ফার্মিং',
            'expected_location' => 'সাভার, ঢাকা',
            'product_type' => 'আমদানির বিকল্প পণ্য',
            'market_scope' => 'অভ্যন্তরীণ',
            'photo' => $photo,
            'signature' => $sig,
        ]);

        $report = BusinessFeasibilityReport::where('user_id', $applicant->id)->where('status', 'submitted')->first();
        $this->assertNotNull($report);
        $this->assertNotNull($report->photo_path);
        $this->assertNotNull($report->signature_path);

        // Date is strictly enforced as today's real date, ignoring malicious input
        $this->assertEquals(now()->format('Y-m-d'), $report->submission_date->format('Y-m-d'));
        $this->assertEquals(now()->format('Y-m-d'), $report->signature_date->format('Y-m-d'));

        // Redirects to report view
        $submitResponse->assertRedirect('/sicip/report/' . $report->tracking_number);

        // Owner applicant can view their own report
        $viewResponse = $this->actingAs($applicant)->get('/sicip/report/' . $report->tracking_number);
        $viewResponse->assertStatus(200);
        $viewResponse->assertInertia(fn ($page) => $page
            ->component('Sicip/FeasibilityReportView')
            ->where('report.tracking_number', $report->tracking_number)
            ->where('report.applicant_name_bn', 'মাহমুদুল হক')
        );
    }

    /**
     * 5. Strict Data Privacy: An applicant can NEVER see other applicants or their data.
     */
    public function test_e2e_strict_applicant_privacy_and_data_isolation(): void
    {
        $applicant1 = User::create([
            'name' => 'আবেদনকারী ১',
            'email' => 'user1@example.com',
            'phone' => '01711111111',
            'role' => 'client_user',
            'password' => 'secret123',
        ]);

        $applicant2 = User::create([
            'name' => 'আবেদনকারী ২',
            'email' => 'user2@example.com',
            'phone' => '01722222222',
            'role' => 'client_user',
            'password' => 'secret123',
        ]);

        // Applicant 1 submits a report
        $report1 = BusinessFeasibilityReport::create([
            'user_id' => $applicant1->id,
            'tracking_number' => 'SICIP-PRIVACY-001',
            'applicant_name_bn' => 'আবেদনকারী ১ এর গোপন তথ্য',
            'applicant_name_en' => 'Applicant One Private',
            'phone' => '01711111111',
            'status' => 'submitted',
        ]);

        // 1. Applicant 2 tries to view Applicant 1's report directly by URL -> 403 Forbidden
        $response1 = $this->actingAs($applicant2)->get('/sicip/report/' . $report1->tracking_number);
        $response1->assertStatus(403);

        // 2. Applicant 2 tries to view Applicant 1's profile console -> 403 Forbidden
        $response2 = $this->actingAs($applicant2)->get('/sicip/report/' . $report1->tracking_number . '/profile');
        $response2->assertStatus(403);

        // 3. Applicant 2 tries to access the full applicant list -> 403 Forbidden
        $response3 = $this->actingAs($applicant2)->get('/sicip/reports');
        $response3->assertStatus(403);

        // 4. Applicant 2 tries to tamper Applicant 1's report via POST -> 403 Forbidden
        $response4 = $this->actingAs($applicant2)->post('/sicip/feasibility-report', [
            'tracking_number' => $report1->tracking_number,
            'save_action' => 'draft',
            'applicant_name_bn' => 'টেম্পারিং আক্রমণ',
        ]);
        $response4->assertStatus(403);
    }

    /**
     * 6. Admin Management & Scrutiny Flow: List, Filter, Review, Status Update, and Delete.
     */
    public function test_e2e_admin_scrutiny_and_review_workflow(): void
    {
        $admin = User::create([
            'name' => 'বাংলাদেশ ব্যাংক অ্যাডমিন',
            'email' => 'admin@novaportal.io',
            'phone' => '01700000000',
            'role' => 'super_admin',
            'password' => 'secret123',
        ]);

        $applicant = User::create([
            'name' => 'উদ্যোক্তা প্রার্থী',
            'email' => 'candidate@example.com',
            'phone' => '01899999999',
            'role' => 'client_user',
            'password' => 'secret123',
        ]);

        $report = BusinessFeasibilityReport::create([
            'user_id' => $applicant->id,
            'tracking_number' => 'SICIP-REVIEW-7777',
            'applicant_name_bn' => 'প্রার্থী আবেদনকারী',
            'applicant_name_en' => 'Candidate Applicant',
            'phone' => '01899999999',
            'nid_number' => '1995123456789',
            'business_category' => 'ম্যানুফেকচারিং',
            'status' => 'submitted',
        ]);

        // 1. Admin accesses the master reports list
        $listResponse = $this->actingAs($admin)->get('/sicip/reports');
        $listResponse->assertStatus(200);
        $listResponse->assertInertia(fn ($page) => $page
            ->component('Sicip/Index')
            ->has('reports.data')
            ->has('stats')
        );

        // 2. Admin searches by tracking number
        $searchResponse = $this->actingAs($admin)->get('/sicip/reports?search=SICIP-REVIEW-7777');
        $searchResponse->assertStatus(200);

        // 3. Admin opens the applicant scrutiny profile
        $profileResponse = $this->actingAs($admin)->get('/sicip/report/' . $report->tracking_number . '/profile');
        $profileResponse->assertStatus(200);
        $profileResponse->assertInertia(fn ($page) => $page
            ->component('Sicip/ApplicantProfile')
            ->where('report.tracking_number', 'SICIP-REVIEW-7777')
        );

        // 4. Admin updates the application status to approved with review notes
        $statusResponse = $this->actingAs($admin)->post('/sicip/report/' . $report->id . '/status', [
            'status' => 'approved',
            'admin_notes' => 'সকল কাগজপত্র সঠিক ও যাচাই সম্পন্ন। প্রশিক্ষণের জন্য মনোনীত করা হলো।',
        ]);
        $statusResponse->assertSessionHas('success');

        $report->refresh();
        $this->assertEquals('approved', $report->status);
        $this->assertEquals('সকল কাগজপত্র সঠিক ও যাচাই সম্পন্ন। প্রশিক্ষণের জন্য মনোনীত করা হলো।', $report->admin_notes);
        $this->assertEquals($admin->id, $report->reviewer_id);

        // 5. Admin can delete an application if required
        $deleteResponse = $this->actingAs($admin)->delete('/sicip/report/' . $report->id);
        $deleteResponse->assertRedirect('/sicip/reports');
        $this->assertDatabaseMissing('business_feasibility_reports', ['id' => $report->id]);
    }

    /**
     * 7. Sample Demo PDF: Fully accessible with authentic 4-page realistic data.
     */
    public function test_e2e_sample_demo_pdf_generation_and_print_modes(): void
    {
        // View sample demo PDF
        $demoResponse = $this->get('/sicip/sample-demo-pdf');
        $demoResponse->assertStatus(200);
        $demoResponse->assertInertia(fn ($page) => $page
            ->component('Sicip/FeasibilityReportView')
            ->where('isDemo', true)
            ->where('report.applicant_name_bn', 'তানভীর আহমেদ চৌধুরী')
        );

        // Print mode trigger
        $printResponse = $this->get('/sicip/sample-demo-pdf?action=print');
        $printResponse->assertStatus(200);
        $printResponse->assertInertia(fn ($page) => $page
            ->where('autoPrint', true)
        );
    }
}

