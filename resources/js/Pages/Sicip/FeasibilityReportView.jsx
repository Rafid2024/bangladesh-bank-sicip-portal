import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Printer, ArrowLeft, CheckCircle2, Download, PlusCircle, Share2, Building2, User, ListFilter } from 'lucide-react';
import { toBengaliNumber, formatBengaliCurrency, toBengaliDate, toBengaliSerial } from '../../Utils/banglaUtils';

export default function FeasibilityReportView({ report, isDemo = false, autoPrint = false }) {
  const { settings = {}, auth = {} } = usePage().props;
  const handlePrint = () => {
    window.print();
  };

  React.useEffect(() => {
    if (autoPrint) {
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [autoPrint]);

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:') || path.startsWith('/')) {
      return path;
    }
    return `/storage/${path}`;
  };

  const present = report.present_address || {};
  const permanent = report.permanent_address || {};
  const education = report.education_history || [];
  const training = report.training_history || [];
  const experience = report.experience_history || [];
  const competitors = report.competitor_analysis || [];

  const isAdmin = auth?.user?.is_super_admin || auth?.user?.is_operations_manager;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 py-4 sm:py-6 px-2 sm:px-6 font-sans">
      <Head title={isDemo ? 'ব্যবসার সম্ভাব্যতা যাচাই প্রতিবেদন - নমুনা গাইড (Demo PDF)' : `ব্যবসার সম্ভাব্যতা যাচাই প্রতিবেদন - ${report.tracking_number}`} />

      {/* Demo Explanatory Guidance Banner - Only visible on web, hidden during print */}
      {isDemo && (
        <div className="max-w-4xl mx-auto mb-4 bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white p-4 sm:p-5 rounded-2xl shadow-lg border border-emerald-500/30 no-print flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                📄 অফিসিয়াল নমুনা PDF গাইড
              </span>
              <span className="text-xs text-emerald-200">বাংলাদেশ ব্যাংক • SICIP</span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white">
              বাংলাদেশ ব্যাংক নির্ধারিত ফরম্যাটে সম্পূর্ণ পূরণকৃত নমুনা সম্ভাব্যতা যাচাই প্রতিবেদন
            </h2>
            <p className="text-xs text-emerald-100/90">
              কীভাবে প্রতিটি তথ্য ও হিসাব লিখতে হয় তা দেখতে নিচের ৪ পৃষ্ঠার অফিসিয়াল ডকুমেন্টটি পড়ুন অথবা সরাসরি PDF হিসেবে সংরক্ষণ করুন।
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <Link
              href="/sicip/feasibility-report?demo=1"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold shadow-md transition"
              title="এই নমুনা ডাটা দিয়ে সরাসরি আবেদন ফরম পূরণ শুরু করুন"
            >
              <span>✨ এই নমুনা দিয়ে ফরম পূরণ করুন</span>
            </Link>
          </div>
        </div>
      )}

      {/* Action Header - Hidden during print */}
      <div className="max-w-4xl mx-auto mb-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <Link
            href={isDemo ? "/sicip/feasibility-report" : (isAdmin ? "/sicip/reports" : "/sicip/feasibility-report")}
            className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-sm transition shrink-0"
            title={isDemo ? "আবেদন ফরমে ফিরে যান" : "ফিরে যান"}
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                isDemo 
                  ? 'bg-amber-50 text-amber-800 border-amber-300' 
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {report.tracking_number}
              </span>
              <span className="text-xs text-slate-500">
                {isDemo ? 'আদর্শ নমুনা কপি (Demo)' : 'দাখিলকৃত প্রতিবেদন'}
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5 truncate">
              {report.applicant_name_bn} ({report.applicant_name_en})
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          {isAdmin && !isDemo && (
            <>
              <Link
                href={`/sicip/report/${report.tracking_number}/profile`}
                className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-sm text-xs font-semibold transition"
              >
                <User className="w-4 h-4 text-emerald-600" />
                <span>প্রোফাইল ও স্ক্রুটিনি</span>
              </Link>

              <Link
                href="/sicip/reports"
                className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-sm text-xs font-medium transition"
              >
                <ListFilter className="w-4 h-4 text-slate-500" />
                <span>আবেদন তালিকা</span>
              </Link>
            </>
          )}

          <Link
            href={isDemo ? "/sicip/feasibility-report?demo=1" : "/sicip/feasibility-report"}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-sm text-xs font-medium transition"
          >
            <PlusCircle className="w-4 h-4 text-slate-500" />
            <span>{isDemo ? 'আবেদন ফরম পূরণ' : 'নতুন আবেদন'}</span>
          </Link>

          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition cursor-pointer"
            title="ব্রাউজারের মাধ্যমে প্রিন্ট করুন অথবা সরাসরি PDF ফাইল হিসেবে সেভ করুন"
          >
            <Printer className="w-4 h-4" />
            <span>🖨️ PDF ডাউনলোড / প্রিন্ট</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4-PAGE PRINTABLE OFFICIAL DOCUMENT CONTAINER */}
      {/* ========================================================================= */}
      <div className="max-w-4xl mx-auto space-y-8 print:space-y-0 text-black">

        {/* ------------------------------------------------------------------------- */}
        {/* PAGE 1: ব্যক্তিগত তথ্যাবলী */}
        {/* ------------------------------------------------------------------------- */}
        <div className="bg-white p-3 sm:p-6 md:p-10 shadow-2xl rounded-xl border border-zinc-300 print-sheet page-break text-black font-sans leading-normal print:p-0 print:border-none print:shadow-none">
          {/* Header */}
          <div className="border-b-2 border-black pb-3 sm:pb-4 mb-3 sm:mb-4">
            <div className="flex items-center sm:items-start justify-between gap-1 sm:gap-2">
              {/* Left logo */}
              <div className="w-14 sm:w-20 text-center shrink-0">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto flex items-center justify-center">
                  <img 
                    src={settings?.bb_logo || '/uploads/logos/bb_1793994378_UqTbAw.svg'} 
                    alt="বাংলাদেশ ব্যাংক" 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>

              {/* Center Title */}
              <div className="text-center flex-1 px-1 sm:px-2 min-w-0">
                <h4 className="text-[10px] sm:text-xs font-bold text-zinc-900 leading-snug">উদ্যোক্তা উন্নয়ন প্রশিক্ষণ প্রোগ্রাম</h4>
                <h2 className="text-xs sm:text-base font-extrabold text-zinc-950 leading-tight">
                  Skills for Industry Competitiveness and Innovation Program (SICIP)
                </h2>
                <h5 className="text-[10px] sm:text-xs font-semibold text-zinc-800">প্রোগ্রাম ইমপ্লিমেন্টেশন ইউনিট (PIU)</h5>
                <p className="text-[9px] sm:text-[11px] text-zinc-700">এসএমই এন্ড স্পেশাল প্রোগ্রামস্ ডিপার্টমেন্ট, বাংলাদেশ ব্যাংক।</p>
              </div>

              {/* Right logo & Slogan */}
              <div className="w-16 sm:w-24 text-right flex flex-col items-end shrink-0">
                <div className="h-8 sm:h-10 flex items-center justify-end">
                  <img 
                    src={settings?.sicip_logo || '/uploads/logos/sicip_1793994378_6ZWj0e.png'} 
                    alt="SICIP" 
                    className="h-full w-auto max-w-[70px] sm:max-w-[96px] object-contain"
                  />
                </div>
                <p className="text-[8px] sm:text-[10px] font-bold text-zinc-800 mt-0.5 sm:mt-1 italic leading-tight">
                  উদ্যোক্তা হবো, দেশ গড়বো।
                </p>
              </div>
            </div>

            {/* Document Title Bar */}
            <div className="mt-2 sm:mt-3 text-center border-t border-black pt-1.5 sm:pt-2">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                ব্যবসার সম্ভাব্যতা যাচাই প্রতিবেদন (Business Feasibility Report)
              </h3>
            </div>
          </div>

          {/* Part 1 Header & Date */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-bold mb-3 border-b border-zinc-400 pb-1 gap-1">
            <span>পার্ট- I: ব্যক্তিগত তথ্যাবলীঃ (প্রযোজ্য ক্ষেত্রে NID মোতাবেক)</span>
            <span># যাচাই প্রতিবেদন দাখিলের তারিখঃ <span className="font-normal underline bn-num">{toBengaliDate(report.submission_date) || '........................'}</span></span>
          </div>

          {/* Top Section with Photo */}
          <div className="flex flex-col-reverse sm:flex-row print:flex-row gap-3 sm:gap-4 mb-3">
            <div className="flex-1 space-y-1 text-xs">
              {/* 01. Name */}
              <div className="border border-black flex">
                <div className="w-28 sm:w-36 p-1.5 font-bold border-r border-black bg-zinc-100 flex items-center shrink-0">
                  <span className="bn-num font-bold mr-1">০১.</span> অংশগ্রহণকারীর নামঃ
                </div>
                <div className="flex-1 min-w-0">
                  <div className="p-1 border-b border-black flex">
                    <span className="w-16 font-semibold shrink-0">বাংলায় :</span>
                    <span className="font-medium truncate">{report.applicant_name_bn}</span>
                  </div>
                  <div className="p-1 flex">
                    <span className="w-16 font-semibold shrink-0">English:</span>
                    <span className="font-medium truncate">{report.applicant_name_en}</span>
                  </div>
                </div>
              </div>

              {/* 02. Father's Name */}
              <div className="border border-black flex">
                <div className="w-28 sm:w-36 p-1.5 font-bold border-r border-black bg-zinc-100 flex items-center shrink-0">
                  <span className="bn-num font-bold mr-1">০২.</span> পিতার নামঃ
                </div>
                <div className="flex-1 min-w-0">
                  <div className="p-1 border-b border-black flex">
                    <span className="w-16 font-semibold shrink-0">বাংলায় :</span>
                    <span className="truncate">{report.father_name_bn}</span>
                  </div>
                  <div className="p-1 flex">
                    <span className="w-16 font-semibold shrink-0">English:</span>
                    <span className="truncate">{report.father_name_en}</span>
                  </div>
                </div>
              </div>

              {/* 03. Mother's Name */}
              <div className="border border-black flex">
                <div className="w-28 sm:w-36 p-1.5 font-bold border-r border-black bg-zinc-100 flex items-center shrink-0">
                  ০৩. মাতার নামঃ
                </div>
                <div className="flex-1 min-w-0">
                  <div className="p-1 border-b border-black flex">
                    <span className="w-16 font-semibold shrink-0">বাংলায় :</span>
                    <span className="truncate">{report.mother_name_bn}</span>
                  </div>
                  <div className="p-1 flex">
                    <span className="w-16 font-semibold shrink-0">English:</span>
                    <span className="truncate">{report.mother_name_en}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Photo Box */}
            <div className="w-24 h-32 sm:w-28 sm:h-36 border border-black flex flex-col items-center justify-center text-center p-1 bg-zinc-50 shrink-0 self-center sm:self-auto">
              {report.photo_path ? (
                <img src={getImageUrl(report.photo_path)} alt="Applicant" className="w-full h-full object-cover" />
              ) : (
                <div className="text-[10px] text-zinc-600 leading-tight">
                  পাসপোর্ট সাইজ ছবি<br />(২ কপি)
                </div>
              )}
            </div>
          </div>

          {/* 04 - 06: Guardian Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 print:grid-cols-3 text-xs border border-black mb-2 p-1.5 gap-2">
            <div>
              <span className="font-bold">০৪. স্থানীয় অভিভাবকের নামঃ</span> {report.guardian_name || '........................'}
            </div>
            <div>
              <span className="font-bold">০৫. সম্পর্কঃ</span> {report.guardian_relation || '........................'}
            </div>
            <div>
              <span className="font-bold">০৬. ফোন নাম্বারঃ</span> {report.guardian_phone || '........................'}
            </div>
          </div>

          {/* 07 - 10: NID, DOB, Age, Marital */}
          <div className="grid grid-cols-2 sm:grid-cols-4 print:grid-cols-4 text-xs border border-black mb-2 p-1.5 gap-2">
            <div>
              <span className="font-bold">০৭. NID নাম্বারঃ</span> <span className="bn-num">{toBengaliNumber(report.nid_number)}</span>
            </div>
            <div>
              <span className="font-bold">০৮. জন্ম তারিখঃ</span> <span className="bn-num">{toBengaliDate(report.dob)}</span>
            </div>
            <div>
              <span className="font-bold">০৯. বয়সঃ</span> <span className="bn-num font-semibold">{toBengaliNumber(report.age)}</span> বছর
            </div>
            <div>
              <span className="font-bold">১০. বৈবাহিক অবস্থাঃ</span> {report.marital_status}
            </div>
          </div>

          {/* 11. শিক্ষাগত যোগ্যতা (Table) */}
          <div className="mb-2">
            <span className="text-xs font-bold block mb-1">১১. শিক্ষাগত যোগ্যতাঃ</span>
            <div className="overflow-x-auto print:overflow-visible -mx-1 sm:mx-0">
              <table className="min-w-[550px] sm:min-w-0 w-full text-xs border border-black border-collapse">
                <thead>
                  <tr className="bg-zinc-100 font-bold text-center">
                    <th className="border border-black p-1">সর্বশেষ শিক্ষাগত যোগ্যতা</th>
                    <th className="border border-black p-1">ফলাফল</th>
                    <th className="border border-black p-1">পাসের সন</th>
                    <th className="border border-black p-1">বিষয়</th>
                    <th className="border border-black p-1">বোর্ড/বিশ্ববিদ্যালয়ের নাম</th>
                  </tr>
                </thead>
                <tbody>
                  {education.length > 0 ? (
                    education.map((edu, i) => (
                      <tr key={i} className="text-center">
                        <td className="border border-black p-1">{edu.degree || '-'}</td>
                        <td className="border border-black p-1">{edu.result || '-'}</td>
                        <td className="border border-black p-1 bn-num">{toBengaliNumber(edu.passing_year) || '-'}</td>
                        <td className="border border-black p-1">{edu.subject || '-'}</td>
                        <td className="border border-black p-1">{edu.board || '-'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="border border-black p-2 text-center" colSpan={5}>তথ্য নেই</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 12 - 13: Phone & Email */}
          <div className="border border-black p-1.5 text-xs mb-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 print:grid-cols-3 gap-2">
              <div>
                <span className="font-bold">১২. ফোন নাম্বারঃ</span> {report.phone}
              </div>
              <div>
                <span className="font-bold">বিকল্প ফোন নাম্বারঃ</span> {report.alt_phone || '-'}
              </div>
              <div>
                <span className="font-bold">১৩. E-mail ID:</span> {report.email || '-'}
              </div>
            </div>
            <p className="text-[10px] text-zinc-700 italic mt-1">
              *ফোন নাম্বার অবশ্যই আবেদনকারীর নাম এ রেজিস্টার্ড হতে হবে এবং উক্ত নাম্বারে এমএফএস/ব্যাংক হিসাব থাকতে/খুলতে হবে।
            </p>
          </div>

          {/* 14. বর্তমান ঠিকানা */}
          <div className="mb-2">
            <span className="text-xs font-bold block mb-1">১৪. বর্তমান ঠিকানাঃ (এনআইডি মোতাবেক)</span>
            <div className="overflow-x-auto print:overflow-visible -mx-1 sm:mx-0">
              <table className="min-w-[500px] sm:min-w-0 w-full text-xs border border-black border-collapse">
                <tbody>
                  <tr>
                    <td className="border border-black p-1 w-1/3"><span className="font-bold">বাড়ি/মহল্লার নং/নামঃ</span> {present.house}</td>
                    <td className="border border-black p-1 w-1/3"><span className="font-bold">রোড নং/এলাকা/গ্রামঃ</span> {present.road}</td>
                    <td className="border border-black p-1 w-1/3"><span className="font-bold">থানাঃ</span> {present.thana}</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-1"><span className="font-bold">পোস্ট অফিস ও কোডঃ</span> {present.post_code}</td>
                    <td className="border border-black p-1"><span className="font-bold">জেলাঃ</span> {present.district}</td>
                    <td className="border border-black p-1"><span className="font-bold">বিভাগঃ</span> {present.division}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 15. স্থায়ী ঠিকানা */}
          <div className="mb-2">
            <span className="text-xs font-bold block mb-1">১৫. স্থায়ী ঠিকানাঃ</span>
            <div className="overflow-x-auto print:overflow-visible -mx-1 sm:mx-0">
              <table className="min-w-[500px] sm:min-w-0 w-full text-xs border border-black border-collapse">
                <tbody>
                  <tr>
                    <td className="border border-black p-1 w-1/3"><span className="font-bold">বাড়ি/মহল্লার নামঃ</span> {permanent.house}</td>
                    <td className="border border-black p-1 w-1/3"><span className="font-bold">রোড নং/এলাকা/গ্রামঃ</span> {permanent.road}</td>
                    <td className="border border-black p-1 w-1/3"><span className="font-bold">থানাঃ</span> {permanent.thana}</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-1"><span className="font-bold">পোস্ট অফিস ও কোডঃ</span> {permanent.post_code}</td>
                    <td className="border border-black p-1"><span className="font-bold">জেলাঃ</span> {permanent.district}</td>
                    <td className="border border-black p-1"><span className="font-bold">বিভাগঃ</span> {permanent.division}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 16. প্রশিক্ষণ বিবরণী */}
          <div className="mb-2">
            <span className="text-xs font-bold block mb-1">১৬. দক্ষতা উন্নয়নমূলক কোনরূপ প্রশিক্ষণ থাকলে তার বিবরণঃ</span>
            <div className="overflow-x-auto print:overflow-visible -mx-1 sm:mx-0">
              <table className="min-w-[550px] sm:min-w-0 w-full text-xs border border-black border-collapse">
                <thead>
                  <tr className="bg-zinc-100 font-bold text-center">
                    <th className="border border-black p-1 w-12">ক্রমিক নং</th>
                    <th className="border border-black p-1">প্রশিক্ষণের বিষয়/কোর্স</th>
                    <th className="border border-black p-1">প্রতিষ্ঠানের নাম</th>
                    <th className="border border-black p-1">মেয়াদ</th>
                    <th className="border border-black p-1">প্রশিক্ষণ সমাপ্তির তারিখ</th>
                  </tr>
                </thead>
                <tbody>
                  {training.length > 0 ? (
                    training.map((t, i) => (
                      <tr key={i} className="text-center">
                        <td className="border border-black p-1 bn-num font-semibold">{toBengaliNumber(i + 1)}</td>
                        <td className="border border-black p-1">{t.subject || '-'}</td>
                        <td className="border border-black p-1">{t.institute || '-'}</td>
                        <td className="border border-black p-1">{t.duration || '-'}</td>
                        <td className="border border-black p-1 bn-num">{toBengaliDate(t.completion_date) || '-'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="border border-black p-1 text-center" colSpan={5}>তথ্য নেই</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 17. ব্যবসা/চাকরির অভিজ্ঞতা */}
          <div className="mb-2">
            <span className="text-xs font-bold block mb-1">১৭. ব্যবসা/চাকরির অভিজ্ঞতা থাকলে তার বিবরণঃ</span>
            <div className="overflow-x-auto print:overflow-visible -mx-1 sm:mx-0">
              <table className="min-w-[550px] sm:min-w-0 w-full text-xs border border-black border-collapse">
                <thead>
                  <tr className="bg-zinc-100 font-bold text-center">
                    <th className="border border-black p-1 w-12">ক্রমিক নং</th>
                    <th className="border border-black p-1">প্রতিষ্ঠানের নাম</th>
                    <th className="border border-black p-1">পদবী</th>
                    <th className="border border-black p-1">সময়কাল</th>
                    <th className="border border-black p-1">প্রতিষ্ঠান/ ব্যবসার ধরণ</th>
                  </tr>
                </thead>
                <tbody>
                  {experience.length > 0 ? (
                    experience.map((exp, i) => (
                      <tr key={i} className="text-center">
                        <td className="border border-black p-1 bn-num font-semibold">{toBengaliNumber(i + 1)}</td>
                        <td className="border border-black p-1">{exp.organization || '-'}</td>
                        <td className="border border-black p-1">{exp.designation || '-'}</td>
                        <td className="border border-black p-1">{exp.duration || '-'}</td>
                        <td className="border border-black p-1">{exp.type || '-'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="border border-black p-1 text-center" colSpan={5}>তথ্য নেই</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 18. তথ্যের উৎস */}
          <div className="border border-black p-2 text-xs">
            <span className="font-bold">১৮. কোন উৎস হতে উদ্যোক্তা উন্নয়ন প্রোগ্রাম সম্পর্কে জানতে পেরেছেনঃ </span>
            <span className="font-semibold text-emerald-900 underline ml-2">{report.info_source || 'Facebook/Social Media এর মাধ্যমে'}</span>
          </div>

          {/* Footer page number */}
          <div className="text-right text-[10px] text-slate-500 mt-4">পৃষ্ঠা ১/৪</div>
        </div>


        {/* ------------------------------------------------------------------------- */}
        {/* PAGE 2: নতুন ব্যবসায়িক আইডিয়া এবং পরিকল্পনা সংক্রান্ত তথ্যাদি */}
        {/* ------------------------------------------------------------------------- */}
        <div className="bg-white p-3 sm:p-6 md:p-10 shadow-2xl rounded-xl border border-zinc-300 print-sheet page-break text-black font-sans leading-normal print:p-0 print:border-none print:shadow-none">
          {/* Header */}
          <div className="border-b-2 border-black pb-3 sm:pb-4 mb-3 sm:mb-4">
            <div className="flex items-center sm:items-start justify-between gap-1 sm:gap-2">
              <div className="w-14 sm:w-16 text-center shrink-0">
                <span className="text-[9px] sm:text-[10px] font-bold text-emerald-800">বাংলাদেশ ব্যাংক</span>
              </div>
              <div className="text-center flex-1 px-1 min-w-0">
                <h4 className="text-[10px] sm:text-xs font-bold leading-snug">উদ্যোক্তা উন্নয়ন প্রশিক্ষণ প্রোগ্রাম</h4>
                <h2 className="text-xs sm:text-sm font-extrabold">Skills for Industry Competitiveness and Innovation Program (SICIP)</h2>
                <p className="text-[9px] sm:text-[10px] text-zinc-700">প্রোগ্রাম ইমপ্লিমেন্টেশন ইউনিট (PIU) • এসএমই ডিপার্টমেন্ট, বাংলাদেশ ব্যাংক</p>
              </div>
              <div className="w-14 sm:w-20 text-right shrink-0">
                <span className="text-xs font-black text-blue-900">SICIP</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="border-b border-black pb-1 mb-3">
            <h4 className="text-xs font-bold">
              পার্ট-II: নতুন ব্যবসায়িক আইডিয়া এবং পরিকল্পনা সংক্রান্ত তথ্যাদিঃ
            </h4>
          </div>

          {/* ক. নতুন ব্যবসায়িক আইডিয়া সংক্রান্ত তথ্যাদি */}
          <div className="space-y-3 text-xs mb-6">
            <h5 className="font-bold underline">ক. নতুন ব্যবসায়িক আইডিয়া সংক্রান্ত তথ্যাদি</h5>

            <div className="border border-black p-2">
              <span className="font-bold block mb-1">০১. উদ্যোগ/সৃজনশীল ব্যবসায়িক ধারণার সংক্ষিপ্ত বিবরণঃ</span>
              <p className="text-zinc-800 leading-relaxed pl-2">{report.idea_description || '-'}</p>
            </div>

            <div className="border border-black p-2">
              <span className="font-bold">০২. প্রশিক্ষণ শেষে কত সময়ের মধ্যে ব্যবসায় শুরু করার পরিকল্পনা রয়েছে? : </span>
              <span className="font-medium ml-2">{report.business_start_timeline || '-'}</span>
            </div>

            <div className="border border-black p-2">
              <span className="font-bold block mb-1">০৩. প্রয়োজনীয় মূলধনের পরিমাণ ও অর্থায়ন পরিকল্পনাঃ</span>
              <p className="text-zinc-800 leading-relaxed pl-2">{report.capital_financing_plan || '-'}</p>
            </div>

            <div className="border border-black p-2">
              <span className="font-bold">০৪. ব্যবসায়ের ধরণ (ম্যানুফেকচারিং, সার্ভিসেস/ট্রেডিং) ও বিবরণঃ </span>
              <span className="font-semibold ml-1">[{report.business_category}]</span> - 
              <span className="ml-1">{report.business_category_details || '-'}</span>
            </div>

            <div className="border border-black p-2">
              <span className="font-bold">০৫. ব্যবসায়ের সম্ভাব্য অবস্থানঃ </span>
              <span className="ml-2 font-medium">{report.expected_location || '-'}</span>
            </div>

            <div className="border border-black p-2">
              <span className="font-bold">০৬. পণ্যের ধরণ (আমদানির বিকল্প পণ্য বা রপ্তানীযোগ্য পণ্য কিনা?)ঃ </span>
              <span className="ml-2 font-medium">{report.product_type || '-'}</span>
            </div>

            <div className="border border-black p-2">
              <span className="font-bold">০৭. পণ্যের বাজার (অভ্যন্তরীণ/আন্তর্জাতিক) : </span>
              <span className="ml-2 font-medium">{report.market_scope || '-'}</span>
            </div>
          </div>

          {/* খ. ব্যবসায়িক পরিকল্পনা সংক্রান্ত তথ্যাদি */}
          <div className="space-y-3 text-xs">
            <h5 className="font-bold underline">খ. ব্যবসায়িক পরিকল্পনা সংক্রান্ত তথ্যাদি</h5>

            <div className="border border-black p-2">
              <span className="font-bold block mb-1">i) চলমান ব্যবসায়ের বিবরণ (যদি থাকে) ঃ-</span>
              <p className="text-zinc-800 leading-relaxed pl-2">{report.ongoing_business_details || 'প্রযোজ্য নয়'}</p>
            </div>

            <p className="font-bold mt-2">ii) প্রশিক্ষণ সমাপনান্তে গৃহীতব্য পরিকল্পনাঃ</p>

            <div className="border border-black p-2">
              <span className="font-bold block">০১. চলমান ব্যবসায় সম্প্রসারণসহ কর্মী বাড়ানোর কোন পরিকল্পনা রয়েছে কিনা? :</span>
              <span className="ml-2 text-zinc-800">{report.plan_expand_employees || '-'}</span>
            </div>

            <div className="border border-black p-2">
              <span className="font-bold block">০২. ব্যবসায়িক খাতে বর্ধিত আর্থিক সংশ্লিষ্টতা বাড়ানোর পরিকল্পনা আছে কিনা? :</span>
              <span className="ml-2 text-zinc-800">{report.plan_increase_financial_involvement || '-'}</span>
            </div>

            <div className="border border-black p-2">
              <span className="font-bold block">০৩. কি উপায়ে উক্ত আর্থিক সংশ্লিষ্টতা বাড়ানো হবে? :</span>
              <span className="ml-2 text-zinc-800">{report.way_to_increase_finance || '-'}</span>
            </div>

            <div className="border border-black p-2">
              <span className="font-bold block">০৪. পণ্য/ সেবার ধরণ/মান পরিবর্তন করা হবে কিনা?ঃ</span>
              <span className="ml-2 text-zinc-800">{report.plan_product_quality_change || '-'}</span>
            </div>

            <div className="border border-black p-2">
              <span className="font-bold block">০৫. দৈনন্দিন ব্যবসায়িক লেনদেন হিসাবভুক্ত করত: প্রয়োজনীয় আর্থিক বিবরণী সংরক্ষণের পরিকল্পনা আছে কিনা? :</span>
              <span className="ml-2 text-zinc-800">{report.plan_maintain_financial_records || '-'}</span>
            </div>
          </div>

          {/* Footer page number */}
          <div className="text-right text-[10px] text-slate-500 mt-6">পৃষ্ঠা ২/৪</div>
        </div>


        {/* ------------------------------------------------------------------------- */}
        {/* PAGE 3: ব্যবসায় সম্পর্কিত তথ্যাবলী */}
        {/* ------------------------------------------------------------------------- */}
        <div className="bg-white p-3 sm:p-6 md:p-10 shadow-2xl rounded-xl border border-zinc-300 print-sheet page-break text-black font-sans leading-normal print:p-0 print:border-none print:shadow-none">
          {/* Header */}
          <div className="border-b-2 border-black pb-3 sm:pb-4 mb-3 sm:mb-4">
            <div className="flex items-center sm:items-start justify-between gap-1 sm:gap-2">
              <div className="w-14 sm:w-16 text-center shrink-0">
                <span className="text-[9px] sm:text-[10px] font-bold text-emerald-800">বাংলাদেশ ব্যাংক</span>
              </div>
              <div className="text-center flex-1 px-1 min-w-0">
                <h4 className="text-[10px] sm:text-xs font-bold leading-snug">উদ্যোক্তা উন্নয়ন প্রশিক্ষণ প্রোগ্রাম</h4>
                <h2 className="text-xs sm:text-sm font-extrabold">Skills for Industry Competitiveness and Innovation Program (SICIP)</h2>
                <p className="text-[9px] sm:text-[10px] text-zinc-700">এসএমই এন্ড স্পেশাল প্রোগ্রামস্ ডিপার্টমেন্ট, বাংলাদেশ ব্যাংক।</p>
              </div>
              <div className="w-14 sm:w-20 text-right shrink-0">
                <span className="text-xs font-black text-blue-900">SICIP</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="border-b border-black pb-1 mb-2">
            <h4 className="text-xs font-bold">
              পার্ট-III: ব্যবসায় সম্পর্কিত তথ্যাবলীঃ
            </h4>
            <p className="text-[10px] text-zinc-600">
              (অংশগ্রহণকারী বর্তমানে কোনরূপ ব্যবসায় নিয়োজিত থাকলে তার বিবরণ অথবা যে ব্যবসা করতে ইচ্ছুক তার বিবরণঃ-)
            </p>
          </div>

          {/* Grid of financial/business info */}
          <div className="space-y-2 text-xs mb-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-2">
              <div className="border border-black p-1.5">
                <span className="font-bold">০১. ব্যবসায়ের ধরণঃ</span> {report.existing_business_type || '-'}
              </div>
              <div className="border border-black p-1.5 flex justify-between">
                <div><span className="font-bold">০২. ট্রেড লাইসেন্স আছে কিনা:</span> {report.has_trade_license ? 'হ্যাঁ' : 'না'}</div>
                <div><span className="font-bold">তারিখঃ</span> <span className="bn-num">{toBengaliDate(report.trade_license_date) || '-'}</span></div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 print:grid-cols-3 gap-2">
              <div className="border border-black p-1.5">
                <span className="font-bold">০৩. পণ্য/সেবার গড় বিক্রয় মূল্যঃ</span> <span className="bn-num font-semibold text-emerald-800">{report.avg_selling_price ? formatBengaliCurrency(report.avg_selling_price) : '-'}</span>
              </div>
              <div className="border border-black p-1.5">
                <span className="font-bold">০৪. দৈনিক বিক্রয়ের পরিমাণঃ</span> <span className="bn-num font-semibold text-emerald-800">{report.daily_sales_amount ? formatBengaliCurrency(report.daily_sales_amount) : '-'}</span>
              </div>
              <div className="border border-black p-1.5">
                <span className="font-bold">০৫. মাসিক সম্ভাব্য বিক্রয়ের পরিমাণঃ</span> <span className="bn-num font-semibold text-emerald-800">{report.monthly_sales_amount ? formatBengaliCurrency(report.monthly_sales_amount) : '-'}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-2">
              <div className="border border-black p-1.5">
                <span className="font-bold">০৬. কাঁচামাল ও ব্যবসায় পরিচালনা বাবদ মাসিক সম্ভাব্য খরচঃ</span> <span className="bn-num font-semibold text-emerald-800">{report.monthly_raw_operational_cost ? formatBengaliCurrency(report.monthly_raw_operational_cost) : '-'}</span>
              </div>
              <div className="border border-black p-1.5 bg-zinc-50">
                <span className="font-bold">০৭. মাসিক সম্ভাব্য লাভ/মুনাফাঃ</span> <span className="bn-num font-bold text-emerald-800">{report.monthly_estimated_profit ? formatBengaliCurrency(report.monthly_estimated_profit) : '-'}</span>
              </div>
            </div>

            <div className="border border-black p-1.5">
              <span className="font-bold block">০৮. উদ্যোক্তা কিভাবে আলোচ্য ব্যবসায়ের সাথে জড়িত হয়েছেন/ ব্যবসায়ের আইডিয়া কিভাবে পেয়েছেন ঃ</span>
              <p className="text-zinc-800 pl-2">{report.business_involvement_reason || '-'}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-2">
              <div className="border border-black p-1.5">
                <span className="font-bold">০৯. ব্যবসায়ের সাথে সম্পর্কিত মোট বিনিয়োগের পরিমাণঃ</span> <span className="bn-num font-semibold text-emerald-800">{report.total_investment_amount ? formatBengaliCurrency(report.total_investment_amount) : '-'}</span>
              </div>
              <div className="border border-black p-1.5">
                <span className="font-bold">১০. কাঁচামালের উৎস (প্রযোজ্য ক্ষেত্রে)ঃ</span> {report.raw_material_source || '-'}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-2">
              <div className="border border-black p-1.5">
                <span className="font-bold">১১. সম্ভাব্য ক্রেতাঃ</span> {report.potential_buyers || '-'}
              </div>
              <div className="border border-black p-1.5">
                <span className="font-bold">১২. প্রতিযোগী প্রতিষ্ঠানের নাম (কমপক্ষে ৩টি)ঃ</span> {report.competitor_names || '-'}
              </div>
            </div>

            <div className="border border-black p-1.5">
              <span className="font-bold">১৩. পণ্য/সেবা বিপণন এলাকাঃ</span> {report.marketing_area || '-'}
            </div>
          </div>

          {/* 14. Competitor Table */}
          <div className="mb-3">
            <span className="text-xs font-bold block mb-1">
              ১৪. যে পণ্য/সেবা বিক্রয় করা হয়/হবে বর্তমানে তার অবস্থান কেমন? ঃ (কমপক্ষে ৩টি সম্ভাব্য প্রতিযোগী প্রতিষ্ঠানের তথ্য)
            </span>
            <div className="overflow-x-auto print:overflow-visible -mx-1 sm:mx-0">
              <div className="text-[10px] text-slate-500 sm:hidden flex items-center justify-end mb-1 print:hidden font-medium">
                <span>👉 ডানে স্ক্রল করে পুরো ছক দেখুন</span>
              </div>
              <table className="min-w-[750px] sm:min-w-0 w-full text-[11px] border border-black border-collapse">
                <thead>
                  <tr className="bg-zinc-100 font-bold text-center">
                    <th className="border border-black p-1 w-10">ক্রমিক নং</th>
                    <th className="border border-black p-1">প্রতিষ্ঠানের নাম</th>
                    <th className="border border-black p-1">অবস্থান</th>
                    <th className="border border-black p-1">দৈনিক উৎপাদন</th>
                    <th className="border border-black p-1">দৈনিক বিক্রয়</th>
                    <th className="border border-black p-1">পণ্যের মূল্য</th>
                    <th className="border border-black p-1">আনুমানিক গ্রাহক সংখ্যা</th>
                    <th className="border border-black p-1">বিপণন এরিয়া/ ভৌগোলিক কাভারেজ</th>
                  </tr>
                </thead>
                <tbody>
                  {competitors.length > 0 ? (
                    competitors.map((comp, i) => (
                      <tr key={i} className="text-center">
                        <td className="border border-black p-1 bn-num font-semibold">{toBengaliNumber(i + 1)}</td>
                        <td className="border border-black p-1">{comp.name || '-'}</td>
                        <td className="border border-black p-1">{comp.location || '-'}</td>
                        <td className="border border-black p-1 bn-num">{toBengaliNumber(comp.daily_production) || '-'}</td>
                        <td className="border border-black p-1 bn-num">{toBengaliNumber(comp.daily_sales) || '-'}</td>
                        <td className="border border-black p-1 bn-num">{comp.price ? formatBengaliCurrency(comp.price) : '-'}</td>
                        <td className="border border-black p-1 bn-num">{toBengaliNumber(comp.customer_count) || '-'}</td>
                        <td className="border border-black p-1">{comp.coverage || '-'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="border border-black p-1 text-center" colSpan={8}>তথ্য নেই</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 15 - 18: Strategic Feasibility Questions */}
          <div className="space-y-2 text-xs">
            <div className="border border-black p-1.5">
              <span className="font-bold block">১৫. একইরূপ পণ্য/সেবা প্রতিযোগী প্রতিষ্ঠান সরবরাহ করলেও আপনার নিকট থেকে ক্রেতাগণ তা ক্রয় করার কারণঃ</span>
              <p className="text-zinc-800 pl-2">{report.reason_buyers_choose_you || '-'}</p>
            </div>

            <div className="border border-black p-1.5">
              <span className="font-bold block">১৬. অন্যান্য প্রতিযোগী প্রতিষ্ঠানের পণ্য/সেবা হতে আপনার পণ্য/সেবার মূল্য এবং গুণগত মান এর পার্থক্য কিঃ</span>
              <p className="text-zinc-800 pl-2">{report.price_and_quality_difference || '-'}</p>
            </div>

            <div className="border border-black p-1.5">
              <span className="font-bold block">১৭. বিদ্যমান ব্যবসায় পরিচালনায় সমস্যাসমূহঃ</span>
              <p className="text-zinc-800 pl-2">{report.existing_business_challenges || '-'}</p>
            </div>

            <div className="border border-black p-1.5">
              <span className="font-bold block">১৮. উদ্যোক্তা উন্নয়ন প্রোগ্রামে অংশগ্রহণের কারণঃ</span>
              <p className="text-zinc-800 pl-2">{report.training_participation_reason || '-'}</p>
            </div>
          </div>

          {/* Footer page number */}
          <div className="text-right text-[10px] text-slate-500 mt-4">পৃষ্ঠা ৩/৪</div>
        </div>


        {/* ------------------------------------------------------------------------- */}
        {/* PAGE 4: অন্যান্য, স্বাক্ষর ও সংযুক্তি */}
        {/* ------------------------------------------------------------------------- */}
        <div className="bg-white p-3 sm:p-6 md:p-10 shadow-2xl rounded-xl border border-zinc-300 print-sheet page-break text-black font-sans leading-normal print:p-0 print:border-none print:shadow-none">
          {/* Header */}
          <div className="border-b-2 border-black pb-3 sm:pb-4 mb-3 sm:mb-4">
            <div className="flex items-center sm:items-start justify-between gap-1 sm:gap-2">
              <div className="w-14 sm:w-16 text-center shrink-0">
                <span className="text-[9px] sm:text-[10px] font-bold text-emerald-800">বাংলাদেশ ব্যাংক</span>
              </div>
              <div className="text-center flex-1 px-1 min-w-0">
                <h4 className="text-[10px] sm:text-xs font-bold leading-snug">উদ্যোক্তা উন্নয়ন প্রশিক্ষণ প্রোগ্রাম</h4>
                <h2 className="text-xs sm:text-sm font-extrabold">Skills for Industry Competitiveness and Innovation Program (SICIP)</h2>
                <p className="text-[9px] sm:text-[10px] text-zinc-700">প্রোগ্রাম ইমপ্লিমেন্টেশন ইউনিট (PIU) • এসএমই ডিপার্টমেন্ট, বাংলাদেশ ব্যাংক</p>
              </div>
              <div className="w-14 sm:w-20 text-right shrink-0">
                <span className="text-xs font-black text-blue-900">SICIP</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="border-b border-black pb-1 mb-3">
            <h4 className="text-xs font-bold">
              পার্ট-IV: অন্যান্য ঃ
            </h4>
          </div>

          {/* 01 - 04 */}
          <div className="space-y-2 text-xs mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-2">
              <div className="border border-black p-1.5">
                <span className="font-bold">০১. পিতার শিক্ষাগত যোগ্যতা ঃ</span> {report.father_education || '-'}
              </div>
              <div className="border border-black p-1.5">
                <span className="font-bold">০২. পিতার পেশা ঃ</span> {report.father_occupation || '-'}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-2">
              <div className="border border-black p-1.5">
                <span className="font-bold">০৩. মাতার শিক্ষাগত যোগ্যতা ঃ</span> {report.mother_education || '-'}
              </div>
              <div className="border border-black p-1.5">
                <span className="font-bold">০৪. মাতার পেশা ঃ</span> {report.mother_occupation || '-'}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-2">
              <div className="border border-black p-1.5">
                <span className="font-bold">০৫. পরিবারের মাসিক আয় ঃ</span> <span className="bn-num font-semibold text-emerald-800">{report.family_monthly_income ? formatBengaliCurrency(report.family_monthly_income) : '-'}</span>
              </div>
              <div className="border border-black p-1.5 flex items-center justify-between">
                <span className="font-bold">০৬. নিজস্ব মালিকানাধীন বাড়ী আছে কিনা?</span>
                <span className="font-bold border border-black px-3 py-0.5">
                  {report.has_own_house ? 'হ্যাঁ' : 'না'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-2">
              <div className="border border-black p-1.5">
                <span className="font-bold">০৭. ভাই-বোনের সংখ্যা ঃ</span> <span className="bn-num font-semibold">{report.siblings_count ? toBengaliNumber(report.siblings_count) : '-'}</span>
              </div>
              <div className="border border-black p-1.5">
                <span className="font-bold">০৮. শারীরিক প্রতিবন্ধকতা ঃ</span> {report.physical_disability || 'না'}
              </div>
            </div>

            {/* 09. Bank details */}
            <div className="border border-black p-2 space-y-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-2">
                <div>
                  <span className="font-bold">০৯. ব্যাংক হিসাব নং (যদি থাকে) ঃ</span> <span className="bn-num">{toBengaliNumber(report.bank_account_number) || '-'}</span>
                </div>
                <div>
                  <span className="font-bold">ব্যাংক ও শাখার নাম ঃ</span> {report.bank_and_branch_name || '-'}
                </div>
              </div>
              <div>
                <span className="font-bold">শাখার রাউটিং নম্বরঃ</span> <span className="bn-num">{toBengaliNumber(report.bank_routing_number) || '-'}</span>
              </div>
            </div>
          </div>

          {/* Signature Box */}
          <div className="pt-12 sm:pt-16 pb-8 sm:pb-12 flex justify-between items-end border-b border-black text-xs">
            <div>
              <span className="font-bold">তারিখঃ</span> <span className="bn-num">{toBengaliDate(report.signature_date || report.submission_date) || '........................'}</span>
            </div>
            <div className="text-center w-48 sm:w-60">
              {report.signature_path ? (
                <div className="h-12 flex items-center justify-center mb-1">
                  <img src={getImageUrl(report.signature_path)} alt="Signature" className="max-h-12 max-w-full" />
                </div>
              ) : (
                <div className="h-10 border-b border-dotted border-black mb-1"></div>
              )}
              <span className="font-bold block border-t border-black pt-1">
                আবেদনকারীর স্বাক্ষর ও তারিখ
              </span>
            </div>
          </div>

          {/* Attachments checklist */}
          <div className="mt-4 flex flex-col sm:flex-row print:flex-row gap-3 sm:gap-4 text-xs">
            <div className="w-full sm:w-1/2 print:w-1/2 border border-black p-2">
              <span className="font-bold block mb-1">সংযুক্তিঃ</span>
              <ul className="space-y-1 pl-2">
                <li>
                  ০১. জাতীয় পরিচয়পত্রের কপি {report.nid_attachment_path ? (
                    <span className="inline-flex items-center space-x-1.5 ml-1">
                      <span className="text-emerald-700 font-bold">✔ (সংযুক্ত)</span>
                      <a
                        href={`/storage/${report.nid_attachment_path}`}
                        target="_blank"
                        rel="noreferrer"
                        className="print:hidden text-[11px] text-indigo-600 hover:text-indigo-800 underline font-medium"
                      >
                        [দেখুন]
                      </a>
                    </span>
                  ) : <span className="text-slate-400"> (সংযুক্ত নয়)</span>}
                </li>
                <li>
                  ০২. ট্রেড লাইসেন্স (যদি থাকে) এর কপি {report.trade_license_attachment_path ? (
                    <span className="inline-flex items-center space-x-1.5 ml-1">
                      <span className="text-emerald-700 font-bold">✔ (সংযুক্ত)</span>
                      <a
                        href={`/storage/${report.trade_license_attachment_path}`}
                        target="_blank"
                        rel="noreferrer"
                        className="print:hidden text-[11px] text-indigo-600 hover:text-indigo-800 underline font-medium"
                      >
                        [দেখুন]
                      </a>
                    </span>
                  ) : <span className="text-slate-400"> (সংযুক্ত নয়)</span>}
                </li>
                <li>
                  ০৩. সর্বশেষ শিক্ষা সনদের কপি {report.education_certificate_path ? (
                    <span className="inline-flex items-center space-x-1.5 ml-1">
                      <span className="text-emerald-700 font-bold">✔ (সংযুক্ত)</span>
                      <a
                        href={`/storage/${report.education_certificate_path}`}
                        target="_blank"
                        rel="noreferrer"
                        className="print:hidden text-[11px] text-indigo-600 hover:text-indigo-800 underline font-medium"
                      >
                        [দেখুন]
                      </a>
                    </span>
                  ) : <span className="text-slate-400"> (সংযুক্ত নয়)</span>}
                </li>
                {report.extra_attachments && Array.isArray(report.extra_attachments) && report.extra_attachments.map((extra, idx) => (
                  <li key={idx}>
                    <span className="bn-num">{toBengaliSerial(idx + 4)}.</span> {extra.title || 'অতিরিক্ত ডকুমেন্ট'} {extra.file_path ? (
                      <span className="inline-flex items-center space-x-1.5 ml-1">
                        <span className="text-emerald-700 font-bold">✔ (সংযুক্ত)</span>
                        <a
                          href={`/storage/${extra.file_path}`}
                          target="_blank"
                          rel="noreferrer"
                          className="print:hidden text-[11px] text-indigo-600 hover:text-indigo-800 underline font-medium"
                        >
                          [দেখুন]
                        </a>
                      </span>
                    ) : ''}
                  </li>
                ))}
              </ul>
            </div>

            {/* Official notice box */}
            <div className="w-full sm:w-1/2 print:w-1/2 border border-black p-2 bg-zinc-50 leading-relaxed text-[10px]">
              <p>
                পূরণকৃত ব্যবসায় সম্ভাব্যতা যাচাই প্রতিবেদন (Business Feasibility Report) সংযুক্তি সহ Scan করে{' '}
                <span className="font-bold underline">bbsme.sicip@gmail.com</span> -এই ই-মেইলে অথবা অঞ্চল ভিত্তিক প্রশিক্ষণসূচী মোতাবেক সংশ্লিষ্ট ব্যাংকের ফোকাল কর্মকর্তার ই-মেইলে অথবা প্রিন্ট কপি সরাসরি প্রেরণ করতে হবে।
              </p>
            </div>
          </div>

          {/* Footer page number */}
          <div className="text-right text-[10px] text-slate-500 mt-6">পৃষ্ঠা ৪/৪</div>
        </div>

      </div>
    </div>
  );
}

