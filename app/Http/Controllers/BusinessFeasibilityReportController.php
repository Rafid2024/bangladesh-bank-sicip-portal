<?php

namespace App\Http\Controllers;

use App\Models\BusinessFeasibilityReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BusinessFeasibilityReportController extends Controller
{
    /**
     * Display a listing of submitted feasibility reports with search, filter, and stats.
     */
    public function index(Request $request)
    {
        $query = BusinessFeasibilityReport::with('reviewer')->latest();

        // Search filter
        if ($request->filled('search')) {
            $search = trim($request->input('search'));
            $query->where(function ($q) use ($search) {
                $q->where('tracking_number', 'like', "%{$search}%")
                  ->orWhere('applicant_name_bn', 'like', "%{$search}%")
                  ->orWhere('applicant_name_en', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('nid_number', 'like', "%{$search}%");
            });
        }

        // Status filter
        if ($request->filled('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }

        // Division filter
        if ($request->filled('division') && $request->input('division') !== 'all') {
            $query->where('present_address->division', $request->input('division'));
        }

        // Category filter
        if ($request->filled('category') && $request->input('category') !== 'all') {
            $query->where('business_category', $request->input('category'));
        }

        // Statistics
        $stats = [
            'total' => BusinessFeasibilityReport::count(),
            'submitted' => BusinessFeasibilityReport::where('status', 'submitted')->count(),
            'under_review' => BusinessFeasibilityReport::where('status', 'under_review')->count(),
            'approved' => BusinessFeasibilityReport::where('status', 'approved')->count(),
            'rejected' => BusinessFeasibilityReport::where('status', 'rejected')->count(),
            'draft' => BusinessFeasibilityReport::where('status', 'draft')->count(),
        ];

        $reports = $query->paginate(15)->withQueryString();

        return Inertia::render('Sicip/Index', [
            'reports' => $reports,
            'stats' => $stats,
            'filters' => [
                'search' => $request->input('search', ''),
                'status' => $request->input('status', 'all'),
                'division' => $request->input('division', 'all'),
                'category' => $request->input('category', 'all'),
            ],
        ]);
    }

    /**
     * Show the form for creating a new business feasibility report or resuming a draft.
     */
    public function create(Request $request)
    {
        // Require applicant authentication
        if (!auth()->check()) {
            return redirect()->route('sicip.login')
                ->with('error', 'আবেদন ফরম পূরণ করতে অনুগ্রহ করে আপনার অ্যাকাউন্টে লগইন করুন অথবা নতুন অ্যাকাউন্ট তৈরি করুন।');
        }

        $draftReport = null;
        if ($request->filled('draft')) {
            $draftReport = BusinessFeasibilityReport::where('user_id', auth()->id())
                ->where(function ($q) use ($request) {
                    $q->where('tracking_number', $request->query('draft'))
                      ->orWhere('id', $request->query('draft'));
                })
                ->first();
        } else {
            // Find existing draft for this logged-in applicant
            $draftReport = BusinessFeasibilityReport::where('user_id', auth()->id())
                ->where('status', 'draft')
                ->latest()
                ->first();
        }

        // Check if applicant already has an active submitted application
        $submittedReport = BusinessFeasibilityReport::where('user_id', auth()->id())
            ->where('status', '!=', 'draft')
            ->latest()
            ->first();

        return Inertia::render('Sicip/FeasibilityReportForm', [
            'initialReport' => $draftReport,
            'submittedReport' => $submittedReport,
        ]);
    }

    /**
     * Store or update a feasibility report (Draft or Final Submission).
     */
    public function store(Request $request)
    {
        // Require applicant authentication
        if (!auth()->check()) {
            return redirect()->route('sicip.login')
                ->with('error', 'আবেদন সংরক্ষণ বা দাখিল করতে অনুগ্রহ করে প্রথমে আপনার অ্যাকাউন্টে লগইন করুন।');
        }

        $saveAction = $request->input('save_action', 'submit');

        $fileRules = [
            'photo' => 'nullable|file|image|mimes:jpeg,png,jpg,webp|max:3072',
            'signature' => 'nullable|file|image|mimes:jpeg,png,jpg,webp|max:2048',
            'nid_doc' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:5120',
            'trade_license_doc' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:5120',
            'education_doc' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:5120',
        ];

        if ($saveAction === 'draft') {
            $request->validate(array_merge([
                'applicant_name_bn' => 'nullable|string|max:255',
                'applicant_name_en' => 'nullable|string|max:255',
                'phone' => 'nullable|string|max:30',
            ], $fileRules));
            $status = 'draft';
        } else {
            $request->validate(array_merge([
                'applicant_name_bn' => 'required|string|max:255',
                'applicant_name_en' => 'required|string|max:255',
                'father_name_bn' => 'required|string|max:255',
                'mother_name_bn' => 'required|string|max:255',
                'nid_number' => 'required|string|max:50',
                'dob' => 'required|date',
                'phone' => 'required|string|max:30',
                'idea_description' => 'required|string',
                'capital_financing_plan' => 'required|string',
                'business_category' => 'required|string',
                'expected_location' => 'required|string',
                'product_type' => 'required|string',
                'market_scope' => 'required|string',
            ], $fileRules));
            $status = 'submitted';
        }

        $data = $request->except(['photo', 'nid_doc', 'trade_license_doc', 'education_doc', 'signature', 'save_action']);

        if ($saveAction === 'draft') {
            if (empty($data['applicant_name_bn'])) {
                $data['applicant_name_bn'] = 'খসড়া আবেদন (' . now()->format('d M, Y') . ')';
            }
            if (empty($data['applicant_name_en'])) {
                $data['applicant_name_en'] = 'Draft Applicant (' . now()->format('d M, Y') . ')';
            }
        }

        $data['user_id'] = auth()->id();
        $data['status'] = $status;
        $today = now()->format('Y-m-d');
        // Always automatically assign the real live date of that day
        $data['submission_date'] = $today;
        $data['signature_date'] = $today;

        // Decode JSON fields if sent as JSON strings or arrays
        $jsonFields = [
            'present_address',
            'permanent_address',
            'education_history',
            'training_history',
            'experience_history',
            'competitor_analysis'
        ];

        foreach ($jsonFields as $field) {
            if ($request->has($field)) {
                $val = $request->input($field);
                $data[$field] = is_string($val) ? json_decode($val, true) : $val;
            }
        }

        // Handle File Uploads
        if ($request->hasFile('photo')) {
            $data['photo_path'] = $request->file('photo')->store('sicip/photos', 'public');
        }
        if ($request->hasFile('nid_doc')) {
            $data['nid_attachment_path'] = $request->file('nid_doc')->store('sicip/docs', 'public');
        }
        if ($request->hasFile('trade_license_doc')) {
            $data['trade_license_attachment_path'] = $request->file('trade_license_doc')->store('sicip/docs', 'public');
        }
        if ($request->hasFile('education_doc')) {
            $data['education_certificate_path'] = $request->file('education_doc')->store('sicip/docs', 'public');
        }
        if ($request->hasFile('signature')) {
            $data['signature_path'] = $request->file('signature')->store('sicip/signatures', 'public');
        }

        // Handle Extra Attachments
        if ($request->has('extra_attachments')) {
            $extraList = $request->input('extra_attachments');
            if (is_string($extraList)) {
                $extraList = json_decode($extraList, true) ?? [];
            }
            if (is_array($extraList)) {
                $savedExtra = [];
                foreach ($extraList as $idx => $item) {
                    $title = $item['title'] ?? ('সংযুক্তি ' . ($idx + 1));
                    $path = $item['file_path'] ?? null;
                    if ($request->hasFile("extra_attachment_file_{$idx}")) {
                        $path = $request->file("extra_attachment_file_{$idx}")->store('sicip/docs', 'public');
                    } elseif ($request->hasFile("extra_attachments.{$idx}.file")) {
                        $path = $request->file("extra_attachments.{$idx}.file")->store('sicip/docs', 'public');
                    }
                    $savedExtra[] = [
                        'title' => $title,
                        'file_path' => $path,
                    ];
                }
                $data['extra_attachments'] = $savedExtra;
            }
        }

        // Check if updating an existing report (e.g. existing draft)
        $existing = null;
        if ($request->filled('tracking_number')) {
            $existing = BusinessFeasibilityReport::where('tracking_number', $request->input('tracking_number'))->first();
        } elseif ($request->filled('report_id')) {
            $existing = BusinessFeasibilityReport::find($request->input('report_id'));
        }

        if ($existing) {
            $user = auth()->user();
            $isAdmin = $user && ($user->isSuperAdmin() || $user->isOperationsManager());
            if (!$isAdmin && $existing->user_id && $existing->user_id !== auth()->id()) {
                abort(403, 'অননুমোদিত অ্যাক্সেস। গোপনীয়তা রক্ষার স্বার্থে আপনি শুধুমাত্র আপনার নিজের আবেদন সম্পাদন করতে পারবেন।');
            }
            $existing->update($data);
            $report = $existing;
        } else {
            $data['tracking_number'] = 'SICIP-' . strtoupper(Str::random(4)) . '-' . rand(1000, 9999);
            $report = BusinessFeasibilityReport::create($data);
        }

        if ($saveAction === 'draft') {
            return redirect()->route('sicip.create', ['draft' => $report->tracking_number])
                ->with('success', 'আপনার খসড়াটি সফলভাবে সংরক্ষিত হয়েছে! পরবর্তীতে যেকোনো সময় আপনি এটি পূরণ করে দাখিল করতে পারবেন।');
        }

        return redirect()->route('sicip.show', $report->tracking_number)
            ->with('success', 'ব্যবসার সম্ভাব্যতা যাচাই প্রতিবেদন সফলভাবে দাখিল হয়েছে!');
    }

    /**
     * Display the specified report / printable view.
     */
    public function show($tracking_number)
    {
        $report = BusinessFeasibilityReport::where('tracking_number', $tracking_number)
            ->orWhere('id', $tracking_number)
            ->firstOrFail();

        // Strict Data Privacy Check:
        // Applicants can ONLY see their own submitted report.
        // Under no circumstances can an applicant see other applicants' reports.
        $user = auth()->user();
        $isAdmin = $user && ($user->isSuperAdmin() || $user->isOperationsManager());
        $isOwner = $user && ($report->user_id === $user->id);

        if (!$isAdmin && !$isOwner) {
            abort(403, 'অননুমোদিত অ্যাক্সেস। গোপনীয়তা রক্ষার স্বার্থে কোনো আবেদনকারী অন্য কারো আবেদন দেখতে পারেন না।');
        }

        return Inertia::render('Sicip/FeasibilityReportView', [
            'report' => $report,
            'isAdmin' => $isAdmin,
        ]);
    }

    /**
     * Display a complete filled sample demo report in official 4-page PDF printable format.
     */
    public function sampleDemo(Request $request)
    {
        $sampleData = self::getSampleDemoReportData();
        $report = new BusinessFeasibilityReport($sampleData);
        $report->id = 999999;
        $report->exists = true;

        return Inertia::render('Sicip/FeasibilityReportView', [
            'report' => $report,
            'isDemo' => true,
            'autoPrint' => $request->boolean('print') || $request->query('action') === 'print',
        ]);
    }

    /**
     * Complete realistic sample data for Tanvir Ahmed Chowdhury's Feasibility Report.
     */
    public static function getSampleDemoReportData(): array
    {
        $samplePhoto = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="300" viewBox="0 0 240 300"><rect width="240" height="300" fill="%23065f46"/><circle cx="120" cy="100" r="50" fill="%23ffffff"/><circle cx="120" cy="280" r="100" fill="%23ffffff"/><text x="120" y="235" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23ecfdf5" text-anchor="middle">তানভীর আহমেদ</text><text x="120" y="255" font-family="sans-serif" font-size="11" fill="%23a7f3d0" text-anchor="middle">পাসপোর্ট ছবি (নমুনা)</text></svg>';
        $sampleSig = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="90" viewBox="0 0 300 90"><path d="M20,55 Q60,10 110,50 T190,35 T270,45" fill="none" stroke="%231e3a8a" stroke-width="3" stroke-linecap="round"/><text x="50" y="78" font-family="cursive, sans-serif" font-size="16" font-style="italic" fill="%231e3a8a">Tanvir A. Chowdhury</text></svg>';

        return [
            'id' => 999999,
            'tracking_number' => 'SICIP-DEMO-2024-001',
            'submission_date' => date('Y-m-d'),
            'applicant_name_bn' => 'তানভীর আহমেদ চৌধুরী',
            'applicant_name_en' => 'Tanvir Ahmed Chowdhury',
            'father_name_bn' => 'মোস্তফা কামাল চৌধুরী',
            'father_name_en' => 'Mostafa Kamal Chowdhury',
            'mother_name_bn' => 'সালমা বেগম',
            'mother_name_en' => 'Salma Begum',
            'guardian_name' => 'মোস্তফা কামাল চৌধুরী',
            'guardian_relation' => 'পিতা',
            'guardian_phone' => '01711223344',
            'nid_number' => '19952678901234567',
            'dob' => '1995-04-15',
            'age' => 29,
            'marital_status' => 'অবিবাহিত',
            'phone' => '01819876543',
            'alt_phone' => '01711223344',
            'email' => 'tanvir.chowdhury95@gmail.com',
            'photo_path' => $samplePhoto,
            'signature_path' => $sampleSig,
            'signature_date' => date('Y-m-d'),
            'present_address' => [
                'house' => 'বাড়ি নং- ১২/এ, ফ্ল্যাট- ৪বি',
                'road' => 'রোড- ৫, ধানমন্ডি',
                'thana' => 'ধানমন্ডি',
                'post_code' => '১২০৫',
                'district' => 'ঢাকা',
                'division' => 'ঢাকা',
            ],
            'permanent_address' => [
                'house' => 'চৌধুরী ভিলা, পোস্ট অফিস পাড়া',
                'road' => 'মেইন রোড, গ্রাম: চন্দনপুরা',
                'thana' => 'কোতোয়ালী',
                'post_code' => '৪০০০',
                'district' => 'চট্টগ্রাম',
                'division' => 'চট্টগ্রাম',
            ],
            'education_history' => [
                ['degree' => 'মাস্টার্স / এমবিএ', 'result' => 'সিজিপিএ ৩.৬৫', 'passing_year' => '২০১৯', 'subject' => 'মার্কেটিং ও বিজনেস', 'board' => 'ঢাকা বিশ্ববিদ্যালয়'],
                ['degree' => 'স্নাতক (সম্মান)', 'result' => 'সিজিপিএ ৩.৫৮', 'passing_year' => '২০১৭', 'subject' => 'ব্যবস্থাপনা', 'board' => 'ঢাকা বিশ্ববিদ্যালয়'],
                ['degree' => 'এইচএসসি (ব্যবসায় শিক্ষা)', 'result' => 'জিপিএ ৫.০০', 'passing_year' => '২০১৩', 'subject' => 'ব্যবসায় শিক্ষা', 'board' => 'ঢাকা'],
            ],
            'training_history' => [
                ['sl' => '১', 'subject' => 'ডিজিটাল উদ্যোক্তা ও সাপ্লাই চেইন', 'institute' => 'বিডা (BIDA)', 'duration' => '১ মাস', 'completion_date' => '2023-08-15'],
                ['sl' => '২', 'subject' => 'অ্যাগ্রো ফুড প্রসেসিং ও কোয়ালিটি কন্ট্রোল', 'institute' => 'বিসিক (BSCIC)', 'duration' => '৩ সপ্তাহ', 'completion_date' => '2024-02-10'],
            ],
            'experience_history' => [
                ['sl' => '১', 'organization' => 'অর্গানিক ফার্মস লিমিটেড', 'designation' => 'অপারেশন সুপারভাইজার', 'duration' => '২ বছর', 'type' => 'ফুড প্রসেসিং ও কোয়ালিটি কন্ট্রোল'],
            ],
            'info_source' => 'Facebook/Social Media এর মাধ্যমে',
            'idea_description' => 'স্থানীয়ভাবে উৎপাদিত সম্পূর্ণ প্রাকৃতিক ও প্রিজারভেটিভমুক্ত মধু, কোল্ড প্রেসড সরিষার তেল এবং জৈব খাদ্যশস্য আধুনিক স্বাস্থ্যসম্মত প্যাকেজিংয়ে বাণিজ্যিকীকরণ।',
            'business_start_timeline' => '৩ মাসের মধ্যে',
            'capital_financing_plan' => 'মোট প্রাক্কলিত মূলধন ১৫,০০,০০০ টাকা। এর মধ্যে উদ্যোক্তার নিজস্ব সঞ্চয় ৫,০০,০০০ টাকা এবং এসএমই উদ্যোক্তা রিফাইন্যান্সিং থেকে ১০,০০,০০০ টাকা সংগ্রহের পরিকল্পনা।',
            'business_category' => 'ম্যানুফেকচারিং',
            'business_category_details' => 'অ্যাগ্রো ফুড প্রসেসিং, ন্যাচারাল অয়েল মিলিং ও কোল্ড প্রেস রিফাইনিং',
            'expected_location' => 'কেরানীগঞ্জ, ঢাকা (বিসিক শিল্প এলাকা)',
            'product_type' => 'আমদানির বিকল্প পণ্য',
            'market_scope' => 'অভ্যন্তরীণ ও আন্তর্জাতিক (রপ্তানি সম্ভাবনাময়)',
            'ongoing_business_details' => 'বর্তমানে সীমিত পরিসরে প্রি-অর্ডারের মাধ্যমে অনলাইনে পরীক্ষামূলকভাবে পণ্য সরবরাহ করা হচ্ছে।',
            'plan_expand_employees' => 'হ্যাঁ, ব্যবসায় সম্প্রসারণের প্রাথমিক বছরে অন্তত ৬ জন দক্ষ ও ৪ জন অদক্ষ কর্মী নিয়োগের পরিকল্পনা রয়েছে।',
            'plan_increase_financial_involvement' => 'হ্যাঁ, উৎপাদন বৃদ্ধির সাথে সাথে কার্যকারী মূলধন (Working Capital) ক্রমান্বয়ে বৃদ্ধি করা হবে।',
            'way_to_increase_finance' => 'ব্যাংক অর্থায়ন, বাংলাদেশ ব্যাংকের উদ্যোক্তা রিফাইন্যান্স স্কিম এবং অংশীদারী বিনিয়োগের মাধ্যমে।',
            'plan_product_quality_change' => 'বিএসটিআই এবং হালাল সার্টিফিকেশন অর্জনের মাধ্যমে আন্তর্জাতিক মানের পণ্য সরবরাহ নিশ্চিত করা হবে।',
            'plan_maintain_financial_records' => 'হ্যাঁ, আধুনিক ক্লাউড পিওএস ও অ্যাকাউন্টিং সফটওয়্যারের মাধ্যমে দৈনিক আয়-ব্যয় এবং মাসিক লাভ-ক্ষতির পূর্ণ বিবরণ সংরক্ষণ করা হবে।',
            'existing_business_type' => 'ন্যাচারাল ফুড প্রসেসিং ও রিটেইল',
            'has_trade_license' => true,
            'trade_license_date' => '2023-11-20',
            'avg_selling_price' => '450.00',
            'daily_sales_amount' => '18000.00',
            'monthly_sales_amount' => '540000.00',
            'monthly_raw_operational_cost' => '360000.00',
            'monthly_estimated_profit' => 180000.00,
            'business_involvement_reason' => 'পারিবারিক কৃষি পটভূমি ও বিশ্ববিদ্যালয়ে পড়ার সময় থেকেই নিরাপদ খাদ্যের বিশাল বাজার চাহিদা পর্যবেক্ষণ করে এই ব্যবসায় সম্পৃক্ত হওয়ার আগ্রহ জন্মায়।',
            'total_investment_amount' => '1500000.00',
            'raw_material_source' => 'সরাসরি চাষী ও মানিকগঞ্জ, টাঙ্গাইল ও সুন্দরবনের মৌয়ালদের থেকে সরাসরি কাঁচামাল সংগ্রহ।',
            'potential_buyers' => 'সচেতন নগরবাসী, সুপারশপ (স্বপ্ন, ইউনিমার্ট), কর্পোরেট ক্লায়েন্ট ও সাধারণ পরিবার।',
            'competitor_names' => 'খাস ফুড, প্রাকৃত ফুডস, অর্গানিক বিডি',
            'competitor_analysis' => [
                [
                    'name' => 'প্রতিযোগী প্রতিষ্ঠান- ১ (খাস ফুড)',
                    'address' => 'ঢাকা ও দেশব্যাপী আউটলেট',
                    'strengths' => 'শক্তিশালী ব্র্যান্ড পরিচিতি ও রিটেইল চেইন নেটওয়ার্ক',
                    'weaknesses' => 'পণ্যের উচ্চ মূল্য এবং নির্দিষ্ট কিছু অঞ্চলে হোম ডেলিভারি ধীরগতির',
                ],
                [
                    'name' => 'প্রতিযোগী প্রতিষ্ঠান- ২ (প্রাকৃত ফুডস)',
                    'address' => 'উত্তরা, ঢাকা',
                    'strengths' => 'প্রিমিয়াম কোয়ালিটি ও ভালো কাস্টমার সার্ভিস',
                    'weaknesses' => 'সীমিত উৎপাদন সক্ষমতা এবং প্রমোশনের অপ্রতুলতা',
                ],
                [
                    'name' => 'প্রতিযোগী প্রতিষ্ঠান- ৩ (স্থানীয় বাজার)',
                    'address' => 'কারওয়ান বাজার ও পাইকারি মার্কেট',
                    'strengths' => 'সহজপ্রাপ্যতা ও কম মূল্য',
                    'weaknesses' => 'ভেজাল ও গুণগত মানের নিশ্চয়তাহীনতা',
                ],
            ],
            'family_earning_members_count' => 2,
            'family_monthly_income' => 95000.00,
            'family_monthly_expense' => 55000.00,
            'family_past_business_experience' => 'পারিবারিক কৃষিজ পণ্য বিপণনের ১৫ বছরের বাস্তব অভিজ্ঞতা রয়েছে।',
            'has_bank_account' => true,
            'bank_name' => 'ইসলামী ব্যাংক বাংলাদেশ পিএলসি',
            'bank_branch' => 'ধানমন্ডি শাখা, ঢাকা',
            'account_no' => '20501450200891234',
            'bank_relation_duration' => '৫ বছর',
            'has_other_loan' => false,
            'status' => 'approved',
            'extra_attachments' => [
                ['title' => 'জাতীয় পরিচয়পত্র (NID) রঙিন স্ক্যান কপি', 'file_path' => null],
                ['title' => 'হালনাগাদ ট্রেড লাইসেন্স কপি (২০২৩-২৪)', 'file_path' => null],
                ['title' => 'শিক্ষাগত যোগ্যতার মূল সনদের কপি', 'file_path' => null],
                ['title' => 'বিডা উদ্যোক্তা প্রশিক্ষণ সার্টিফিকেট', 'file_path' => null],
            ],
        ];
    }

    /**
     * Display full applicant profile and verification console for admins.
     */
    public function profile($tracking_number)
    {
        $report = BusinessFeasibilityReport::with('reviewer')
            ->where('tracking_number', $tracking_number)
            ->orWhere('id', $tracking_number)
            ->firstOrFail();

        return Inertia::render('Sicip/ApplicantProfile', [
            'report' => $report,
        ]);
    }

    /**
     * Update application status and admin review notes.
     */
    public function updateStatus(Request $request, $id)
    {
        $report = BusinessFeasibilityReport::findOrFail($id);

        $request->validate([
            'status' => 'required|string|in:draft,submitted,under_review,approved,rejected',
            'admin_notes' => 'nullable|string|max:5000',
        ]);

        $report->update([
            'status' => $request->input('status'),
            'admin_notes' => $request->input('admin_notes'),
            'reviewed_at' => now(),
            'reviewer_id' => auth()->id(),
        ]);

        return redirect()->back()->with('success', 'আবেদনের স্ট্যাটাস ও অ্যাডমিন নোট সফলভাবে আপডেট করা হয়েছে!');
    }

    /**
     * Delete an application.
     */
    public function destroy($id)
    {
        $report = BusinessFeasibilityReport::findOrFail($id);
        $report->delete();

        return redirect()->route('sicip.index')->with('success', 'আবেদনটি সফলভাবে মুছে ফেলা হয়েছে।');
    }
}

