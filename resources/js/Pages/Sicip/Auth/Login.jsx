import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { LogIn, UserPlus, FileText, Lock, Phone, ArrowRight, ShieldCheck, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function ApplicantLogin({ alreadyLoggedIn = false, user = null }) {
  const { flash = {}, settings = {} } = usePage().props;
  const [showPassword, setShowPassword] = useState(false);

  const { data, setData, post, processing, errors } = useForm({
    login: '',
    password: '',
    remember: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/sicip/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 text-slate-800 font-sans relative selection:bg-emerald-600 selection:text-white">
      <Head title="উদ্যোক্তা লগইন - বাংলাদেশ ব্যাংক SICIP পোর্টাল" />

      {/* Subtle soft backdrop accent */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-emerald-100/60 via-slate-50/40 to-transparent pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Official Header with 2 Logos */}
        <div className="text-center space-y-3">
          {/* 2 Official Logos Container */}
          <div className="inline-flex items-center justify-center gap-3.5 bg-white px-5 py-2.5 rounded-2xl shadow-md border border-slate-200/90">
            {/* Logo 1: Bangladesh Bank Official Emblem */}
            <div className="flex items-center justify-center" title="বাংলাদেশ ব্যাংক">
              <img
                src={settings?.bb_logo || '/uploads/logos/bb_1793994378_UqTbAw.svg'}
                alt="বাংলাদেশ ব্যাংক লোগো"
                className="h-12 w-12 object-contain"
              />
            </div>

            {/* Elegant Divider */}
            <div className="h-8 w-px bg-slate-200"></div>

            {/* Logo 2: SICIP Official Logo */}
            <div className="flex items-center justify-center" title="Skills for Industry Competitiveness and Innovation Program (SICIP)">
              <img
                src={settings?.sicip_logo || '/uploads/logos/sicip_1793994378_6ZWj0e.png'}
                alt="SICIP লোগো"
                className="h-10 w-auto max-w-[140px] object-contain"
              />
            </div>
          </div>

          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>আবেদনকারী পোর্টাল</span>
              <span className="text-emerald-500">•</span>
              <span className="text-amber-700">উদ্যোক্তা উন্নয়ন প্রোগ্রাম</span>
            </div>

            <h2 className="text-2xl font-black text-slate-900 mt-2.5">
              উদ্যোক্তা অ্যাকাউন্টে লগইন
            </h2>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              সম্ভাব্যতা যাচাই প্রতিবেদন পূরণ বা সংরক্ষিত খসড়া দেখতে লগইন করুন
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Flash Messages */}
        {flash?.success && (
          <div className="mb-4 bg-emerald-50 border border-emerald-300 p-3.5 rounded-2xl text-emerald-800 text-xs flex items-center space-x-2">
            <span className="font-bold text-sm">✓</span>
            <span>{flash.success}</span>
          </div>
        )}
        {flash?.error && (
          <div className="mb-4 bg-rose-50 border border-rose-300 p-3.5 rounded-2xl text-rose-800 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{flash.error}</span>
          </div>
        )}

        {/* If already logged in */}
        {alreadyLoggedIn && user ? (
          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-xl shadow-slate-200/60 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center text-2xl font-bold border border-emerald-200">
              👤
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{user.name}</h3>
              <p className="text-xs text-slate-500">{user.phone || user.email}</p>
              <span className="inline-block mt-2 text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
                লগইন আছেন
              </span>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <Link
                href="/sicip/feasibility-report"
                className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
              >
                <span>আবেদন ফরমে যান</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/sicip/logout"
                method="post"
                as="button"
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 transition cursor-pointer"
              >
                লগআউট
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white py-6 px-5 sm:px-8 shadow-xl shadow-slate-200/70 rounded-3xl border border-slate-200">
            {/* Nav Tabs */}
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 border border-slate-200 mb-6">
              <button
                type="button"
                className="py-2.5 text-xs font-bold rounded-xl bg-white text-emerald-800 shadow-sm flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-emerald-600" />
                <span>লগইন</span>
              </button>
              <Link
                href="/sicip/register"
                className="py-2.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-xl flex items-center justify-center space-x-1.5 transition"
              >
                <UserPlus className="w-4 h-4" />
                <span>নতুন অ্যাকাউন্ট</span>
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Login Input (Phone or Email) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  মোবাইল নম্বর অথবা ইমেইল ঠিকানা
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={data.login}
                    onChange={(e) => setData('login', e.target.value)}
                    placeholder="যেমন: 01819876543 বা email@domain.com"
                    autoFocus
                    className={`w-full bg-slate-50 border rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition ${
                      errors.login ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-300'
                    }`}
                  />
                </div>
                {errors.login && (
                  <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.login}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  পাসওয়ার্ড
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    placeholder="আপনার গোপন পাসওয়ার্ড লিখুন"
                    className={`w-full bg-slate-50 border rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition ${
                      errors.password ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.password}</p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.remember}
                    onChange={(e) => setData('remember', e.target.checked)}
                    className="rounded bg-white border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span className="text-slate-700 font-medium">মনে রাখুন</span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full inline-flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold shadow-md shadow-emerald-700/20 active:scale-[0.99] transition cursor-pointer disabled:opacity-50"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{processing ? 'লগইন হচ্ছে...' : 'লগইন করুন ও ফরমে যান'}</span>
                </button>
              </div>
            </form>

            {/* Bottom Sign up link */}
            <div className="mt-6 pt-5 border-t border-slate-200 text-center space-y-2">
              <p className="text-xs text-slate-500">
                নতুন উদ্যোক্তা? এখনো কোনো অ্যাকাউন্ট নেই?
              </p>
              <Link
                href="/sicip/register"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 transition"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>এখানে ক্লিক করে নতুন অ্যাকাউন্ট খুলুন</span>
              </Link>
            </div>
          </div>
        )}

        {/* Demo PDF Helper Link */}
        <div className="mt-6 text-center">
          <Link
            href="/sicip/sample-demo-pdf"
            target="_blank"
            className="inline-flex items-center space-x-1.5 text-xs text-emerald-800 hover:text-emerald-900 transition bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-full font-medium shadow-xs"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            <span>আবেদন করার পূর্বে পূরণকৃত নমুনা ফরম (PDF) দেখুন</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
