<?php

namespace Tests\Feature;

use App\Models\BusinessFeasibilityReport;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SicipReportTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_to_sicip_login_when_accessing_form(): void
    {
        $response = $this->get('/sicip/feasibility-report');
        $response->assertRedirect('/sicip/login');
    }

    public function test_applicant_login_page_can_be_rendered(): void
    {
        $response = $this->get('/sicip/login');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Sicip/Auth/Login'));
    }

    public function test_applicant_register_page_can_be_rendered(): void
    {
        $response = $this->get('/sicip/register');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Sicip/Auth/Register'));
    }

    public function test_new_applicant_can_register_an_account(): void
    {
        $response = $this->post('/sicip/register', [
            'name' => 'তানভীর রহমান',
            'phone' => '01819876543',
            'email' => 'tanvir.test@example.com',
            'password' => 'secret123',
            'password_confirmation' => 'secret123',
        ]);

        $response->assertRedirect('/sicip/feasibility-report');
        $this->assertAuthenticated();

        $user = User::where('phone', '01819876543')->first();
        $this->assertNotNull($user);
        $this->assertEquals('client_user', $user->role);
    }

    public function test_registered_applicant_can_log_in_via_phone_or_email(): void
    {
        $user = User::create([
            'name' => 'সাকিব আহমেদ',
            'phone' => '01712345678',
            'email' => 'sakib@example.com',
            'role' => 'client_user',
            'password' => 'password123',
            'status' => 'active',
        ]);

        // Login via phone
        $responsePhone = $this->post('/sicip/login', [
            'login' => '01712345678',
            'password' => 'password123',
        ]);
        $responsePhone->assertRedirect('/sicip/feasibility-report');
        $this->assertAuthenticatedAs($user);

        // Logout
        $this->post('/sicip/logout');
        $this->assertGuest();

        // Login via email
        $responseEmail = $this->post('/sicip/login', [
            'login' => 'sakib@example.com',
            'password' => 'password123',
        ]);
        $responseEmail->assertRedirect('/sicip/feasibility-report');
        $this->assertAuthenticatedAs($user);
    }

    public function test_authenticated_applicant_can_render_feasibility_report_form(): void
    {
        $applicant = User::create([
            'name' => 'Applicant User',
            'email' => 'applicant_auth@example.com',
            'phone' => '01911223344',
            'role' => 'client_user',
            'password' => 'secret123',
        ]);

        $response = $this->actingAs($applicant)->get('/sicip/feasibility-report');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Sicip/FeasibilityReportForm'));
    }

    public function test_guest_is_redirected_to_login_when_accessing_reports_list(): void
    {
        $response = $this->get('/sicip/reports');
        $response->assertRedirect('/login');
    }

    public function test_non_admin_client_user_cannot_access_reports_list(): void
    {
        $client = User::create([
            'name' => 'Client User',
            'email' => 'client_test@example.com',
            'role' => 'client_user',
            'password' => 'secret123',
        ]);

        $response = $this->actingAs($client)->get('/sicip/reports');
        $response->assertStatus(403);
    }

    public function test_admin_can_access_feasibility_reports_list(): void
    {
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin_test@example.com',
            'role' => 'super_admin',
            'password' => 'secret123',
        ]);

        $response = $this->actingAs($admin)->get('/sicip/reports');
        $response->assertStatus(200);
    }

    public function test_feasibility_report_submission_and_view(): void
    {
        $applicant = User::create([
            'name' => 'আবেদনকারী',
            'email' => 'applicant@test.com',
            'phone' => '01812345678',
            'role' => 'client_user',
            'password' => 'secret123',
        ]);

        $report = BusinessFeasibilityReport::create([
            'user_id' => $applicant->id,
            'tracking_number' => 'SICIP-TEST-1234',
            'applicant_name_bn' => 'আবেদনকারী',
            'applicant_name_en' => 'Applicant Name',
            'phone' => '01812345678',
        ]);

        // Owner applicant can view their own report
        $response = $this->actingAs($applicant)->get('/sicip/report/' . $report->tracking_number);
        $response->assertStatus(200);

        // Another applicant cannot view this report (strictly 403 Forbidden)
        $otherApplicant = User::create([
            'name' => 'অন্য আবেদনকারী',
            'email' => 'other@test.com',
            'phone' => '01912345678',
            'role' => 'client_user',
            'password' => 'secret123',
        ]);
        $forbiddenResponse = $this->actingAs($otherApplicant)->get('/sicip/report/' . $report->tracking_number);
        $forbiddenResponse->assertStatus(403);
    }

    public function test_applicant_cannot_access_applicants_list(): void
    {
        $applicant = User::create([
            'name' => 'সাধারণ আবেদনকারী',
            'email' => 'client_norights@test.com',
            'phone' => '01799999999',
            'role' => 'client_user',
            'password' => 'secret123',
        ]);

        // An applicant must never see the list of other applicants
        $response = $this->actingAs($applicant)->get('/sicip/reports');
        $response->assertStatus(403);
    }

    public function test_applicant_cannot_access_or_tamper_another_applicants_draft_or_report(): void
    {
        $userA = User::create([
            'name' => 'আবেদনকারী ক',
            'email' => 'user_a@test.com',
            'phone' => '01811111111',
            'role' => 'client_user',
            'password' => 'secret123',
        ]);

        $userB = User::create([
            'name' => 'আবেদনকারী খ',
            'email' => 'user_b@test.com',
            'phone' => '01822222222',
            'role' => 'client_user',
            'password' => 'secret123',
        ]);

        // User A creates a draft
        $draftA = BusinessFeasibilityReport::create([
            'user_id' => $userA->id,
            'tracking_number' => 'SICIP-DRAFT-AAAA',
            'applicant_name_bn' => 'আবেদনকারী ক এর গোপন খসড়া',
            'status' => 'draft',
        ]);

        // User B attempts to load User A's draft in create form
        $response = $this->actingAs($userB)->get('/sicip/feasibility-report?draft=' . $draftA->tracking_number);
        $response->assertStatus(200);
        // Inertia page should NOT contain User A's draft data
        $response->assertInertia(fn ($page) => $page
            ->component('Sicip/FeasibilityReportForm')
            ->where('initialReport', null)
        );

        // User B attempts to overwrite User A's draft via POST
        $postResponse = $this->actingAs($userB)->post('/sicip/feasibility-report', [
            'tracking_number' => $draftA->tracking_number,
            'save_action' => 'draft',
            'applicant_name_bn' => 'হ্যাক করার চেষ্টা',
        ]);
        $postResponse->assertStatus(403);
    }

    public function test_guest_cannot_submit_report_and_is_redirected_to_login(): void
    {
        $response = $this->post('/sicip/feasibility-report', [
            'applicant_name_bn' => 'অননুমোদিত আবেদনকারী',
        ]);

        $response->assertRedirect('/sicip/login');
    }

    public function test_user_can_save_draft_with_minimal_data(): void
    {
        $user = User::create([
            'name' => 'খসড়া উদ্যোক্তা',
            'email' => 'draft.user@example.com',
            'phone' => '01711000000',
            'role' => 'client_user',
            'password' => 'secret123',
        ]);

        $response = $this->actingAs($user)->post('/sicip/feasibility-report', [
            'save_action' => 'draft',
            'applicant_name_bn' => 'খসড়া উদ্যোক্তা',
            'phone' => '01711000000',
        ]);

        $this->assertDatabaseHas('business_feasibility_reports', [
            'applicant_name_bn' => 'খসড়া উদ্যোক্তা',
            'status' => 'draft',
        ]);

        $report = BusinessFeasibilityReport::where('applicant_name_bn', 'খসড়া উদ্যোক্তা')->first();
        $response->assertRedirect('/sicip/feasibility-report?draft=' . $report->tracking_number);
    }

    public function test_final_submission_validates_mandatory_fields(): void
    {
        $user = User::create([
            'name' => 'অসম্পূর্ণ আবেদনকারী',
            'email' => 'incomplete.user@example.com',
            'phone' => '01722000000',
            'role' => 'client_user',
            'password' => 'secret123',
        ]);

        $response = $this->actingAs($user)->post('/sicip/feasibility-report', [
            'save_action' => 'submit',
            'applicant_name_bn' => 'অসম্পূর্ণ আবেদন',
            // Missing required father_name, nid, dob, idea_description, etc.
        ]);

        $response->assertSessionHasErrors([
            'applicant_name_en',
            'father_name_bn',
            'mother_name_bn',
            'nid_number',
            'dob',
            'phone',
            'idea_description',
        ]);
    }

    public function test_user_can_update_and_submit_existing_draft(): void
    {
        $user = User::create([
            'name' => 'খসড়া মালিক',
            'email' => 'draft.owner@example.com',
            'phone' => '01819999999',
            'role' => 'client_user',
            'password' => 'secret123',
        ]);

        $draft = BusinessFeasibilityReport::create([
            'user_id' => $user->id,
            'tracking_number' => 'SICIP-DRAFT-9999',
            'applicant_name_bn' => 'প্রথমে খসড়া',
            'applicant_name_en' => 'Draft English',
            'status' => 'draft',
        ]);

        $response = $this->actingAs($user)->post('/sicip/feasibility-report', [
            'report_id' => $draft->id,
            'tracking_number' => $draft->tracking_number,
            'save_action' => 'submit',
            'applicant_name_bn' => 'চূড়ান্ত তানভীর',
            'applicant_name_en' => 'Final Tanvir',
            'father_name_bn' => 'পিতার নাম',
            'mother_name_bn' => 'মাতার নাম',
            'nid_number' => '1234567890',
            'dob' => '1995-01-01',
            'phone' => '01819999999',
            'idea_description' => 'প্রাকৃতিক মধু প্রসেসিং',
            'capital_financing_plan' => '১০ লাখ টাকা',
            'business_category' => 'ম্যানুফেকচারিং',
            'expected_location' => 'ঢাকা',
            'product_type' => 'আমদানির বিকল্প পণ্য',
            'market_scope' => 'অভ্যন্তরীণ',
        ]);

        $this->assertDatabaseHas('business_feasibility_reports', [
            'tracking_number' => 'SICIP-DRAFT-9999',
            'applicant_name_bn' => 'চূড়ান্ত তানভীর',
            'status' => 'submitted',
        ]);

        $response->assertRedirect('/sicip/report/SICIP-DRAFT-9999');
    }

    public function test_photo_and_documents_can_be_uploaded_and_stored(): void
    {
        Storage::fake('public');

        $user = User::create([
            'name' => 'ফটো টেস্ট ইউজার',
            'email' => 'photo.test@example.com',
            'phone' => '01733000000',
            'role' => 'client_user',
            'password' => 'secret123',
        ]);

        $photo = UploadedFile::fake()->create('applicant_photo.jpg', 200, 'image/jpeg');
        $signature = UploadedFile::fake()->create('signature.png', 100, 'image/png');
        $nidDoc = UploadedFile::fake()->create('nid_card.pdf', 500, 'application/pdf');

        $response = $this->actingAs($user)->post('/sicip/feasibility-report', [
            'save_action' => 'draft',
            'applicant_name_bn' => 'ফটো টেস্ট আবেদনকারী',
            'photo' => $photo,
            'signature' => $signature,
            'nid_doc' => $nidDoc,
        ]);

        $report = BusinessFeasibilityReport::where('applicant_name_bn', 'ফটো টেস্ট আবেদনকারী')->first();
        $this->assertNotNull($report);
        $this->assertNotNull($report->photo_path);
        $this->assertNotNull($report->signature_path);
        $this->assertNotNull($report->nid_attachment_path);

        Storage::disk('public')->assertExists($report->photo_path);
        Storage::disk('public')->assertExists($report->signature_path);
        Storage::disk('public')->assertExists($report->nid_attachment_path);

        $response->assertRedirect('/sicip/feasibility-report?draft=' . $report->tracking_number);
    }

    public function test_storage_direct_route_serves_files(): void
    {
        Storage::disk('public')->put('test_photo.jpg', 'fake-image-bytes');

        $response = $this->get('/storage/test_photo.jpg');
        $response->assertStatus(200);

        Storage::disk('public')->delete('test_photo.jpg');
    }

    public function test_end_to_end_submission_with_photo_displays_in_report_view(): void
    {
        Storage::fake('public');

        $photo = UploadedFile::fake()->create('tanvir_photo.jpg', 250, 'image/jpeg');
        $signature = UploadedFile::fake()->create('tanvir_sig.png', 100, 'image/png');

        $applicant = User::create([
            'name' => 'তানভীর আহমেদ',
            'email' => 'tanvir.applicant@example.com',
            'phone' => '01812345678',
            'role' => 'client_user',
            'password' => 'secret123',
        ]);

        $response = $this->actingAs($applicant)->post('/sicip/feasibility-report', [
            'save_action' => 'submit',
            'applicant_name_bn' => 'তানভীর আহমেদ',
            'applicant_name_en' => 'Tanvir Ahmed',
            'father_name_bn' => 'মোস্তফা কামাল',
            'mother_name_bn' => 'সালমা বেগম',
            'nid_number' => '1995123456789',
            'dob' => '1995-05-10',
            'phone' => '01812345678',
            'idea_description' => 'অর্গানিক মধু ও ন্যাচারাল অয়েল',
            'capital_financing_plan' => '১০ লক্ষ টাকা নিজস্ব ও ঋণ',
            'business_category' => 'ম্যানুফেকচারিং',
            'expected_location' => 'কেরানীগঞ্জ, ঢাকা',
            'product_type' => 'আমদানির বিকল্প পণ্য',
            'market_scope' => 'অভ্যন্তরীণ',
            'photo' => $photo,
            'signature' => $signature,
        ]);

        $report = BusinessFeasibilityReport::where('applicant_name_en', 'Tanvir Ahmed')->first();
        $this->assertNotNull($report);
        $this->assertEquals('submitted', $report->status);
        $this->assertNotNull($report->photo_path);
        $this->assertNotNull($report->signature_path);

        $response->assertRedirect('/sicip/report/' . $report->tracking_number);

        // Access the show view as the owner applicant
        $viewResponse = $this->actingAs($applicant)->get('/sicip/report/' . $report->tracking_number);
        $viewResponse->assertStatus(200);

        // Access the photo file directly through /storage/{path}
        $fileResponse = $this->get('/storage/' . $report->photo_path);
        $fileResponse->assertStatus(200);
    }

    public function test_applicant_profile_can_be_rendered(): void
    {
        $admin = User::create([
            'name' => 'Admin Reviewer',
            'email' => 'reviewer@example.com',
            'role' => 'super_admin',
            'password' => 'secret123',
        ]);

        $report = BusinessFeasibilityReport::create([
            'tracking_number' => 'SICIP-PROF-5555',
            'applicant_name_bn' => 'আফরোজা খাতুন',
            'applicant_name_en' => 'Afroza Khatun',
            'phone' => '01712345678',
            'status' => 'submitted',
        ]);

        $response = $this->actingAs($admin)->get('/sicip/report/' . $report->tracking_number . '/profile');
        $response->assertStatus(200);
    }

    public function test_admin_can_update_applicant_status_and_notes(): void
    {
        $admin = User::create([
            'name' => 'Admin Reviewer 2',
            'email' => 'reviewer2@example.com',
            'role' => 'super_admin',
            'password' => 'secret123',
        ]);

        $report = BusinessFeasibilityReport::create([
            'tracking_number' => 'SICIP-STAT-8888',
            'applicant_name_bn' => 'রফিকুল ইসলাম',
            'phone' => '01912345678',
            'status' => 'submitted',
        ]);

        $response = $this->actingAs($admin)->post('/sicip/report/' . $report->id . '/status', [
            'status' => 'approved',
            'admin_notes' => 'সকল তথ্য ও কাগজপত্র সঠিকভাবে যাচাই করা হয়েছে। প্রশিক্ষণের জন্য মনোনীত।',
        ]);

        $response->assertSessionHas('success');

        $report->refresh();
        $this->assertEquals('approved', $report->status);
        $this->assertEquals('সকল তথ্য ও কাগজপত্র সঠিকভাবে যাচাই করা হয়েছে। প্রশিক্ষণের জন্য মনোনীত।', $report->admin_notes);
        $this->assertNotNull($report->reviewed_at);
        $this->assertEquals($admin->id, $report->reviewer_id);
    }

    public function test_applicant_list_filtering_and_search(): void
    {
        $admin = User::create([
            'name' => 'Admin Reviewer 3',
            'email' => 'reviewer3@example.com',
            'role' => 'super_admin',
            'password' => 'secret123',
        ]);

        BusinessFeasibilityReport::create([
            'tracking_number' => 'SICIP-SRCH-1111',
            'applicant_name_bn' => 'তাহের আলী',
            'applicant_name_en' => 'Taher Ali',
            'phone' => '01311111111',
            'status' => 'under_review',
        ]);

        BusinessFeasibilityReport::create([
            'tracking_number' => 'SICIP-SRCH-2222',
            'applicant_name_bn' => 'সাবিনা ইয়াসমিন',
            'applicant_name_en' => 'Sabina Yasmin',
            'phone' => '01422222222',
            'status' => 'approved',
        ]);

        // Search by name
        $searchResponse = $this->actingAs($admin)->get('/sicip/reports?search=তাহের');
        $searchResponse->assertStatus(200);

        // Filter by status
        $statusResponse = $this->actingAs($admin)->get('/sicip/reports?status=approved');
        $statusResponse->assertStatus(200);
    }

    public function test_admin_can_delete_application(): void
    {
        $admin = User::create([
            'name' => 'Admin Reviewer 4',
            'email' => 'reviewer4@example.com',
            'role' => 'super_admin',
            'password' => 'secret123',
        ]);

        $report = BusinessFeasibilityReport::create([
            'tracking_number' => 'SICIP-DEL-9999',
            'applicant_name_bn' => 'বাতিল আবেদনকারী',
            'phone' => '01611111111',
            'status' => 'draft',
        ]);

        $response = $this->actingAs($admin)->delete('/sicip/report/' . $report->id);
        $response->assertRedirect('/sicip/reports');

        $this->assertDatabaseMissing('business_feasibility_reports', [
            'id' => $report->id,
        ]);
    }

    public function test_sample_demo_pdf_can_be_viewed_by_anyone(): void
    {
        $response = $this->get('/sicip/sample-demo-pdf');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Sicip/FeasibilityReportView')
            ->has('report')
            ->where('isDemo', true)
            ->where('report.applicant_name_bn', 'তানভীর আহমেদ চৌধুরী')
            ->where('report.tracking_number', 'SICIP-DEMO-2024-001')
        );
    }

    public function test_sample_demo_pdf_with_print_action_enables_autoprint(): void
    {
        $response = $this->get('/sicip/sample-demo-pdf?action=print');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Sicip/FeasibilityReportView')
            ->where('isDemo', true)
            ->where('autoPrint', true)
        );
    }

    public function test_old_submission_date_is_prevented_and_forced_to_real_today_date(): void
    {
        Storage::fake('public');

        $user = User::create([
            'name' => 'আফজাল হোসেন',
            'email' => 'afzal@example.com',
            'phone' => '01719876543',
            'role' => 'client_user',
            'password' => 'secret123',
        ]);

        $photo = UploadedFile::fake()->create('photo.jpg', 200, 'image/jpeg');
        $signature = UploadedFile::fake()->create('signature.png', 100, 'image/png');

        $response = $this->actingAs($user)->post('/sicip/feasibility-report', [
            'applicant_name_bn' => 'আফজাল হোসেন',
            'applicant_name_en' => 'Afzal Hossain',
            'father_name_bn' => 'আব্দুল করিম',
            'father_name_en' => 'Abdul Karim',
            'mother_name_bn' => 'আমিনা বেগম',
            'mother_name_en' => 'Amina Begum',
            'nid_number' => '19902678901234567',
            'phone' => '01719876543',
            'dob' => '1990-05-10',
            'submission_date' => '2020-01-01', // An old past date
            'idea_description' => 'টেস্টিং রিয়েল ডেট',
            'capital_financing_plan' => '১০ লক্ষ টাকা',
            'business_category' => 'ম্যানুফেকচারিং',
            'expected_location' => 'ঢাকা',
            'product_type' => 'আমদানির বিকল্প পণ্য',
            'market_scope' => 'অভ্যন্তরীণ',
            'photo' => $photo,
            'signature' => $signature,
        ]);

        $report = BusinessFeasibilityReport::where('applicant_name_en', 'Afzal Hossain')->first();
        $this->assertNotNull($report);
        $this->assertEquals(now()->format('Y-m-d'), $report->submission_date->format('Y-m-d'));
    }
}
