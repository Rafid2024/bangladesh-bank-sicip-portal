import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
  ArrowLeft, Printer, Eye, Download, CheckCircle2, XCircle, Clock,
  ShieldCheck, AlertCircle, Phone, Mail, MapPin, Calendar, User,
  Briefcase, DollarSign, Award, FileText, Check, ChevronRight,
  ExternalLink, Building, Landmark, School, Sparkles, MessageSquare,
  ShieldAlert, Edit3, LogOut
} from 'lucide-react';
import { toBengaliNumber, formatBengaliCurrency, toBengaliDate } from '../../Utils/banglaUtils';

export default function ApplicantProfile({ report }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentStatus, setCurrentStatus] = useState(report.status || 'submitted');
  const [adminNotes, setAdminNotes] = useState(report.admin_notes || '');
  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [activeDocModal, setActiveDocModal] = useState(null);

  const handleStatusSubmit = (e) => {
    e.preventDefault();
    setIsSavingStatus(true);
    router.post(`/sicip/report/${report.id}/status`, {
      status: currentStatus,
      admin_notes: adminNotes,
    }, {
      preserveScroll: true,
      onFinish: () => setIsSavingStatus(false),
    });
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case 'approved':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>অনুমোদিত / প্রশিক্ষণের জন্য মনোনীত</span>
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-300 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>যাচাইকরণাধীন (Under Review)</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 shadow-sm">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>সংশোধন প্রয়োজন / বাতিল</span>
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-sm">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            <span>খসড়া আবেদন (Draft)</span>
          </span>
        );
      case 'submitted':
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-300 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
            <span>দাখিলকৃত (Submitted)</span>
          </span>
        );
    }
  };

  const renderFileUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('data:') || path.startsWith('http')) return path;
    return `/storage/${path}`;
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 py-4 sm:py-6 px-2.5 sm:px-6 lg:px-8 font-sans">
      <Head title={`আবেদনকারী প্রোফাইল: ${report.applicant_name_bn || report.tracking_number} - SICIP`} />

      <div className="max-w-6xl mx-auto space-y-6">

        {/* Navigation Breadcrumb & Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3">
            <Link
              href="/sicip/reports"
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm transition"
              title="আবেদন তালিকায় ফিরে যান"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <Link href="/sicip/reports" className="hover:text-emerald-700 font-medium">আবেদন তালিকা</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-900 font-semibold">আবেদনকারী বিস্তারিত প্রোফাইল</span>
              </div>
              <h1 className="text-base sm:text-xl font-bold text-slate-900 mt-0.5 flex items-center space-x-2">
                <span>{report.applicant_name_bn}</span>
                <span className="text-xs font-mono font-normal text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {report.tracking_number}
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <Link
              href={`/sicip/report/${report.tracking_number}`}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold shadow-sm transition"
              title="অফিশিয়াল ফরম্যাট ও প্রিন্ট ভিউ দেখুন"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>অফিশিয়াল রিপোর্ট প্রিন্ট</span>
            </Link>

            {report.status === 'draft' && (
              <Link
                href={`/sicip/feasibility-report?draft=${report.tracking_number}`}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold shadow-sm transition"
              >
                <Edit3 className="w-4 h-4" />
                <span>ড্রাফট সম্পাদনা</span>
              </Link>
            )}

            <button
              type="button"
              onClick={() => router.post('/logout')}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold shadow-sm transition cursor-pointer"
              title="অ্যাডমিন সেশন থেকে লগআউট"
            >
              <LogOut className="w-4 h-4 text-rose-600" />
              <span>লগআউট</span>
            </button>
          </div>
        </div>

        {/* Top Overview Banner Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white p-6 sm:p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              
              {/* Photo */}
              <div className="relative w-32 h-40 sm:w-36 sm:h-44 rounded-2xl overflow-hidden bg-slate-800 border-4 border-white/20 shadow-2xl shrink-0 flex items-center justify-center">
                {report.photo_path ? (
                  <img
                    src={renderFileUrl(report.photo_path)}
                    alt={report.applicant_name_bn}
                    className="w-full h-full object-cover cursor-pointer hover:scale-105 transition"
                    onClick={() => setActiveDocModal(renderFileUrl(report.photo_path))}
                  />
                ) : (
                  <User className="w-16 h-16 text-slate-400" />
                )}
              </div>

              {/* Basic Details */}
              <div className="flex-1 text-center md:text-left space-y-2">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                    উদ্যোক্তা উন্নয়ন প্রোগ্রাম (SICIP)
                  </span>
                  {getStatusBadge(report.status)}
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {report.applicant_name_bn}
                </h2>
                <p className="text-sm text-emerald-200 font-medium">
                  {report.applicant_name_en}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-3 text-xs text-emerald-100/90 border-t border-white/10">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-mono bn-num">{toBengaliNumber(report.phone || '-')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{report.email || 'ইমেইল নেই'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      {report.present_address?.district ? `${report.present_address.district}, ${report.present_address.division}` : (report.present_address?.division || '-')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Briefcase className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>ক্যাটাগরি: {report.business_category || report.existing_business_type || '-'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="bn-num">দাখিলের তারিখ: {toBengaliDate(report.submission_date || new Date(report.created_at).toLocaleDateString())}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="bn-num font-semibold text-white">মাসিক লাভ: {report.monthly_estimated_profit ? formatBengaliCurrency(report.monthly_estimated_profit) : '-'}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Admin Decision & Status Management Panel */}
          <div className="bg-slate-50 p-5 sm:p-6 border-t border-slate-200">
            <form onSubmit={handleStatusSubmit} className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b border-slate-200">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">অ্যাডমিন রিভিউ, স্ট্যাটাস পরিবর্তন ও স্ক্রুটিনি সিদ্ধান্ত</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    আবেদনের বর্তমান স্ট্যাটাস নির্ধারণ করুনঃ
                  </label>
                  <select
                    value={currentStatus}
                    onChange={(e) => setCurrentStatus(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:border-emerald-600 focus:outline-none transition font-semibold"
                  >
                    <option value="submitted">দাখিলকৃত (Submitted)</option>
                    <option value="under_review">যাচাইকরণাধীন (Under Review)</option>
                    <option value="approved">অনুমোদিত / প্রশিক্ষণের জন্য মনোনীত (Approved)</option>
                    <option value="rejected">সংশোধন প্রয়োজন / বাতিল (Needs Correction / Rejected)</option>
                    <option value="draft">খসড়া মোড (Draft)</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    অ্যাডমিন স্ক্রুটিনি নোট / মন্তব্য (Internal Notes):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="যেমন: কাগজপত্র সঠিক আছে, সাক্ষাৎকারের জন্য ডাকা হবে..."
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:border-emerald-600 focus:outline-none transition"
                    />
                    <button
                      type="submit"
                      disabled={isSavingStatus}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-md shadow-emerald-600/20 cursor-pointer disabled:opacity-50 shrink-0"
                    >
                      {isSavingStatus ? 'সংরক্ষণ হচ্ছে...' : 'সিদ্ধান্ত সেভ করুন'}
                    </button>
                  </div>
                </div>
              </div>

              {report.reviewed_at && (
                <div className="text-[11px] text-slate-500 flex items-center space-x-2 pt-1">
                  <span>সর্বশেষ পর্যালোচনাঃ</span>
                  <span className="font-semibold text-slate-700 bn-num">{new Date(report.reviewed_at).toLocaleString('bn-BD')}</span>
                  {report.reviewer && (
                    <span>• পর্যালোচনাকারী: <strong className="text-slate-800">{report.reviewer.name}</strong></span>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Tabs Navigation (Horizontally scrollable on mobile, wraps on desktop) */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
          {[
            { id: 'overview', label: '১. ব্যক্তিগত ও পারিবারিক', icon: User },
            { id: 'business', label: '২. আইডিয়া ও পরিকল্পনা', icon: Briefcase },
            { id: 'financials', label: '৩. আর্থিক হিসাব ও প্রতিযোগী', icon: DollarSign },
            { id: 'documents', label: '৪. ডকুমেন্ট ও সংযুক্তি', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center space-x-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer shrink-0 whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Personal & Family Info */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Identity & Personal Info Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center space-x-2">
                <User className="w-4 h-4 text-emerald-600" />
                <span>আবেদনকারীর ব্যক্তিগত পরিচিতি (NID মোতাবেক)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 block mb-0.5">আবেদনকারীর নাম (বাংলা):</span>
                  <span className="font-bold text-slate-900 text-sm">{report.applicant_name_bn}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 block mb-0.5">আবেদনকারীর নাম (English):</span>
                  <span className="font-bold text-slate-900 text-sm">{report.applicant_name_en}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 block mb-0.5">পিতার নাম:</span>
                  <span className="font-semibold text-slate-900">{report.father_name_bn} ({report.father_name_en || '-'})</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 block mb-0.5">মাতার নাম:</span>
                  <span className="font-semibold text-slate-900">{report.mother_name_bn} ({report.mother_name_en || '-'})</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 block mb-0.5">NID নম্বর:</span>
                  <span className="font-bold font-mono text-emerald-800 bn-num text-sm">{toBengaliNumber(report.nid_number || '-')}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 block mb-0.5">জন্ম তারিখ ও বয়স:</span>
                  <span className="font-semibold text-slate-900 bn-num">{toBengaliDate(report.dob)} ({toBengaliNumber(report.age || '-')} বছর)</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 block mb-0.5">বৈবাহিক অবস্থা:</span>
                  <span className="font-semibold text-slate-900">{report.marital_status || '-'}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 block mb-0.5">তথ্য প্রাপ্তির উৎস:</span>
                  <span className="font-semibold text-slate-900">{report.info_source || '-'}</span>
                </div>
              </div>

              {/* Guardian Info */}
              <div className="pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 mb-2">স্থানীয় অভিভাবকের বিবরণঃ</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-lg">অভিভাবকের নাম: <strong>{report.guardian_name || '-'}</strong></div>
                  <div className="p-2.5 bg-slate-50 rounded-lg">সম্পর্ক: <strong>{report.guardian_relation || '-'}</strong></div>
                  <div className="p-2.5 bg-slate-50 rounded-lg">ফোন: <strong className="font-mono bn-num">{toBengaliNumber(report.guardian_phone || '-')}</strong></div>
                </div>
              </div>
            </div>

            {/* Addresses Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 text-xs">
                <h4 className="font-bold text-slate-900 flex items-center space-x-1.5 pb-2 border-b border-slate-100">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>বর্তমান ঠিকানা</span>
                </h4>
                <div className="space-y-1 text-slate-700 leading-relaxed">
                  <p><strong>বিভাগ:</strong> {report.present_address?.division || '-'}</p>
                  <p><strong>জেলা:</strong> {report.present_address?.district || '-'}</p>
                  <p><strong>থানা/উপজেলা:</strong> {report.present_address?.thana || '-'}</p>
                  <p><strong>বাড়ি/মহল্লা:</strong> {report.present_address?.house || '-'}</p>
                  <p><strong>রোড/গ্রাম:</strong> {report.present_address?.road || '-'}</p>
                  <p><strong>পোস্ট কোড:</strong> {report.present_address?.post_code || '-'}</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 text-xs">
                <h4 className="font-bold text-slate-900 flex items-center space-x-1.5 pb-2 border-b border-slate-100">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  <span>স্থায়ী ঠিকানা</span>
                </h4>
                <div className="space-y-1 text-slate-700 leading-relaxed">
                  <p><strong>বিভাগ:</strong> {report.permanent_address?.division || '-'}</p>
                  <p><strong>জেলা:</strong> {report.permanent_address?.district || '-'}</p>
                  <p><strong>থানা/উপজেলা:</strong> {report.permanent_address?.thana || '-'}</p>
                  <p><strong>বাড়ি/মহল্লা:</strong> {report.permanent_address?.house || '-'}</p>
                  <p><strong>রোড/গ্রাম:</strong> {report.permanent_address?.road || '-'}</p>
                  <p><strong>পোস্ট কোড:</strong> {report.permanent_address?.post_code || '-'}</p>
                </div>
              </div>
            </div>

            {/* Education History Table */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h4 className="font-bold text-slate-900 flex items-center space-x-2 text-xs sm:text-sm">
                <School className="w-4 h-4 text-emerald-600" />
                <span>১১. শিক্ষাগত যোগ্যতা</span>
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">ডিগ্রি / সনদ</th>
                      <th className="p-2.5">ফলাফল</th>
                      <th className="p-2.5">পাসের সন</th>
                      <th className="p-2.5">বিষয়</th>
                      <th className="p-2.5">বোর্ড / বিশ্ববিদ্যালয়</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(report.education_history || []).map((edu, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2.5 font-bold text-slate-900">{edu.degree || '-'}</td>
                        <td className="p-2.5">{edu.result || '-'}</td>
                        <td className="p-2.5 font-mono bn-num">{toBengaliNumber(edu.passing_year || '-')}</td>
                        <td className="p-2.5">{edu.subject || '-'}</td>
                        <td className="p-2.5">{edu.board || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Training and Experience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-xs">
                <h4 className="font-bold text-slate-900 pb-2 border-b border-slate-100">১৬. প্রশিক্ষণ ইতিহাস</h4>
                {(!report.training_history || report.training_history.length === 0) ? (
                  <p className="text-slate-500 italic">কোনো পূর্ববর্তী প্রশিক্ষণ নেই</p>
                ) : (
                  <div className="space-y-2">
                    {report.training_history.map((tr, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-50 rounded-xl space-y-0.5">
                        <p className="font-bold text-slate-900">{tr.subject || 'প্রশিক্ষণ'}</p>
                        <p className="text-slate-600">প্রতিষ্ঠান: {tr.institute || '-'}</p>
                        <p className="text-slate-500">সময়কাল: {tr.duration || '-'} {tr.completion_date && `(${toBengaliDate(tr.completion_date)})`}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-xs">
                <h4 className="font-bold text-slate-900 pb-2 border-b border-slate-100">১৭. কাজের / ব্যবসায়িক অভিজ্ঞতা</h4>
                {(!report.experience_history || report.experience_history.length === 0) ? (
                  <p className="text-slate-500 italic">কোনো পূর্ববর্তী অভিজ্ঞতা নেই</p>
                ) : (
                  <div className="space-y-2">
                    {report.experience_history.map((exp, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-50 rounded-xl space-y-0.5">
                        <p className="font-bold text-slate-900">{exp.organization || 'প্রতিষ্ঠান'}</p>
                        <p className="text-slate-600">পদবী: {exp.designation || '-'} ({exp.type || '-'})</p>
                        <p className="text-slate-500">সময়কাল: {exp.duration || '-'}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Banking Details Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 flex items-center space-x-2 pb-2 border-b border-slate-100">
                <Landmark className="w-4 h-4 text-emerald-600" />
                <span>আবেদনকারীর ব্যাংক হিসাব বিবরণ</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 block mb-0.5">ব্যাংক ও শাখার নাম:</span>
                  <span className="font-bold text-slate-900 text-sm">{report.bank_and_branch_name || '-'}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 block mb-0.5">হিসাব নম্বর:</span>
                  <span className="font-bold font-mono text-emerald-800 text-sm">{report.bank_account_number || '-'}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 block mb-0.5">শাখার রাউটিং নম্বর:</span>
                  <span className="font-mono text-slate-700">{report.bank_routing_number || '-'}</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Business Idea & Plan */}
        {activeTab === 'business' && (
          <div className="space-y-6 text-xs sm:text-sm">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base pb-2 border-b border-slate-100 flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-emerald-600" />
                <span>পার্ট-II: ব্যবসায়িক আইডিয়া ও পরিকল্পনা সংক্রান্ত তথ্যাবলী</span>
              </h3>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                  <span className="font-bold text-slate-800 block">০১. উদ্যোগ/সৃজনশীল ব্যবসায়িক ধারণার সংক্ষিপ্ত বিবরণঃ</span>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line">{report.idea_description || '-'}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                    <span className="font-bold text-slate-800 block">০২. ব্যবসা শুরুর সম্ভাব্য সময়সীমাঃ</span>
                    <p className="text-slate-700 font-semibold">{report.business_start_timeline || '-'}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                    <span className="font-bold text-slate-800 block">০৫. ব্যবসাটির সম্ভাব্য অবস্থানঃ</span>
                    <p className="text-slate-700 font-semibold">{report.expected_location || '-'}</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                  <span className="font-bold text-slate-800 block">০৩. মূলধন / অর্থায়ন পরিকল্পনাঃ</span>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line">{report.capital_financing_plan || '-'}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                    <span className="font-bold text-slate-800 block">০৪. ব্যবসায়ের ধরণঃ</span>
                    <p className="text-slate-700 font-semibold">{report.business_category || '-'}</p>
                    {report.business_category_details && (
                      <p className="text-xs text-slate-500 mt-1">{report.business_category_details}</p>
                    )}
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                    <span className="font-bold text-slate-800 block">০৬. পণ্যের ধরণঃ</span>
                    <p className="text-slate-700 font-semibold">{report.product_type || '-'}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                    <span className="font-bold text-slate-800 block">০৭. বাজার পরিধিঃ</span>
                    <p className="text-slate-700 font-semibold">{report.market_scope || '-'}</p>
                  </div>
                </div>

                {/* Future plans */}
                <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-200">
                  <span className="font-bold text-slate-800 block">পরিকল্পনা ও ব্যবস্থাপনা সংক্রান্ত বিবরণঃ</span>
                  <div className="space-y-1.5 text-xs text-slate-700">
                    <p><strong>কর্মী সংখ্যা বৃদ্ধি:</strong> {report.plan_expand_employees || '-'}</p>
                    <p><strong>আর্থিক সম্পৃক্ততা বৃদ্ধি:</strong> {report.plan_increase_financial_involvement || '-'}</p>
                    <p><strong>অর্থায়ন বৃদ্ধির মাধ্যম:</strong> {report.way_to_increase_finance || '-'}</p>
                    <p><strong>পণ্যের মান পরিবর্তন:</strong> {report.plan_product_quality_change || '-'}</p>
                    <p><strong>হিসাব সংরক্ষণ পরিকল্পনা:</strong> {report.plan_maintain_financial_records || '-'}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab 3: Financials & Competitor Analysis */}
        {activeTab === 'financials' && (
          <div className="space-y-6">
            
            {/* Financial Overview Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
                <span className="text-[11px] text-slate-500 block mb-1">গড় বিক্রয় মূল্য</span>
                <span className="text-base sm:text-lg font-bold text-slate-900 bn-num">
                  {report.avg_selling_price ? formatBengaliCurrency(report.avg_selling_price) : '-'}
                </span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
                <span className="text-[11px] text-slate-500 block mb-1">দৈনিক বিক্রয়ের পরিমাণ</span>
                <span className="text-base sm:text-lg font-bold text-slate-900 bn-num">
                  {report.daily_sales_amount ? formatBengaliCurrency(report.daily_sales_amount) : '-'}
                </span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
                <span className="text-[11px] text-slate-500 block mb-1">মাসিক মোট বিক্রয়</span>
                <span className="text-base sm:text-lg font-bold text-slate-900 bn-num">
                  {report.monthly_sales_amount ? formatBengaliCurrency(report.monthly_sales_amount) : '-'}
                </span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
                <span className="text-[11px] text-slate-500 block mb-1">মাসিক খরচ</span>
                <span className="text-base sm:text-lg font-bold text-rose-700 bn-num">
                  {report.monthly_raw_operational_cost ? formatBengaliCurrency(report.monthly_raw_operational_cost) : '-'}
                </span>
              </div>
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-300 shadow-sm text-center">
                <span className="text-[11px] text-emerald-800 font-bold block mb-1">প্রাক্কলিত মাসিক লাভ</span>
                <span className="text-base sm:text-lg font-black text-emerald-800 bn-num">
                  {report.monthly_estimated_profit ? formatBengaliCurrency(report.monthly_estimated_profit) : '-'}
                </span>
              </div>
            </div>

            {/* Total Investment & Trade License */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1 text-xs">
                <span className="text-slate-500">ব্যবসায়ে মোট বিনিয়োগের পরিমাণঃ</span>
                <div className="text-xl font-bold text-slate-900 bn-num">
                  {report.total_investment_amount ? formatBengaliCurrency(report.total_investment_amount) : '-'}
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1 text-xs">
                <span className="text-slate-500">ট্রেড লাইসেন্স সংক্রান্ত তথ্যঃ</span>
                <div className="text-base font-semibold text-slate-900">
                  {report.has_trade_license ? `হ্যাঁ (তারিখ: ${toBengaliDate(report.trade_license_date)})` : 'না / নেই'}
                </div>
              </div>
            </div>

            {/* Competitor Analysis Table */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm">১৪. প্রতিযোগী প্রতিষ্ঠানের বিশ্লেষণ</h4>
              <div className="overflow-x-auto">
                <table className="min-w-[700px] w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">প্রতিযোগীর নাম</th>
                      <th className="p-2.5">অবস্থান</th>
                      <th className="p-2.5">দৈনিক উৎপাদন</th>
                      <th className="p-2.5">দৈনিক বিক্রয়</th>
                      <th className="p-2.5">বিক্রয় মূল্য</th>
                      <th className="p-2.5">কভারেজ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(report.competitor_analysis || []).map((comp, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2.5 font-bold text-slate-900">{comp.name || '-'}</td>
                        <td className="p-2.5">{comp.location || '-'}</td>
                        <td className="p-2.5">{comp.daily_production || '-'}</td>
                        <td className="p-2.5">{comp.daily_sales || '-'}</td>
                        <td className="p-2.5">{comp.price || '-'}</td>
                        <td className="p-2.5">{comp.coverage || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Competitive Advantage */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2">প্রতিযোগিতামূলক সুবিধা ও প্রশিক্ষণ গ্রহণের উদ্দেশ্য</h4>
              <div className="space-y-3 text-slate-700">
                <p><strong>ক্রেতারা কেন পণ্য ক্রয় করবে:</strong> {report.reason_buyers_choose_you || '-'}</p>
                <p><strong>মূল্য ও গুণগত পার্থক্যের বিবরণ:</strong> {report.price_and_quality_difference || '-'}</p>
                <p><strong>বর্তমান ব্যবসায়িক সমস্যা/চ্যালেঞ্জ:</strong> {report.existing_business_challenges || '-'}</p>
                <p><strong>প্রশিক্ষণে অংশগ্রহণের উদ্দেশ্য:</strong> {report.training_participation_reason || '-'}</p>
              </div>
            </div>

          </div>
        )}

        {/* Tab 4: Documents & Attachments Verification */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-base font-bold text-slate-900">জমা দেওয়া ডকুমেন্ট ও সংযুক্তি ফাইলসমূহ যাচাই</h3>
                </div>
                <span className="text-xs text-slate-500">যেকোনো ফাইলে ক্লিক করে বড় আকারে যাচাই করুন</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                
                {/* 1. Passport Photo */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">পাসপোর্ট সাইজ ছবি</span>
                    {report.photo_path ? (
                      <span className="text-emerald-600 flex items-center space-x-1 text-xs font-semibold">
                        <Check className="w-4 h-4" />
                        <span>আপলোডকৃত</span>
                      </span>
                    ) : (
                      <span className="text-rose-500 text-xs">জমা দেওয়া হয়নি</span>
                    )}
                  </div>
                  {report.photo_path ? (
                    <div 
                      onClick={() => setActiveDocModal(renderFileUrl(report.photo_path))}
                      className="w-full h-40 rounded-lg overflow-hidden bg-white border border-slate-200 cursor-pointer relative group flex items-center justify-center"
                    >
                      <img src={renderFileUrl(report.photo_path)} alt="Photo" className="w-full h-full object-cover group-hover:scale-105 transition" />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-semibold">
                        <Eye className="w-4 h-4 mr-1" /> বড় করে দেখুন
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-40 rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs">ছবি নেই</div>
                  )}
                  {report.photo_path && (
                    <a
                      href={renderFileUrl(report.photo_path)}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-center text-xs font-semibold text-emerald-700 hover:underline"
                    >
                      ডাউনলোড / নতুন ট্যাবে দেখুন &rarr;
                    </a>
                  )}
                </div>

                {/* 2. Applicant Signature */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">আবেদনকারীর স্বাক্ষর</span>
                    {report.signature_path ? (
                      <span className="text-emerald-600 flex items-center space-x-1 text-xs font-semibold">
                        <Check className="w-4 h-4" />
                        <span>আপলোডকৃত</span>
                      </span>
                    ) : (
                      <span className="text-rose-500 text-xs">জমা দেওয়া হয়নি</span>
                    )}
                  </div>
                  {report.signature_path ? (
                    <div 
                      onClick={() => setActiveDocModal(renderFileUrl(report.signature_path))}
                      className="w-full h-40 rounded-lg overflow-hidden bg-white border border-slate-200 cursor-pointer relative group flex items-center justify-center p-2"
                    >
                      <img src={renderFileUrl(report.signature_path)} alt="Signature" className="max-w-full max-h-full object-contain group-hover:scale-105 transition" />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-semibold">
                        <Eye className="w-4 h-4 mr-1" /> বড় করে দেখুন
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-40 rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs">স্বাক্ষর নেই</div>
                  )}
                  {report.signature_path && (
                    <a
                      href={renderFileUrl(report.signature_path)}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-center text-xs font-semibold text-emerald-700 hover:underline"
                    >
                      ডাউনলোড / নতুন ট্যাবে দেখুন &rarr;
                    </a>
                  )}
                </div>

                {/* 3. NID Document */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">জাতীয় পরিচয়পত্র (NID) কপি</span>
                    {report.nid_attachment_path ? (
                      <span className="text-emerald-600 flex items-center space-x-1 text-xs font-semibold">
                        <Check className="w-4 h-4" />
                        <span>আপলোডকৃত</span>
                      </span>
                    ) : (
                      <span className="text-rose-500 text-xs">জমা দেওয়া হয়নি</span>
                    )}
                  </div>
                  {report.nid_attachment_path ? (
                    <div 
                      onClick={() => setActiveDocModal(renderFileUrl(report.nid_attachment_path))}
                      className="w-full h-40 rounded-lg overflow-hidden bg-white border border-slate-200 cursor-pointer relative group flex items-center justify-center p-2"
                    >
                      {report.nid_attachment_path.toLowerCase().endsWith('.pdf') ? (
                        <div className="text-center p-4">
                          <FileText className="w-12 h-12 text-rose-500 mx-auto mb-1" />
                          <span className="text-xs font-bold text-slate-700">PDF ডকুমেন্ট</span>
                        </div>
                      ) : (
                        <img src={renderFileUrl(report.nid_attachment_path)} alt="NID Document" className="w-full h-full object-contain group-hover:scale-105 transition" />
                      )}
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-semibold">
                        <Eye className="w-4 h-4 mr-1" /> দেখুন
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-40 rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs">ডকুমেন্ট নেই</div>
                  )}
                  {report.nid_attachment_path && (
                    <a
                      href={renderFileUrl(report.nid_attachment_path)}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-center text-xs font-semibold text-emerald-700 hover:underline"
                    >
                      ডাউনলোড / নতুন ট্যাবে দেখুন &rarr;
                    </a>
                  )}
                </div>

                {/* 4. Trade License */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">ট্রেড লাইসেন্স কপি</span>
                    {report.trade_license_attachment_path ? (
                      <span className="text-emerald-600 flex items-center space-x-1 text-xs font-semibold">
                        <Check className="w-4 h-4" />
                        <span>সংযুক্ত</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs">প্রযোজ্য নয় / নেই</span>
                    )}
                  </div>
                  {report.trade_license_attachment_path ? (
                    <div 
                      onClick={() => setActiveDocModal(renderFileUrl(report.trade_license_attachment_path))}
                      className="w-full h-40 rounded-lg overflow-hidden bg-white border border-slate-200 cursor-pointer relative group flex items-center justify-center p-2"
                    >
                      {report.trade_license_attachment_path.toLowerCase().endsWith('.pdf') ? (
                        <div className="text-center p-4">
                          <FileText className="w-12 h-12 text-rose-500 mx-auto mb-1" />
                          <span className="text-xs font-bold text-slate-700">PDF ডকুমেন্ট</span>
                        </div>
                      ) : (
                        <img src={renderFileUrl(report.trade_license_attachment_path)} alt="Trade License" className="w-full h-full object-contain group-hover:scale-105 transition" />
                      )}
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-semibold">
                        <Eye className="w-4 h-4 mr-1" /> দেখুন
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-40 rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs">সংযুক্ত করা হয়নি</div>
                  )}
                  {report.trade_license_attachment_path && (
                    <a
                      href={renderFileUrl(report.trade_license_attachment_path)}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-center text-xs font-semibold text-emerald-700 hover:underline"
                    >
                      ডাউনলোড / নতুন ট্যাবে দেখুন &rarr;
                    </a>
                  )}
                </div>

                {/* 5. Education Certificate */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">সর্বশেষ শিক্ষা সনদের কপি</span>
                    {report.education_certificate_path ? (
                      <span className="text-emerald-600 flex items-center space-x-1 text-xs font-semibold">
                        <Check className="w-4 h-4" />
                        <span>আপলোডকৃত</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs">নেই</span>
                    )}
                  </div>
                  {report.education_certificate_path ? (
                    <div 
                      onClick={() => setActiveDocModal(renderFileUrl(report.education_certificate_path))}
                      className="w-full h-40 rounded-lg overflow-hidden bg-white border border-slate-200 cursor-pointer relative group flex items-center justify-center p-2"
                    >
                      {report.education_certificate_path.toLowerCase().endsWith('.pdf') ? (
                        <div className="text-center p-4">
                          <FileText className="w-12 h-12 text-rose-500 mx-auto mb-1" />
                          <span className="text-xs font-bold text-slate-700">PDF সনদ</span>
                        </div>
                      ) : (
                        <img src={renderFileUrl(report.education_certificate_path)} alt="Certificate" className="w-full h-full object-contain group-hover:scale-105 transition" />
                      )}
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-semibold">
                        <Eye className="w-4 h-4 mr-1" /> দেখুন
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-40 rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs">সনদ আপলোড করা হয়নি</div>
                  )}
                  {report.education_certificate_path && (
                    <a
                      href={renderFileUrl(report.education_certificate_path)}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-center text-xs font-semibold text-emerald-700 hover:underline"
                    >
                      ডাউনলোড / নতুন ট্যাবে দেখুন &rarr;
                    </a>
                  )}
                </div>

              </div>

              {/* Extra Attachments */}
              {report.extra_attachments && report.extra_attachments.length > 0 && (
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800">অতিরিক্ত অন্যান্য সংযুক্তি ফাইলসমূহঃ</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {report.extra_attachments.map((extra, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800 truncate">{extra.title || `ফাইল ${idx + 1}`}</span>
                        <a
                          href={renderFileUrl(extra.file_path)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-700 hover:underline font-bold shrink-0 ml-2"
                        >
                          দেখুন &rarr;
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

      </div>

      {/* Fullscreen Document Preview Modal */}
      {activeDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-2xl p-4 overflow-hidden shadow-2xl flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-sm font-bold text-slate-800">ডকুমেন্ট ভিউয়ার</span>
              <div className="flex items-center space-x-2">
                <a
                  href={activeDocModal}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition"
                >
                  নতুন উইন্ডোতে খুলুন
                </a>
                <button
                  type="button"
                  onClick={() => setActiveDocModal(null)}
                  className="p-1 rounded-lg text-slate-500 hover:bg-slate-100"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-900 rounded-xl mt-3">
              {activeDocModal.toLowerCase().endsWith('.pdf') ? (
                <iframe src={activeDocModal} className="w-full h-[70vh] rounded-lg" title="Document Preview" />
              ) : (
                <img src={activeDocModal} alt="Document" className="max-w-full max-h-[70vh] object-contain rounded-lg" />
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

