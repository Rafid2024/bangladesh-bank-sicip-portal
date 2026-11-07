import React, { useState, useEffect } from 'react';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import { 
  Building2, 
  User, 
  FileText, 
  DollarSign, 
  Upload, 
  Plus, 
  Trash2, 
  Printer, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Layers,
  HelpCircle,
  Eye,
  Check,
  X,
  Save,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ShieldCheck,
  ZoomIn,
  ZoomOut,
  ExternalLink,
  Download,
  LogOut
} from 'lucide-react';
import {
  BANGLADESH_DIVISIONS,
  BANGLADESH_DISTRICTS_BY_DIVISION,
  POPULAR_THANAS_BY_DISTRICT,
  EDUCATION_LEVELS,
  EDUCATION_RESULTS,
  EDUCATION_SUBJECTS,
  getSubjectsForDegree,
  EDUCATION_BOARDS,
  PASSING_YEARS,
  BUSINESS_START_TIMELINES,
  BUSINESS_CATEGORIES,
  WAYS_TO_INCREASE_FINANCE,
  EXISTING_BUSINESS_TYPES,
  PRODUCT_TYPES,
  PRODUCT_MARKET_SCOPES,
  PARENTS_EDUCATION_LEVELS,
  FATHER_OCCUPATIONS,
  MOTHER_OCCUPATIONS,
  DISABILITY_OPTIONS
} from '../../Constants/sicipOptions';
import SampleDemoPdfModal from './SampleDemoPdfModal';
import { toBengaliNumber } from '../../Utils/banglaUtils';

const Required = () => (
  <span className="text-rose-500 font-bold ml-1 text-sm inline-block" title="বাধ্যতামূলক (Required)">*</span>
);

