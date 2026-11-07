<?php

namespace Database\Seeders;

use App\Models\BusinessFeasibilityReport;
use Illuminate\Database\Seeder;

class SicipReportSeeder extends Seeder
{
    public function run(): void
    {
        BusinessFeasibilityReport::firstOrCreate(
            ['tracking_number' => 'SICIP-DEMO-2026'],
            [
                'submission_date' => '2026-11-07',
                'status' => 'submitted',
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
                    [
                        'degree' => 'মাস্টার্স / এমবিএ',
                        'result' => 'সিজিপিএ ৩.৬৫',
                        'passing_year' => '২০১৯',
                        'subject' => 'মার্কেটিং ও বিজনেস',
                        'board' => 'ঢাকা বিশ্ববিদ্যালয়',
                    ],
                    [
                        'degree' => 'স্নাতক (সম্মান)',
                        'result' => 'সিজিপিএ ৩.৫৮',
                        'passing_year' => '২০১৭',
                        'subject' => 'ব্যবস্থাপনা',
                        'board' => 'ঢাকা বিশ্ববিদ্যালয়',
                    ]
                ],
                'training_history' => [
                    [
                        'sl' => '১',
                        'subject' => 'ডিজিটাল উদ্যোক্তা ও সাপ্লাই চেইন',
                        'institute' => 'বিডা (BIDA)',
                        'duration' => '১ মাস',
                        'completion_date' => '2023-08-15',
                    ]
                ],
                'experience_history' => [
                    [
                        'sl' => '১',
                        'organization' => 'অর্গানিক ফার্মস লিমিটেড',
                        'designation' => 'অপারেশন সুপারভাইজার',
                        'duration' => '২ বছর',
                        'type' => 'ফুড প্রসেসিং',
                    ]
                ],
                'info_source' => 'Facebook/Social Media এর মাধ্যমে',
                'idea_description' => 'প্রাকৃতিক ও প্রিজারভেটিভমুক্ত মধু, সরিষার তেল ও খাদ্যশস্য প্রক্রিয়াজাতকরণ এবং আধুনিক পরিবেশবান্ধব প্যাকেজিংয়ে বাজারজাতকরণ।',
                'business_start_timeline' => '৩ মাসের মধ্যে',
                'capital_financing_plan' => 'মোট প্রাক্কলিত মূলধন ১৫ লক্ষ টাকা (নিজস্ব ৫ লক্ষ, এসএমই ঋণ ১০ লক্ষ)।',
                'business_category' => 'ম্যানুফেকচারিং',
                'business_category_details' => 'এগ্রো ফুড প্রসেসিং ও প্যাকেজিং',
                'expected_location' => 'কেরানীগঞ্জ, ঢাকা (বিসিক শিল্প এলাকা)',
                'product_type' => 'আমদানির বিকল্প পণ্য',
                'market_scope' => 'অভ্যন্তরীণ ও রপ্তানি সম্ভাবনাময়',
                'ongoing_business_details' => 'বর্তমানে সীমিত পরিসরে প্রি-অর্ডারের মাধ্যমে অনলাইনে পরীক্ষামূলকভাবে পণ্য সরবরাহ করা হচ্ছে।',
                'plan_expand_employees' => 'হ্যাঁ, ব্যবসায় সম্প্রসারণের প্রাথমিক বছরে অন্তত ৬ জন কর্মী নিয়োগের পরিকল্পনা রয়েছে।',
                'plan_increase_financial_involvement' => 'হ্যাঁ, উৎপাদন বৃদ্ধির সাথে সাথে কার্যকারী মূলধন ক্রমান্বয়ে বৃদ্ধি করা হবে।',
                'way_to_increase_finance' => 'ব্যাংক অর্থায়ন ও বাংলাদেশ ব্যাংকের উদ্যোক্তা রিফাইন্যান্স স্কিমের মাধ্যমে।',
                'plan_product_quality_change' => 'বিএসটিআই এবং হালাল সার্টিফিকেশন অর্জনের মাধ্যমে আন্তর্জাতিক মানের পণ্য সরবরাহ নিশ্চিত করা হবে।',
                'plan_maintain_financial_records' => 'হ্যাঁ, আধুনিক অ্যাকাউন্টিং সফটওয়্যারের মাধ্যমে দৈনিক লেনদেনের হিসাব সংরক্ষণ করা হবে।',
                'existing_business_type' => 'ন্যাচারাল ফুড প্রসেসিং ও রিটেইল',
                'has_trade_license' => true,
                'trade_license_date' => '2023-11-20',
                'avg_selling_price' => 450.00,
                'daily_sales_amount' => 18000.00,
                'monthly_sales_amount' => 540000.00,
                'monthly_raw_operational_cost' => 360000.00,
                'monthly_estimated_profit' => 180000.00,
                'business_involvement_reason' => 'পারিবারিক কৃষি পটভূমি ও নিরাপদ খাদ্যের বিশাল বাজার চাহিদা পর্যবেক্ষণ করে এই ব্যবসায় সম্পৃক্ত হওয়ার আগ্রহ।',
                'total_investment_amount' => 1500000.00,
                'raw_material_source' => 'সরাসরি চাষী ও সুন্দরবনের মৌয়ালদের থেকে সরাসরি কাঁচামাল সংগ্রহ।',
                'potential_buyers' => 'সচেতন নগরবাসী, সুপারশপ এবং কর্পোরেট পরিবারবর্গ।',
                'competitor_names' => 'খাস ফুড, প্রাকৃত ফুডস, অর্গানিক বিডি',
                'marketing_area' => 'ঢাকা মহানগরী এবং সারা দেশব্যাপী অনলাইন ডেলিভারি।',
                'competitor_analysis' => [
                    [
                        'sl' => '১',
                        'name' => 'খাস ফুড লিমিটেড',
                        'location' => 'মিরপুর, ঢাকা',
                        'daily_production' => '১০০০ কেজি',
                        'daily_sales' => '৯০০ কেজি',
                        'price' => '৫০০ টাকা',
                        'customer_count' => '৫০০০০+',
                        'coverage' => 'সারা বাংলাদেশ',
                    ],
                    [
                        'sl' => '২',
                        'name' => 'প্রাকৃত এগ্রো',
                        'location' => 'উত্তরা, ঢাকা',
                        'daily_production' => '৩০০ কেজি',
                        'daily_sales' => '২৫০ কেজি',
                        'price' => '৪৮০ টাকা',
                        'customer_count' => '১২০০০+',
                        'coverage' => 'ঢাকা ও চট্টগ্রাম',
                    ],
                    [
                        'sl' => '৩',
                        'name' => 'ন্যাচারাল হারভেস্ট',
                        'location' => 'ধানমন্ডি',
                        'daily_production' => '১৫০ কেজি',
                        'daily_sales' => '১৩০ কেজি',
                        'price' => '৫২০ টাকা',
                        'customer_count' => '৫০০০',
                        'coverage' => 'ঢাকা সেন্ট্রাল',
                    ],
                ],
                'reason_buyers_choose_you' => 'সরাসরি কৃষক থেকে সংগৃহীত ভেজালমুক্ত গ্যারান্টিযুক্ত পণ্য ও সাশ্রয়ী মূল্য।',
                'price_and_quality_difference' => '১০০% ফুড গ্রেড গ্লাস জার প্যাকেজিং এবং মধ্যস্বত্বভোগী না থাকায় ১০-১৫% কম মূল্য।',
                'existing_business_challenges' => 'পর্যাপ্ত কার্যকরী মূলধনের সংকট ও মৌসুমি কাঁচামালের দামের ওঠানামা।',
                'training_participation_reason' => 'বাংলাদেশ ব্যাংক ও SICIP এর প্রশিক্ষণ গ্রহণের মাধ্যমে অ্যাকাউন্টিং, আর্থিক ব্যবস্থাপনা ও ব্যাংক ঋণের শর্তাবলী যথাযথভাবে রপ্ত করে সফল উদ্যোক্তা হওয়া।',
                'father_education' => 'স্নাতক (বিএ)',
                'father_occupation' => 'অবসরপ্রাপ্ত কর্মকর্তা',
                'mother_education' => 'এইচএসসি',
                'mother_occupation' => 'গৃহিণী',
                'family_monthly_income' => 85000.00,
                'has_own_house' => true,
                'siblings_count' => 2,
                'physical_disability' => 'না',
                'bank_account_number' => '20501234567890',
                'bank_and_branch_name' => 'ইসলামী ব্যাংক বাংলাদেশ পিএলসি, ধানমন্ডি শাখা',
                'bank_routing_number' => '125261458',
                'signature_date' => '2026-11-07',
            ]
        );
    }
}

