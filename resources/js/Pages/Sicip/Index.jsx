import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { 
  Plus, Printer, Eye, FileText, ArrowLeft, Building2, Calendar, Phone, 
  CheckCircle2, Clock, AlertCircle, XCircle, Trash2, UserCheck, ShieldCheck, 
  Download, RefreshCw, ChevronLeft, ChevronRight, User, MapPin, Briefcase, 
  ExternalLink, Search, Filter, ShieldAlert, Award, FileSpreadsheet, LogOut
} from 'lucide-react';
import { toBengaliNumber, formatBengaliCurrency, toBengaliDate } from '../../Utils/banglaUtils';
import { BANGLADESH_DIVISIONS, BUSINESS_CATEGORIES } from '../../Constants/sicipOptions';

export default function Index({ reports, stats = {}, filters = {} }) {
  const items = reports.data || [];

  const [search, setSearch] = useState(filters.search || '');
  const [status, setStatus] = useState(filters.status || 'all');
  const [division, setDivision] = useState(filters.division || 'all');
  const [category, setCategory] = useState(filters.category || 'all');
  const [isDeleting, setIsDeleting] = useState(null);

  const handleFilter = (newFilters = {}) => {
    const query = {
      search: newFilters.search !== undefined ? newFilters.search : search,
      status: newFilters.status !== undefined ? newFilters.status : status,
      division: newFilters.division !== undefined ? newFilters.division : division,
      category: newFilters.category !== undefined ? newFilters.category : category,
    };

    // Remove 'all' or empty strings
    Object.keys(query).forEach(key => {
      if (!query[key] || query[key] === 'all') delete query[key];
    });

    router.get('/sicip/reports', query, {
      preserveState: true,
      replace: true,
    });
  };

  const handleReset = () => {
    setSearch('');
    setStatus('all');
    setDivision('all');
    setCategory('all');
    router.get('/sicip/reports', {}, { replace: true });
  };

  const handleDelete = (id, trackingNumber) => {
    if (confirm(`আপনি কি নিশ্চিত যে ট্র্যাকিং নম্বর ${trackingNumber}-এর আবেদনটি মুছে ফেলতে চান? এটি আর ফিরিয়ে আনা যাবে না!`)) {
      setIsDeleting(id);
      router.delete(`/sicip/report/${id}`, {
        onFinish: () => setIsDeleting(null),
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Status badge config
  const getStatusBadge = (st) => {
    switch (st) {
      case 'approved':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>অনুমোদিত / মনোনীত</span>
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-300 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>যাচাইকরণাধীন</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300 shadow-sm">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>সংশোধন / বাতিল</span>
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-sm">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            <span>খসড়া (Draft)</span>
          </span>
        );
      case 'submitted':
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-100 text-sky-800 border border-sky-300 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
            <span>দাখিলকৃত (Submitted)</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 py-4 sm:py-6 px-2.5 sm:px-6 lg:px-8 font-sans">
      <Head title="আবেদন স্ক্রুটিনি ও অ্যাডমিন ড্যাশবোর্ড - SICIP (বাংলাদেশ ব্যাংক)" />

      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        
        {/* Top Floating App Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5 sm:gap-4 bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-md sm:shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-emerald-600/10 text-emerald-700 flex items-center justify-center font-bold text-xl sm:text-2xl border border-emerald-500/20 shrink-0">
              ৳
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[11px] sm:text-xs text-emerald-700 font-semibold tracking-wide truncate">
                  বাংলাদেশ ব্যাংক & SICIP প্রোগ্রাম
                </span>
                <span className="bg-emerald-50 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                  অ্যাডমিন স্ক্রুটিনি পোর্টাল
                </span>
              </div>
              <h1 className="text-sm sm:text-xl font-bold text-slate-900 mt-0.5 leading-snug">
                উদ্যোক্তা আবেদন ও সম্ভাব্যতা প্রতিবেদন পরিচালনা
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
            <Link
              href="/sicip/feasibility-report"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/30 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন আবেদন ফর্ম</span>
            </Link>

            <button
              type="button"
              onClick={handlePrint}
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold shadow-sm transition cursor-pointer print:hidden"
              title="বর্তমান তালিকা প্রিন্ট করুন"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>প্রিন্ট তালিকা</span>
            </button>

            <button
              type="button"
              onClick={() => router.post('/logout')}
              className="inline-flex items-center justify-center space-x-1 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold shadow-sm transition cursor-pointer print:hidden"
              title="অ্যাডমিন সেশন থেকে লগআউট করুন"
            >
              <LogOut className="w-4 h-4 text-rose-600" />
              <span>লগআউট</span>
            </button>
          </div>
        </div>

        {/* KPI Stats Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 print:hidden">
          {/* 1. Total */}
          <div 
            onClick={() => { setStatus('all'); handleFilter({ status: 'all' }); }}
            className={`p-4 rounded-2xl border transition cursor-pointer shadow-sm ${
              status === 'all' ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/30' : 'bg-white hover:bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-[11px] font-bold ${status === 'all' ? 'text-slate-300' : 'text-slate-500'}`}>মোট আবেদন</span>
              <FileText className={`w-4 h-4 ${status === 'all' ? 'text-emerald-400' : 'text-slate-400'}`} />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono bn-num">
              {toBengaliNumber(stats.total || 0)}
            </div>
          </div>

          {/* 2. Submitted */}
          <div 
            onClick={() => { setStatus('submitted'); handleFilter({ status: 'submitted' }); }}
            className={`p-4 rounded-2xl border transition cursor-pointer shadow-sm ${
              status === 'submitted' ? 'bg-sky-700 text-white border-sky-700 shadow-md ring-2 ring-sky-600/30' : 'bg-white hover:bg-sky-50/50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-[11px] font-bold ${status === 'submitted' ? 'text-sky-200' : 'text-sky-700'}`}>দাখিলকৃত</span>
              <CheckCircle2 className={`w-4 h-4 ${status === 'submitted' ? 'text-white' : 'text-sky-600'}`} />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono bn-num">
              {toBengaliNumber(stats.submitted || 0)}
            </div>
          </div>

          {/* 3. Under Review */}
          <div 
            onClick={() => { setStatus('under_review'); handleFilter({ status: 'under_review' }); }}
            className={`p-4 rounded-2xl border transition cursor-pointer shadow-sm ${
              status === 'under_review' ? 'bg-indigo-700 text-white border-indigo-700 shadow-md ring-2 ring-indigo-600/30' : 'bg-white hover:bg-indigo-50/50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-[11px] font-bold ${status === 'under_review' ? 'text-indigo-200' : 'text-indigo-700'}`}>যাচাইকরণাধীন</span>
              <ShieldCheck className={`w-4 h-4 ${status === 'under_review' ? 'text-white' : 'text-indigo-600'}`} />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono bn-num">
              {toBengaliNumber(stats.under_review || 0)}
            </div>
          </div>

          {/* 4. Approved */}
          <div 
            onClick={() => { setStatus('approved'); handleFilter({ status: 'approved' }); }}
            className={`p-4 rounded-2xl border transition cursor-pointer shadow-sm ${
              status === 'approved' ? 'bg-emerald-700 text-white border-emerald-700 shadow-md ring-2 ring-emerald-600/30' : 'bg-white hover:bg-emerald-50/50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-[11px] font-bold ${status === 'approved' ? 'text-emerald-200' : 'text-emerald-700'}`}>অনুমোদিত / মনোনীত</span>
              <Award className={`w-4 h-4 ${status === 'approved' ? 'text-white' : 'text-emerald-600'}`} />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono bn-num">
              {toBengaliNumber(stats.approved || 0)}
            </div>
          </div>

          {/* 5. Rejected / Correction */}
          <div 
            onClick={() => { setStatus('rejected'); handleFilter({ status: 'rejected' }); }}
            className={`p-4 rounded-2xl border transition cursor-pointer shadow-sm ${
              status === 'rejected' ? 'bg-rose-700 text-white border-rose-700 shadow-md ring-2 ring-rose-600/30' : 'bg-white hover:bg-rose-50/50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-[11px] font-bold ${status === 'rejected' ? 'text-rose-200' : 'text-rose-700'}`}>সংশোধন / বাতিল</span>
              <XCircle className={`w-4 h-4 ${status === 'rejected' ? 'text-white' : 'text-rose-600'}`} />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono bn-num">
              {toBengaliNumber(stats.rejected || 0)}
            </div>
          </div>

          {/* 6. Draft */}
          <div 
            onClick={() => { setStatus('draft'); handleFilter({ status: 'draft' }); }}
            className={`p-4 rounded-2xl border transition cursor-pointer shadow-sm ${
              status === 'draft' ? 'bg-amber-600 text-white border-amber-600 shadow-md ring-2 ring-amber-500/30' : 'bg-white hover:bg-amber-50/50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-[11px] font-bold ${status === 'draft' ? 'text-amber-100' : 'text-amber-800'}`}>খসড়া (Draft)</span>
              <Clock className={`w-4 h-4 ${status === 'draft' ? 'text-white' : 'text-amber-600'}`} />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono bn-num">
              {toBengaliNumber(stats.draft || 0)}
            </div>
          </div>
        </div>

        {/* Search & Multi-Filter Control Panel */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 print:hidden">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleFilter();
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3"
          >
            {/* Search Input */}
            <div className="lg:col-span-4 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="নাম, ট্র্যাকিং নম্বর, ফোন বা NID দিয়ে খুঁজুন..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50 focus:bg-white border border-slate-300 rounded-xl pl-10 pr-3 py-2 text-xs sm:text-sm text-slate-900 focus:border-emerald-600 focus:outline-none transition"
              />
            </div>

            {/* Status Filter */}
            <div className="lg:col-span-3">
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  handleFilter({ status: e.target.value });
                }}
                className="w-full bg-slate-50 focus:bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:border-emerald-600 focus:outline-none transition"
              >
                <option value="all">সব স্ট্যাটাস (All Status)</option>
                <option value="submitted">দাখিলকৃত (Submitted)</option>
                <option value="under_review">যাচাইকরণাধীন (Under Review)</option>
                <option value="approved">অনুমোদিত / মনোনীত (Approved)</option>
                <option value="rejected">সংশোধন প্রয়োজন / বাতিল (Rejected)</option>
                <option value="draft">খসড়া (Draft)</option>
              </select>
            </div>

            {/* Division Filter */}
            <div className="lg:col-span-2">
              <select
                value={division}
                onChange={(e) => {
                  setDivision(e.target.value);
                  handleFilter({ division: e.target.value });
                }}
                className="w-full bg-slate-50 focus:bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:border-emerald-600 focus:outline-none transition"
              >
                <option value="all">সব বিভাগ (All Divisions)</option>
                {BANGLADESH_DIVISIONS.map((div) => (
                  <option key={div} value={div}>{div}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="lg:col-span-2">
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  handleFilter({ category: e.target.value });
                }}
                className="w-full bg-slate-50 focus:bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:border-emerald-600 focus:outline-none transition"
              >
                <option value="all">সব ক্যাটাগরি (All Categories)</option>
                {BUSINESS_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="lg:col-span-1 flex items-center space-x-1.5">
              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center cursor-pointer shadow-sm"
                title="ফিল্টার প্রয়োগ করুন"
              >
                <Filter className="w-3.5 h-3.5" />
              </button>
              {(search || status !== 'all' || division !== 'all' || category !== 'all') && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold transition cursor-pointer"
                  title="ফিল্টার রিসেট করুন"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </form>

          {/* Active Filter Indicators */}
          {(search || status !== 'all' || division !== 'all' || category !== 'all') && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-500 font-medium">সক্রিয় ফিল্টারঃ</span>
              {search && (
                <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-lg border border-slate-200">
                  কীওয়ার্ড: <strong className="font-semibold">{search}</strong>
                </span>
              )}
              {status !== 'all' && (
                <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-lg border border-slate-200">
                  স্ট্যাটাস: <strong className="font-semibold">{status}</strong>
                </span>
              )}
              {division !== 'all' && (
                <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-lg border border-slate-200">
                  বিভাগ: <strong className="font-semibold">{division}</strong>
                </span>
              )}
              {category !== 'all' && (
                <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-lg border border-slate-200">
                  ক্যাটাগরি: <strong className="font-semibold">{category}</strong>
                </span>
              )}
              <button
                type="button"
                onClick={handleReset}
                className="text-rose-600 hover:text-rose-700 font-semibold underline text-xs cursor-pointer ml-1"
              >
                সব মুছুন
              </button>
            </div>
          )}
        </div>

        {/* Applications Data Table Card */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xl">
          {items.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <FileText className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-semibold text-slate-800">কোনো আবেদন পাওয়া যায়নি</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                আপনার দেওয়া ফিল্টারের সাথে মিলে এমন কোনো প্রতিবেদন পাওয়া যায়নি। ফিল্টার রিসেট করে আবার চেষ্টা করুন।
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>সব ফিল্টার রিসেট করুন</span>
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>
                  সর্বমোট <strong className="font-mono text-slate-900 bn-num">{toBengaliNumber(reports.total || items.length)}</strong> টি আবেদনের মধ্যে{' '}
                  <strong className="font-mono text-slate-900 bn-num">{toBengaliNumber(reports.from || 1)}</strong> - <strong className="font-mono text-slate-900 bn-num">{toBengaliNumber(reports.to || items.length)}</strong> প্রদর্শন করা হচ্ছে
                </span>
                <span className="text-emerald-700 font-semibold md:hidden text-[11px]">
                  📱 মোবাইল কার্ড ভিউ
                </span>
              </div>

              {/* 1. Mobile Phone Cards View (< md screens) */}
              <div className="block md:hidden p-3 space-y-3 bg-slate-50/70">
                {items.map((row) => (
                  <div
                    key={row.id}
                    className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm space-y-3 transition hover:shadow-md"
                  >
                    {/* Top Row: Photo + Name + Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center shadow-xs">
                          {row.photo_path ? (
                            <img
                              src={row.photo_path.startsWith('data:') ? row.photo_path : `/storage/${row.photo_path}`}
                              alt={row.applicant_name_bn}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          ) : (
                            <User className="w-6 h-6 text-slate-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/sicip/report/${row.tracking_number}/profile`}
                            className="font-bold text-slate-900 hover:text-emerald-700 text-sm block truncate"
                          >
                            {row.applicant_name_bn || 'নাম উল্লেখ নেই'}
                          </Link>
                          <div className="text-xs text-slate-500 truncate">{row.applicant_name_en}</div>
                          <div className="mt-1 inline-flex items-center space-x-1 text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/70">
                            <span>#{row.tracking_number}</span>
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0">
                        {getStatusBadge(row.status)}
                      </div>
                    </div>

                    {/* Details Box */}
                    <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">মোবাইল নম্বর</span>
                        <a 
                          href={`tel:${row.phone}`} 
                          className="font-mono text-emerald-700 font-bold flex items-center gap-1 hover:underline bn-num"
                        >
                          <Phone className="w-3 h-3 text-emerald-600" />
                          <span>{toBengaliNumber(row.phone || '-')}</span>
                        </a>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">ঠিকানা ও এলাকা</span>
                        <span className="text-slate-700 flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{row.present_address?.district || row.present_address?.division || '-'}</span>
                        </span>
                      </div>

                      <div className="col-span-2 pt-1 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                        <span className="text-slate-600 truncate max-w-[180px] flex items-center gap-1">
                          <Briefcase className="w-3 h-3 text-indigo-500 shrink-0" />
                          <span className="truncate">{row.business_category || 'ব্যবসা'}</span>
                        </span>
                        <span className="text-slate-400 text-[10px] bn-num flex items-center gap-1 shrink-0">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{toBengaliDate(row.submission_date || new Date(row.created_at).toLocaleDateString())}</span>
                        </span>
                      </div>

                      {row.admin_notes && (
                        <div className="col-span-2 text-[10px] text-amber-800 bg-amber-50 p-1.5 rounded-lg border border-amber-200/60 italic">
                          📝 {row.admin_notes}
                        </div>
                      )}
                    </div>

                    {/* Actions Row */}
                    <div className="flex items-center gap-2 pt-1">
                      <Link
                        href={`/sicip/report/${row.tracking_number}/profile`}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm shadow-emerald-600/30 flex items-center justify-center gap-1.5 transition text-center"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>স্ক্রুটিনি ও মূল্যায়ন</span>
                      </Link>

                      <Link
                        href={`/sicip/report/${row.tracking_number}`}
                        className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-xs transition"
                        title="অফিশিয়াল রিপোর্ট ভিউ"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      {row.status === 'draft' && (
                        <Link
                          href={`/sicip/feasibility-report?draft=${row.tracking_number}`}
                          className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition"
                          title="খসড়া ফর্ম সম্পাদনা"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDelete(row.id, row.tracking_number)}
                        disabled={isDeleting === row.id}
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition disabled:opacity-50"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* 2. Desktop Table View (>= md screens) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-[1000px] w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-700 text-xs border-b border-slate-200 font-semibold">
                    <tr>
                      <th className="py-3.5 px-4">আবেদনকারী ও ছবি</th>
                      <th className="py-3.5 px-4">যোগাযোগ ও ঠিকানা</th>
                      <th className="py-3.5 px-4">ব্যবসায়িক বিবরণ</th>
                      <th className="py-3.5 px-4">আবেদনের তারিখ</th>
                      <th className="py-3.5 px-4">স্ট্যাটাস</th>
                      <th className="py-3.5 px-4 text-center">অ্যাকশন ও স্ক্রুটিনি</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/80 transition group">
                        
                        {/* 1. Applicant with Photo */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center shadow-sm">
                              {row.photo_path ? (
                                <img
                                  src={row.photo_path.startsWith('data:') ? row.photo_path : `/storage/${row.photo_path}`}
                                  alt={row.applicant_name_bn}
                                  className="w-full h-full object-cover"
                                  onError={(e) => { e.target.style.display = 'none'; }}
                                />
                              ) : (
                                <User className="w-5 h-5 text-slate-400" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <Link 
                                href={`/sicip/report/${row.tracking_number}/profile`}
                                className="font-bold text-slate-900 hover:text-emerald-700 text-sm block truncate transition"
                                title="পূর্ণাঙ্গ প্রোফাইল দেখুন"
                              >
                                {row.applicant_name_bn || 'নাম উল্লেখ নেই'}
                              </Link>
                              <div className="text-[11px] text-slate-500 truncate">{row.applicant_name_en}</div>
                              <div className="mt-0.5 inline-flex items-center space-x-1 text-[10px] font-mono font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
                                <span>#</span>
                                <span>{row.tracking_number}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 2. Contact & Address */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-1 text-slate-800 font-mono bn-num">
                              <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span>{toBengaliNumber(row.phone || '-')}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-[11px] text-slate-500">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>
                                {row.present_address?.district ? `${row.present_address.district}, ${row.present_address.division}` : (row.present_address?.division || '-')}
                              </span>
                            </div>
                            {row.nid_number && (
                              <div className="text-[10px] text-slate-400 font-mono">
                                NID: {toBengaliNumber(row.nid_number)}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* 3. Business Info */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            <div className="font-semibold text-slate-900 flex items-center space-x-1">
                              <Briefcase className="w-3 h-3 text-indigo-500 shrink-0" />
                              <span className="truncate max-w-[200px]">{row.business_category || row.existing_business_type || 'নির্দিষ্ট নয়'}</span>
                            </div>
                            <div className="text-[11px] text-slate-500">
                              সম্ভাব্য স্থান: <span className="text-slate-700">{row.expected_location || '-'}</span>
                            </div>
                            <div className="text-[11px] text-emerald-700 font-semibold bn-num">
                              প্রাক্কলিত লাভ: {row.monthly_estimated_profit ? formatBengaliCurrency(row.monthly_estimated_profit) : '-'}
                            </div>
                          </div>
                        </td>

                        {/* 4. Submission Date */}
                        <td className="py-3.5 px-4">
                          <div className="text-slate-800 font-medium bn-num flex items-center space-x-1">
                            <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{toBengaliDate(row.submission_date || new Date(row.created_at).toLocaleDateString())}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {new Date(row.created_at).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>

                        {/* 5. Status Badge */}
                        <td className="py-3.5 px-4">
                          {getStatusBadge(row.status)}
                          {row.admin_notes && (
                            <div className="text-[10px] text-slate-500 mt-1 italic truncate max-w-[140px]" title={row.admin_notes}>
                              📝 {row.admin_notes}
                            </div>
                          )}
                        </td>

                        {/* 6. Action Buttons */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center space-x-1.5">
                            {/* Profile View (Primary Scrutiny Console) */}
                            <Link
                              href={`/sicip/report/${row.tracking_number}/profile`}
                              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 transition cursor-pointer"
                              title="পূর্ণাঙ্গ প্রোফাইল, ডকুমেন্ট যাচাই ও স্ট্যাটাস পরিচালনা করুন"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>প্রোফাইল ও স্ক্রুটিনি</span>
                            </Link>

                            {/* Official Printable Report View */}
                            <Link
                              href={`/sicip/report/${row.tracking_number}`}
                              className="p-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 shadow-sm transition"
                              title="অফিশিয়াল প্রিন্ট ভিউ দেখুন"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>

                            {/* Draft Edit (if draft) */}
                            {row.status === 'draft' && (
                              <Link
                                href={`/sicip/feasibility-report?draft=${row.tracking_number}`}
                                className="p-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition"
                                title="খসড়া ফর্ম সম্পাদনা"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Link>
                            )}

                            {/* Delete Application */}
                            <button
                              type="button"
                              onClick={() => handleDelete(row.id, row.tracking_number)}
                              disabled={isDeleting === row.id}
                              className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition cursor-pointer disabled:opacity-50"
                              title="আবেদন মুছে ফেলুন"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {reports.links && reports.links.length > 3 && (
                <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <span className="text-slate-500">
                    পৃষ্ঠা <strong className="font-mono bn-num">{toBengaliNumber(reports.current_page)}</strong> এর মোট <strong className="font-mono bn-num">{toBengaliNumber(reports.last_page)}</strong> পৃষ্ঠা
                  </span>

                  <div className="flex flex-wrap items-center gap-1">
                    {reports.links.map((link, idx) => {
                      if (!link.url) {
                        return (
                          <span
                            key={idx}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className="px-3 py-1.5 rounded-lg text-slate-400 bg-slate-50 border border-slate-200 text-xs select-none"
                          />
                        );
                      }

                      return (
                        <Link
                          key={idx}
                          href={link.url}
                          dangerouslySetInnerHTML={{ __html: link.label }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                            link.active
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
