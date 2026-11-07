import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { LogIn, UserPlus, FileText, Lock, Phone, Mail, ArrowRight, ShieldCheck, Eye, EyeOff, AlertCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 text-slate-100 font-sans">
      <Head title="উদ্যোক্তা লগইন - বাংলাদেশ ব্যাংক SICIP পোর্টাল" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Official Header with 2 Logos */}
        <div className="text-center space-y-3">
          {/* 2 Official Logos Container */}
          <div className="inline-flex items-center justify-center gap-3.5 bg-white px-4 py-2 rounded-2xl shadow-xl shadow-black/30 border border-emerald-400/40">
            {/* Logo 1: Bangladesh Bank Official Emblem */}
            <div className="flex items-center justify-center" title="বাংলাদেশ ব্যাংক">
              <img
                src={settings?.bb_logo || '/uploads/logos/bb_1793994378_UqTbAw.svg'}
                alt="বাংলাদেশ ব্যাংক লোগো"
                className="h-12 w-12 object-contain"
              />
            </div>

            {/* Elegant Divider */}
            <div className="h-8 w-px bg-slate-300"></div>

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
            <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
              <span>আবেদনকারী পোর্টাল</span>
              <span className="text-emerald-400">•</span>
              <span className="text-amber-300">উদ্যোক্তা উন্নয়ন প্রোগ্রাম</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white mt-2.5">
              উদ্যোক্তা অ্যাকাউন্টে লগইন
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              সম্ভাব্যতা যাচাই প্রতিবেদন পূরণ বা সংরক্ষিত খসড়া দেখতে লগইন করুন
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Flash Messages */}
        {flash?.success && (
          <div className="mb-4 bg-emerald-500/20 border border-emerald-400/50 p-3.5 rounded-2xl text-emerald-200 text-xs flex items-center space-x-2">
            <span className="font-bold text-sm">✓</span>
            <span>{flash.success}</span>
          </div>
        )}
        {flash?.error && (
          <div className="mb-4 bg-rose-500/20 border border-rose-400/50 p-3.5 rounded-2xl text-rose-200 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{flash.error}</span>
          </div>
        )}

        {/* If already logged in */}
        {alreadyLoggedIn && user ? (
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-300 mx-auto flex items-center justify-center text-2xl font-bold border border-emerald-400/30">
              👤
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{user.name}</h3>
              <p className="text-xs text-slate-300">{user.phone || user.email}</p>
              <span className="inline-block mt-2 text-[11px] font-semibold bg-emerald-500/30 text-emerald-300 px-3 py-1 rounded-full border border-emerald-400/30">
                লগইন আছেন
              </span>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <Link
                href="/sicip/feasibility-report"
                className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition"
              >
                <span>আবেদন ফরমে যান</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/sicip/logout"
                method="post"
                as="button"
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-semibold text-xs border border-white/20 transition cursor-pointer"
              >
                লগআউট
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/90 backdrop-blur-2xl py-6 px-5 sm:px-8 shadow-2xl rounded-3xl border border-slate-700/80">
            {/* Nav Tabs */}
            <div className="flex border-b border-slate-700/80 mb-6">
              <button
                type="button"
                className="flex-1 pb-3 text-xs sm:text-sm font-bold text-emerald-400 border-b-2 border-emerald-500 flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>লগইন</span>
              </button>
              <Link
                href="/sicip/register"
                className="flex-1 pb-3 text-xs sm:text-sm font-medium text-slate-400 hover:text-slate-200 border-b-2 border-transparent flex items-center justify-center space-x-1.5 transition"
              >
                <UserPlus className="w-4 h-4" />
                <span>নতুন অ্যাকাউন্ট</span>
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Login Input (Phone or Email) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  মোবাইল নম্বর অথবা ইমেইল ঠিকানা
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={data.login}
                    onChange={(e) => setData('login', e.target.value)}
                    placeholder="যেমন: 01819876543 বা email@domain.com"
                    autoFocus
                    className={`w-full bg-slate-800/90 border rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${
                      errors.login ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-700'
                    }`}
                  />
                </div>
                {errors.login && (
                  <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.login}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  পাসওয়ার্ড
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    placeholder="আপনার গোপন পাসওয়ার্ড লিখুন"
                    className={`w-full bg-slate-800/90 border rounded-xl pl-9 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${
                      errors.password ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-700'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.password}</p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.remember}
                    onChange={(e) => setData('remember', e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span>মনে রাখুন</span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full inline-flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition cursor-pointer disabled:opacity-50"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{processing ? 'লগইন হচ্ছে...' : 'লগইন করুন ও ফরমে যান'}</span>
                </button>
              </div>
            </form>

            {/* Bottom Sign up link */}
            <div className="mt-6 pt-5 border-t border-slate-800 text-center space-y-3">
              <p className="text-xs text-slate-400">
                নতুন উদ্যোক্তা? এখনো কোনো অ্যাকাউন্ট নেই?
              </p>
              <Link
                href="/sicip/register"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition"
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
            className="inline-flex items-center space-x-1.5 text-xs text-emerald-300 hover:text-emerald-200 transition bg-emerald-950/60 border border-emerald-500/30 px-3.5 py-1.5 rounded-full"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>আবেদন করার পূর্বে পূরণকৃত নমুনা ফরম (PDF) দেখুন</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