export default function FeasibilityReportForm({ initialReport = null, submittedReport = null }) {
  const { settings = {}, auth = {} } = usePage().props;
  const [activeTab, setActiveTab] = useState('part1');
  const [viewMode, setViewMode] = useState('interactive'); // 'interactive' or 'document'
  const [sameAsPresent, setSameAsPresent] = useState(false);
  const [missingFields, setMissingFields] = useState([]);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [showSampleDemoModal, setShowSampleDemoModal] = useState(false);
  const [pdfZoom, setPdfZoom] = useState(1);
  const [activePdfPage, setActivePdfPage] = useState(1);
  const [isDraftSaving, setIsDraftSaving] = useState(false);

  // File preview states (prepopulate from initialReport if available)
  const [photoPreview, setPhotoPreview] = useState(initialReport?.photo_path ? `/storage/${initialReport.photo_path}` : null);
  const [nidPreview, setNidPreview] = useState(initialReport?.nid_attachment_path ? `/storage/${initialReport.nid_attachment_path}` : null);
  const [tradePreview, setTradePreview] = useState(initialReport?.trade_license_attachment_path ? `/storage/${initialReport.trade_license_attachment_path}` : null);
  const [eduPreview, setEduPreview] = useState(initialReport?.education_certificate_path ? `/storage/${initialReport.education_certificate_path}` : null);
  const [sigPreview, setSigPreview] = useState(initialReport?.signature_path ? `/storage/${initialReport.signature_path}` : null);

  const todayDateString = new Date().toISOString().split('T')[0];
  const [tYear, tMonth, tDay] = todayDateString.split('-');
  const banglaMonths = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
  const formattedTodayBangla = `${toBengaliNumber(tDay)} ${banglaMonths[parseInt(tMonth, 10) - 1]} ${toBengaliNumber(tYear)}`;

  const { data, setData, post, processing, errors, reset, transform } = useForm({
    report_id: initialReport?.id || '',
    tracking_number: initialReport?.tracking_number || '',
    save_action: 'submit',
    submission_date: todayDateString,

    // Part I: Personal Info
    applicant_name_bn: initialReport?.applicant_name_bn || '',
    applicant_name_en: initialReport?.applicant_name_en || auth?.user?.name || '',
    father_name_bn: initialReport?.father_name_bn || '',
    father_name_en: initialReport?.father_name_en || '',
    mother_name_bn: initialReport?.mother_name_bn || '',
    mother_name_en: initialReport?.mother_name_en || '',
    guardian_name: initialReport?.guardian_name || '',
    guardian_relation: initialReport?.guardian_relation || '',
    guardian_phone: initialReport?.guardian_phone || '',
    nid_number: initialReport?.nid_number || '',
    dob: initialReport?.dob || '',
    age: initialReport?.age || '',
    marital_status: initialReport?.marital_status || 'অবিবাহিত',
    phone: initialReport?.phone || auth?.user?.phone || '',
    alt_phone: initialReport?.alt_phone || '',
    email: initialReport?.email || (auth?.user?.email && !auth?.user?.email.includes('@applicant.sicip.gov.bd') ? auth?.user?.email : ''),

    // Addresses
    present_address: initialReport?.present_address || {
      house: '',
      road: '',
      thana: '',
      post_code: '',
      district: '',
      division: '',
    },
    permanent_address: initialReport?.permanent_address || {
      house: '',
      road: '',
      thana: '',
      post_code: '',
      district: '',
      division: '',
    },

    // Dynamic Lists (Part I)
    education_history: (initialReport?.education_history && initialReport.education_history.length > 0)
      ? initialReport.education_history
      : [{ degree: '', result: '', passing_year: '', subject: '', board: '' }],
    training_history: (initialReport?.training_history && initialReport.training_history.length > 0)
      ? initialReport.training_history
      : [{ sl: '১', subject: '', institute: '', duration: '', completion_date: '' }],
    experience_history: (initialReport?.experience_history && initialReport.experience_history.length > 0)
      ? initialReport.experience_history
      : [{ sl: '১', organization: '', designation: '', duration: '', type: '' }],
    info_source: initialReport?.info_source || 'Facebook/Social Media এর মাধ্যমে',

    // Part II: Idea & Business Plan
    idea_description: initialReport?.idea_description || '',
    business_start_timeline: initialReport?.business_start_timeline || '৩ মাসের মধ্যে',
    capital_financing_plan: initialReport?.capital_financing_plan || '',
    business_category: initialReport?.business_category || 'ম্যানুফেকচারিং',
    business_category_details: initialReport?.business_category_details || '',
    expected_location: initialReport?.expected_location || '',
    product_type: initialReport?.product_type || 'আমদানির বিকল্প পণ্য',
    market_scope: initialReport?.market_scope || 'অভ্যন্তরীণ',

    ongoing_business_details: initialReport?.ongoing_business_details || '',
    plan_expand_employees: initialReport?.plan_expand_employees || 'হ্যাঁ, ব্যবসায় সম্প্রসারণের সাথে নতুন কর্মী নিয়োগ করা হবে',
    plan_increase_financial_involvement: initialReport?.plan_increase_financial_involvement || 'হ্যাঁ, পর্যায়ক্রমে মূলধন বৃদ্ধি করা হবে',
    way_to_increase_finance: initialReport?.way_to_increase_finance || '',
    plan_product_quality_change: initialReport?.plan_product_quality_change || 'হ্যাঁ, আধুনিক প্রযুক্তির মাধ্যমে পণ্যের মান উন্নত করা হবে',
    plan_maintain_financial_records: initialReport?.plan_maintain_financial_records || 'হ্যাঁ, অ্যাকাউন্টিং সফটওয়্যার বা নিয়মিত খতিয়ান সংরক্ষণ করা হবে',

    // Part III: Business Feasibility Financials
    existing_business_type: initialReport?.existing_business_type || '',
    has_trade_license: initialReport?.has_trade_license || false,
    trade_license_date: initialReport?.trade_license_date || '',
    avg_selling_price: initialReport?.avg_selling_price || '',
    daily_sales_amount: initialReport?.daily_sales_amount || '',
    monthly_sales_amount: initialReport?.monthly_sales_amount || '',
    monthly_raw_operational_cost: initialReport?.monthly_raw_operational_cost || '',
    monthly_estimated_profit: initialReport?.monthly_estimated_profit || '',
    business_involvement_reason: initialReport?.business_involvement_reason || '',
    total_investment_amount: initialReport?.total_investment_amount || '',
    raw_material_source: initialReport?.raw_material_source || '',
    potential_buyers: initialReport?.potential_buyers || '',
    competitor_names: initialReport?.competitor_names || '',
    marketing_area: initialReport?.marketing_area || '',
    
    // Competitor Analysis Table
    competitor_analysis: (initialReport?.competitor_analysis && initialReport.competitor_analysis.length > 0)
      ? initialReport.competitor_analysis
      : [
          { sl: '১', name: '', location: '', daily_production: '', daily_sales: '', price: '', customer_count: '', coverage: '' },
          { sl: '২', name: '', location: '', daily_production: '', daily_sales: '', price: '', customer_count: '', coverage: '' },
          { sl: '৩', name: '', location: '', daily_production: '', daily_sales: '', price: '', customer_count: '', coverage: '' },
        ],
    reason_buyers_choose_you: initialReport?.reason_buyers_choose_you || '',
    price_and_quality_difference: initialReport?.price_and_quality_difference || '',
    existing_business_challenges: initialReport?.existing_business_challenges || '',
    training_participation_reason: initialReport?.training_participation_reason || '',

    // Part IV: Family & Banking
    father_education: initialReport?.father_education || '',
    father_occupation: initialReport?.father_occupation || '',
    mother_education: initialReport?.mother_education || '',
    mother_occupation: initialReport?.mother_occupation || '',
    family_monthly_income: initialReport?.family_monthly_income || '',
    has_own_house: initialReport?.has_own_house !== undefined ? initialReport.has_own_house : true,
    siblings_count: initialReport?.siblings_count || '২',
    physical_disability: initialReport?.physical_disability || 'না',

    bank_account_number: initialReport?.bank_account_number || '',
    bank_and_branch_name: initialReport?.bank_and_branch_name || '',
    bank_routing_number: initialReport?.bank_routing_number || '',

    // File attachments
    photo: null,
    nid_doc: null,
    trade_license_doc: null,
    education_doc: null,
    signature: null,
    signature_date: todayDateString,
    extra_attachments: initialReport?.extra_attachments || [],
  });

  // Calculate age from DOB
  useEffect(() => {
    if (data.dob) {
      const birthDate = new Date(data.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setData('age', age > 0 ? age : '');
    }
  }, [data.dob]);

  // Calculate monthly estimated profit
  useEffect(() => {
    const sales = parseFloat(data.monthly_sales_amount) || 0;
    const costs = parseFloat(data.monthly_raw_operational_cost) || 0;
    if (sales > 0 || costs > 0) {
      const profit = sales - costs;
      setData('monthly_estimated_profit', profit >= 0 ? profit : 0);
    }
  }, [data.monthly_sales_amount, data.monthly_raw_operational_cost]);

  // Check for ?demo=1 in URL to pre-fill sample demo data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('demo') === '1' || urlParams.get('demo') === 'true') {
        populateSampleData();
      }
    }
  }, []);

  // Sync addresses if checked
  const handleSameAsPresent = (e) => {
    const isChecked = e.target.checked;
    setSameAsPresent(isChecked);
    if (isChecked) {
      setData('permanent_address', { ...data.present_address });
    }
  };

  // Helpers for missing field highlighting
  const isMissing = (fieldName) => missingFields.some(m => m.field === fieldName);
  const clearMissing = (fieldName) => {
    setMissingFields(prev => prev.filter(m => m.field !== fieldName));
  };

  // Helper to generate realistic sample canvas image/signature for demo testing
  const createSampleFile = (text, filename, isSignature = false) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = isSignature ? 320 : 240;
      canvas.height = isSignature ? 110 : 300;
      const ctx = canvas.getContext('2d');
      if (isSignature) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#1e3a8a';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(30, 65);
        ctx.bezierCurveTo(70, 20, 110, 85, 160, 45);
        ctx.bezierCurveTo(190, 25, 230, 75, 280, 50);
        ctx.stroke();
        ctx.fillStyle = '#1e3a8a';
        ctx.font = 'italic 16px sans-serif';
        ctx.fillText(text, 50, 92);
      } else {
        ctx.fillStyle = '#065f46';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(120, 105, 52, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(120, 270, 95, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ecfdf5';
        ctx.font = 'bold 15px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(text, 120, 220);
      }
      const dataUrl = canvas.toDataURL('image/png');
      const arr = dataUrl.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const file = new File([u8arr], filename, { type: mime });
      return { file, dataUrl };
    } catch (e) {
      return { file: null, dataUrl: null };
    }
  };

  // Populate realistic sample demo data for quick testing
  const populateSampleData = () => {
    const samplePhoto = createSampleFile('তানভীর আহমেদ', 'tanvir_photo.png', false);
    const sampleSig = createSampleFile('Tanvir A. Chowdhury', 'tanvir_signature.png', true);

    if (samplePhoto.dataUrl) setPhotoPreview(samplePhoto.dataUrl);
    if (sampleSig.dataUrl) setSigPreview(sampleSig.dataUrl);
    setMissingFields([]);

    setData({
      ...data,
      photo: samplePhoto.file,
      signature: sampleSig.file,
      applicant_name_bn: 'তানভীর আহমেদ চৌধুরী',
      applicant_name_en: 'Tanvir Ahmed Chowdhury',
      father_name_bn: 'মোস্তফা কামাল চৌধুরী',
      father_name_en: 'Mostafa Kamal Chowdhury',
      mother_name_bn: 'সালমা বেগম',
      mother_name_en: 'Salma Begum',
      guardian_name: 'মোস্তফা কামাল চৌধুরী',
      guardian_relation: 'পিতা',
      guardian_phone: '01711223344',
      nid_number: '19952678901234567',
      dob: '1995-04-15',
      age: 29,
      marital_status: 'অবিবাহিত',
      phone: '01819876543',
      alt_phone: '01711223344',
      email: 'tanvir.chowdhury95@gmail.com',

      present_address: {
        house: 'বাড়ি নং- ১২/এ, ফ্ল্যাট- ৪বি',
        road: 'রোড- ৫, ধানমন্ডি',
        thana: 'ধানমন্ডি',
        post_code: '১২০৫',
        district: 'ঢাকা',
        division: 'ঢাকা',
      },
      permanent_address: {
        house: 'চৌধুরী ভিলা, পোস্ট অফিস পাড়া',
        road: 'মেইন রোড, গ্রাম: চন্দনপুরা',
        thana: 'কোতোয়ালী',
        post_code: '৪০০০',
        district: 'চট্টগ্রাম',
        division: 'চট্টগ্রাম',
      },

      education_history: [
        { degree: 'মাস্টার্স / এমবিএ', result: 'সিজিপিএ ৩.৬৫', passing_year: '২০১৯', subject: 'মার্কেটিং ও বিজনেস', board: 'ঢাকা বিশ্ববিদ্যালয়' },
        { degree: 'স্নাতক (সম্মান)', result: 'সিজিপিএ ৩.৫৮', passing_year: '২০১৭', subject: 'ব্যবস্থাপনা', board: 'ঢাকা বিশ্ববিদ্যালয়' }
      ],
      training_history: [
        { sl: '১', subject: 'ডিজিটাল উদ্যোক্তা ও সাপ্লাই চেইন', institute: 'বিডা (BIDA)', duration: '১ মাস', completion_date: '2023-08-15' },
        { sl: '২', subject: 'অ্যাগ্রো ফুড প্রসেসিং ও কোয়ালিটি কন্ট্রোল', institute: 'বিসিক (BSCIC)', duration: '৩ সপ্তাহ', completion_date: '2024-02-10' }
      ],
      experience_history: [
        { sl: '১', organization: 'অর্গানিক ফার্মস লিমিটেড', designation: 'অপারেশন সুপারভাইজার', duration: '২ বছর', type: 'ফুড প্রসেসিং' }
      ],
      info_source: 'Facebook/Social Media এর মাধ্যমে',

      idea_description: 'স্থানীয়ভাবে উৎপাদিত সম্পূর্ণ প্রাকৃতিক ও প্রিজারভেটিভমুক্ত মধু, সরিষার তেল এবং খাদ্যশস্য প্রক্রিয়াজাতকরণ ও আধুনিক পরিবেশবান্ধব প্যাকেজিংয়ে বাজারজাতকরণ।',
      business_start_timeline: '৩ মাসের মধ্যে',
      capital_financing_plan: 'মোট প্রাক্কলিত মূলধন ১৫,০০,০০০ টাকা। এর মধ্যে নিজস্ব সঞ্চয় ৫,০০,০০০ টাকা এবং এসএমই ঋণ/উদ্যোক্তা রিফাইন্যান্সিং থেকে ১০,০০,০০০ টাকা অর্থায়নের পরিকল্পনা।',
      business_category: 'ম্যানুফেকচারিং',
      business_category_details: 'অ্যাগ্রো ফুড প্রসেসিং, ন্যাচারাল অয়েল মিলিং ও কোল্ড প্রেস রিফাইনিং',
      expected_location: 'কেরানীগঞ্জ, ঢাকা (বিসিক শিল্প এলাকা)',
      product_type: 'আমদানির বিকল্প পণ্য',
      market_scope: 'অভ্যন্তরীণ ও রপ্তানি সম্ভাবনাময়',

      ongoing_business_details: 'বর্তমানে সীমিত পরিসরে প্রি-অর্ডারের মাধ্যমে অনলাইনে পরীক্ষামূলকভাবে পণ্য সরবরাহ করা হচ্ছে।',
      plan_expand_employees: 'হ্যাঁ, ব্যবসায় সম্প্রসারণের প্রাথমিক বছরে অন্তত ৬ জন দক্ষ ও ৪ জন অদক্ষ কর্মী নিয়োগের পরিকল্পনা রয়েছে।',
      plan_increase_financial_involvement: 'হ্যাঁ, উৎপাদন বৃদ্ধির সাথে সাথে কার্যকারী মূলধন (Working Capital) ক্রমান্বয়ে বৃদ্ধি করা হবে।',
      way_to_increase_finance: 'ব্যাংক অর্থায়ন, বাংলাদেশ ব্যাংকের উদ্যোক্তা রিফাইন্যান্স স্কিম এবং অংশীদারী বিনিয়োগের মাধ্যমে।',
      plan_product_quality_change: 'বিএসটিআই এবং হালাল সার্টিফিকেশন অর্জনের মাধ্যমে আন্তর্জাতিক মানের পণ্য সরবরাহ নিশ্চিত করা হবে।',
      plan_maintain_financial_records: 'হ্যাঁ, আধুনিক ক্লাউড পিওএস ও অ্যাকাউন্টিং সফটওয়্যারের মাধ্যমে দৈনিক আয়-ব্যয় এবং মাসিক লাভ-ক্ষতির পূর্ণ বিবরণ সংরক্ষণ করা হবে।',

      existing_business_type: 'ন্যাচারাল ফুড প্রসেসিং ও রিটেইল',
      has_trade_license: true,
      trade_license_date: '2023-11-20',
      avg_selling_price: '450',
      daily_sales_amount: '18000',
      monthly_sales_amount: '540000',
      monthly_raw_operational_cost: '360000',
      monthly_estimated_profit: 180000,
      business_involvement_reason: 'পারিবারিক কৃষি পটভূমি ও বিশ্ববিদ্যালয়ে পড়ার সময় থেকেই নিরাপদ খাদ্যের বিশাল বাজার চাহিদা পর্যবেক্ষণ করে এই ব্যবসায় সম্পৃক্ত হওয়ার আগ্রহ জন্মায়।',
      total_investment_amount: '1500000',
      raw_material_source: 'সরাসরি চাষী ও মানিকগঞ্জ, টাঙ্গাইল ও সুন্দরবনের মৌয়ালদের থেকে সরাসরি কাঁচামাল সংগ্রহ।',
      potential_buyers: 'সচেতন নগরবাসী, সুপারশপ (স্বপ্ন, ইউনিমার্ট), কর্পোরেট ক্লায়েন্ট ও সাধারণ পরিবার।',
      competitor_names: 'খাস ফুড, প্রাকৃত ফুডস, অর্গানিক বিডি',
      marketing_area: 'ঢাকা মহানগরী এবং অনলাইন ডেলিভারির মাধ্যমে সমগ্র বাংলাদেশ।',

      competitor_analysis: [
        { sl: '১', name: 'খাস ফুড লিমিটেড', location: 'মিরপুর, ঢাকা', daily_production: '১০০০ কেজি', daily_sales: '৯০০ কেজি', price: '৫০০ টাকা', customer_count: '৫০০০০+', coverage: 'সারা বাংলাদেশ' },
        { sl: '২', name: 'প্রাকৃত এগ্রো', location: 'উত্তরা, ঢাকা', daily_production: '৩০০ কেজি', daily_sales: '২৫০ কেজি', price: '৪৮০ টাকা', customer_count: '১২০০০+', coverage: 'ঢাকা ও চট্টগ্রাম' },
        { sl: '৩', name: 'ন্যাচারাল হারভেস্ট', location: 'ধানমন্ডি', daily_production: '১৫০ কেজি', daily_sales: '১৩০ কেজি', price: '৫২০ টাকা', customer_count: '৫০০০', coverage: 'ঢাকা সেন্ট্রাল' },
      ],
      reason_buyers_choose_you: 'সরাসরি কৃষক থেকে সংগৃহীত ভেজালমুক্ত গ্যারান্টিযুক্ত কাঁচামাল, সাশ্রয়ী মূল্য এবং দ্রুততম হোম ডেলিভারি সুবিধা।',
      price_and_quality_difference: 'প্রতিযোগীদের তুলনায় আমাদের প্যাকেজিং ১০০% ফুড গ্রেড কাচের জার এবং উৎপাদন খরচে মধ্যস্বত্বভোগী না থাকায় ১০-১৫% কম মূল্যে সরবরাহ সম্ভব।',
      existing_business_challenges: 'পর্যাপ্ত কার্যকরী মূলধনের অভাব, কাঁচামালের মৌসুমী মূল্য উঠানামা এবং আধুনিক টেস্টিং ল্যাবের সংকট।',
      training_participation_reason: 'বাংলাদেশ ব্যাংক ও এসআইসিআইপি এর প্রশিক্ষণ গ্রহণের মাধ্যমে আধুনিক ব্যবসায়িক ব্যবস্থাপনা, আর্থিক হিসাবরক্ষণ, কমপ্লায়েন্স এবং ব্যাংক ঋণের শর্তাবলী যথাযথভাবে জেনে একজন সফল উদ্যোক্তা হওয়া।',

      father_education: 'স্নাতক (বিএ)',
      father_occupation: 'অবসরপ্রাপ্ত সরকারি কর্মকর্তা',
      mother_education: 'এইচএসসি',
      mother_occupation: 'গৃহিণী',
      family_monthly_income: '85000',
      has_own_house: true,
      siblings_count: '২',
      physical_disability: 'না',

      bank_account_number: '20501234567890',
      bank_and_branch_name: 'ইসলামী ব্যাংক বাংলাদেশ পিএলসি, ধানমন্ডি শাখা',
      bank_routing_number: '125261458',
    });
  };

  const handleFileChange = (field, e, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      setData(field, file);
      clearMissing(field);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(file.name);
      }
    }
  };

  // Add / Remove Row Helpers
  const addEducationRow = () => {
    setData('education_history', [
      ...data.education_history,
      { degree: '', result: '', passing_year: '', subject: '', board: '' }
    ]);
  };
  const removeEducationRow = (index) => {
    const updated = data.education_history.filter((_, i) => i !== index);
    setData('education_history', updated);
  };

  const addTrainingRow = () => {
    setData('training_history', [
      ...data.training_history,
      { sl: `${data.training_history.length + 1}`, subject: '', institute: '', duration: '', completion_date: '' }
    ]);
  };
  const removeTrainingRow = (index) => {
    const updated = data.training_history.filter((_, i) => i !== index);
    setData('training_history', updated);
  };

  const addExperienceRow = () => {
    setData('experience_history', [
      ...data.experience_history,
      { sl: `${data.experience_history.length + 1}`, organization: '', designation: '', duration: '', type: '' }
    ]);
  };
  const removeExperienceRow = (index) => {
    const updated = data.experience_history.filter((_, i) => i !== index);
    setData('experience_history', updated);
  };

  const addCompetitorRow = () => {
    setData('competitor_analysis', [
      ...data.competitor_analysis,
      { sl: `${data.competitor_analysis.length + 1}`, name: '', location: '', daily_production: '', daily_sales: '', price: '', customer_count: '', coverage: '' }
    ]);
  };
  const removeCompetitorRow = (index) => {
    const updated = data.competitor_analysis.filter((_, i) => i !== index);
    setData('competitor_analysis', updated);
  };

  const addExtraAttachment = () => {
    setData('extra_attachments', [
      ...(data.extra_attachments || []),
      { id: Date.now(), title: '', file: null, preview: null }
    ]);
  };

  const removeExtraAttachment = (index) => {
    const updated = (data.extra_attachments || []).filter((_, i) => i !== index);
    setData('extra_attachments', updated);
  };

  const handleExtraFileChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const copy = [...(data.extra_attachments || [])];
      copy[index].file = file;
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          copy[index].preview = reader.result;
          setData('extra_attachments', copy);
        };
        reader.readAsDataURL(file);
      } else {
        copy[index].preview = file.name;
        setData('extra_attachments', copy);
      }
    }
  };

  const handleExtraTitleChange = (index, value) => {
    const copy = [...(data.extra_attachments || [])];
    copy[index].title = value;
    setData('extra_attachments', copy);
  };

  const validateForm = () => {
    const missing = [];

    // Part 1 checks
    if (!data.applicant_name_bn?.trim()) missing.push({ tab: 'part1', field: 'applicant_name_bn', label: 'আবেদনকারীর নাম (বাংলায়)', part: 'পার্ট-১' });
    if (!data.applicant_name_en?.trim()) missing.push({ tab: 'part1', field: 'applicant_name_en', label: 'আবেদনকারীর নাম (ইংরেজিতে)', part: 'পার্ট-১' });
    if (!data.father_name_bn?.trim()) missing.push({ tab: 'part1', field: 'father_name_bn', label: 'পিতার নাম (বাংলায়)', part: 'পার্ট-১' });
    if (!data.mother_name_bn?.trim()) missing.push({ tab: 'part1', field: 'mother_name_bn', label: 'মাতার নাম (বাংলায়)', part: 'পার্ট-১' });

    // NID Validation: must be 10, 13, or 17 digits
    const nidClean = (data.nid_number || '').toString().trim();
    if (!nidClean) {
      missing.push({ tab: 'part1', field: 'nid_number', label: 'জাতীয় পরিচয়পত্র নং (NID)', part: 'পার্ট-১' });
    } else if (!/^\d{10}$|^\d{13}$|^\d{17}$/.test(nidClean)) {
      missing.push({ tab: 'part1', field: 'nid_number', label: 'NID নম্বর ১০, ১৩ বা ১৭ সংখ্যার হতে হবে', part: 'পার্ট-১' });
    }

    if (!data.dob?.trim()) missing.push({ tab: 'part1', field: 'dob', label: 'জন্ম তারিখ', part: 'পার্ট-১' });

    // Phone Validation: must be 11 digits starting with 01
    const phoneClean = (data.phone || '').toString().trim().replace(/[-\s]/g, '');
    if (!phoneClean) {
      missing.push({ tab: 'part1', field: 'phone', label: 'মোবাইল নম্বর', part: 'পার্ট-১' });
    } else if (!/^01[3-9]\d{8}$/.test(phoneClean)) {
      missing.push({ tab: 'part1', field: 'phone', label: 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 018XXXXXXXX)', part: 'পার্ট-১' });
    }

    if (!data.present_address?.division) missing.push({ tab: 'part1', field: 'present_address.division', label: 'বর্তমান ঠিকানা (বিভাগ)', part: 'পার্ট-১' });
    if (!data.present_address?.district) missing.push({ tab: 'part1', field: 'present_address.district', label: 'বর্তমান ঠিকানা (জেলা)', part: 'পার্ট-১' });
    if (!data.present_address?.thana) missing.push({ tab: 'part1', field: 'present_address.thana', label: 'বর্তমান ঠিকানা (উপজেলা/থানা)', part: 'পার্ট-১' });
    if (!data.permanent_address?.division) missing.push({ tab: 'part1', field: 'permanent_address.division', label: 'স্থায়ী ঠিকানা (বিভাগ)', part: 'পার্ট-১' });
    if (!data.permanent_address?.district) missing.push({ tab: 'part1', field: 'permanent_address.district', label: 'স্থায়ী ঠিকানা (জেলা)', part: 'পার্ট-১' });
    if (!data.permanent_address?.thana) missing.push({ tab: 'part1', field: 'permanent_address.thana', label: 'স্থায়ী ঠিকানা (উপজেলা/থানা)', part: 'পার্ট-১' });

    // Photo check
    const hasPhoto = data.photo || photoPreview || initialReport?.photo_path;
    if (!hasPhoto) {
      missing.push({ tab: 'part1', field: 'photo', label: 'পাসপোর্ট সাইজ ছবি আপলোড', part: 'পার্ট-১' });
    }

    // Education check (at least 1 row must have degree selected)
    const hasEdu = data.education_history?.some(edu => edu.degree && edu.degree.trim() !== '');
    if (!hasEdu) {
      missing.push({ tab: 'part1', field: 'education_history', label: 'শিক্ষাগত যোগ্যতা (কমপক্ষে ১টি ডিগ্রি/সনদ)', part: 'পার্ট-১' });
    }

    // Part 2 checks
    if (!data.idea_description?.trim()) missing.push({ tab: 'part2', field: 'idea_description', label: 'ব্যবসায়িক ধারণার সংক্ষিপ্ত বিবরণ', part: 'পার্ট-২' });
    if (!data.business_start_timeline?.trim()) missing.push({ tab: 'part2', field: 'business_start_timeline', label: 'ব্যবসা শুরুর সম্ভাব্য সময়সীমা', part: 'পার্ট-২' });
    if (!data.capital_financing_plan?.trim()) missing.push({ tab: 'part2', field: 'capital_financing_plan', label: 'মূলধন / অর্থায়নের পরিকল্পনা', part: 'পার্ট-২' });
    if (!data.business_category?.trim()) missing.push({ tab: 'part2', field: 'business_category', label: 'ব্যবসায়ের ধরণ', part: 'পার্ট-২' });
    if (!data.expected_location?.trim()) missing.push({ tab: 'part2', field: 'expected_location', label: 'ব্যবসাটির সম্ভাব্য স্থান', part: 'পার্ট-২' });
    if (!data.product_type?.trim()) missing.push({ tab: 'part2', field: 'product_type', label: 'পণ্যের ধরণ', part: 'পার্ট-২' });
    if (!data.market_scope?.trim()) missing.push({ tab: 'part2', field: 'market_scope', label: 'বাজার পরিধি', part: 'পার্ট-২' });

    // Part 3 checks
    if (!data.avg_selling_price?.toString().trim()) missing.push({ tab: 'part3', field: 'avg_selling_price', label: 'সম্ভাব্য গড় বিক্রয় মূল্য', part: 'পার্ট-৩' });
    if (!data.daily_sales_amount?.toString().trim()) missing.push({ tab: 'part3', field: 'daily_sales_amount', label: 'দৈনিক বিক্রয়ের পরিমাণ', part: 'পার্ট-৩' });
    if (!data.monthly_raw_operational_cost?.toString().trim()) missing.push({ tab: 'part3', field: 'monthly_raw_operational_cost', label: 'কাঁচামাল ও পরিচালন ব্যয়', part: 'পার্ট-৩' });
    if (!data.total_investment_amount?.toString().trim()) missing.push({ tab: 'part3', field: 'total_investment_amount', label: 'মোট বিনিয়োগের পরিমাণ', part: 'পার্ট-৩' });

    // Part 4 checks
    const hasSig = data.signature || sigPreview || initialReport?.signature_path;
    if (!hasSig) {
      missing.push({ tab: 'part4', field: 'signature', label: 'আবেদনকারীর স্বাক্ষর আপলোড', part: 'পার্ট-৪' });
    }

    return missing;
  };

  const handleAction = (action = 'submit') => {
    if (action === 'draft') {
      setIsDraftSaving(true);
      transform((currentData) => ({
        ...currentData,
        save_action: 'draft',
      }));
      post('/sicip/feasibility-report', {
        forceFormData: true,
        preserveScroll: true,
        onFinish: () => setIsDraftSaving(false),
      });
      return;
    }

    // Submit action with validation
    const missing = validateForm();
    if (missing.length > 0) {
      setMissingFields(missing);
      setShowValidationModal(true);
      return;
    }

    transform((currentData) => ({
      ...currentData,
      save_action: 'submit',
    }));
    post('/sicip/feasibility-report', {
      forceFormData: true,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAction('submit');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 py-4 sm:py-6 px-2 sm:px-4 lg:px-8 font-sans">
      <Head title="ব্যবসার সম্ভাব্যতা যাচাই প্রতিবেদন - SICIP (বাংলাদেশ ব্যাংক)" />

      {/* Floating Action Bar */}
      <div className="max-w-6xl mx-auto mb-4 sm:mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-xl border border-emerald-500/30 shrink-0">
            ৳
          </div>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-semibold text-slate-900 truncate">বাংলাদেশ ব্যাংক & SICIP অনলাইন পোর্টাল</h1>
            <p className="text-[11px] sm:text-xs text-slate-500 truncate">উদ্যোক্তা উন্নয়ন প্রশিক্ষণ প্রোগ্রাম • Business Feasibility Report</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* New Applicant Guide Demo Form Modal & PDF Buttons */}
          <button
            type="button"
            onClick={() => setShowSampleDemoModal(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white shadow-md shadow-emerald-700/20 text-xs font-bold transition cursor-pointer"
            title="সম্পূর্ণ পূরণকৃত ৪ পৃষ্ঠার অফিসিয়াল নমুনা ফরম PDF আকারে দেখুন"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>📄 পূরণকৃত নমুনা ফরম (PDF)</span>
          </button>

          <a
            href="/sicip/sample-demo-pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-600/20 text-xs font-bold transition cursor-pointer"
            title="নতুন উইন্ডোতে অফিসিয়াল ৪ পৃষ্ঠার নমুনা PDF ভিউ ও ডাউনলোড করুন"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>📥 নমুনা PDF</span>
          </a>

          <button
            type="button"
            onClick={() => handleAction('draft')}
            disabled={processing || isDraftSaving}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white border border-amber-600 text-xs font-semibold transition shadow-sm cursor-pointer disabled:opacity-50"
            title="যেকোনো সময় খসড়া হিসেবে একাউন্টে জমা রাখুন"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isDraftSaving ? 'সংরক্ষণ হচ্ছে...' : 'খসড়া সংরক্ষণ (Draft)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'interactive' ? 'document' : 'interactive')}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white text-slate-700 hover:bg-slate-100 border border-slate-300 shadow-sm text-xs font-medium transition cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{viewMode === 'interactive' ? 'ডকুমেন্ট ভিউ' : 'স্টেপ ভিউ'}</span>
          </button>

          {/* Logged in Applicant Profile & Logout */}
          {auth?.user && (
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-bold text-slate-800 block leading-tight truncate max-w-[150px]">
                  {auth.user.name}
                </span>
                <span className="text-[10px] text-slate-500 font-mono block leading-tight">
                  {auth.user.phone || auth.user.email}
                </span>
              </div>
              <Link
                href="/sicip/logout"
                method="post"
                as="button"
                className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition cursor-pointer"
                title="অ্যাকাউন্ট থেকে লগআউট করুন"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">লগআউট</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Submitted Application Notice Ribbon */}
      {submittedReport && (
        <div className="max-w-6xl mx-auto mb-4 bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-emerald-950">
                আপনার একটি আবেদন ইতিমধ্যে দাখিল করা আছে (ট্র্যাকিং নম্বর: <span className="font-mono underline">{submittedReport.tracking_number}</span>)
              </p>
              <p className="text-[11px] sm:text-xs text-emerald-700">
                বর্তমান স্ট্যাটাস: <strong className="uppercase bg-emerald-200/80 px-1.5 py-0.5 rounded text-[10px] text-emerald-900">{submittedReport.status}</strong> • দাখিলের তারিখ: {submittedReport.submission_date}
              </p>
            </div>
          </div>
          <Link
            href={`/sicip/report/${submittedReport.tracking_number}`}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition shrink-0"
          >
            <span>দাখিলকৃত আবেদন দেখুন ও প্রিন্ট করুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Draft Notification Ribbon */}
      {initialReport && (
        <div className="max-w-6xl mx-auto mb-4 bg-amber-50 border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-200 text-amber-800 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-amber-900">
                {initialReport.status === 'draft' ? 'খসড়া আবেদন লোড করা হয়েছে' : 'দাখিলকৃত প্রতিবেদন'} (ট্র্যাকিং নম্বর: <span className="font-mono underline">{initialReport.tracking_number}</span>)
              </p>
              <p className="text-[11px] sm:text-xs text-amber-700">
                {initialReport.status === 'draft' 
                  ? 'আপনি এই খসড়াটি যে কোনো সময় তথ্য পরিবর্তন করে সংরক্ষণ করতে পারেন অথবা সম্পূর্ণ পূরণ করে ফাইনাল সাবমিট করতে পারেন।' 
                  : 'এই প্রতিবেদনটি ইতিমধ্যে দাখিল করা হয়েছে।'}
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-200 text-amber-900 border border-amber-300">
              {initialReport.status === 'draft' ? '📝 খসড়া মোড' : '✅ দাখিলকৃত'}
            </span>
          </div>
        </div>
      )}

      <form noValidate onSubmit={handleSubmit} className="max-w-6xl mx-auto">
        {/* Main Official Container */}
        <div className="bg-white border border-slate-300 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
          
          {/* Official Document Header (Exact reproduction of PDF top header) */}
          <div className="bg-gradient-to-b from-emerald-50/70 to-white p-4 sm:p-6 border-b border-slate-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
              
              {/* Bangladesh Bank Crest / Logo */}
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 p-1.5 flex items-center justify-center shadow-md overflow-hidden">
                  <img 
                    src={settings?.bb_logo || '/uploads/logos/bb_1793994378_UqTbAw.svg'} 
                    alt="বাংলাদেশ ব্যাংক লোগো" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Title & Organization Details */}
              <div className="flex-1 text-center">
                <div className="inline-block px-3 py-1 mb-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                  উদ্যোক্তা উন্নয়ন প্রশিক্ষণ প্রোগ্রাম
                </div>
                <h2 className="text-lg md:text-xl font-bold text-slate-900">
                  Skills for Industry Competitiveness and Innovation Program (SICIP)
                </h2>
                <p className="text-xs md:text-sm text-slate-700 font-medium mt-1">
                  প্রোগ্রাম ইমপ্লিমেন্টেশন ইউনিট (PIU)
                </p>
                <p className="text-xs text-slate-500">
                  এসএমই এন্ড স্পেশাল প্রোগ্রামস্ ডিপার্টমেন্ট, বাংলাদেশ ব্যাংক।
                </p>
              </div>

              {/* SICIP Logo & Slogan */}
              <div className="flex flex-col items-center md:items-end">
                <div className="h-14 px-3 py-1 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-center">
                  <img 
                    src={settings?.sicip_logo || '/uploads/logos/sicip_1793994378_6ZWj0e.png'} 
                    alt="SICIP Logo" 
                    className="h-full w-auto max-w-[170px] object-contain"
                  />
                </div>
                <span className="text-xs font-semibold text-amber-700 mt-1 italic">
                  "উদ্যোক্তা হবো, দেশ গড়বো।"
                </span>
              </div>
            </div>

            {/* Document Title Ribbon */}
            <div className="mt-6 text-center">
              <div className="inline-block bg-slate-100 border border-amber-400 px-6 py-2 rounded-xl bg-amber-50 shadow-sm">
                <h3 className="text-base md:text-lg font-bold text-amber-800">
                  ব্যবসার সম্ভাব্যতা যাচাই প্রতিবেদন (Business Feasibility Report)
                </h3>
              </div>
            </div>
          </div>

          {/* Stepper Tabs Navigation (if in Interactive Mode) */}
          {viewMode === 'interactive' && (
            <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none">
              {[
                { id: 'part1', label: 'পার্ট- ১: ব্যক্তিগত তথ্যাবলী', icon: User },
                { id: 'part2', label: 'পার্ট- ২: আইডিয়া ও পরিকল্পনা', icon: Sparkles },
                { id: 'part3', label: 'পার্ট- ৩: ব্যবসা ও বাজার বিশ্লেষণ', icon: DollarSign },
                { id: 'part4', label: 'পার্ট- ৪: পরিবার, ব্যাংক ও সংযুক্তি', icon: FileText },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer shrink-0 whitespace-nowrap ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Form Content Area */}
          <div className="p-3.5 sm:p-6 md:p-8 space-y-6 sm:space-y-8">

            {/* ========================================================================= */}
            {/* PART 1: ব্যক্তিগত তথ্যাবলী (PERSONAL INFO) */}
            {/* ========================================================================= */}
            {(viewMode === 'document' || activeTab === 'part1') && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
                  <h4 className="text-base font-bold text-emerald-400 flex items-center space-x-2">
                    <span className="w-7 h-7 rounded-md bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-sm font-bold bn-num">১</span>
                    <span>পার্ট- I: ব্যক্তিগত তথ্যাবলীঃ (প্রযোজ্য ক্ষেত্রে NID মোতাবেক)</span>
                  </h4>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-slate-700 flex items-center space-x-1.5">
                      <Calendar className="w-4 h-4 text-emerald-600 inline shrink-0" />
                      <span># যাচাই প্রতিবেদন দাখিলের তারিখঃ</span>
                    </span>
                    <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-300/80 px-3 py-1.5 rounded-xl shadow-xs">
                      <span className="font-bold text-emerald-950 text-xs">
                        {formattedTodayBangla}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200 shadow-2xs">
                        ⚡ অটো রিয়েল ডেট
                      </span>
                    </div>
                  </div>
                </div>

                {/* Top Section with Photo Box */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Left 3 cols: Names */}
                  <div className="lg:col-span-3 space-y-4">
                    {/* 01. Applicant Name */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                      <label className="block text-xs font-semibold text-slate-700">
                        ০১. অংশগ্রহণকারীর নামঃ
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <span className="text-[11px] text-slate-500 block mb-1">বাংলায় : <Required /></span>
                          <input
                            type="text"
                            placeholder="যেমন: তানভীর আহমেদ চৌধুরী"
                            value={data.applicant_name_bn}
                            onChange={(e) => {
                              setData('applicant_name_bn', e.target.value);
                              clearMissing('applicant_name_bn');
                            }}
                            className={`w-full bg-white border rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none transition ${
                              isMissing('applicant_name_bn')
                                ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-400'
                                : 'border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600'
                            }`}
                            required
                          />
                          {errors.applicant_name_bn && <p className="text-red-400 text-xs mt-1">{errors.applicant_name_bn}</p>}
                        </div>
                        <div>
                          <span className="text-[11px] text-slate-500 block mb-1">English : <Required /></span>
                          <input
                            type="text"
                            placeholder="e.g. Tanvir Ahmed Chowdhury"
                            value={data.applicant_name_en}
                            onChange={(e) => {
                              setData('applicant_name_en', e.target.value);
                              clearMissing('applicant_name_en');
                            }}
                            className={`w-full bg-white border rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none transition ${
                              isMissing('applicant_name_en')
                                ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-400'
                                : 'border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600'
                            }`}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* 02. Father's Name */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                      <label className="block text-xs font-semibold text-slate-700">
                        ০২. পিতার নামঃ
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <span className="text-[11px] text-slate-500 block mb-1">বাংলায় : <Required /></span>
                          <input
                            type="text"
                            value={data.father_name_bn}
                            onChange={(e) => {
                              setData('father_name_bn', e.target.value);
                              clearMissing('father_name_bn');
                            }}
                            className={`w-full bg-white border rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none transition ${
                              isMissing('father_name_bn')
                                ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-400'
                                : 'border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600'
                            }`}
                          />
                        </div>
                        <div>
                          <span className="text-[11px] text-slate-500 block mb-1">English :</span>
                          <input
                            type="text"
                            value={data.father_name_en}
                            onChange={(e) => setData('father_name_en', e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 03. Mother's Name */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                      <label className="block text-xs font-semibold text-slate-700">
                        ০৩. মাতার নামঃ
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <span className="text-[11px] text-slate-500 block mb-1">বাংলায় : <Required /></span>
                          <input
                            type="text"
                            value={data.mother_name_bn}
                            onChange={(e) => {
                              setData('mother_name_bn', e.target.value);
                              clearMissing('mother_name_bn');
                            }}
                            className={`w-full bg-white border rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none transition ${
                              isMissing('mother_name_bn')
                                ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-400'
                                : 'border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600'
                            }`}
                          />
                        </div>
                        <div>
                          <span className="text-[11px] text-slate-500 block mb-1">English :</span>
                          <input
                            type="text"
                            value={data.mother_name_en}
                            onChange={(e) => setData('mother_name_en', e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right 1 col: Passport Photo Upload Box */}
                  <div className={`lg:col-span-1 flex flex-col items-center justify-center p-4 rounded-2xl relative group border-2 border-dashed transition ${
                    isMissing('photo') ? 'border-rose-400 bg-rose-50/30 ring-2 ring-rose-400/40' : 'bg-slate-50 border-slate-300'
                  }`}>
                    {photoPreview ? (
                      <div className="relative w-36 h-44 rounded-xl overflow-hidden border border-slate-300 shadow-md">
                        <img src={photoPreview} alt="Passport Photo" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => { setPhotoPreview(null); setData('photo', null); }}
                          className="absolute top-1 right-1 bg-red-600/80 p-1 rounded-full text-white hover:bg-red-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center justify-center text-center p-3 w-full h-44 border border-slate-200 rounded-xl bg-white hover:bg-white transition">
                        <Upload className="w-8 h-8 text-slate-500 mb-2 group-hover:text-emerald-400 transition" />
                        <span className="text-xs font-semibold text-slate-800">পাসপোর্ট সাইজ ছবি <Required /></span>
                        <span className="text-[10px] text-slate-500 mt-1">(২ কপি আপলোড করুন)</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileChange('photo', e, setPhotoPreview)}
                        />
                      </label>
                    )}
                    <span className="text-[10px] text-slate-500 mt-2 text-center">সর্বোচ্চ ২MB (JPG/PNG)</span>
                  </div>
                </div>

                {/* 04 - 06: Guardian Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">০৪. স্থানীয় অভিভাবকের নামঃ</label>
                    <input
                      type="text"
                      value={data.guardian_name}
                      onChange={(e) => setData('guardian_name', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">০৫. সম্পর্কঃ</label>
                    <input
                      type="text"
                      placeholder="পিতা / মাতা / চাচা / বড় ভাই"
                      value={data.guardian_relation}
                      onChange={(e) => setData('guardian_relation', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">০৬. ফোন নাম্বারঃ</label>
                    <input
                      type="text"
                      placeholder="01XXXXXXXXX"
                      value={data.guardian_phone}
                      onChange={(e) => setData('guardian_phone', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* 07 - 10: NID, DOB, Age, Marital Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">০৭. NID নাম্বারঃ <Required /></label>
                    <input
                      type="text"
                      placeholder="১০, ১৩ বা ১৭ সংখ্যার এনআইডি"
                      value={data.nid_number}
                      onChange={(e) => {
                        setData('nid_number', e.target.value);
                        clearMissing('nid_number');
                      }}
                      className={`w-full bg-white border rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none transition ${
                        isMissing('nid_number')
                          ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-400'
                          : 'border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">০৮. জন্ম তারিখঃ <Required /></label>
                    <input
                      type="date"
                      value={data.dob}
                      onChange={(e) => {
                        setData('dob', e.target.value);
                        clearMissing('dob');
                      }}
                      className={`w-full bg-white border rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none transition ${
                        isMissing('dob')
                          ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-400'
                          : 'border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">০৯. বয়সঃ</label>
                    <input
                      type="number"
                      placeholder="স্বয়ংক্রিয় বা লিখুন"
                      value={data.age}
                      onChange={(e) => setData('age', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">১০. বৈবাহিক অবস্থাঃ</label>
                    <select
                      value={['অবিবাহিত', 'বিবাহিত'].includes(data.marital_status) ? data.marital_status : (data.marital_status ? '__other__' : '')}
                      onChange={(e) => {
                        const val = e.target.value;
                        setData('marital_status', val === '__other__' ? 'অন্যান্য' : val);
                      }}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 sm:py-2 text-sm sm:text-xs text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none min-h-[42px] sm:min-h-[38px]"
                    >
                      <option value="">বৈবাহিক অবস্থা নির্বাচন</option>
                      <option value="__other__">✏️ অন্যান্য / নিজে লিখুন</option>
                      <option value="অবিবাহিত">অবিবাহিত</option>
                      <option value="বিবাহিত">বিবাহিত</option>
                    </select>
                    {(!['অবিবাহিত', 'বিবাহিত'].includes(data.marital_status) && data.marital_status) && (
                      <input
                        type="text"
                        placeholder="বৈবাহিক অবস্থা লিখুন (যেমন: ডিভোর্সড / বিধবা / বিপত্নীক)..."
                        value={data.marital_status === 'অন্যান্য' ? '' : data.marital_status}
                        onChange={(e) => setData('marital_status', e.target.value || 'অন্যান্য')}
                        className="w-full bg-white border border-emerald-400 rounded-lg px-3 py-2 sm:py-1.5 text-sm sm:text-xs text-slate-900 focus:border-emerald-600 focus:outline-none placeholder:text-slate-400 mt-1.5 min-h-[40px] sm:min-h-[36px] transition"
                        autoFocus
                      />
                    )}
                  </div>
                </div>

                {/* 11. শিক্ষাগত যোগ্যতা (TABLE) */}
                <div className={`p-4 rounded-xl border space-y-3 transition ${
                  isMissing('education_history') ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-400' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-700">
                      ১১. শিক্ষাগত যোগ্যতাঃ <Required />
                    </label>
                    <button
                      type="button"
                      onClick={addEducationRow}
                      className="inline-flex items-center space-x-1 text-xs text-emerald-400 hover:text-emerald-300 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>সারি যোগ করুন</span>
                    </button>
                  </div>

                  {/* Mobile Card View (Phone only: No horizontal scroll needed) */}
                  <div className="sm:hidden space-y-3">
                    {data.education_history.map((row, idx) => (
                      <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                          <span className="text-xs font-bold text-emerald-800 flex items-center space-x-1.5">
                            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[11px] font-bold">
                              {idx + 1}
                            </span>
                            <span>{row.degree || 'শিক্ষাগত যোগ্যতা'}</span>
                          </span>
                          {data.education_history.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeEducationRow(idx)}
                              className="inline-flex items-center space-x-1 text-xs text-rose-600 hover:text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>মুছুন</span>
                            </button>
                          )}
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            সর্বশেষ শিক্ষাগত যোগ্যতাঃ
                          </label>
                          <input
                            type="text"
                            list="degree-qualification-options"
                            value={row.degree}
                            onChange={(e) => {
                              const copy = [...data.education_history];
                              copy[idx].degree = e.target.value;
                              setData('education_history', copy);
                              if (e.target.value.trim()) clearMissing('education_history');
                            }}
                            placeholder="ডিগ্রি বাছুন বা লিখুন (যেমন: SSC / HSC / B.Sc)..."
                            className="w-full bg-slate-50 focus:bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[42px] transition placeholder:text-slate-400"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            বিষয়ঃ
                          </label>
                          <input
                            type="text"
                            list={`subject-options-mobile-${idx}`}
                            value={row.subject}
                            onChange={(e) => {
                              const copy = [...data.education_history];
                              copy[idx].subject = e.target.value;
                              setData('education_history', copy);
                            }}
                            placeholder={row.degree ? "বিষয় বাছুন বা লিখুন..." : "প্রথমে ডিগ্রি বাছুন..."}
                            className="w-full bg-slate-50 focus:bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[42px] transition placeholder:text-slate-400"
                          />
                          <datalist id={`subject-options-mobile-${idx}`}>
                            {getSubjectsForDegree(row.degree).map((sub) => (
                              <option key={sub} value={sub} />
                            ))}
                          </datalist>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            বোর্ড / বিশ্ববিদ্যালয়ের নামঃ
                          </label>
                          <input
                            type="text"
                            list="board-university-options"
                            value={row.board}
                            onChange={(e) => {
                              const copy = [...data.education_history];
                              copy[idx].board = e.target.value;
                              setData('education_history', copy);
                            }}
                            placeholder="বোর্ড বা বিশ্ববিদ্যালয়ের নাম টাইপ করুন বা বাছুন..."
                            className="w-full bg-slate-50 focus:bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[42px] transition placeholder:text-slate-400"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              ফলাফলঃ
                            </label>
                            <select
                              value={EDUCATION_RESULTS.includes(row.result) ? row.result : (row.result ? '__other__' : '')}
                              onChange={(e) => {
                                const val = e.target.value;
                                const copy = [...data.education_history];
                                copy[idx].result = val === '__other__' ? 'অন্যান্য' : val;
                                setData('education_history', copy);
                              }}
                              className="w-full bg-slate-50 focus:bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[42px]"
                            >
                              <option value="">ফলাফল বাছুন</option>
                              <option value="__other__">✏️ নিজে লিখুন</option>
                              {EDUCATION_RESULTS.map((res) => (
                                <option key={res} value={res}>{res}</option>
                              ))}
                            </select>
                            {(!EDUCATION_RESULTS.includes(row.result) && row.result) && (
                              <input
                                type="text"
                                placeholder="ফলাফল লিখুন..."
                                value={row.result === 'অন্যান্য' ? '' : row.result}
                                onChange={(e) => {
                                  const copy = [...data.education_history];
                                  copy[idx].result = e.target.value || 'অন্যান্য';
                                  setData('education_history', copy);
                                }}
                                className="w-full bg-white border border-emerald-400 rounded-xl px-3 py-2 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none placeholder:text-slate-400 mt-1.5 min-h-[40px] transition"
                                autoFocus
                              />
                            )}
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              পাসের সনঃ
                            </label>
                            <select
                              value={row.passing_year}
                              onChange={(e) => {
                                const copy = [...data.education_history];
                                copy[idx].passing_year = e.target.value;
                                setData('education_history', copy);
                              }}
                              className="w-full bg-slate-50 focus:bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[42px] bn-num"
                            >
                              <option value="">সন বাছুন</option>
                              {PASSING_YEARS.map((yr) => (
                                <option key={yr} value={yr}>{yr}</option>
                              ))}
                              {row.passing_year && !PASSING_YEARS.includes(row.passing_year) && (
                                <option value={row.passing_year}>{row.passing_year}</option>
                              )}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addEducationRow}
                      className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 border border-dashed border-emerald-400 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ আরও শিক্ষাগত যোগ্যতা যোগ করুন</span>
                    </button>
                  </div>

                  {/* Desktop Table View (Tablet & PC) */}
                  <div className="hidden sm:block border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm -mx-1 sm:mx-0">
                    <div className="overflow-x-auto">
                      <table className="min-w-[1080px] w-full text-left text-xs text-slate-700 border-collapse">
                        <thead className="bg-slate-100 text-slate-800 font-semibold">
                          <tr>
                            <th className="p-3 border-b border-r border-slate-200 min-w-[220px]">সর্বশেষ শিক্ষাগত যোগ্যতা</th>
                            <th className="p-3 border-b border-r border-slate-200 min-w-[190px]">ফলাফল</th>
                            <th className="p-3 border-b border-r border-slate-200 min-w-[120px]">পাসের সন</th>
                            <th className="p-3 border-b border-r border-slate-200 min-w-[240px]">বিষয়</th>
                            <th className="p-3 border-b border-r border-slate-200 min-w-[280px]">বোর্ড/বিশ্ববিদ্যালয়ের নাম</th>
                            <th className="p-3 border-b border-slate-200 text-center w-12">মুছুন</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {data.education_history.map((row, idx) => (
                            <tr key={idx} className="bg-white hover:bg-slate-50/50">
                              <td className="p-2.5 border-r border-slate-200 align-top">
                                <input
                                  type="text"
                                  list="degree-qualification-options"
                                  value={row.degree}
                                  onChange={(e) => {
                                    const copy = [...data.education_history];
                                    copy[idx].degree = e.target.value;
                                    setData('education_history', copy);
                                    if (e.target.value.trim()) clearMissing('education_history');
                                  }}
                                  placeholder="ডিগ্রি / যোগ্যতা বাছুন বা লিখুন..."
                                  className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm sm:text-xs text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[40px] sm:min-h-[36px] transition placeholder:text-slate-400"
                                />
                              </td>
                              <td className="p-2.5 border-r border-slate-200 align-top">
                                <select
                                  value={EDUCATION_RESULTS.includes(row.result) ? row.result : (row.result ? '__other__' : '')}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    const copy = [...data.education_history];
                                    copy[idx].result = val === '__other__' ? 'অন্যান্য' : val;
                                    setData('education_history', copy);
                                  }}
                                  className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm sm:text-xs text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[40px] sm:min-h-[36px]"
                                >
                                  <option value="">ফলাফল নির্বাচন</option>
                                  <option value="__other__">✏️ অন্যান্য / গ্রেড নিজে লিখুন</option>
                                  {EDUCATION_RESULTS.map((res) => (
                                    <option key={res} value={res}>{res}</option>
                                  ))}
                                </select>
                                {(!EDUCATION_RESULTS.includes(row.result) && row.result) && (
                                  <input
                                    type="text"
                                    placeholder="ফলাফল / জিপিএ লিখুন..."
                                    value={row.result === 'অন্যান্য' ? '' : row.result}
                                    onChange={(e) => {
                                      const copy = [...data.education_history];
                                      copy[idx].result = e.target.value || 'অন্যান্য';
                                      setData('education_history', copy);
                                    }}
                                    className="w-full bg-white border border-emerald-400 rounded-lg px-3 py-1.5 text-sm sm:text-xs text-slate-900 focus:border-emerald-600 focus:outline-none placeholder:text-slate-400 mt-1.5 min-h-[38px] transition"
                                    autoFocus
                                  />
                                )}
                              </td>
                              <td className="p-2.5 border-r border-slate-200 align-top">
                                <select
                                  value={row.passing_year}
                                  onChange={(e) => {
                                    const copy = [...data.education_history];
                                    copy[idx].passing_year = e.target.value;
                                    setData('education_history', copy);
                                  }}
                                  className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm sm:text-xs text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[40px] sm:min-h-[36px] bn-num"
                                >
                                  <option value="">সন নির্বাচন</option>
                                  {PASSING_YEARS.map((yr) => (
                                    <option key={yr} value={yr}>{yr}</option>
                                  ))}
                                  {row.passing_year && !PASSING_YEARS.includes(row.passing_year) && (
                                    <option value={row.passing_year}>{row.passing_year}</option>
                                  )}
                                </select>
                              </td>
                              <td className="p-2.5 border-r border-slate-200 align-top">
                                <input
                                  type="text"
                                  list={`subject-options-${idx}`}
                                  value={row.subject}
                                  onChange={(e) => {
                                    const copy = [...data.education_history];
                                    copy[idx].subject = e.target.value;
                                    setData('education_history', copy);
                                  }}
                                  placeholder={row.degree ? "বিষয় বাছুন বা লিখুন..." : "প্রথমে ডিগ্রি বাছুন..."}
                                  className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm sm:text-xs text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[40px] sm:min-h-[36px] transition placeholder:text-slate-400"
                                />
                                <datalist id={`subject-options-${idx}`}>
                                  {getSubjectsForDegree(row.degree).map((sub) => (
                                    <option key={sub} value={sub} />
                                  ))}
                                </datalist>
                              </td>
                              <td className="p-2.5 border-r border-slate-200 align-top">
                                <input
                                  type="text"
                                  list="board-university-options"
                                  value={row.board}
                                  onChange={(e) => {
                                    const copy = [...data.education_history];
                                    copy[idx].board = e.target.value;
                                    setData('education_history', copy);
                                  }}
                                  placeholder="বোর্ড / বিশ্ববিদ্যালয় টাইপ করুন বা বাছুন..."
                                  className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm sm:text-xs text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[40px] sm:min-h-[36px] transition placeholder:text-slate-400"
                                />
                              </td>
                              <td className="p-2.5 text-center align-middle">
                                {data.education_history.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeEducationRow(idx)}
                                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                                    title="সারি মুছুন"
                                  >
                                    <Trash2 className="w-4 h-4 mx-auto" />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <datalist id="degree-qualification-options">
                    {EDUCATION_LEVELS.map((lvl) => (
                      <option key={lvl} value={lvl} />
                    ))}
                  </datalist>
                  <datalist id="board-university-options">
                    {EDUCATION_BOARDS.map((b) => (
                      <option key={b} value={b} />
                    ))}
                  </datalist>
                </div>

                {/* 12 - 13: Phone & Email */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">১২. ফোন নাম্বারঃ <Required /></label>
                      <input
                        type="text"
                        placeholder="01XXXXXXXXX"
                        value={data.phone}
                        onChange={(e) => {
                          setData('phone', e.target.value);
                          clearMissing('phone');
                        }}
                        className={`w-full bg-white border rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none transition ${
                          isMissing('phone')
                            ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-400'
                            : 'border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600'
                        }`}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">বিকল্প ফোন নাম্বারঃ</label>
                      <input
                        type="text"
                        placeholder="01XXXXXXXXX"
                        value={data.alt_phone}
                        onChange={(e) => setData('alt_phone', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">১৩. E-mail ID:</label>
                      <input
                        type="email"
                        placeholder="example@mail.com"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-amber-700/90 italic">
                    * ফোন নাম্বার অবশ্যই আবেদনকারীর নাম এ রেজিস্টার্ড হতে হবে এবং উক্ত নাম্বারে এমএফএস/ব্যাংক হিসাব থাকতে/খুলতে হবে।
                  </p>
                </div>

                {/* 14. বর্তমান ঠিকানা */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <label className="block text-xs font-semibold text-slate-700">
                    ১৪. বর্তমান ঠিকানাঃ (এনআইডি মোতাবেক)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                      <span className="text-[11px] text-slate-500 block mb-1">বিভাগঃ <Required /></span>
                      <select
                        value={data.present_address.division}
                        onChange={(e) => {
                          const newDiv = e.target.value;
                          const updated = { ...data.present_address, division: newDiv, district: '', thana: '' };
                          setData('present_address', updated);
                          clearMissing('present_address.division');
                          if (sameAsPresent) setData('permanent_address', updated);
                        }}
                        className={`w-full bg-white border rounded-lg px-3 py-2.5 sm:py-2 text-sm sm:text-xs text-slate-900 focus:outline-none min-h-[42px] sm:min-h-[38px] transition ${
                          isMissing('present_address.division')
                            ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-400'
                            : 'border-slate-300 focus:border-emerald-600'
                        }`}
                      >
                        <option value="">বিভাগ নির্বাচন করুন</option>
                        {BANGLADESH_DIVISIONS.map((div) => (
                          <option key={div} value={div}>{div}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block mb-1">জেলাঃ <Required /></span>
                      <select
                        value={data.present_address.district}
                        onChange={(e) => {
                          const newDist = e.target.value;
                          const updated = { ...data.present_address, district: newDist, thana: '' };
                          setData('present_address', updated);
                          clearMissing('present_address.district');
                          if (sameAsPresent) setData('permanent_address', updated);
                        }}
                        className={`w-full bg-white border rounded-lg px-3 py-2.5 sm:py-2 text-sm sm:text-xs text-slate-900 focus:outline-none min-h-[42px] sm:min-h-[38px] transition ${
                          isMissing('present_address.district')
                            ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-400'
                            : 'border-slate-300 focus:border-emerald-600'
                        }`}
                      >
                        <option value="">জেলা নির্বাচন করুন</option>
                        {(BANGLADESH_DISTRICTS_BY_DIVISION[data.present_address.division] || Object.values(BANGLADESH_DISTRICTS_BY_DIVISION).flat()).map((dist) => (
                          <option key={dist} value={dist}>{dist}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block mb-1">থানাঃ <Required /></span>
                      <div className="space-y-1">
                        <select
                          value={(POPULAR_THANAS_BY_DISTRICT[data.present_address.district] || []).includes(data.present_address.thana) ? data.present_address.thana : (data.present_address.thana ? 'custom' : '')}
                          onChange={(e) => {
                            const val = e.target.value;
                            const updated = { ...data.present_address, thana: val === 'custom' ? '' : val };
                            setData('present_address', updated);
                            if (val && val !== 'custom') clearMissing('present_address.thana');
                            if (sameAsPresent) setData('permanent_address', updated);
                          }}
                          className={`w-full bg-white border rounded-lg px-3 py-2.5 sm:py-2 text-sm sm:text-xs text-slate-900 focus:outline-none min-h-[42px] sm:min-h-[38px] transition ${
                            isMissing('present_address.thana')
                              ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-400'
                              : 'border-slate-300 focus:border-emerald-600'
                          }`}
                        >
                          <option value="">{data.present_address.district ? `${data.present_address.district}-এর থানা নির্বাচন করুন` : 'প্রথমে জেলা নির্বাচন করুন'}</option>
                          <option value="custom">✏️ অন্যান্য / ম্যানুয়ালি লিখুন</option>
                          {(POPULAR_THANAS_BY_DISTRICT[data.present_address.district] || []).map((th) => (
                            <option key={th} value={th}>{th}</option>
                          ))}
                        </select>
                        {(!(POPULAR_THANAS_BY_DISTRICT[data.present_address.district] || []).includes(data.present_address.thana) || data.present_address.thana === '') && (
                          <div className="relative">
                            <input
                              type="text"
                              list="present-thana-datalist"
                              placeholder="থানার নাম লিখুন বা বাছুন..."
                              value={data.present_address.thana}
                              onChange={(e) => {
                                const updated = { ...data.present_address, thana: e.target.value };
                                setData('present_address', updated);
                                if (e.target.value.trim()) clearMissing('present_address.thana');
                                if (sameAsPresent) setData('permanent_address', updated);
                              }}
                              className={`w-full bg-white border rounded-lg px-3 py-2 sm:py-1.5 text-sm sm:text-xs text-slate-900 focus:outline-none placeholder:text-slate-400 min-h-[40px] sm:min-h-[36px] transition ${
                                isMissing('present_address.thana')
                                  ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-400'
                                  : 'border-slate-300 focus:border-emerald-600'
                              }`}
                            />
                            <datalist id="present-thana-datalist">
                              {(POPULAR_THANAS_BY_DISTRICT[data.present_address.district] || Object.values(POPULAR_THANAS_BY_DISTRICT).flat()).map((th, i) => (
                                <option key={`present-th-${th}-${i}`} value={th} />
                              ))}
                            </datalist>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block mb-1">বাড়ি/মহল্লার নং/নামঃ</span>
                      <input
                        type="text"
                        placeholder="বাড়ি নং, ফ্ল্যাট বা গ্রাম"
                        value={data.present_address.house}
                        onChange={(e) => {
                          const updated = { ...data.present_address, house: e.target.value };
                          setData('present_address', updated);
                          if (sameAsPresent) setData('permanent_address', updated);
                        }}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 sm:py-2 text-sm sm:text-xs text-slate-900 min-h-[42px] sm:min-h-[38px]"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block mb-1">রোড নং/এলাকা/গ্রামের নামঃ</span>
                      <input
                        type="text"
                        placeholder="রোড নং / সেক্টর / মহল্লা"
                        value={data.present_address.road}
                        onChange={(e) => {
                          const updated = { ...data.present_address, road: e.target.value };
                          setData('present_address', updated);
                          if (sameAsPresent) setData('permanent_address', updated);
                        }}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 sm:py-2 text-sm sm:text-xs text-slate-900 min-h-[42px] sm:min-h-[38px]"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block mb-1">পোস্ট অফিস ও কোডঃ</span>
                      <input
                        type="text"
                        placeholder="যেমন: ঢাকা জিপিও - ১২০০"
                        value={data.present_address.post_code}
                        onChange={(e) => {
                          const updated = { ...data.present_address, post_code: e.target.value };
                          setData('present_address', updated);
                          if (sameAsPresent) setData('permanent_address', updated);
                        }}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 sm:py-2 text-sm sm:text-xs text-slate-900 min-h-[42px] sm:min-h-[38px]"
                      />
                    </div>
                  </div>
                </div>

                {/* 15. স্থায়ী ঠিকানা */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-700">
                      ১৫. স্থায়ী ঠিকানাঃ
                    </label>
                    <label className="inline-flex items-center space-x-2 text-xs text-emerald-600 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sameAsPresent}
                        onChange={handleSameAsPresent}
                        className="rounded border-slate-300 bg-white text-emerald-600 focus:ring-0"
                      />
                      <span>বর্তমান ঠিকানার অনুরূপ</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                      <span className="text-[11px] text-slate-500 block mb-1">বিভাগঃ <Required /></span>
                      <select
                        disabled={sameAsPresent}
                        value={data.permanent_address.division}
                        onChange={(e) => {
                          const newDiv = e.target.value;
                          setData('permanent_address', { ...data.permanent_address, division: newDiv, district: '', thana: '' });
                          clearMissing('permanent_address.division');
                        }}
                        className={`w-full bg-white border rounded-lg px-3 py-2.5 sm:py-2 text-sm sm:text-xs text-slate-900 focus:outline-none min-h-[42px] sm:min-h-[38px] transition ${
                          isMissing('permanent_address.division')
                            ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-400'
                            : 'border-slate-300 focus:border-emerald-600'
                        } ${sameAsPresent ? 'bg-slate-100 opacity-70' : ''}`}
                      >
                        <option value="">বিভাগ নির্বাচন করুন</option>
                        {BANGLADESH_DIVISIONS.map((div) => (
                          <option key={div} value={div}>{div}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block mb-1">জেলাঃ <Required /></span>
                      <select
                        disabled={sameAsPresent}
                        value={data.permanent_address.district}
                        onChange={(e) => {
                          const newDist = e.target.value;
                          setData('permanent_address', { ...data.permanent_address, district: newDist, thana: '' });
                          clearMissing('permanent_address.district');
                        }}
                        className={`w-full bg-white border rounded-lg px-3 py-2.5 sm:py-2 text-sm sm:text-xs text-slate-900 focus:outline-none min-h-[42px] sm:min-h-[38px] transition ${
                          isMissing('permanent_address.district')
                            ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-400'
                            : 'border-slate-300 focus:border-emerald-600'
                        } ${sameAsPresent ? 'bg-slate-100 opacity-70' : ''}`}
                      >
                        <option value="">জেলা নির্বাচন করুন</option>
                        {(BANGLADESH_DISTRICTS_BY_DIVISION[data.permanent_address.division] || Object.values(BANGLADESH_DISTRICTS_BY_DIVISION).flat()).map((dist) => (
                          <option key={dist} value={dist}>{dist}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block mb-1">থানাঃ <Required /></span>
                      <div className="space-y-1">
                        <select
                          disabled={sameAsPresent}
                          value={(POPULAR_THANAS_BY_DISTRICT[data.permanent_address.district] || []).includes(data.permanent_address.thana) ? data.permanent_address.thana : (data.permanent_address.thana ? 'custom' : '')}
                          onChange={(e) => {
                            const val = e.target.value;
                            setData('permanent_address', { ...data.permanent_address, thana: val === 'custom' ? '' : val });
                            if (val && val !== 'custom') clearMissing('permanent_address.thana');
                          }}
                          className={`w-full bg-white border rounded-lg px-3 py-2.5 sm:py-2 text-sm sm:text-xs text-slate-900 focus:outline-none min-h-[42px] sm:min-h-[38px] transition ${
                            isMissing('permanent_address.thana')
                              ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-400'
                              : 'border-slate-300 focus:border-emerald-600'
                          } ${sameAsPresent ? 'bg-slate-100 opacity-70' : ''}`}
                        >
                          <option value="">{data.permanent_address.district ? `${data.permanent_address.district}-এর থানা নির্বাচন করুন` : 'প্রথমে জেলা নির্বাচন করুন'}</option>
                          <option value="custom">✏️ অন্যান্য / ম্যানুয়ালি লিখুন</option>
                          {(POPULAR_THANAS_BY_DISTRICT[data.permanent_address.district] || []).map((th) => (
                            <option key={th} value={th}>{th}</option>
                          ))}
                        </select>
                        {!sameAsPresent && (!(POPULAR_THANAS_BY_DISTRICT[data.permanent_address.district] || []).includes(data.permanent_address.thana) || data.permanent_address.thana === '') && (
                          <div className="relative">
                            <input
                              type="text"
                              list="permanent-thana-datalist"
                              placeholder="থানার নাম লিখুন বা বাছুন..."
                              value={data.permanent_address.thana}
                              onChange={(e) => {
                                setData('permanent_address', { ...data.permanent_address, thana: e.target.value });
                                if (e.target.value.trim()) clearMissing('permanent_address.thana');
                              }}
                              className={`w-full bg-white border rounded-lg px-3 py-2 sm:py-1.5 text-sm sm:text-xs text-slate-900 focus:outline-none placeholder:text-slate-400 min-h-[40px] sm:min-h-[36px] transition ${
                                isMissing('permanent_address.thana')
                                  ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-400'
                                  : 'border-slate-300 focus:border-emerald-600'
                              }`}
                            />
                            <datalist id="permanent-thana-datalist">
                              {(POPULAR_THANAS_BY_DISTRICT[data.permanent_address.district] || Object.values(POPULAR_THANAS_BY_DISTRICT).flat()).map((th, i) => (
                                <option key={`perm-th-${th}-${i}`} value={th} />
                              ))}
                            </datalist>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block mb-1">বাড়ি/মহল্লার নামঃ</span>
                      <input
                        type="text"
                        disabled={sameAsPresent}
                        value={data.permanent_address.house}
                        onChange={(e) => setData('permanent_address', { ...data.permanent_address, house: e.target.value })}
                        className={`w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 ${sameAsPresent ? 'bg-slate-100 opacity-70' : ''}`}
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block mb-1">রোড নং/এলাকা/গ্রামের নামঃ</span>
                      <input
                        type="text"
                        disabled={sameAsPresent}
                        value={data.permanent_address.road}
                        onChange={(e) => setData('permanent_address', { ...data.permanent_address, road: e.target.value })}
                        className={`w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 ${sameAsPresent ? 'bg-slate-100 opacity-70' : ''}`}
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block mb-1">পোস্ট অফিস ও কোডঃ</span>
                      <input
                        type="text"
                        disabled={sameAsPresent}
                        value={data.permanent_address.post_code}
                        onChange={(e) => setData('permanent_address', { ...data.permanent_address, post_code: e.target.value })}
                        className={`w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 ${sameAsPresent ? 'bg-slate-100 opacity-70' : ''}`}
                      />
                    </div>
                  </div>
                </div>

                {/* 16. প্রশিক্ষণ বিবরণী (TABLE) */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-700">
                      ১৬. দক্ষতা উন্নয়নমূলক কোনরূপ প্রশিক্ষণ থাকলে তার বিবরণঃ
                    </label>
                    <button
                      type="button"
                      onClick={addTrainingRow}
                      className="inline-flex items-center space-x-1 text-xs text-emerald-400 hover:text-emerald-300 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>প্রশিক্ষণ যোগ করুন</span>
                    </button>
                  </div>

                  {/* Mobile Card View (Phone only: No horizontal scroll needed) */}
                  <div className="sm:hidden space-y-3">
                    {data.training_history.map((row, idx) => (
                      <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                          <span className="text-xs font-bold text-emerald-800 flex items-center space-x-1.5">
                            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[11px] font-bold">
                              {idx + 1}
                            </span>
                            <span>{row.subject || 'প্রশিক্ষণ বিবরণী'}</span>
                          </span>
                          {data.training_history.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeTrainingRow(idx)}
                              className="inline-flex items-center space-x-1 text-xs text-rose-600 hover:text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>মুছুন</span>
                            </button>
                          )}
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            প্রশিক্ষণের বিষয় / কোর্সঃ
                          </label>
                          <input
                            type="text"
                            placeholder="কোর্স বা প্রশিক্ষণের বিষয় লিখুন..."
                            value={row.subject}
                            onChange={(e) => {
                              const copy = [...data.training_history];
                              copy[idx].subject = e.target.value;
                              setData('training_history', copy);
                            }}
                            className="w-full bg-slate-50 focus:bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[42px] transition placeholder:text-slate-400"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            প্রতিষ্ঠানের নামঃ
                          </label>
                          <input
                            type="text"
                            placeholder="যে প্রতিষ্ঠান থেকে প্রশিক্ষণ নিয়েছেন..."
                            value={row.institute}
                            onChange={(e) => {
                              const copy = [...data.training_history];
                              copy[idx].institute = e.target.value;
                              setData('training_history', copy);
                            }}
                            className="w-full bg-slate-50 focus:bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[42px] transition placeholder:text-slate-400"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              মেয়াদঃ
                            </label>
                            <input
                              type="text"
                              placeholder="যেমন: ১ মাস / ৩ মাস"
                              value={row.duration}
                              onChange={(e) => {
                                const copy = [...data.training_history];
                                copy[idx].duration = e.target.value;
                                setData('training_history', copy);
                              }}
                              className="w-full bg-slate-50 focus:bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[42px]"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              সমাপ্তির তারিখঃ
                            </label>
                            <input
                              type="date"
                              value={row.completion_date}
                              onChange={(e) => {
                                const copy = [...data.training_history];
                                copy[idx].completion_date = e.target.value;
                                setData('training_history', copy);
                              }}
                              className="w-full bg-slate-50 focus:bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[42px]"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addTrainingRow}
                      className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 border border-dashed border-emerald-400 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ আরও প্রশিক্ষণ যোগ করুন</span>
                    </button>
                  </div>

                  {/* Desktop Table View (Tablet & PC) */}
                  <div className="hidden sm:block border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm -mx-1 sm:mx-0">
                    <div className="overflow-x-auto">
                      <table className="min-w-[850px] w-full text-left text-xs text-slate-700 border-collapse">
                        <thead className="bg-slate-100 text-slate-800 font-semibold">
                          <tr>
                            <th className="p-3 border-b border-r border-slate-200 w-16 text-center">ক্রমিক নং</th>
                            <th className="p-3 border-b border-r border-slate-200 min-w-[240px]">প্রশিক্ষণের বিষয়/কোর্স</th>
                            <th className="p-3 border-b border-r border-slate-200 min-w-[240px]">প্রতিষ্ঠানের নাম</th>
                            <th className="p-3 border-b border-r border-slate-200 min-w-[130px]">মেয়াদ</th>
                            <th className="p-3 border-b border-r border-slate-200 min-w-[160px]">প্রশিক্ষণ সমাপ্তির তারিখ</th>
                            <th className="p-3 border-b border-slate-200 text-center w-12">মুছুন</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {data.training_history.map((row, idx) => (
                            <tr key={idx} className="bg-white hover:bg-slate-50/50">
                              <td className="p-2.5 border-r border-slate-200 text-center text-slate-500 font-medium">{idx + 1}</td>
                              <td className="p-2.5 border-r border-slate-200">
                                <input
                                  type="text"
                                  placeholder="কোর্সের নাম"
                                  value={row.subject}
                                  onChange={(e) => {
                                    const copy = [...data.training_history];
                                    copy[idx].subject = e.target.value;
                                    setData('training_history', copy);
                                  }}
                                  className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm sm:text-xs text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[40px] sm:min-h-[36px]"
                                />
                              </td>
                              <td className="p-2.5 border-r border-slate-200">
                                <input
                                  type="text"
                                  placeholder="প্রতিষ্ঠানের নাম"
                                  value={row.institute}
                                  onChange={(e) => {
                                    const copy = [...data.training_history];
                                    copy[idx].institute = e.target.value;
                                    setData('training_history', copy);
                                  }}
                                  className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm sm:text-xs text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[40px] sm:min-h-[36px]"
                                />
                              </td>
                              <td className="p-2.5 border-r border-slate-200">
                                <input
                                  type="text"
                                  placeholder="১ মাস / ৩ মাস"
                                  value={row.duration}
                                  onChange={(e) => {
                                    const copy = [...data.training_history];
                                    copy[idx].duration = e.target.value;
                                    setData('training_history', copy);
                                  }}
                                  className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm sm:text-xs text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[40px] sm:min-h-[36px]"
                                />
                              </td>
                              <td className="p-2.5 border-r border-slate-200">
                                <input
                                  type="date"
                                  value={row.completion_date}
                                  onChange={(e) => {
                                    const copy = [...data.training_history];
                                    copy[idx].completion_date = e.target.value;
                                    setData('training_history', copy);
                                  }}
                                  className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm sm:text-xs text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[40px] sm:min-h-[36px]"
                                />
                              </td>
                              <td className="p-2.5 text-center align-middle">
                                {data.training_history.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeTrainingRow(idx)}
                                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                                    title="সারি মুছুন"
                                  >
                                    <Trash2 className="w-4 h-4 mx-auto" />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* 17. ব্যবসা/চাকরির অভিজ্ঞতা (TABLE) */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-700">
                      ১৭. ব্যবসা/চাকরির অভিজ্ঞতা থাকলে তার বিবরণঃ
                    </label>
                    <button
                      type="button"
                      onClick={addExperienceRow}
                      className="inline-flex items-center space-x-1 text-xs text-emerald-400 hover:text-emerald-300 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>অভিজ্ঞতা যোগ করুন</span>
                    </button>
                  </div>

                  {/* Mobile Card View (Phone only: No horizontal scroll needed) */}
                  <div className="sm:hidden space-y-3">
                    {data.experience_history.map((row, idx) => (
                      <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                          <span className="text-xs font-bold text-emerald-800 flex items-center space-x-1.5">
                            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[11px] font-bold">
                              {idx + 1}
                            </span>
                            <span>{row.organization || 'অভিজ্ঞতার বিবরণী'}</span>
                          </span>
                          {data.experience_history.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeExperienceRow(idx)}
                              className="inline-flex items-center space-x-1 text-xs text-rose-600 hover:text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>মুছুন</span>
                            </button>
                          )}
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            প্রতিষ্ঠানের নামঃ
                          </label>
                          <input
                            type="text"
                            placeholder="কোম্পানি বা প্রতিষ্ঠানের নাম..."
                            value={row.organization}
                            onChange={(e) => {
                              const copy = [...data.experience_history];
                              copy[idx].organization = e.target.value;
                              setData('experience_history', copy);
                            }}
                            className="w-full bg-slate-50 focus:bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[42px] transition placeholder:text-slate-400"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              পদবীঃ
                            </label>
                            <input
                              type="text"
                              placeholder="যেমন: ম্যানেজার / অফিসার"
                              value={row.designation}
                              onChange={(e) => {
                                const copy = [...data.experience_history];
                                copy[idx].designation = e.target.value;
                                setData('experience_history', copy);
                              }}
                              className="w-full bg-slate-50 focus:bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[42px]"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              প্রতিষ্ঠান/ব্যবসার ধরণঃ
                            </label>
                            <input
                              type="text"
                              placeholder="যেমন: সার্ভিস / ম্যানুফ্যাকচারিং"
                              value={row.type}
                              onChange={(e) => {
                                const copy = [...data.experience_history];
                                copy[idx].type = e.target.value;
                                setData('experience_history', copy);
                              }}
                              className="w-full bg-slate-50 focus:bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[42px]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            সময়কালঃ
                          </label>
                          <input
                            type="text"
                            placeholder="যেমন: ১ বছর / ২ বছর"
                            value={row.duration}
                            onChange={(e) => {
                              const copy = [...data.experience_history];
                              copy[idx].duration = e.target.value;
                              setData('experience_history', copy);
                            }}
                            className="w-full bg-slate-50 focus:bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[42px]"
                          />
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addExperienceRow}
                      className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 border border-dashed border-emerald-400 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ আরও অভিজ্ঞতা যোগ করুন</span>
                    </button>
                  </div>

                  {/* Desktop Table View (Tablet & PC) */}
                  <div className="hidden sm:block border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm -mx-1 sm:mx-0">
                    <div className="overflow-x-auto">
                      <table className="min-w-[850px] w-full text-left text-xs text-slate-700 border-collapse">
                        <thead className="bg-slate-100 text-slate-800 font-semibold">
                          <tr>
                            <th className="p-3 border-b border-r border-slate-200 w-16 text-center">ক্রমিক নং</th>
                            <th className="p-3 border-b border-r border-slate-200 min-w-[230px]">প্রতিষ্ঠানের নাম</th>
                            <th className="p-3 border-b border-r border-slate-200 min-w-[170px]">পদবী</th>
                            <th className="p-3 border-b border-r border-slate-200 min-w-[130px]">সময়কাল</th>
                            <th className="p-3 border-b border-r border-slate-200 min-w-[220px]">প্রতিষ্ঠান/ ব্যবসার ধরণ</th>
                            <th className="p-3 border-b border-slate-200 text-center w-12">মুছুন</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {data.experience_history.map((row, idx) => (
                            <tr key={idx} className="bg-white hover:bg-slate-50/50">
                              <td className="p-2.5 border-r border-slate-200 text-center text-slate-500 font-medium">{idx + 1}</td>
                              <td className="p-2.5 border-r border-slate-200">
                                <input
                                  type="text"
                                  placeholder="কোম্পানির নাম"
                                  value={row.organization}
                                  onChange={(e) => {
                                    const copy = [...data.experience_history];
                                    copy[idx].organization = e.target.value;
                                    setData('experience_history', copy);
                                  }}
                                  className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm sm:text-xs text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[40px] sm:min-h-[36px]"
                                />
                              </td>
                              <td className="p-2.5 border-r border-slate-200">
                                <input
                                  type="text"
                                  placeholder="ম্যানেজার / অফিসার"
                                  value={row.designation}
                                  onChange={(e) => {
                                    const copy = [...data.experience_history];
                                    copy[idx].designation = e.target.value;
                                    setData('experience_history', copy);
                                  }}
                                  className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm sm:text-xs text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[40px] sm:min-h-[36px]"
                                />
                              </td>
                              <td className="p-2.5 border-r border-slate-200">
                                <input
                                  type="text"
                                  placeholder="১ বছর / ২ বছর"
                                  value={row.duration}
                                  onChange={(e) => {
                                    const copy = [...data.experience_history];
                                    copy[idx].duration = e.target.value;
                                    setData('experience_history', copy);
                                  }}
                                  className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm sm:text-xs text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[40px] sm:min-h-[36px]"
                                />
                              </td>
                              <td className="p-2.5 border-r border-slate-200">
                                <input
                                  type="text"
                                  placeholder="সার্ভিস / ম্যানুফ্যাকচারিং"
                                  value={row.type}
                                  onChange={(e) => {
                                    const copy = [...data.experience_history];
                                    copy[idx].type = e.target.value;
                                    setData('experience_history', copy);
                                  }}
                                  className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm sm:text-xs text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[40px] sm:min-h-[36px]"
                                />
                              </td>
                              <td className="p-2.5 text-center align-middle">
                                {data.experience_history.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeExperienceRow(idx)}
                                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                                    title="সারি মুছুন"
                                  >
                                    <Trash2 className="w-4 h-4 mx-auto" />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* 18. তথ্যের উৎস */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <label className="block text-xs font-semibold text-slate-700">
                    ১৮. কোন উৎস হতে উদ্যোক্তা উন্নয়ন প্রোগ্রাম সম্পর্কে জানতে পেরেছেনঃ
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      '১) ব্যাংকের মাধ্যমে',
                      '২) Facebook/Social Media এর মাধ্যমে',
                      '৩) BB website এর মাধ্যমে',
                      '৪) বিজ্ঞাপনের মাধ্যমে',
                      '৫) আত্মীয়-স্বজনের মাধ্যমে'
                    ].map((src, i) => (
                      <label key={i} className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer p-2 rounded-lg bg-white border border-slate-200 hover:border-emerald-500/30">
                        <input
                          type="radio"
                          name="info_source"
                          value={src}
                          checked={data.info_source === src}
                          onChange={(e) => setData('info_source', e.target.value)}
                          className="text-emerald-600 focus:ring-0 bg-transparent border-slate-300"
                        />
                        <span>{src}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Next button for Part 1 */}
                {viewMode === 'interactive' && (
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => handleAction('draft')}
                      disabled={processing || isDraftSaving}
                      className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-semibold transition cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5 text-amber-700" />
                      <span>{isDraftSaving ? 'সংরক্ষণ হচ্ছে...' : 'খসড়া সংরক্ষণ (Draft)'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('part2')}
                      className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition shadow-lg shadow-emerald-600/30 cursor-pointer"
                    >
                      <span>পরবর্তী ধাপ (পার্ট-২)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}


            {/* ========================================================================= */}
            {/* PART 2: নতুন ব্যবসায়িক আইডিয়া এবং পরিকল্পনা সংক্রান্ত তথ্যাদি */}
            {/* ========================================================================= */}
            {(viewMode === 'document' || activeTab === 'part2') && (
              <div className="space-y-6 pt-6 border-t border-slate-200">
                <div className="pb-3 border-b border-slate-200">
                  <h4 className="text-base font-bold text-emerald-400 flex items-center space-x-2">
                    <span className="w-7 h-7 rounded-md bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-sm font-bold bn-num">২</span>
                    <span>পার্ট-II: নতুন ব্যবসায়িক আইডিয়া এবং পরিকল্পনা সংক্রান্ত তথ্যাদিঃ</span>
                  </h4>
                </div>

                {/* ক. নতুন ব্যবসায়িক আইডিয়া সংক্রান্ত তথ্যাদি */}
                <div className="space-y-4">
                  <h5 className="text-sm font-semibold text-amber-800 border-l-2 border-amber-400 pl-2">
                    ক. নতুন ব্যবসায়িক আইডিয়া সংক্রান্ত তথ্যাদি
                  </h5>

                  {/* 01 */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      ০১. উদ্যোগ/সৃজনশীল ব্যবসায়িক ধারণার সংক্ষিপ্ত বিবরণঃ <Required />
                    </label>
                    <textarea
                      rows={3}
                      placeholder="আপনার উদ্যোগ বা উদ্ভাবনী ব্যবসায়িক ধারণার বিস্তারিত লিখুন..."
                      value={data.idea_description}
                      onChange={(e) => {
                        setData('idea_description', e.target.value);
                        clearMissing('idea_description');
                      }}
                      className={`w-full bg-white border rounded-lg p-3 text-xs text-slate-900 focus:outline-none transition ${
                        isMissing('idea_description')
                          ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-400'
                          : 'border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600'
                      }`}
                    />
                  </div>

                  {/* 02 */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      ০২. প্রশিক্ষণ শেষে কত সময়ের মধ্যে ব্যবসায় শুরু করার পরিকল্পনা রয়েছে? : <Required />
                    </label>
                    <select
                      value={BUSINESS_START_TIMELINES.includes(data.business_start_timeline) ? data.business_start_timeline : (data.business_start_timeline ? '__other__' : '')}
                      onChange={(e) => {
                        const val = e.target.value;
                        setData('business_start_timeline', val === '__other__' ? 'অন্যান্য' : val);
                        if (val && val !== '__other__') clearMissing('business_start_timeline');
                      }}
                      className={`w-full bg-white border rounded-lg px-3 py-2.5 sm:py-2 text-sm sm:text-xs text-slate-900 focus:outline-none min-h-[42px] sm:min-h-[38px] transition ${
                        isMissing('business_start_timeline')
                          ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-400'
                          : 'border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600'
                      }`}
                    >
                      <option value="">পরিকল্পিত সময়সীমা নির্বাচন করুন</option>
                      <option value="__other__">✏️ অন্যান্য / নিজে লিখুন</option>
                      {BUSINESS_START_TIMELINES.map((tl) => (
                        <option key={tl} value={tl}>{tl}</option>
                      ))}
                    </select>
                    {(!BUSINESS_START_TIMELINES.includes(data.business_start_timeline) && data.business_start_timeline) && (
                      <input
                        type="text"
                        placeholder="পরিকল্পিত সময়সীমা বিস্তারিত লিখুন..."
                        value={data.business_start_timeline === 'অন্যান্য' ? '' : data.business_start_timeline}
                        onChange={(e) => {
                          setData('business_start_timeline', e.target.value || 'অন্যান্য');
                          if (e.target.value.trim()) clearMissing('business_start_timeline');
                        }}
                        className="w-full bg-white border border-emerald-400 rounded-lg px-3 py-2 sm:py-1.5 text-sm sm:text-xs text-slate-900 focus:border-emerald-600 focus:outline-none placeholder:text-slate-400 mt-1.5 min-h-[40px] sm:min-h-[36px] transition"
                        autoFocus
                      />
                    )}
                  </div>

                  {/* 03 */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      ০৩. প্রয়োজনীয় মূলধনের পরিমাণ ও অর্থায়ন পরিকল্পনাঃ <Required />
                    </label>
                    <textarea
                      rows={2}
                      placeholder="মোট মূলধনের পরিমাণ এবং নিজস্ব ও ঋণের উৎস সম্পর্কিত পরিকল্পনা লিখুন..."
                      value={data.capital_financing_plan}
                      onChange={(e) => {
                        setData('capital_financing_plan', e.target.value);
                        clearMissing('capital_financing_plan');
                      }}
                      className={`w-full bg-white border rounded-lg p-3 text-xs text-slate-900 focus:outline-none transition ${
                        isMissing('capital_financing_plan')
                          ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-400'
                          : 'border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600'
                      }`}
                    />
                  </div>

                  {/* 04 & 05 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <label className="block text-xs font-semibold text-slate-700">
                        ০৪. ব্যবসায়ের ধরণ (ম্যানুফেকচারিং, সার্ভিসেস/ট্রেডিং) ও বিবরণঃ <Required />
                      </label>
                      <select
                        value={BUSINESS_CATEGORIES.includes(data.business_category) && data.business_category !== 'অন্যান্য' ? data.business_category : (data.business_category ? '__other__' : '')}
                        onChange={(e) => {
                          const val = e.target.value;
                          setData('business_category', val === '__other__' ? 'অন্যান্য' : val);
                          if (val && val !== '__other__') clearMissing('business_category');
                        }}
                        className={`w-full bg-white border rounded-lg px-3 py-2.5 sm:py-2 text-sm sm:text-xs text-slate-900 mb-2 focus:outline-none min-h-[42px] sm:min-h-[38px] transition ${
                          isMissing('business_category')
                            ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-400'
                            : 'border-slate-300 focus:border-emerald-600'
                        }`}
                      >
                        <option value="">ক্যাটাগরি নির্বাচন করুন</option>
                        <option value="__other__">✏️ অন্যান্য ধরণ / নিজে লিখুন</option>
                        {BUSINESS_CATEGORIES.filter(cat => cat !== 'অন্যান্য').map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      {((!BUSINESS_CATEGORIES.includes(data.business_category) || data.business_category === 'অন্যান্য') && data.business_category) && (
                        <input
                          type="text"
                          placeholder="ব্যবসায়ের ধরণ / ক্যাটাগরি নিজে লিখুন..."
                          value={data.business_category === 'অন্যান্য' ? '' : data.business_category}
                          onChange={(e) => {
                            setData('business_category', e.target.value || 'অন্যান্য');
                            if (e.target.value.trim()) clearMissing('business_category');
                          }}
                          className="w-full bg-white border border-emerald-400 rounded-lg px-3 py-2 sm:py-1.5 text-sm sm:text-xs text-slate-900 focus:border-emerald-600 focus:outline-none placeholder:text-slate-400 mb-2 min-h-[40px] sm:min-h-[36px] transition"
                          autoFocus
                        />
                      )}
                      <input
                        type="text"
                        placeholder="ধরণের বিস্তারিত বিবরণ লিখুন"
                        value={data.business_category_details}
                        onChange={(e) => setData('business_category_details', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900"
                      />
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <label className="block text-xs font-semibold text-slate-700">
                        ০৫. ব্যবসায়ের সম্ভাব্য অবস্থানঃ <Required />
                      </label>
                      <input
                        type="text"
                        placeholder="যেমন: কেরানীগঞ্জ, ঢাকা"
                        value={data.expected_location}
                        onChange={(e) => {
                          setData('expected_location', e.target.value);
                          clearMissing('expected_location');
                        }}
                        className={`w-full bg-white border rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none transition ${
                          isMissing('expected_location')
                            ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-400'
                            : 'border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600'
                        }`}
                      />
                    </div>
                  </div>

                  {/* 06 & 07 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <label className="block text-xs font-semibold text-slate-700">
                        ০৬. পণ্যের ধরণ (আমদানির বিকল্প পণ্য বা রপ্তানীযোগ্য পণ্য কিনা?)ঃ <Required />
                      </label>
                      <select
                        value={PRODUCT_TYPES.includes(data.product_type) ? data.product_type : (data.product_type ? '__other__' : '')}
                        onChange={(e) => {
                          const val = e.target.value;
                          setData('product_type', val === '__other__' ? 'অন্যান্য' : val);
                          if (val && val !== '__other__') clearMissing('product_type');
                        }}
                        className={`w-full bg-white border rounded-lg px-3 py-2.5 sm:py-2 text-sm sm:text-xs text-slate-900 focus:outline-none min-h-[42px] sm:min-h-[38px] transition ${
                          isMissing('product_type')
                            ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-400'
                            : 'border-slate-300 focus:border-emerald-600'
                        }`}
                      >
                        <option value="">পণ্যের ধরণ নির্বাচন করুন</option>
                        <option value="__other__">✏️ অন্যান্য পণ্য / নিজে লিখুন</option>
                        {PRODUCT_TYPES.map((pt) => (
                          <option key={pt} value={pt}>{pt}</option>
                        ))}
                      </select>
                      {(!PRODUCT_TYPES.includes(data.product_type) && data.product_type) && (
                        <input
                          type="text"
                          placeholder="পণ্যের ধরণ বিস্তারিত লিখুন..."
                          value={data.product_type === 'অন্যান্য' ? '' : data.product_type}
                          onChange={(e) => {
                            setData('product_type', e.target.value || 'অন্যান্য');
                            if (e.target.value.trim()) clearMissing('product_type');
                          }}
                          className="w-full bg-white border border-emerald-400 rounded-lg px-3 py-2 sm:py-1.5 text-sm sm:text-xs text-slate-900 focus:border-emerald-600 focus:outline-none placeholder:text-slate-400 mt-1.5 min-h-[40px] sm:min-h-[36px] transition"
                          autoFocus
                        />
                      )}
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <label className="block text-xs font-semibold text-slate-700">
                        ০৭. পণ্যের বাজার (অভ্যন্তরীণ/আন্তর্জাতিক) : <Required />
                      </label>
                      <select
                        value={PRODUCT_MARKET_SCOPES.includes(data.market_scope) ? data.market_scope : (data.market_scope ? '__other__' : '')}
                        onChange={(e) => {
                          const val = e.target.value;
                          setData('market_scope', val === '__other__' ? 'অন্যান্য' : val);
                          if (val && val !== '__other__') clearMissing('market_scope');
                        }}
                        className={`w-full bg-white border rounded-lg px-3 py-2.5 sm:py-2 text-sm sm:text-xs text-slate-900 focus:outline-none min-h-[42px] sm:min-h-[38px] transition ${
                          isMissing('market_scope')
                            ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-400'
                            : 'border-slate-300 focus:border-emerald-600'
                        }`}
                      >
                        <option value="">পণ্যের বাজার নির্বাচন করুন</option>
                        <option value="__other__">✏️ অন্যান্য বাজার / নিজে লিখুন</option>
                        {PRODUCT_MARKET_SCOPES.map((ms) => (
                          <option key={ms} value={ms}>{ms}</option>
                        ))}
                      </select>
                      {(!PRODUCT_MARKET_SCOPES.includes(data.market_scope) && data.market_scope) && (
                        <input
                          type="text"
                          placeholder="পণ্যের বাজার বিস্তারিত লিখুন..."
                          value={data.market_scope === 'অন্যান্য' ? '' : data.market_scope}
                          onChange={(e) => {
                            setData('market_scope', e.target.value || 'অন্যান্য');
                            if (e.target.value.trim()) clearMissing('market_scope');
                          }}
                          className="w-full bg-white border border-emerald-400 rounded-lg px-3 py-2 sm:py-1.5 text-sm sm:text-xs text-slate-900 focus:border-emerald-600 focus:outline-none placeholder:text-slate-400 mt-1.5 min-h-[40px] sm:min-h-[36px] transition"
                          autoFocus
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* খ. ব্যবসায়িক পরিকল্পনা সংক্রান্ত তথ্যাদি */}
                <div className="space-y-4 pt-4 border-t border-slate-200">
                  <h5 className="text-sm font-semibold text-amber-800 border-l-2 border-amber-400 pl-2">
                    খ. ব্যবসায়িক পরিকল্পনা সংক্রান্ত তথ্যাদি
                  </h5>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      i) চলমান ব্যবসায়ের বিবরণ (যদি থাকে) ঃ-
                    </label>
                    <textarea
                      rows={2}
                      placeholder="বর্তমান কোনো ব্যবসা চালু থাকলে তার বিবরণ লিখুন..."
                      value={data.ongoing_business_details}
                      onChange={(e) => setData('ongoing_business_details', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-3 text-xs text-slate-900"
                    />
                  </div>

                  <p className="text-xs font-bold text-slate-800">
                    ii) প্রশিক্ষণ সমাপনান্তে গৃহীতব্য পরিকল্পনাঃ
                  </p>

                  <div className="space-y-4">
                    {/* Plan 01: Expand employees */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <label className="block text-xs font-semibold text-slate-700">
                        ০১. চলমান ব্যবসায় সম্প্রসারণসহ কর্মী বাড়ানোর কোন পরিকল্পনা রয়েছে কিনা? :
                      </label>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <div className="flex items-center space-x-1 bg-white border border-slate-300 p-1 rounded-lg shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setData('plan_expand_employees', 'হ্যাঁ, ব্যবসায় সম্প্রসারণের সাথে নতুন কর্মী নিয়োগের পরিকল্পনা রয়েছে');
                            }}
                            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center space-x-1 cursor-pointer transition ${
                              data.plan_expand_employees.startsWith('হ্যাঁ') ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>হ্যাঁ</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setData('plan_expand_employees', 'না, বর্তমান কর্মী দিয়েই ব্যবসা পরিচালনা করা হবে, নতুন কর্মী নিয়োগের পরিকল্পনা নেই');
                            }}
                            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center space-x-1 cursor-pointer transition ${
                              data.plan_expand_employees.startsWith('না') ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>না</span>
                          </button>
                        </div>
                        <input
                          type="text"
                          placeholder="এখানে আপনার কারণ বা বিবরণ লিখুন..."
                          value={data.plan_expand_employees}
                          onChange={(e) => setData('plan_expand_employees', e.target.value)}
                          className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 italic flex items-center space-x-1 pl-1">
                        <span>💡</span>
                        <span>প্রয়োজনে আপনি আপনার নিজস্ব কারণ বা বিবরণও নিজের মতো এডিট/লিখতে পারেন।</span>
                      </p>
                    </div>

                    {/* Plan 02: Increase financial involvement */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <label className="block text-xs font-semibold text-slate-700">
                        ০২. ব্যবসায়িক খাতে বর্ধিত আর্থিক সংশ্লিষ্টতা বাড়ানোর পরিকল্পনা আছে কিনা? :
                      </label>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <div className="flex items-center space-x-1 bg-white border border-slate-300 p-1 rounded-lg shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setData('plan_increase_financial_involvement', 'হ্যাঁ, ব্যবসায়িক প্রবৃদ্ধি অর্জনে পর্যায়ক্রমে অতিরিক্ত মূলধন বিনিয়োগের পরিকল্পনা রয়েছে');
                            }}
                            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center space-x-1 cursor-pointer transition ${
                              data.plan_increase_financial_involvement.startsWith('হ্যাঁ') ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>হ্যাঁ</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setData('plan_increase_financial_involvement', 'না, আপাতত বর্তমান মূলধনেই ব্যবসা পরিচালনা করা হবে, অতিরিক্ত বিনিয়োগের পরিকল্পনা নেই');
                            }}
                            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center space-x-1 cursor-pointer transition ${
                              data.plan_increase_financial_involvement.startsWith('না') ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>না</span>
                          </button>
                        </div>
                        <input
                          type="text"
                          placeholder="এখানে আপনার কারণ বা বিবরণ লিখুন..."
                          value={data.plan_increase_financial_involvement}
                          onChange={(e) => setData('plan_increase_financial_involvement', e.target.value)}
                          className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 italic flex items-center space-x-1 pl-1">
                        <span>💡</span>
                        <span>প্রয়োজনে আপনি আপনার নিজস্ব কারণ বা বিবরণও নিজের মতো এডিট/লিখতে পারেন।</span>
                      </p>
                    </div>

                    {/* Plan 03: Ways to increase finance (Dropdown only) */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <label className="block text-xs font-semibold text-slate-700">
                        ০৩. কি উপায়ে উক্ত আর্থিক সংশ্লিষ্টতা বাড়ানো হবে? :
                      </label>
                      <select
                        value={WAYS_TO_INCREASE_FINANCE.includes(data.way_to_increase_finance) && data.way_to_increase_finance !== 'অন্যান্য উৎস' ? data.way_to_increase_finance : (data.way_to_increase_finance ? '__other__' : '')}
                        onChange={(e) => {
                          const val = e.target.value;
                          setData('way_to_increase_finance', val === '__other__' ? 'অন্যান্য' : val);
                        }}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 sm:py-2 text-sm sm:text-xs text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[42px] sm:min-h-[38px]"
                      >
                        <option value="">অর্থায়ন বৃদ্ধির উপায় নির্বাচন করুন</option>
                        <option value="__other__">✏️ অন্যান্য উৎস / নিজে লিখুন</option>
                        {WAYS_TO_INCREASE_FINANCE.filter(w => w !== 'অন্যান্য উৎস').map((way) => (
                          <option key={way} value={way}>{way}</option>
                        ))}
                      </select>
                      {((!WAYS_TO_INCREASE_FINANCE.includes(data.way_to_increase_finance) || data.way_to_increase_finance === 'অন্যান্য' || data.way_to_increase_finance === 'অন্যান্য উৎস') && data.way_to_increase_finance) && (
                        <input
                          type="text"
                          placeholder="অর্থায়ন বৃদ্ধির নিজস্ব উৎস বা পরিকল্পনা লিখুন..."
                          value={data.way_to_increase_finance === 'অন্যান্য' || data.way_to_increase_finance === 'অন্যান্য উৎস' ? '' : data.way_to_increase_finance}
                          onChange={(e) => setData('way_to_increase_finance', e.target.value || 'অন্যান্য')}
                          className="w-full bg-white border border-emerald-400 rounded-lg px-3 py-2 sm:py-1.5 text-sm sm:text-xs text-slate-900 focus:border-emerald-600 focus:outline-none placeholder:text-slate-400 mt-1.5 min-h-[40px] sm:min-h-[36px] transition"
                          autoFocus
                        />
                      )}
                    </div>

                    {/* Plan 04: Product Quality Change */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <label className="block text-xs font-semibold text-slate-700">
                        ০৪. পণ্য/ সেবার ধরণ/মান পরিবর্তন করা হবে কিনা?ঃ
                      </label>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <div className="flex items-center space-x-1 bg-white border border-slate-300 p-1 rounded-lg shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setData('plan_product_quality_change', 'হ্যাঁ, আধুনিক প্রযুক্তি ও উন্নত কাঁচামাল ব্যবহারের মাধ্যমে পণ্য ও সেবার গুণগত মান বৃদ্ধি করা হবে');
                            }}
                            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center space-x-1 cursor-pointer transition ${
                              data.plan_product_quality_change.startsWith('হ্যাঁ') ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>হ্যাঁ</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setData('plan_product_quality_change', 'না, বিদ্যমান পণ্য ও সেবার মান ও বৈশিষ্ট্য অপরিবর্তিত রাখা হবে');
                            }}
                            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center space-x-1 cursor-pointer transition ${
                              data.plan_product_quality_change.startsWith('না') ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>না</span>
                          </button>
                        </div>
                        <input
                          type="text"
                          placeholder="এখানে আপনার কারণ বা বিবরণ লিখুন..."
                          value={data.plan_product_quality_change}
                          onChange={(e) => setData('plan_product_quality_change', e.target.value)}
                          className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 italic flex items-center space-x-1 pl-1">
                        <span>💡</span>
                        <span>প্রয়োজনে আপনি আপনার নিজস্ব কারণ বা বিবরণও নিজের মতো এডিট/লিখতে পারেন।</span>
                      </p>
                    </div>

                    {/* Plan 05: Financial records */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <label className="block text-xs font-semibold text-slate-700">
                        ০৫. দৈনন্দিন ব্যবসায়িক লেনদেন হিসাবভুক্ত করত: প্রয়োজনীয় আর্থিক বিবরণী সংরক্ষণের পরিকল্পনা আছে কিনা? :
                      </label>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <div className="flex items-center space-x-1 bg-white border border-slate-300 p-1 rounded-lg shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setData('plan_maintain_financial_records', 'হ্যাঁ, ক্যাশ মেমো, লেজার খাতা ও নিয়মিত অ্যাকাউন্টিং সফটওয়্যারের মাধ্যমে আর্থিক বিবরণী সংরক্ষণ করা হবে');
                            }}
                            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center space-x-1 cursor-pointer transition ${
                              data.plan_maintain_financial_records.startsWith('হ্যাঁ') ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>হ্যাঁ</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setData('plan_maintain_financial_records', 'না, সাধারণ সনাতন খতিয়ান পদ্ধতি চালু থাকবে, পৃথক আধুনিক হিসাব সংরক্ষণের পরিকল্পনা নেই');
                            }}
                            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center space-x-1 cursor-pointer transition ${
                              data.plan_maintain_financial_records.startsWith('না') ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>না</span>
                          </button>
                        </div>
                        <input
                          type="text"
                          placeholder="এখানে আপনার কারণ বা বিবরণ লিখুন..."
                          value={data.plan_maintain_financial_records}
                          onChange={(e) => setData('plan_maintain_financial_records', e.target.value)}
                          className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 italic flex items-center space-x-1 pl-1">
                        <span>💡</span>
                        <span>প্রয়োজনে আপনি আপনার নিজস্ব কারণ বা বিবরণও নিজের মতো এডিট/লিখতে পারেন।</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stepper Buttons for Part 2 */}
                {viewMode === 'interactive' && (
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setActiveTab('part1')}
                      className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-sm font-medium text-sm transition cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>পূর্ববর্তী ধাপ (পার্ট-১)</span>
                    </button>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleAction('draft')}
                        disabled={processing || isDraftSaving}
                        className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-semibold transition cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5 text-amber-700" />
                        <span>{isDraftSaving ? 'সংরক্ষণ হচ্ছে...' : 'খসড়া সংরক্ষণ'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('part3')}
                        className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition shadow-lg shadow-emerald-600/30 cursor-pointer"
                      >
                        <span>পরবর্তী ধাপ (পার্ট-৩)</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}


            {/* ========================================================================= */}
            {/* PART 3: ব্যবসায় সম্পর্কিত তথ্যাবলী (BUSINESS & FINANCIALS) */}
            {/* ========================================================================= */}
            {(viewMode === 'document' || activeTab === 'part3') && (
              <div className="space-y-6 pt-6 border-t border-slate-200">
                <div className="pb-3 border-b border-slate-200">
                  <h4 className="text-base font-bold text-emerald-400 flex items-center space-x-2">
                    <span className="w-7 h-7 rounded-md bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-sm font-bold bn-num">৩</span>
                    <span>পার্ট-III: ব্যবসায় সম্পর্কিত তথ্যাবলীঃ</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 italic">
                    (অংশগ্রহণকারী বর্তমানে কোনরূপ ব্যবসায় নিয়োজিত থাকলে তার বিবরণ অথবা যে ব্যবসা করতে ইচ্ছুক তার বিবরণঃ-)
                  </p>
                </div>

                {/* 01 & 02: Business Type & Trade License */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      ০১. ব্যবসায়ের ধরণঃ
                    </label>
                    <select
                      value={EXISTING_BUSINESS_TYPES.includes(data.existing_business_type) ? data.existing_business_type : (data.existing_business_type ? '__other__' : '')}
                      onChange={(e) => {
                        const val = e.target.value;
                        setData('existing_business_type', val === '__other__' ? 'অন্যান্য' : val);
                      }}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 sm:py-2 text-sm sm:text-xs text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[42px] sm:min-h-[38px]"
                    >
                      <option value="">ব্যবসায়ের ধরণ নির্বাচন করুন</option>
                      <option value="__other__">✏️ অন্যান্য ব্যবসা / নিজে লিখুন</option>
                      {EXISTING_BUSINESS_TYPES.map((bt) => (
                        <option key={bt} value={bt}>{bt}</option>
                      ))}
                    </select>
                    {(!EXISTING_BUSINESS_TYPES.includes(data.existing_business_type) && data.existing_business_type) && (
                      <input
                        type="text"
                        placeholder="ব্যবসায়ের ধরণ বিস্তারিত লিখুন..."
                        value={data.existing_business_type === 'অন্যান্য' ? '' : data.existing_business_type}
                        onChange={(e) => setData('existing_business_type', e.target.value || 'অন্যান্য')}
                        className="w-full bg-white border border-emerald-400 rounded-lg px-3 py-2 sm:py-1.5 text-sm sm:text-xs text-slate-900 focus:border-emerald-600 focus:outline-none placeholder:text-slate-400 mt-1.5 min-h-[40px] sm:min-h-[36px] transition"
                        autoFocus
                      />
                    )}
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      ০২. ট্রেড লাইসেন্স আছে কিনা (হ্যাঁ/ না) ও তারিখঃ
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <select
                        value={data.has_trade_license ? 'yes' : 'no'}
                        onChange={(e) => setData('has_trade_license', e.target.value === 'yes')}
                        className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900"
                      >
                        <option value="no">না</option>
                        <option value="yes">হ্যাঁ</option>
                      </select>
                      <input
                        type="date"
                        value={data.trade_license_date}
                        onChange={(e) => setData('trade_license_date', e.target.value)}
                        className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                {/* 03 - 07: Financial Feasibility Grid */}
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                  <h5 className="text-xs font-bold text-amber-800 flex items-center space-x-2">
                    <DollarSign className="w-4 h-4" />
                    <span>আর্থিক প্রাক্কলন ও বিক্রয় হিসাব (টাকায়)</span>
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        ০৩. পণ্য/সেবার গড় বিক্রয় মূল্যঃ <Required />
                      </label>
                      <input
                        type="number"
                        placeholder="৳ মূল্য"
                        value={data.avg_selling_price}
                        onChange={(e) => {
                          setData('avg_selling_price', e.target.value);
                          clearMissing('avg_selling_price');
                        }}
                        className={`w-full bg-white border rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none transition ${
                          isMissing('avg_selling_price')
                            ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-400'
                            : 'border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        ০৪. দৈনিক বিক্রয়ের পরিমাণঃ <Required />
                      </label>
                      <input
                        type="number"
                        placeholder="৳ দৈনিক বিক্রয়"
                        value={data.daily_sales_amount}
                        onChange={(e) => {
                          setData('daily_sales_amount', e.target.value);
                          clearMissing('daily_sales_amount');
                        }}
                        className={`w-full bg-white border rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none transition ${
                          isMissing('daily_sales_amount')
                            ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-400'
                            : 'border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        ০৫. মাসিক সম্ভাব্য বিক্রয়ের পরিমাণঃ
                      </label>
                      <input
                        type="number"
                        placeholder="৳ মাসিক মোট বিক্রয়"
                        value={data.monthly_sales_amount}
                        onChange={(e) => setData('monthly_sales_amount', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        ০৬. কাঁচামাল ও মাসিক সম্ভাব্য খরচঃ <Required />
                      </label>
                      <input
                        type="number"
                        placeholder="৳ মাসিক মোট খরচ"
                        value={data.monthly_raw_operational_cost}
                        onChange={(e) => {
                          setData('monthly_raw_operational_cost', e.target.value);
                          clearMissing('monthly_raw_operational_cost');
                        }}
                        className={`w-full bg-white border rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none transition ${
                          isMissing('monthly_raw_operational_cost')
                            ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-400'
                            : 'border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-emerald-400 mb-1">
                        ০৭. মাসিক সম্ভাব্য লাভ/মুনাফাঃ (Auto)
                      </label>
                      <input
                        type="number"
                        readOnly
                        value={data.monthly_estimated_profit}
                        className="w-full bg-white border border-emerald-500/40 rounded-lg px-3 py-2 text-xs text-emerald-800 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        ০৯. ব্যবসায় মোট বিনিয়োগের পরিমাণঃ <Required />
                      </label>
                      <input
                        type="number"
                        placeholder="৳ মোট বিনিয়োগ"
                        value={data.total_investment_amount}
                        onChange={(e) => {
                          setData('total_investment_amount', e.target.value);
                          clearMissing('total_investment_amount');
                        }}
                        className={`w-full bg-white border rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none transition ${
                          isMissing('total_investment_amount')
                            ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-400'
                            : 'border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* 08, 10, 11, 12, 13: Qualitative info */}
                <div className="space-y-3">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      ০৮. উদ্যোক্তা কিভাবে আলোচ্য ব্যবসায়ের সাথে জড়িত হয়েছেন/ ব্যবসায়ের আইডিয়া কিভাবে পেয়েছেন ঃ
                    </label>
                    <textarea
                      rows={2}
                      value={data.business_involvement_reason}
                      onChange={(e) => setData('business_involvement_reason', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-3 text-xs text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <label className="block text-xs font-semibold text-slate-700">
                        ১০. কাঁচামালের উৎস (প্রযোজ্য ক্ষেত্রে)ঃ
                      </label>
                      <input
                        type="text"
                        value={data.raw_material_source}
                        onChange={(e) => setData('raw_material_source', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900"
                      />
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <label className="block text-xs font-semibold text-slate-700">
                        ১১. সম্ভাব্য ক্রেতাঃ
                      </label>
                      <input
                        type="text"
                        value={data.potential_buyers}
                        onChange={(e) => setData('potential_buyers', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <label className="block text-xs font-semibold text-slate-700">
                        ১২. প্রতিযোগী প্রতিষ্ঠানের নাম (কমপক্ষে ৩টি)ঃ
                      </label>
                      <input
                        type="text"
                        placeholder="যেমন: প্রতিষ্ঠান ক, প্রতিষ্ঠান খ, প্রতিষ্ঠান গ"
                        value={data.competitor_names}
                        onChange={(e) => setData('competitor_names', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900"
                      />
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <label className="block text-xs font-semibold text-slate-700">
                        ১৩. পণ্য/সেবা বিপণন এলাকাঃ
                      </label>
                      <input
                        type="text"
                        placeholder="যেমন: ঢাকা মহানগর ও দেশব্যাপী অনলাইন"
                        value={data.marketing_area}
                        onChange={(e) => setData('marketing_area', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                {/* 14. প্রতিযোগী প্রতিষ্ঠানের অবস্থান ও বিশ্লেষণ (TABLE) */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700">
                        ১৪. যে পণ্য/সেবা বিক্রয় করা হয়/হবে বর্তমানে তার অবস্থান কেমন? ঃ
                      </label>
                      <span className="text-[11px] text-amber-700 italic">(কমপক্ষে ৩টি সম্ভাব্য প্রতিযোগী প্রতিষ্ঠানের তথ্য)</span>
                    </div>
                    <button
                      type="button"
                      onClick={addCompetitorRow}
                      className="inline-flex items-center space-x-1 text-xs text-emerald-400 hover:text-emerald-300 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>প্রতিযোগী যোগ করুন</span>
                    </button>
                  </div>

                  {/* Mobile Card View (Phone only: No horizontal scroll needed) */}
                  <div className="sm:hidden space-y-3">
                    {data.competitor_analysis.map((comp, idx) => (
                      <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                          <span className="text-xs font-bold text-emerald-800 flex items-center space-x-1.5">
                            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[11px] font-bold">
                              {idx + 1}
                            </span>
                            <span>{comp.name || `প্রতিযোগী প্রতিষ্ঠান #${idx + 1}`}</span>
                          </span>
                          {data.competitor_analysis.length > 3 && (
                            <button
                              type="button"
                              onClick={() => removeCompetitorRow(idx)}
                              className="inline-flex items-center space-x-1 text-xs text-rose-600 hover:text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>মুছুন</span>
                            </button>
                          )}
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            প্রতিষ্ঠানের নামঃ
                          </label>
                          <input
                            type="text"
                            placeholder="প্রতিযোগী কোম্পানির নাম লিখুন..."
                            value={comp.name}
                            onChange={(e) => {
                              const copy = [...data.competitor_analysis];
                              copy[idx].name = e.target.value;
                              setData('competitor_analysis', copy);
                            }}
                            className="w-full bg-slate-50 focus:bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[42px] transition placeholder:text-slate-400"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            অবস্থানঃ
                          </label>
                          <input
                            type="text"
                            placeholder="এলাকা বা বাজারের নাম..."
                            value={comp.location}
                            onChange={(e) => {
                              const copy = [...data.competitor_analysis];
                              copy[idx].location = e.target.value;
                              setData('competitor_analysis', copy);
                            }}
                            className="w-full bg-slate-50 focus:bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[42px] transition placeholder:text-slate-400"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              দৈনিক উৎপাদনঃ
                            </label>
                            <input
                              type="text"
                              placeholder="উৎপাদনের পরিমাণ..."
                              value={comp.daily_production}
                              onChange={(e) => {
                                const copy = [...data.competitor_analysis];
                                copy[idx].daily_production = e.target.value;
                                setData('competitor_analysis', copy);
                              }}
                              className="w-full bg-slate-50 focus:bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[42px]"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              দৈনিক বিক্রয়ঃ
                            </label>
                            <input
                              type="text"
                              placeholder="বিক্রয়ের পরিমাণ..."
                              value={comp.daily_sales}
                              onChange={(e) => {
                                const copy = [...data.competitor_analysis];
                                copy[idx].daily_sales = e.target.value;
                                setData('competitor_analysis', copy);
                              }}
                              className="w-full bg-slate-50 focus:bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[42px]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              পণ্যের মূল্যঃ
                            </label>
                            <input
                              type="text"
                              placeholder="৳ মূল্য..."
                              value={comp.price}
                              onChange={(e) => {
                                const copy = [...data.competitor_analysis];
                                copy[idx].price = e.target.value;
                                setData('competitor_analysis', copy);
                              }}
                              className="w-full bg-slate-50 focus:bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[42px]"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              আনুমানিক গ্রাহক সংখ্যাঃ
                            </label>
                            <input
                              type="text"
                              placeholder="যেমন: ৫০০+..."
                              value={comp.customer_count}
                              onChange={(e) => {
                                const copy = [...data.competitor_analysis];
                                copy[idx].customer_count = e.target.value;
                                setData('competitor_analysis', copy);
                              }}
                              className="w-full bg-slate-50 focus:bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[42px]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            বিপণন এরিয়া / ভৌগোলিক কাভারেজঃ
                          </label>
                          <input
                            type="text"
                            placeholder="যেমন: স্থানীয় বাজার ও পার্শ্ববর্তী এলাকা..."
                            value={comp.coverage}
                            onChange={(e) => {
                              const copy = [...data.competitor_analysis];
                              copy[idx].coverage = e.target.value;
                              setData('competitor_analysis', copy);
                            }}
                            className="w-full bg-slate-50 focus:bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[42px] transition placeholder:text-slate-400"
                          />
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addCompetitorRow}
                      className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 border border-dashed border-emerald-400 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ আরও প্রতিযোগী প্রতিষ্ঠান যোগ করুন</span>
                    </button>
                  </div>

                  {/* Desktop Table View (Tablet & PC) */}
                  <div className="hidden sm:block border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm -mx-1 sm:mx-0">
                    <div className="overflow-x-auto">
                      <table className="min-w-[1100px] w-full text-left text-xs text-slate-700 border-collapse">
                        <thead className="bg-slate-100 text-slate-800 font-semibold">
                          <tr>
                            <th className="p-3 border-b border-r border-slate-200 w-12 text-center">ক্রমিক</th>
                            <th className="p-3 border-b border-r border-slate-200 min-w-[180px]">প্রতিষ্ঠানের নাম</th>
                            <th className="p-3 border-b border-r border-slate-200 min-w-[150px]">অবস্থান</th>
                            <th className="p-3 border-b border-r border-slate-200 min-w-[140px]">দৈনিক উৎপাদন</th>
                            <th className="p-3 border-b border-r border-slate-200 min-w-[140px]">দৈনিক বিক্রয়</th>
                            <th className="p-3 border-b border-r border-slate-200 min-w-[120px]">পণ্যের মূল্য</th>
                            <th className="p-3 border-b border-r border-slate-200 min-w-[150px]">আনুমানিক গ্রাহক</th>
                            <th className="p-3 border-b border-r border-slate-200 min-w-[200px]">বিপণন এরিয়া/ ভৌগোলিক কাভারেজ</th>
                            <th className="p-3 border-b border-slate-200 text-center w-10">মুছুন</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {data.competitor_analysis.map((comp, idx) => (
                            <tr key={idx} className="bg-white hover:bg-slate-50/50">
                              <td className="p-2.5 border-r border-slate-200 text-center text-slate-500 font-medium">{idx + 1}</td>
                              <td className="p-2.5 border-r border-slate-200">
                                <input
                                  type="text"
                                  placeholder="কোম্পানি"
                                  value={comp.name}
                                  onChange={(e) => {
                                    const copy = [...data.competitor_analysis];
                                    copy[idx].name = e.target.value;
                                    setData('competitor_analysis', copy);
                                  }}
                                  className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm sm:text-xs text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[38px] sm:min-h-[34px]"
                                />
                              </td>
                              <td className="p-2.5 border-r border-slate-200">
                                <input
                                  type="text"
                                  placeholder="এলাকা"
                                  value={comp.location}
                                  onChange={(e) => {
                                    const copy = [...data.competitor_analysis];
                                    copy[idx].location = e.target.value;
                                    setData('competitor_analysis', copy);
                                  }}
                                  className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm sm:text-xs text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[38px] sm:min-h-[34px]"
                                />
                              </td>
                              <td className="p-2.5 border-r border-slate-200">
                                <input
                                  type="text"
                                  placeholder="উৎপাদন"
                                  value={comp.daily_production}
                                  onChange={(e) => {
                                    const copy = [...data.competitor_analysis];
                                    copy[idx].daily_production = e.target.value;
                                    setData('competitor_analysis', copy);
                                  }}
                                  className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm sm:text-xs text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[38px] sm:min-h-[34px]"
                                />
                              </td>
                              <td className="p-2.5 border-r border-slate-200">
                                <input
                                  type="text"
                                  placeholder="বিক্রয়"
                                  value={comp.daily_sales}
                                  onChange={(e) => {
                                    const copy = [...data.competitor_analysis];
                                    copy[idx].daily_sales = e.target.value;
                                    setData('competitor_analysis', copy);
                                  }}
                                  className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm sm:text-xs text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[38px] sm:min-h-[34px]"
                                />
                              </td>
                              <td className="p-2.5 border-r border-slate-200">
                                <input
                                  type="text"
                                  placeholder="মূল্য"
                                  value={comp.price}
                                  onChange={(e) => {
                                    const copy = [...data.competitor_analysis];
                                    copy[idx].price = e.target.value;
                                    setData('competitor_analysis', copy);
                                  }}
                                  className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm sm:text-xs text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[38px] sm:min-h-[34px]"
                                />
                              </td>
                              <td className="p-2.5 border-r border-slate-200">
                                <input
                                  type="text"
                                  placeholder="গ্রাহক"
                                  value={comp.customer_count}
                                  onChange={(e) => {
                                    const copy = [...data.competitor_analysis];
                                    copy[idx].customer_count = e.target.value;
                                    setData('competitor_analysis', copy);
                                  }}
                                  className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm sm:text-xs text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[38px] sm:min-h-[34px]"
                                />
                              </td>
                              <td className="p-2.5 border-r border-slate-200">
                                <input
                                  type="text"
                                  placeholder="কাভারেজ"
                                  value={comp.coverage}
                                  onChange={(e) => {
                                    const copy = [...data.competitor_analysis];
                                    copy[idx].coverage = e.target.value;
                                    setData('competitor_analysis', copy);
                                  }}
                                  className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm sm:text-xs text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[38px] sm:min-h-[34px]"
                                />
                              </td>
                              <td className="p-2.5 text-center align-middle">
                                {data.competitor_analysis.length > 3 && (
                                  <button
                                    type="button"
                                    onClick={() => removeCompetitorRow(idx)}
                                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                                    title="সারি মুছুন"
                                  >
                                    <Trash2 className="w-4 h-4 mx-auto" />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* 15 - 18: Strategic Questions */}
                <div className="space-y-3">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      ১৫. একইরূপ পণ্য/সেবা প্রতিযোগী প্রতিষ্ঠান সরবরাহ করলেও আপনার নিকট থেকে ক্রেতাগণ তা ক্রয় করার কারণঃ
                    </label>
                    <textarea
                      rows={2}
                      value={data.reason_buyers_choose_you}
                      onChange={(e) => setData('reason_buyers_choose_you', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-3 text-xs text-slate-900"
                    />
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      ১৬. অন্যান্য প্রতিযোগী প্রতিষ্ঠানের পণ্য/সেবা হতে আপনার পণ্য/সেবার মূল্য এবং গুণগত মান এর পার্থক্য কিঃ
                    </label>
                    <textarea
                      rows={2}
                      value={data.price_and_quality_difference}
                      onChange={(e) => setData('price_and_quality_difference', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-3 text-xs text-slate-900"
                    />
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      ১৭. বিদ্যমান ব্যবসায় পরিচালনায় সমস্যাসমূহঃ
                    </label>
                    <textarea
                      rows={2}
                      value={data.existing_business_challenges}
                      onChange={(e) => setData('existing_business_challenges', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-3 text-xs text-slate-900"
                    />
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      ১৮. উদ্যোক্তা উন্নয়ন প্রোগ্রামে অংশগ্রহণের কারণঃ
                    </label>
                    <textarea
                      rows={2}
                      value={data.training_participation_reason}
                      onChange={(e) => setData('training_participation_reason', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-3 text-xs text-slate-900"
                    />
                  </div>
                </div>

                {/* Stepper Buttons for Part 3 */}
                {viewMode === 'interactive' && (
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setActiveTab('part2')}
                      className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-sm font-medium text-sm transition cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>পূর্ববর্তী ধাপ (পার্ট-২)</span>
                    </button>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleAction('draft')}
                        disabled={processing || isDraftSaving}
                        className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-semibold transition cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5 text-amber-700" />
                        <span>{isDraftSaving ? 'সংরক্ষণ হচ্ছে...' : 'খসড়া সংরক্ষণ'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('part4')}
                        className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition shadow-lg shadow-emerald-600/30 cursor-pointer"
                      >
                        <span>পরবর্তী ধাপ (পার্ট-৪)</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}


            {/* ========================================================================= */}
            {/* PART 4: অন্যান্য, ব্যাংকিং ও সংযুক্তি */}
            {/* ========================================================================= */}
            {(viewMode === 'document' || activeTab === 'part4') && (
              <div className="space-y-6 pt-6 border-t border-slate-200">
                <div className="pb-3 border-b border-slate-200">
                  <h4 className="text-base font-bold text-emerald-400 flex items-center space-x-2">
                    <span className="w-7 h-7 rounded-md bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-sm font-bold bn-num">৪</span>
                    <span>পার্ট-IV: অন্যান্য ঃ</span>
                  </h4>
                </div>

                {/* 01 - 04: Parents Education & Occupation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">০১. পিতার শিক্ষাগত যোগ্যতা ঃ</label>
                    <select
                      value={PARENTS_EDUCATION_LEVELS.includes(data.father_education) ? data.father_education : (data.father_education ? '__other__' : '')}
                      onChange={(e) => {
                        const val = e.target.value;
                        setData('father_education', val === '__other__' ? 'অন্যান্য' : val);
                      }}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 sm:py-2 text-sm sm:text-xs text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[42px] sm:min-h-[38px]"
                    >
                      <option value="">শিক্ষাগত যোগ্যতা নির্বাচন</option>
                      <option value="__other__">✏️ অন্যান্য / নিজে লিখুন</option>
                      {PARENTS_EDUCATION_LEVELS.map((lvl) => (
                        <option key={lvl} value={lvl}>{lvl}</option>
                      ))}
                    </select>
                    {(!PARENTS_EDUCATION_LEVELS.includes(data.father_education) && data.father_education) && (
                      <input
                        type="text"
                        placeholder="পিতার শিক্ষাগত যোগ্যতা লিখুন..."
                        value={data.father_education === 'অন্যান্য' ? '' : data.father_education}
                        onChange={(e) => setData('father_education', e.target.value || 'অন্যান্য')}
                        className="w-full bg-white border border-emerald-400 rounded-lg px-3 py-2 sm:py-1.5 text-sm sm:text-xs text-slate-900 focus:border-emerald-600 focus:outline-none placeholder:text-slate-400 mt-1.5 min-h-[40px] sm:min-h-[36px] transition"
                        autoFocus
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">০২. পিতার পেশা ঃ</label>
                    <select
                      value={FATHER_OCCUPATIONS.includes(data.father_occupation) ? data.father_occupation : (data.father_occupation ? '__other__' : '')}
                      onChange={(e) => {
                        const val = e.target.value;
                        setData('father_occupation', val === '__other__' ? 'অন্যান্য' : val);
                      }}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 sm:py-2 text-sm sm:text-xs text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[42px] sm:min-h-[38px]"
                    >
                      <option value="">পেশা নির্বাচন করুন</option>
                      <option value="__other__">✏️ অন্যান্য পেশা / নিজে লিখুন</option>
                      {FATHER_OCCUPATIONS.map((occ) => (
                        <option key={occ} value={occ}>{occ}</option>
                      ))}
                    </select>
                    {(!FATHER_OCCUPATIONS.includes(data.father_occupation) && data.father_occupation) && (
                      <input
                        type="text"
                        placeholder="পিতার পেশা বিস্তারিত লিখুন..."
                        value={data.father_occupation === 'অন্যান্য' ? '' : data.father_occupation}
                        onChange={(e) => setData('father_occupation', e.target.value || 'অন্যান্য')}
                        className="w-full bg-white border border-emerald-400 rounded-lg px-3 py-2 sm:py-1.5 text-sm sm:text-xs text-slate-900 focus:border-emerald-600 focus:outline-none placeholder:text-slate-400 mt-1.5 min-h-[40px] sm:min-h-[36px] transition"
                        autoFocus
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">০৩. মাতার শিক্ষাগত যোগ্যতা ঃ</label>
                    <select
                      value={PARENTS_EDUCATION_LEVELS.includes(data.mother_education) ? data.mother_education : (data.mother_education ? '__other__' : '')}
                      onChange={(e) => {
                        const val = e.target.value;
                        setData('mother_education', val === '__other__' ? 'অন্যান্য' : val);
                      }}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 sm:py-2 text-sm sm:text-xs text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[42px] sm:min-h-[38px]"
                    >
                      <option value="">শিক্ষাগত যোগ্যতা নির্বাচন</option>
                      <option value="__other__">✏️ অন্যান্য / নিজে লিখুন</option>
                      {PARENTS_EDUCATION_LEVELS.map((lvl) => (
                        <option key={lvl} value={lvl}>{lvl}</option>
                      ))}
                    </select>
                    {(!PARENTS_EDUCATION_LEVELS.includes(data.mother_education) && data.mother_education) && (
                      <input
                        type="text"
                        placeholder="মাতার শিক্ষাগত যোগ্যতা লিখুন..."
                        value={data.mother_education === 'অন্যান্য' ? '' : data.mother_education}
                        onChange={(e) => setData('mother_education', e.target.value || 'অন্যান্য')}
                        className="w-full bg-white border border-emerald-400 rounded-lg px-3 py-2 sm:py-1.5 text-sm sm:text-xs text-slate-900 focus:border-emerald-600 focus:outline-none placeholder:text-slate-400 mt-1.5 min-h-[40px] sm:min-h-[36px] transition"
                        autoFocus
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">০৪. মাতার পেশা ঃ</label>
                    <select
                      value={MOTHER_OCCUPATIONS.includes(data.mother_occupation) ? data.mother_occupation : (data.mother_occupation ? '__other__' : '')}
                      onChange={(e) => {
                        const val = e.target.value;
                        setData('mother_occupation', val === '__other__' ? 'অন্যান্য' : val);
                      }}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 sm:py-2 text-sm sm:text-xs text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[42px] sm:min-h-[38px]"
                    >
                      <option value="">পেশা নির্বাচন করুন</option>
                      <option value="__other__">✏️ অন্যান্য পেশা / নিজে লিখুন</option>
                      {MOTHER_OCCUPATIONS.map((occ) => (
                        <option key={occ} value={occ}>{occ}</option>
                      ))}
                    </select>
                    {(!MOTHER_OCCUPATIONS.includes(data.mother_occupation) && data.mother_occupation) && (
                      <input
                        type="text"
                        placeholder="মাতার পেশা বিস্তারিত লিখুন..."
                        value={data.mother_occupation === 'অন্যান্য' ? '' : data.mother_occupation}
                        onChange={(e) => setData('mother_occupation', e.target.value || 'অন্যান্য')}
                        className="w-full bg-white border border-emerald-400 rounded-lg px-3 py-2 sm:py-1.5 text-sm sm:text-xs text-slate-900 focus:border-emerald-600 focus:outline-none placeholder:text-slate-400 mt-1.5 min-h-[40px] sm:min-h-[36px] transition"
                        autoFocus
                      />
                    )}
                  </div>
                </div>

                {/* 05 - 08: Income, House, Siblings, Disability */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">০৫. পরিবারের মাসিক আয় ঃ</label>
                    <input
                      type="number"
                      placeholder="৳ মাসিক আয়"
                      value={data.family_monthly_income}
                      onChange={(e) => setData('family_monthly_income', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">০৬. নিজস্ব মালিকানাধীন বাড়ী আছে কিনা? :</label>
                    <div className="flex items-center space-x-4 mt-2">
                      <label className="inline-flex items-center space-x-1.5 text-xs text-slate-700 cursor-pointer">
                        <input
                          type="radio"
                          name="has_own_house"
                          checked={data.has_own_house === true}
                          onChange={() => setData('has_own_house', true)}
                          className="text-emerald-600 focus:ring-0 bg-transparent border-slate-300"
                        />
                        <span>হ্যাঁ</span>
                      </label>
                      <label className="inline-flex items-center space-x-1.5 text-xs text-slate-700 cursor-pointer">
                        <input
                          type="radio"
                          name="has_own_house"
                          checked={data.has_own_house === false}
                          onChange={() => setData('has_own_house', false)}
                          className="text-emerald-600 focus:ring-0 bg-transparent border-slate-300"
                        />
                        <span>না</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">০৭. ভাই-বোনের সংখ্যা ঃ</label>
                    <input
                      type="text"
                      placeholder="যেমন: ২"
                      value={data.siblings_count}
                      onChange={(e) => setData('siblings_count', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">০৮. শারীরিক প্রতিবন্ধকতা ঃ</label>
                    <select
                      value={DISABILITY_OPTIONS.includes(data.physical_disability) ? data.physical_disability : (data.physical_disability ? '__other__' : '')}
                      onChange={(e) => {
                        const val = e.target.value;
                        setData('physical_disability', val === '__other__' ? 'অন্যান্য' : val);
                      }}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 sm:py-2 text-sm sm:text-xs text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[42px] sm:min-h-[38px]"
                    >
                      <option value="">প্রতিবন্ধকতা নির্বাচন করুন</option>
                      <option value="__other__">✏️ অন্যান্য প্রতিবন্ধকতা / নিজে লিখুন</option>
                      {DISABILITY_OPTIONS.map((dis) => (
                        <option key={dis} value={dis}>{dis}</option>
                      ))}
                    </select>
                    {(!DISABILITY_OPTIONS.includes(data.physical_disability) && data.physical_disability) && (
                      <input
                        type="text"
                        placeholder="প্রতিবন্ধকতার ধরণ বা বিবরণ লিখুন..."
                        value={data.physical_disability === 'অন্যান্য' ? '' : data.physical_disability}
                        onChange={(e) => setData('physical_disability', e.target.value || 'অন্যান্য')}
                        className="w-full bg-white border border-emerald-400 rounded-lg px-3 py-2 sm:py-1.5 text-sm sm:text-xs text-slate-900 focus:border-emerald-600 focus:outline-none placeholder:text-slate-400 mt-1.5 min-h-[40px] sm:min-h-[36px] transition"
                        autoFocus
                      />
                    )}
                  </div>
                </div>

                {/* 09: Banking Info */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <label className="block text-xs font-semibold text-slate-700">
                    ০৯. ব্যাংক হিসাব সংক্রান্ত তথ্যাবলী (যদি থাকে) ঃ
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <span className="text-[11px] text-slate-500 block mb-1">ব্যাংক হিসাব নং ঃ</span>
                      <input
                        type="text"
                        placeholder="অ্যাকাউন্ট নম্বর"
                        value={data.bank_account_number}
                        onChange={(e) => setData('bank_account_number', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block mb-1">ব্যাংক ও শাখার নাম ঃ</span>
                      <input
                        type="text"
                        placeholder="যেমন: সোনালী ব্যাংক, মতিঝিল শাখা"
                        value={data.bank_and_branch_name}
                        onChange={(e) => setData('bank_and_branch_name', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block mb-1">শাখার রাউটিং নম্বরঃ</span>
                      <input
                        type="text"
                        placeholder="৯ ডিজিটের রাউটিং নম্বর"
                        value={data.bank_routing_number}
                        onChange={(e) => setData('bank_routing_number', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                {/* আবেদনকারীর স্বাক্ষর ও তারিখ */}
                <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 transition ${
                  isMissing('signature') ? 'border-rose-400 bg-rose-50/30 ring-2 ring-rose-400/40' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      আবেদনকারীর স্বাক্ষর ও তারিখঃ <Required />
                    </label>
                    <p className="text-[11px] text-slate-500">স্বাক্ষরের ছবি বা স্ক্যান কপি আপলোড করুন</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {sigPreview && (
                      <div className="relative h-12 px-3 py-1 bg-white border border-slate-300 rounded-lg flex items-center justify-center shadow-sm">
                        {typeof sigPreview === 'string' && (sigPreview.startsWith('data:image') || sigPreview.startsWith('http') || sigPreview.startsWith('/storage')) ? (
                          <img src={sigPreview} alt="Signature Preview" className="h-10 max-w-[150px] object-contain" />
                        ) : (
                          <span className="text-xs font-mono text-emerald-800 font-bold">{sigPreview}</span>
                        )}
                        <button
                          type="button"
                          onClick={() => { setSigPreview(null); setData('signature', null); }}
                          className="ml-2 text-rose-500 hover:text-rose-700 p-0.5"
                          title="স্বাক্ষর মুছুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                    <div className="inline-flex items-center space-x-1.5 bg-emerald-50 border border-emerald-300/80 px-3 py-1.5 rounded-lg text-xs">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-semibold text-slate-700">তারিখঃ</span>
                      <span className="font-bold text-emerald-950">{formattedTodayBangla}</span>
                      <span className="text-[10px] text-emerald-700 font-bold bg-white px-1.5 py-0.5 rounded border border-emerald-200">
                        ⚡ অটো রিয়েল ডেট
                      </span>
                    </div>
                    <label className="cursor-pointer inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-xs text-slate-700 shadow-sm transition">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{sigPreview ? 'স্বাক্ষর পরিবর্তন' : 'স্বাক্ষর আপলোড'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange('signature', e, setSigPreview)}
                      />
                    </label>
                  </div>
                </div>

                {/* সংযুক্তিঃ (ATTACHMENTS CHECKLIST) */}
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                  <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <h5 className="text-xs font-bold text-slate-800">
                      সংযুক্তিঃ (প্রয়োজনীয় ডকুমেন্ট আপলোড করুন)
                    </h5>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Attachment 1: NID */}
                    <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-700">০১. জাতীয় পরিচয়পত্রের কপি <Required /></span>
                        {nidPreview && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                      </div>
                      <label className="cursor-pointer flex items-center justify-center p-3 border border-dashed border-slate-200 rounded-lg hover:border-emerald-500/40 text-center transition">
                        <div className="text-[11px] text-slate-500 truncate">
                          {nidPreview ? (typeof nidPreview === 'string' && nidPreview.length > 20 ? 'ফাইল সিলেক্টেড' : nidPreview) : 'ফাইল আপলোড করুন'}
                        </div>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          className="hidden"
                          onChange={(e) => handleFileChange('nid_doc', e, setNidPreview)}
                        />
                      </label>
                    </div>

                    {/* Attachment 2: Trade License */}
                    <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-700">০২. ট্রেড লাইসেন্স (যদি থাকে)</span>
                        {tradePreview && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                      </div>
                      <label className="cursor-pointer flex items-center justify-center p-3 border border-dashed border-slate-200 rounded-lg hover:border-emerald-500/40 text-center transition">
                        <div className="text-[11px] text-slate-500 truncate">
                          {tradePreview ? (typeof tradePreview === 'string' && tradePreview.length > 20 ? 'ফাইল সিলেক্টেড' : tradePreview) : 'ফাইল আপলোড করুন'}
                        </div>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          className="hidden"
                          onChange={(e) => handleFileChange('trade_license_doc', e, setTradePreview)}
                        />
                      </label>
                    </div>

                    {/* Attachment 3: Education Certificate */}
                    <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-700">০৩. সর্বশেষ শিক্ষা সনদের কপি</span>
                        {eduPreview && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                      </div>
                      <label className="cursor-pointer flex items-center justify-center p-3 border border-dashed border-slate-200 rounded-lg hover:border-emerald-500/40 text-center transition">
                        <div className="text-[11px] text-slate-500 truncate">
                          {eduPreview ? (typeof eduPreview === 'string' && eduPreview.length > 20 ? 'ফাইল সিলেক্টেড' : eduPreview) : 'ফাইল আপলোড করুন'}
                        </div>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          className="hidden"
                          onChange={(e) => handleFileChange('education_doc', e, setEduPreview)}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Extra Attachments Dynamic Section */}
                  <div className="pt-4 border-t border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Plus className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-semibold text-slate-800">
                          অন্যান্য প্রয়োজনীয় অতিরিক্ত ডকুমেন্ট (যদি থাকে)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={addExtraAttachment}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-medium border border-emerald-200 transition cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>আরও ফাইল যোগ করুন</span>
                      </button>
                    </div>

                    {(data.extra_attachments || []).length > 0 && (
                      <div className="space-y-3">
                        {data.extra_attachments.map((item, idx) => (
                          <div key={item.id || idx} className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-slate-700">
                                অতিরিক্ত সংযুক্তি ০{idx + 4}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeExtraAttachment(idx)}
                                className="text-rose-500 hover:text-rose-700 p-1 rounded hover:bg-rose-50 transition cursor-pointer"
                                title="মুছে ফেলুন"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <input
                                type="text"
                                placeholder="ডকুমেন্টের নাম (যেমন: টিআইএন সনদ, ব্যাংক স্টেটমেন্ট, ইত্যাদি)"
                                value={item.title}
                                onChange={(e) => handleExtraTitleChange(idx, e.target.value)}
                                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                              />
                              <label className="cursor-pointer flex items-center justify-between px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-300 rounded-lg text-xs text-slate-700 transition">
                                <span className="truncate max-w-[220px]">
                                  {item.preview || 'ফাইল নির্বাচন করুন (.pdf, .jpg, .png)'}
                                </span>
                                <Upload className="w-4 h-4 text-slate-400 shrink-0" />
                                <input
                                  type="file"
                                  accept="image/*,.pdf"
                                  className="hidden"
                                  onChange={(e) => handleExtraFileChange(idx, e)}
                                />
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Official Instructions / Footer Notice */}
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs leading-relaxed space-y-2">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-amber-800">আবেদন জমাদান সংক্রান্ত নির্দেশনাঃ</p>
                      <p className="mt-1">
                        পূরণকৃত ব্যবসায়ী সম্ভাব্যতা যাচাই প্রতিবেদন (Business Feasibility Report) সংযুক্তি সহ Scan করে{' '}
                        <span className="font-bold underline text-slate-900">bbsme.sicip@gmail.com</span> -এই ই-মেইলে অথবা অঞ্চল ভিত্তিক প্রশিক্ষণসূচী মোতাবেক সংশ্লিষ্ট ব্যাংকের ফোকাল কর্মকর্তার ই-মেইলে অথবা প্রিন্ট কপি সরাসরি প্রেরণ করতে হবে।
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
                  {viewMode === 'interactive' && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('part3')}
                      className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-sm font-medium text-sm transition cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>পূর্ববর্তী ধাপ (পার্ট-৩)</span>
                    </button>
                  )}

                  <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => handleAction('draft')}
                      disabled={processing || isDraftSaving}
                      className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border-2 border-amber-300 font-bold text-sm transition shadow-sm cursor-pointer disabled:opacity-50"
                      title="অসম্পূর্ণ অবস্থায় একাউন্টে জমা রাখুন"
                    >
                      <Save className="w-4 h-4 text-amber-700" />
                      <span>{isDraftSaving ? 'সংরক্ষণ হচ্ছে...' : '💾 খসড়া হিসেবে একাউন্টে জমা রাখুন'}</span>
                    </button>

                    <button
                      type="submit"
                      disabled={processing}
                      className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition shadow-xl shadow-emerald-600/30 cursor-pointer disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>{processing ? 'সংরক্ষণ ও দাখিল হচ্ছে...' : '🚀 চূড়ান্ত প্রতিবেদন দাখিল করুন'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </form>

      {/* Validation Missing Fields Modal */}
      {showValidationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-rose-200 shadow-2xl max-w-lg w-full p-5 sm:p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">বাধ্যতামূলক তথ্য অসম্পূর্ণ রয়েছে!</h3>
                  <p className="text-xs text-rose-600 font-medium">লাল চিহ্নিত (*) বিষয়গুলো পূরণ না করে দাখিল করা যাবে না</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowValidationModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 text-xs text-rose-900 leading-relaxed">
              নিচের <span className="font-bold text-rose-700">{missingFields.length}টি</span> বাধ্যতামূলক তথ্য এখনও পূরণ করা হয়নি। অনুগ্রহ করে পূরণ করুন অথবা এখনই তথ্য না থাকলে <span className="font-bold underline text-amber-900">"খসড়া হিসেবে একাউন্টে জমা রাখুন"</span>:
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100">
              {missingFields.map((item, idx) => (
                <div key={idx} className="pt-2 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-slate-800 font-medium">{item.label}</span>
                    <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">({item.part})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab(item.tab);
                      setShowValidationModal(false);
                    }}
                    className="text-emerald-600 hover:text-emerald-700 font-semibold text-[11px] hover:underline shrink-0 ml-2 cursor-pointer"
                  >
                    পূরণ করুন &rarr;
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setShowValidationModal(false);
                  handleAction('draft');
                }}
                className="flex-1 inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold transition shadow-md shadow-amber-500/20 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>খসড়া হিসেবে একাউন্টে জমা রাখুন</span>
              </button>
              <button
                type="button"
                onClick={() => setShowValidationModal(false)}
                className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
              >
                ফর্মটি সংশোধন করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Sample Demo Form Modal for New Applicants (Official 4-Page PDF Reader) */}
      <SampleDemoPdfModal
        isOpen={showSampleDemoModal}
        onClose={() => setShowSampleDemoModal(false)}
        onLoadSampleData={() => {
          populateSampleData();
          setShowSampleDemoModal(false);
        }}
        settings={settings}
      />
    </div>
  );
}

