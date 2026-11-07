import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  ExternalLink, 
  ZoomIn, 
  ZoomOut, 
  Sparkles, 
  User, 
  Building2, 
  DollarSign, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  CreditCard 
} from 'lucide-react';

export default function SampleDemoPdfModal({ isOpen, onClose, onLoadSampleData, settings = {} }) {
  const [pdfZoom, setPdfZoom] = useState(1);
  const [activePdfPage, setActivePdfPage] = useState(1);

  if (!isOpen) return null;

  const scrollToPage = (pageNum) => {
    setActivePdfPage(pageNum);
    const element = document.getElementById(`demo-pdf-page-${pageNum}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-2 sm:p-4 overflow-hidden">
      <div className="relative max-w-5xl w-full h-[96vh] bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden">
        
        {/* PDF Viewer Top Navigation Bar */}
        <div className="bg-slate-900 border-b border-slate-700/80 px-3 sm:px-5 py-2.5 sm:py-3 text-white flex flex-col md:flex-row items-center justify-between gap-3 shadow-lg shrink-0">
          {/* Document Identity */}
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <div className="w-8 h-8 rounded-lg bg-red-600 text-white font-black text-xs flex items-center justify-center shadow-md shadow-red-600/30 shrink-0">
              PDF
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-400/30">
                  অফিসিয়াল নমুনা PDF
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">৪ পৃষ্ঠার A4 পূর্ণাঙ্গ রূপরেখা</span>
              </div>
              <h3 className="text-xs sm:text-sm font-semibold text-white truncate mt-0.5">
                Bangladesh_Bank_SICIP_Sample_Feasibility_Report.pdf
              </h3>
            </div>
          </div>

          {/* Page Selector & Zoom Toolbar */}
          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-xs text-slate-400 mr-1 hidden sm:inline">পৃষ্ঠা:</span>
            <div className="flex items-center space-x-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
              {[1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => scrollToPage(num)}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition cursor-pointer ${
                    activePdfPage === num 
                      ? 'bg-emerald-600 text-white shadow-sm' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                  title={`পৃষ্ঠা ${num}-এ যান`}
                >
                  {num}
                </button>
              ))}
            </div>

            <div className="h-5 w-px bg-slate-700 mx-1 hidden sm:block"></div>

            <div className="flex items-center space-x-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
              <button
                type="button"
                onClick={() => setPdfZoom(prev => Math.max(0.75, prev - 0.1))}
                disabled={pdfZoom <= 0.75}
                className="p-1 text-slate-300 hover:text-white disabled:opacity-30 rounded hover:bg-slate-700 transition cursor-pointer"
                title="জুম কমান"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono px-1.5 text-slate-200">
                {Math.round(pdfZoom * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setPdfZoom(prev => Math.min(1.25, prev + 0.1))}
                disabled={pdfZoom >= 1.25}
                className="p-1 text-slate-300 hover:text-white disabled:opacity-30 rounded hover:bg-slate-700 transition cursor-pointer"
                title="জুম বাড়ান"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 shrink-0 w-full md:w-auto justify-end">
            <a
              href="/sicip/sample-demo-pdf?action=print"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-600/30 transition cursor-pointer"
              title="PDF হিসেবে ডাউনলোড বা প্রিন্ট করুন"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>🖨️ PDF প্রিন্ট / ডাউনলোড</span>
            </a>

            <a
              href="/sicip/sample-demo-pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-semibold transition cursor-pointer"
              title="নতুন উইন্ডোতে ফুলস্ক্রিন PDF দেখুন"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">নতুন ট্যাবে</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
              title="বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Explanatory Banner */}
        <div className="bg-emerald-950/90 border-b border-emerald-800/80 px-4 py-2.5 flex items-center justify-between text-xs text-emerald-200 shrink-0">
          <span className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              বাংলাদেশ ব্যাংক নির্ধারিত ফরম্যাটে সম্পূর্ণ পূরণকৃত নমুনা সম্ভাব্যতা প্রতিবেদন (PDF)। প্রতিটি ঘর ও ছক কীভাবে পূরণ করতে হবে তা নিচে সরাসরি দেখে নিন।
            </span>
          </span>
          <button
            type="button"
            onClick={onLoadSampleData}
            className="ml-3 shrink-0 inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-sm transition cursor-pointer"
            title="এই নমুনা ডাটা সরাসরি আপনার ফর্মে লোড করুন"
          >
            <span>✨ এই নমুনা ফর্মে লোড করুন</span>
          </button>
        </div>

        {/* Scrollable Document Canvas (PDF Multi-page View) */}
        <div className="flex-1 overflow-y-auto bg-slate-800/90 p-3 sm:p-6 md:p-8 space-y-8 scroll-smooth">
          <div 
            style={{ 
              transform: `scale(${pdfZoom})`, 
              transformOrigin: 'top center',
              transition: 'transform 0.15s ease-out' 
            }} 
            className="space-y-8 max-w-[850px] mx-auto text-black"
          >
            
            {/* ------------------------------------------------------------- */}
            {/* PDF PAGE 1: ব্যক্তিগত তথ্যাবলী */}
            {/* ------------------------------------------------------------- */}
            <div 
              id="demo-pdf-page-1"
              className="bg-white p-4 sm:p-8 md:p-10 shadow-2xl rounded-sm border border-slate-300 font-sans relative text-xs leading-normal"
            >
              {/* Page Counter Watermark */}
              <div className="absolute top-3 right-4 text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                পৃষ্ঠা ১ / ৪ • SICIP নমুনা প্রতিবেদন
              </div>

              {/* Header */}
              <div className="border-b-2 border-black pb-3 mb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-16 text-center shrink-0">
                    <img
                      src="/uploads/logos/bb_1793994378_UqTbAw.svg"
                      alt="বাংলাদেশ ব্যাংক"
                      className="w-14 h-14 object-contain mx-auto"
                    />
                  </div>

                  <div className="text-center flex-1 px-2">
                    <h4 className="text-[11px] font-bold text-zinc-900">উদ্যোক্তা উন্নয়ন প্রশিক্ষণ প্রোগ্রাম</h4>
                    <h2 className="text-sm sm:text-base font-extrabold text-zinc-950 leading-tight">
                      Skills for Industry Competitiveness and Innovation Program (SICIP)
                    </h2>
                    <h5 className="text-[10px] font-semibold text-zinc-800">প্রোগ্রাম ইমপ্লিমেন্টেশন ইউনিট (PIU)</h5>
                    <p className="text-[9px] text-zinc-700">এসএমই এন্ড স্পেশাল প্রোগ্রামস্ ডিপার্টমেন্ট, বাংলাদেশ ব্যাংক।</p>
                  </div>

                  <div className="w-24 text-right flex flex-col items-end shrink-0">
                    <img
                      src="/uploads/logos/sicip_1793994378_6ZWj0e.png"
                      alt="SICIP Logo"
                      className="h-10 w-auto max-w-[110px] object-contain"
                    />
                    <p className="text-[8px] font-bold text-zinc-800 mt-0.5 italic">
                      উদ্যোক্তা হবো, দেশ গড়বো।
                    </p>
                  </div>
                </div>

                <div className="mt-2 text-center border-t border-black pt-1.5">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                    ব্যবসার সম্ভাব্যতা যাচাই প্রতিবেদন (Business Feasibility Report) — নমুনা ফরম
                  </h3>
                </div>
              </div>

              {/* Part 1 Header & Date */}
              <div className="flex items-center justify-between font-bold mb-3 border-b border-zinc-400 pb-1">
                <span>পার্ট- I: ব্যক্তিগত তথ্যাবলীঃ (প্রযোজ্য ক্ষেত্রে NID মোতাবেক)</span>
                <span># যাচাই প্রতিবেদন দাখিলের তারিখঃ <span className="font-semibold underline">১৫/১১/২০২৪</span></span>
              </div>

              {/* Top Section with Photo */}
              <div className="flex flex-row gap-3 mb-3">
                <div className="flex-1 space-y-1">
                  {/* Name */}
                  <div className="border border-black flex">
                    <div className="w-32 p-1.5 font-bold border-r border-black bg-zinc-100 flex items-center shrink-0">
                      ০১. অংশগ্রহণকারীর নামঃ
                    </div>
                    <div className="flex-1">
                      <div className="p-1 border-b border-black flex">
                        <span className="w-16 font-semibold shrink-0">বাংলায় :</span>
                        <span className="font-bold">তানভীর আহমেদ চৌধুরী</span>
                      </div>
                      <div className="p-1 flex">
                        <span className="w-16 font-semibold shrink-0">English:</span>
                        <span className="font-medium">Tanvir Ahmed Chowdhury</span>
                      </div>
                    </div>
                  </div>

                  {/* Father's Name */}
                  <div className="border border-black flex">
                    <div className="w-32 p-1.5 font-bold border-r border-black bg-zinc-100 flex items-center shrink-0">
                      ০২. পিতার নামঃ
                    </div>
                    <div className="flex-1">
                      <div className="p-1 border-b border-black flex">
                        <span className="w-16 font-semibold shrink-0">বাংলায় :</span>
                        <span>মোস্তফা কামাল চৌধুরী</span>
                      </div>
                      <div className="p-1 flex">
                        <span className="w-16 font-semibold shrink-0">English:</span>
                        <span>Mostafa Kamal Chowdhury</span>
                      </div>
                    </div>
                  </div>

                  {/* Mother's Name */}
                  <div className="border border-black flex">
                    <div className="w-32 p-1.5 font-bold border-r border-black bg-zinc-100 flex items-center shrink-0">
                      ০৩. মাতার নামঃ
                    </div>
                    <div className="flex-1">
                      <div className="p-1 border-b border-black flex">
                        <span className="w-16 font-semibold shrink-0">বাংলায় :</span>
                        <span>সালমা বেগম</span>
                      </div>
                      <div className="p-1 flex">
                        <span className="w-16 font-semibold shrink-0">English:</span>
                        <span>Salma Begum</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Photo Box */}
                <div className="w-28 h-36 border border-black flex flex-col items-center justify-center text-center p-1 bg-zinc-50 shrink-0">
                  <div className="w-full h-full bg-emerald-900 rounded flex flex-col items-center justify-center p-2 text-white">
                    <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mb-1">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <span className="font-bold text-[10px] leading-tight">তানভীর আহমেদ</span>
                    <span className="text-[9px] text-emerald-200">পাসপোর্ট ছবি (নমুনা)</span>
                  </div>
                </div>
              </div>

              {/* Guardian Info */}
              <div className="grid grid-cols-3 border border-black mb-2 p-1.5 gap-2">
                <div><span className="font-bold">০৪. স্থানীয় অভিভাবকের নামঃ</span> মোস্তফা কামাল চৌধুরী</div>
                <div><span className="font-bold">০৫. সম্পর্কঃ</span> পিতা</div>
                <div><span className="font-bold">০৬. ফোন নম্বরঃ</span> 01711223344</div>
              </div>

              {/* NID & Personal Details */}
              <div className="border border-black mb-2">
                <div className="p-1.5 border-b border-black flex items-center">
                  <span className="font-bold w-48">০৭. জাতীয় পরিচয়পত্র (NID) নং :</span>
                  <span className="font-mono font-bold tracking-wider text-xs">19952678901234567</span>
                  <span className="ml-2 text-[10px] text-emerald-700 font-semibold">(১৭ ডিজিটের স্মার্ট/জাতীয় পরিচয়পত্র)</span>
                </div>
                <div className="grid grid-cols-4 p-1.5 border-b border-black text-center">
                  <div><span className="font-bold">জন্মতারিখ:</span> ১৫/০৪/১৯৯৫</div>
                  <div><span className="font-bold">বয়স:</span> ২৯ বছর</div>
                  <div><span className="font-bold">বৈবাহিক অবস্থা:</span> অবিবাহিত</div>
                  <div><span className="font-bold">লিঙ্গ:</span> পুরুষ</div>
                </div>
                <div className="grid grid-cols-2 p-1.5">
                  <div><span className="font-bold">মোবাইল ফোন:</span> 01819876543</div>
                  <div><span className="font-bold">ইমেইল:</span> tanvir.chowdhury95@gmail.com</div>
                </div>
              </div>

              {/* Addresses */}
              <div className="grid grid-cols-2 border border-black mb-2">
                <div className="p-2 border-r border-black">
                  <span className="font-bold block border-b border-black pb-1 mb-1 bg-zinc-100 -mx-2 -mt-2 p-1">
                    ০৮. বর্তমান ঠিকানাঃ
                  </span>
                  <p>বাসা/রোড: বাড়ি নং- ১২/এ, ফ্ল্যাট- ৪বি, রোড- ৫, ধানমন্ডি</p>
                  <p>থানা: ধানমন্ডি, পোস্ট কোড: ১২০৫</p>
                  <p>জেলা: ঢাকা, বিভাগ: ঢাকা</p>
                </div>
                <div className="p-2">
                  <span className="font-bold block border-b border-black pb-1 mb-1 bg-zinc-100 -mx-2 -mt-2 p-1">
                    ০৯. স্থায়ী ঠিকানাঃ
                  </span>
                  <p>বাসা/গ্রাম: চৌধুরী ভিলা, মেইন রোড, গ্রাম: চন্দনপুরা</p>
                  <p>থানা: কোতোয়ালী, পোস্ট কোড: ৪০০০</p>
                  <p>জেলা: চট্টগ্রাম, বিভাগ: চট্টগ্রাম</p>
                </div>
              </div>

              {/* Education History */}
              <div className="mb-2">
                <span className="font-bold block mb-1">১০. শিক্ষাগত যোগ্যতাঃ</span>
                <table className="w-full border-collapse border border-black text-center">
                  <thead className="bg-zinc-100 font-bold">
                    <tr>
                      <th className="border border-black p-1">ডিগ্রী / সনদের নাম</th>
                      <th className="border border-black p-1">পাসের বছর</th>
                      <th className="border border-black p-1">বিষয় / বিভাগ</th>
                      <th className="border border-black p-1">বোর্ড / বিশ্ববিদ্যালয়</th>
                      <th className="border border-black p-1">প্রাপ্ত ফলাফল</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-black p-1 font-semibold">মাস্টার্স / এমবিএ</td>
                      <td className="border border-black p-1">২০১৯</td>
                      <td className="border border-black p-1">মার্কেটিং ও বিজনেস</td>
                      <td className="border border-black p-1">ঢাকা বিশ্ববিদ্যালয়</td>
                      <td className="border border-black p-1 font-bold text-emerald-800">সিজিপিএ ৩.৬৫</td>
                    </tr>
                    <tr>
                      <td className="border border-black p-1 font-semibold">স্নাতক (সম্মান)</td>
                      <td className="border border-black p-1">২০১৭</td>
                      <td className="border border-black p-1">ব্যবস্থাপনা</td>
                      <td className="border border-black p-1">ঢাকা বিশ্ববিদ্যালয়</td>
                      <td className="border border-black p-1 font-bold text-emerald-800">সিজিপিএ ৩.৫৮</td>
                    </tr>
                    <tr>
                      <td className="border border-black p-1 font-semibold">এইচএসসি (উচ্চ মাধ্যমিক)</td>
                      <td className="border border-black p-1">২০১৩</td>
                      <td className="border border-black p-1">ব্যবসায় শিক্ষা</td>
                      <td className="border border-black p-1">ঢাকা</td>
                      <td className="border border-black p-1 font-bold text-emerald-800">জিপিএ ৫.০০</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Training & Experience History */}
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <span className="font-bold block mb-1">১১. প্রশিক্ষণ সংক্রান্ত তথ্যাবলীঃ</span>
                  <table className="w-full border border-black text-center">
                    <thead className="bg-zinc-100 font-bold">
                      <tr>
                        <th className="border border-black p-1">বিষয়</th>
                        <th className="border border-black p-1">প্রতিষ্ঠান</th>
                        <th className="border border-black p-1">মেয়াদ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-black p-1">ডিজিটাল উদ্যোক্তা ও সাপ্লাই চেইন</td>
                        <td className="border border-black p-1">বিডা (BIDA)</td>
                        <td className="border border-black p-1">১ মাস</td>
                      </tr>
                      <tr>
                        <td className="border border-black p-1">অ্যাগ্রো ফুড প্রসেসিং</td>
                        <td className="border border-black p-1">বিসিক (BSCIC)</td>
                        <td className="border border-black p-1">৩ সপ্তাহ</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <span className="font-bold block mb-1">১২. অতীত অভিজ্ঞতাঃ</span>
                  <table className="w-full border border-black text-center">
                    <thead className="bg-zinc-100 font-bold">
                      <tr>
                        <th className="border border-black p-1">প্রতিষ্ঠান</th>
                        <th className="border border-black p-1">পদবী</th>
                        <th className="border border-black p-1">সময়কাল</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-black p-1">অর্গানিক ফার্মস লিমিটেড</td>
                        <td className="border border-black p-1 font-semibold">অপারেশন সুপারভাইজার</td>
                        <td className="border border-black p-1">২ বছর</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-1.5 border border-black bg-zinc-50 flex items-center justify-between">
                <span><strong className="font-bold">১৩. এই প্রশিক্ষণের তথ্য কোথা থেকে পেয়েছেনঃ</strong> Facebook/Social Media এর মাধ্যমে</span>
                <span className="text-[10px] text-zinc-500 font-mono">End of Page 1</span>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* PDF PAGE 2: ব্যবসায়িক প্রস্তাবনা ও পরিকল্পনা */}
            {/* ------------------------------------------------------------- */}
            <div 
              id="demo-pdf-page-2"
              className="bg-white p-4 sm:p-8 md:p-10 shadow-2xl rounded-sm border border-slate-300 font-sans relative text-xs leading-normal"
            >
              <div className="absolute top-3 right-4 text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                পৃষ্ঠা ২ / ৪ • SICIP নমুনা প্রতিবেদন
              </div>

              <div className="border-b-2 border-black pb-2 mb-3">
                <h4 className="text-xs font-bold text-zinc-900">Skills for Industry Competitiveness and Innovation Program (SICIP)</h4>
                <h3 className="text-sm font-extrabold text-zinc-950">
                  পার্ট- II: ব্যবসার প্রস্তাবনা ও ব্যবসায়িক পরিকল্পনা সংক্রান্ত তথ্যাবলী
                </h3>
              </div>

              {/* ক. সাধারণ তথ্যাবলী */}
              <div className="mb-4">
                <h5 className="font-bold text-xs bg-zinc-100 p-1 border border-black mb-2">
                  ক. সাধারণ তথ্যাবলীঃ
                </h5>

                <div className="space-y-2 border border-black p-2.5">
                  <div>
                    <span className="font-bold block">০১. ব্যবসার আইডিয়া / ধারণার বিবরণঃ</span>
                    <p className="mt-0.5 text-zinc-800 leading-relaxed bg-zinc-50 p-1.5 rounded border border-zinc-200">
                      স্থানীয়ভাবে উৎপাদিত সম্পূর্ণ প্রাকৃতিক ও প্রিজারভেটিভমুক্ত মধু, কোল্ড প্রেসড সরিষার তেল এবং জৈব খাদ্যশস্য আধুনিক স্বাস্থ্যসম্মত প্যাকেজিংয়ে বাণিজ্যিকীকরণ এবং শহরাঞ্চলে নির্ভরযোগ্য অর্গানিক খাদ্য সরবরাহ চেইন প্রতিষ্ঠা করা।
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1 border-t border-zinc-300">
                    <div>
                      <span className="font-bold">০২. সম্ভাব্য শুরুর সময়সীমাঃ</span>
                      <span className="ml-2 font-semibold text-emerald-800">৩ মাসের মধ্যে</span>
                    </div>
                    <div>
                      <span className="font-bold">০৩. প্রয়োজনীয় মূলধন ও অর্থায়নঃ</span>
                      <span className="ml-2 font-semibold text-emerald-800">১৫,০০,০০০ টাকা (নিজস্ব ৫ লক্ষ, ঋণ ১০ লক্ষ)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1 border-t border-zinc-300">
                    <div>
                      <span className="font-bold">০৪. ব্যবসার খাতঃ</span>
                      <span className="ml-2 font-semibold">ম্যানুফেকচারিং (অ্যাগ্রো ফুড প্রসেসিং ও অয়েল মিলিং)</span>
                    </div>
                    <div>
                      <span className="font-bold">০৫. কারখানা / প্রতিষ্ঠানের সম্ভাব্য স্থানঃ</span>
                      <span className="ml-2 font-semibold">বিসিক শিল্প এলাকা, কেরানীগঞ্জ, ঢাকা</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1 border-t border-zinc-300">
                    <div>
                      <span className="font-bold">০৬. পণ্যের ধরনঃ</span>
                      <span className="ml-2 font-semibold">আমদানির বিকল্প পণ্য</span>
                    </div>
                    <div>
                      <span className="font-bold">০৭. পণ্যের বাজারঃ</span>
                      <span className="ml-2 font-semibold">অভ্যন্তরীণ ও আন্তর্জাতিক (রপ্তানি সম্ভাবনাময়)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* খ. ব্যবসায়িক পরিকল্পনা সংক্রান্ত তথ্যাদি */}
              <div className="mb-2">
                <h5 className="font-bold text-xs bg-zinc-100 p-1 border border-black mb-2">
                  খ. ব্যবসায়িক পরিকল্পনা সংক্রান্ত তথ্যাদিঃ
                </h5>

                <div className="space-y-2.5 border border-black p-2.5">
                  <div>
                    <span className="font-bold block">i) চলমান ব্যবসায়ের বিবরণ (যদি থাকে) ঃ-</span>
                    <p className="mt-0.5 text-zinc-800 bg-zinc-50 p-1.5 rounded border border-zinc-200">
                      বর্তমানে সীমিত পরিসরে প্রি-অর্ডারের মাধ্যমে অনলাইনে পরীক্ষামূলকভাবে পণ্য সরবরাহ করা হচ্ছে।
                    </p>
                  </div>

                  <div className="pt-1 border-t border-zinc-300">
                    <span className="font-bold block">
                      ii) প্রশিক্ষণ সমাপনান্তে গৃহীতব্য পরিকল্পনাঃ
                    </span>
                    
                    <div className="mt-1.5 space-y-2 pl-2">
                      <div>
                        <span className="font-semibold block text-zinc-900">
                          ০১. চলমান ব্যবসায় সম্প্রসারণসহ কর্মী বাড়ানোর কোন পরিকল্পনা রয়েছে কিনা?
                        </span>
                        <p className="bg-zinc-50 p-1 rounded text-zinc-800">
                          উত্তরঃ <strong>হ্যাঁ</strong>, ব্যবসায় সম্প্রসারণের প্রাথমিক বছরে অন্তত ৬ জন দক্ষ ও ৪ জন অদক্ষ কর্মীসহ মোট ১০ জনের কর্মসংস্থান সৃষ্টির পরিকল্পনা রয়েছে।
                        </p>
                      </div>

                      <div>
                        <span className="font-semibold block text-zinc-900">
                          ০২. ব্যবসায় আর্থিক সংশ্লেষ ক্রমান্বয়ে বৃদ্ধি করার পরিকল্পনা রয়েছে কিনা?
                        </span>
                        <p className="bg-zinc-50 p-1 rounded text-zinc-800">
                          উত্তরঃ <strong>হ্যাঁ</strong>, উৎপাদন ও বিক্রয় বৃদ্ধির সাথে সাথে কার্যকারী মূলধন (Working Capital) ক্রমান্বয়ে বৃদ্ধি করা হবে।
                        </p>
                      </div>

                      <div>
                        <span className="font-semibold block text-zinc-900">
                          ০৩. বৃদ্ধির পরিকল্পনা থাকলে কীভাবে করবেনঃ
                        </span>
                        <p className="bg-zinc-50 p-1 rounded text-zinc-800">
                          উত্তরঃ ব্যাংক অর্থায়ন, বাংলাদেশ ব্যাংকের উদ্যোক্তা রিফাইন্যান্স স্কিম এবং অংশীদারী বিনিয়োগের মাধ্যমে।
                        </p>
                      </div>

                      <div>
                        <span className="font-semibold block text-zinc-900">
                          ০৪. পণ্যের গুণগত মান সংক্রান্ত পরিবর্তনের পরিকল্পনা রয়েছে কিনা?
                        </span>
                        <p className="bg-zinc-50 p-1 rounded text-zinc-800">
                          উত্তরঃ <strong>হ্যাঁ</strong>, বিএসটিআই এবং হালাল সার্টিফিকেশন অর্জনের মাধ্যমে আন্তর্জাতিক মানের পণ্য সরবরাহ নিশ্চিত করা হবে।
                        </p>
                      </div>

                      <div>
                        <span className="font-semibold block text-zinc-900">
                          ০৫. আর্থিক হিসাব-নিকাশ সংরক্ষণ করার পরিকল্পনা রয়েছে কিনা?
                        </span>
                        <p className="bg-zinc-50 p-1 rounded text-zinc-800">
                          উত্তরঃ <strong>হ্যাঁ</strong>, আধুনিক ক্লাউড পিওএস ও অ্যাকাউন্টিং সফটওয়্যারের মাধ্যমে দৈনিক আয়-ব্যয় এবং মাসিক লাভ-ক্ষতির পূর্ণ বিবরণ সংরক্ষণ করা হবে।
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-1.5 border border-black bg-zinc-50 flex items-center justify-between mt-4">
                <span className="font-semibold">বাংলাদেশ ব্যাংক SICIP উদ্যোক্তা উন্নয়ন প্রকল্প</span>
                <span className="text-[10px] text-zinc-500 font-mono">End of Page 2</span>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* PDF PAGE 3: আর্থিক বিশ্লেষণ ও প্রতিযোগী মূল্যায়ন */}
            {/* ------------------------------------------------------------- */}
            <div 
              id="demo-pdf-page-3"
              className="bg-white p-4 sm:p-8 md:p-10 shadow-2xl rounded-sm border border-slate-300 font-sans relative text-xs leading-normal"
            >
              <div className="absolute top-3 right-4 text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                পৃষ্ঠা ৩ / ৪ • SICIP নমুনা প্রতিবেদন
              </div>

              <div className="border-b-2 border-black pb-2 mb-3">
                <h4 className="text-xs font-bold text-zinc-900">Skills for Industry Competitiveness and Innovation Program (SICIP)</h4>
                <h3 className="text-sm font-extrabold text-zinc-950">
                  পার্ট- III: আর্থিক সম্ভাব্যতা ও প্রতিযোগী বিশ্লেষণ
                </h3>
              </div>

              {/* Financial Feasibility Calculations */}
              <div className="mb-4">
                <h5 className="font-bold text-xs bg-zinc-100 p-1 border border-black mb-2">
                  ক. আর্থিক সম্ভাব্যতা ও প্রাক্কলিত আয়-ব্যয় ছকঃ
                </h5>

                <div className="border border-black">
                  <div className="p-2 border-b border-black flex justify-between bg-zinc-50">
                    <span><strong className="font-bold">বর্তমান ব্যবসার ধরণ:</strong> ন্যাচারাল ফুড প্রসেসিং ও রিটেইল</span>
                    <span><strong className="font-bold">ট্রেড লাইসেন্স আছে?</strong> হ্যাঁ (ইস্যুর তারিখ: ২০/১১/২০২৩)</span>
                  </div>

                  <table className="w-full border-collapse text-left">
                    <tbody>
                      <tr className="border-b border-zinc-300">
                        <td className="p-2 font-bold w-64 bg-zinc-50 border-r border-black">০১. পণ্যের গড় বিক্রয়মূল্যঃ</td>
                        <td className="p-2 font-semibold">৪৫০.০০ টাকা প্রতি একক/কেজি</td>
                      </tr>
                      <tr className="border-b border-zinc-300">
                        <td className="p-2 font-bold bg-zinc-50 border-r border-black">০২. সম্ভাব্য দৈনিক বিক্রয়ের পরিমাণঃ</td>
                        <td className="p-2 font-semibold">১৮,০০০.০০ টাকা</td>
                      </tr>
                      <tr className="border-b border-zinc-300">
                        <td className="p-2 font-bold bg-zinc-50 border-r border-black">০৩. সম্ভাব্য মাসিক মোট বিক্রয়ঃ</td>
                        <td className="p-2 font-bold text-emerald-800">৫,৪০,০০০.০০ টাকা (৩০ দিন হিসাবে)</td>
                      </tr>
                      <tr className="border-b border-zinc-300">
                        <td className="p-2 font-bold bg-zinc-50 border-r border-black">০৪. সম্ভাব্য মাসিক কাঁচামাল ও পরিচালন ব্যয়ঃ</td>
                        <td className="p-2 font-semibold text-rose-800">৩,৬০,০০০.০০ টাকা</td>
                      </tr>
                      <tr className="bg-emerald-50">
                        <td className="p-2.5 font-bold text-emerald-950 border-r border-black">০৫. সম্ভাব্য মাসিক নিট প্রাক্কলিত মুনাফাঃ</td>
                        <td className="p-2.5 font-extrabold text-emerald-700 text-sm">
                          ১,৮০,০০০.০০ টাকা (মাসিক মোট বিক্রয় - মোট ব্যয়)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Market & Investment Details */}
              <div className="border border-black p-2.5 mb-4 space-y-2">
                <div>
                  <span className="font-bold">০৬. এই ব্যবসায় সম্পৃক্ত হওয়ার কারণঃ</span>
                  <p className="mt-0.5 text-zinc-800 bg-zinc-50 p-1.5 rounded">
                    পারিবারিক কৃষি পটভূমি ও বিশ্ববিদ্যালয়ে পড়ার সময় থেকেই নিরাপদ খাদ্যের বিশাল বাজার চাহিদা পর্যবেক্ষণ করে এই ব্যবসায় সম্পৃক্ত হওয়ার আগ্রহ জন্মায়।
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1 border-t border-zinc-300">
                  <div>
                    <span className="font-bold">০৭. প্রয়োজনীয় মোট বিনিয়োগঃ</span>
                    <span className="ml-1 font-bold text-emerald-800">১৫,০০,০০০.০০ টাকা</span>
                  </div>
                  <div>
                    <span className="font-bold">০৮. কাঁচামাল প্রাপ্তির উৎসঃ</span>
                    <span className="ml-1">সরাসরি চাষী ও সুন্দরবনের মৌয়াল</span>
                  </div>
                </div>

                <div className="pt-1 border-t border-zinc-300">
                  <span className="font-bold">০৯. পণ্যের সম্ভাব্য ক্রেতা / বাজারঃ</span>
                  <span className="ml-1">সচেতন নগরবাসী, সুপারশপ (স্বপ্ন, ইউনিমার্ট), কর্পোরেট ক্লায়েন্ট ও সাধারণ পরিবার।</span>
                </div>
              </div>

              {/* Competitor Analysis Table */}
              <div>
                <h5 className="font-bold text-xs bg-zinc-100 p-1 border border-black mb-2 flex items-center justify-between">
                  <span>খ. প্রতিযোগী প্রতিষ্ঠানের তুলনামূলক বিশ্লেষণ ছকঃ</span>
                  <span className="text-[10px] font-normal text-zinc-600">৩টি প্রধান প্রতিযোগী প্রতিষ্ঠানের মূল্যায়ন</span>
                </h5>

                <table className="w-full border-collapse border border-black text-left">
                  <thead className="bg-zinc-100 font-bold text-center">
                    <tr>
                      <th className="border border-black p-1.5 w-10">ক্র.</th>
                      <th className="border border-black p-1.5 w-44">প্রতিযোগীর নাম ও অবস্থান</th>
                      <th className="border border-black p-1.5">প্রধান শক্তি / সুবিধা</th>
                      <th className="border border-black p-1.5">প্রধান দুর্বলতা / সুযোগ</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-black p-2 text-center font-bold">১</td>
                      <td className="border border-black p-2">
                        <strong className="block text-zinc-900">খাস ফুড</strong>
                        <span className="text-[10px] text-zinc-600">ঢাকা ও দেশব্যাপী রিটেইল চেইন</span>
                      </td>
                      <td className="border border-black p-2">শক্তিশালী ব্র্যান্ড পরিচিতি ও প্রিমিয়াম প্যাকিং নেটওয়ার্ক</td>
                      <td className="border border-black p-2 text-rose-800">পণ্যের মূল্য তুলনামূলক অনেক বেশি এবং প্রত্যন্ত অঞ্চলে ডেলিভারি ধীরগতির</td>
                    </tr>
                    <tr>
                      <td className="border border-black p-2 text-center font-bold">২</td>
                      <td className="border border-black p-2">
                        <strong className="block text-zinc-900">প্রাকৃত ফুডস</strong>
                        <span className="text-[10px] text-zinc-600">উত্তরা, ঢাকা</span>
                      </td>
                      <td className="border border-black p-2">উচ্চ গুণগত মান ও বিশ্বস্ত কাস্টমার সাপোর্ট</td>
                      <td className="border border-black p-2 text-rose-800">সীমিত উৎপাদন সক্ষমতা এবং প্রচারণার অপ্রতুলতা</td>
                    </tr>
                    <tr>
                      <td className="border border-black p-2 text-center font-bold">৩</td>
                      <td className="border border-black p-2">
                        <strong className="block text-zinc-900">স্থানীয় খোলা বাজার</strong>
                        <span className="text-[10px] text-zinc-600">কারওয়ান বাজার ও পাইকারি মার্কেট</span>
                      </td>
                      <td className="border border-black p-2">সহজপ্রাপ্যতা ও কম মূল্য</td>
                      <td className="border border-black p-2 text-rose-800">ভেজাল ও স্বাস্থ্যসম্মত মান নিয়ন্ত্রণের নিশ্চয়তাহীনতা</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-1.5 border border-black bg-zinc-50 flex items-center justify-between mt-4">
                <span className="font-semibold">বাংলাদেশ ব্যাংক SICIP আর্থিক বিশ্লেষণ শাখা</span>
                <span className="text-[10px] text-zinc-500 font-mono">End of Page 3</span>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* PDF PAGE 4: পারিবারিক আয়, ব্যাংকিং ও প্রত্যয়ন */}
            {/* ------------------------------------------------------------- */}
            <div 
              id="demo-pdf-page-4"
              className="bg-white p-4 sm:p-8 md:p-10 shadow-2xl rounded-sm border border-slate-300 font-sans relative text-xs leading-normal"
            >
              <div className="absolute top-3 right-4 text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                পৃষ্ঠা ৪ / ৪ • SICIP নমুনা প্রতিবেদন
              </div>

              <div className="border-b-2 border-black pb-2 mb-3">
                <h4 className="text-xs font-bold text-zinc-900">Skills for Industry Competitiveness and Innovation Program (SICIP)</h4>
                <h3 className="text-sm font-extrabold text-zinc-950">
                  পার্ট- IV: পারিবারিক আয়, ব্যাংকিং বিবরণ ও প্রত্যয়ন
                </h3>
              </div>

              {/* Family Financial Details */}
              <div className="border border-black mb-4">
                <div className="p-1.5 bg-zinc-100 border-b border-black font-bold">
                  ০১. পারিবারিক আর্থিক তথ্যাবলীঃ
                </div>
                <div className="grid grid-cols-3 p-2 border-b border-zinc-300 text-center">
                  <div><span className="font-bold">উপার্জনক্ষম সদস্য:</span> ২ জন</div>
                  <div><span className="font-bold">পরিবারের মাসিক আয়:</span> ৯৫,০০০.০০ টাকা</div>
                  <div><span className="font-bold">পরিবারের মাসিক ব্যয়:</span> ৫৫,০০০.০০ টাকা</div>
                </div>
                <div className="p-2">
                  <span className="font-bold">পরিবারের অতীতে ব্যবসা করার অভিজ্ঞতাঃ</span>
                  <p className="mt-0.5 text-zinc-800">পারিবারিক কৃষিজ পণ্য বিপণনের ১৫ বছরের বাস্তব অভিজ্ঞতা রয়েছে।</p>
                </div>
              </div>

              {/* Banking Details */}
              <div className="border border-black mb-4">
                <div className="p-1.5 bg-zinc-100 border-b border-black font-bold">
                  ০২. উদ্যোক্তার ব্যাংকিং হিসাব সংক্রান্ত তথ্যাবলীঃ
                </div>
                <div className="grid grid-cols-2 p-2 border-b border-zinc-300">
                  <div><span className="font-bold">ব্যাংকের নামঃ</span> ইসলামী ব্যাংক বাংলাদেশ পিএলসি</div>
                  <div><span className="font-bold">শাখাঃ</span> ধানমন্ডি শাখা, ঢাকা</div>
                </div>
                <div className="grid grid-cols-2 p-2 border-b border-zinc-300">
                  <div><span className="font-bold">হিসাব নম্বরঃ</span> <span className="font-mono font-bold">20501450200891234</span></div>
                  <div><span className="font-bold">ব্যাংকিং সম্পর্কের সময়কালঃ</span> ৫ বছর</div>
                </div>
                <div className="p-2 flex items-center justify-between">
                  <span><span className="font-bold">অন্য কোনো ব্যাংক/আর্থিক প্রতিষ্ঠানে ঋণ আছে কিনাঃ</span> না (কোনো ঋণ বা খেলাপি নেই)</span>
                </div>
              </div>

              {/* Declaration & Undertaking */}
              <div className="border border-black p-3 mb-6 bg-zinc-50">
                <span className="font-bold block border-b border-black pb-1 mb-2 text-center text-zinc-900">
                  আবেদনকারীর অঙ্গীকারনামা ও প্রত্যয়ন
                </span>
                <p className="text-justify text-zinc-800 leading-relaxed text-[11px]">
                  আমি এই মর্মে অঙ্গীকার করছি যে, উপরে প্রদত্ত সকল তথ্য এবং বিবরণী আমার জ্ঞান ও বিশ্বাসমতে সম্পূর্ণ সত্য ও সঠিক। কোনো অসত্য বা ভুল তথ্য প্রদানের কারণে আমার আবেদন বাতিল বলে গণ্য হবে এবং বাংলাদেশ ব্যাংক ও সংশ্লিষ্ট কর্তৃপক্ষ কর্তৃক গৃহীত যেকোনো আইনানুগ ব্যবস্থা আমি মেনে নিতে বাধ্য থাকিব।
                </p>
              </div>

              {/* Signature Section */}
              <div className="pt-8 pb-4 flex justify-between items-end border-b border-black">
                <div>
                  <span className="font-bold">দাখিলের তারিখঃ</span> <span className="underline font-semibold">১৫/১১/২০২৪</span>
                </div>
                <div className="text-center w-60">
                  <div className="h-12 flex items-center justify-center mb-1">
                    <span className="font-cursive italic text-blue-900 text-lg font-bold tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
                      Tanvir A. Chowdhury
                    </span>
                  </div>
                  <span className="font-bold block border-t border-black pt-1">
                    আবেদনকারীর স্বাক্ষর ও তারিখ
                  </span>
                </div>
              </div>

              {/* Attachment Checklist */}
              <div className="mt-4 border border-black p-2.5">
                <span className="font-bold block mb-1">প্রয়োজনীয় সংযুক্তি চেকলিস্ট (Verified):</span>
                <ul className="grid grid-cols-2 gap-1.5 pl-2 text-[11px]">
                  <li className="flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>জাতীয় পরিচয়পত্র (NID) রঙিন স্ক্যান কপি</span>
                  </li>
                  <li className="flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>হালনাগাদ ট্রেড লাইসেন্স কপি (২০২৩-২৪)</span>
                  </li>
                  <li className="flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>শিক্ষাগত যোগ্যতার মূল সনদের সত্যায়িত কপি</span>
                  </li>
                  <li className="flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>পাসপোর্ট সাইজের রঙিন ছবি (২ কপি)</span>
                  </li>
                </ul>
              </div>

              <div className="p-1.5 border border-black bg-zinc-50 flex items-center justify-between mt-4">
                <span className="font-semibold">বাংলাদেশ ব্যাংক SICIP প্রোগ্রাম সমাপনী পাতা</span>
                <span className="text-[10px] text-zinc-500 font-mono">End of Page 4 • Official Document</span>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="p-3 sm:p-4 bg-slate-900 border-t border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 text-white">
          <span className="text-xs text-slate-400 text-center sm:text-left flex items-center space-x-1.5">
            <span>💡 আপনি পুরো নমুনাটি দেখে নিয়েছেন। এবার নিচের বাটনে ক্লিক করে সরাসরি এই নমুনা দিয়ে নিজের ফরম পূরণ শুরু করতে পারেন।</span>
          </span>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <a
              href="/sicip/sample-demo-pdf?action=print"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>PDF ডাউনলোড</span>
            </a>

            <button
              type="button"
              onClick={onLoadSampleData}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>এই নমুনা দিয়ে ফরম পূরণ করুন</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition cursor-pointer"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

