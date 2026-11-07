import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { UserPlus, LogIn, FileText, Lock, Phone, Mail, User, AlertCircle, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

export default function ApplicantRegister({ alreadyLoggedIn = false, user = null }) {
  const { flash = {} } = usePage().props;
  const [showPassword, setShowPassword] = useState(false);

  const { data, setData, post, processing, errors } = useForm({
    name: '',
    phone: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/sicip/register');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 text-slate-100 font-sans">
      <Head title="উদ্যোক্তা অ্যাকাউন্ট রেজিস্ট্রেশন - বাংলাদেশ ব্যাংক SICIP পোর্টাল" />

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
            <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold">
              <span>নতুন অ্যাকাউন্ট রেজিস্ট্রেশন</span>
              <span className="text-amber-400">•</span>
              <span className="text-emerald-300">উদ্যোক্তা পোর্টাল</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white mt-2.5">
              নতুন উদ্যোক্তা অ্যাকাউন্ট তৈরি
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              আবেদন জমা ও অগ্রগতি ট্র্যাকিংয়ের জন্য আপনার তথ্য দিয়ে অ্যাকাউন্ট খুলুন
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Flash Messages */}
        {flash?.error && (
          <div className="mb-4 bg-rose-500/20 border border-rose-400/50 p-3.5 rounded-2xl text-rose-200 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{flash.error}</span>
          </div>
        )}

        <div className="bg-slate-900/90 backdrop-blur-2xl py-6 px-5 sm:px-8 shadow-2xl rounded-3xl border border-slate-700/80">
          {/* Nav Tabs */}
          <div className="flex border-b border-slate-700/80 mb-6">
            <Link
              href="/sicip/login"
              className="flex-1 pb-3 text-xs sm:text-sm font-medium text-slate-400 hover:text-slate-200 border-b-2 border-transparent flex items-center justify-center space-x-1.5 transition"
            >
              <LogIn className="w-4 h-4" />
              <span>লগইন</span>
            </Link>
            <button
              type="button"
              className="flex-1 pb-3 text-xs sm:text-sm font-bold text-amber-400 border-b-2 border-amber-500 flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>নতুন অ্যাকাউন্ট</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                উদ্যোক্তার পূর্ণ নাম (বাংলা বা ইংরেজি) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  placeholder="যেমন: তানভীর আহমেদ চৌধুরী"
                  autoFocus
                  className={`w-full bg-slate-800/90 border rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition ${
                    errors.name ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-700'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.name}</p>
              )}
            </div>

            {/* Mobile Number */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                ১১ ডিজিটের মোবাইল নম্বর <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  maxLength={11}
                  value={data.phone}
                  onChange={(e) => setData('phone', e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="01819876543"
                  className={`w-full bg-slate-800/90 border rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition font-mono ${
                    errors.phone ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-700'
                  }`}
                />
              </div>
              {errors.phone ? (
                <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.phone}</p>
              ) : (
                <p className="text-[10px] text-slate-400">এই নম্বরে আবেদনের ট্র্যাকিং আপডেট পাঠানো হবে</p>
              )}
            </div>

            {/* Email Address (Optional) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>ইমেইল ঠিকানা</span>
                <span className="text-[10px] text-slate-400 font-normal">(ঐচ্ছিক / না থাকলে খালি রাখুন)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  placeholder="tanvir@example.com"
                  className={`w-full bg-slate-800/90 border rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition ${
                    errors.email ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-700'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  placeholder="আপনার পাসওয়ার্ড লিখুন"
                  className={`w-full bg-slate-800/90 border rounded-xl pl-9 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition ${
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

            {/* Password Confirmation */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                পাসওয়ার্ড নিশ্চিত করুন <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={data.password_confirmation}
                  onChange={(e) => setData('password_confirmation', e.target.value)}
                  placeholder="পুনরায় একই পাসওয়ার্ড লিখুন"
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={processing}
                className="w-full inline-flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4 text-slate-950" />
                <span>{processing ? 'অ্যাকাউন্ট তৈরি হচ্ছে...' : 'অ্যাকাউন্ট খুলুন ও আবেদন শুরু করুন'}</span>
              </button>
            </div>
          </form>

          {/* Bottom Login link */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center space-y-2">
            <p className="text-xs text-slate-400">
              ইতিমধ্যে অ্যাকাউন্ট আছে?
            </p>
            <Link
              href="/sicip/login"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>এখানে ক্লিক করে সরাসরি লগইন করুন</span>
            </Link>
          </div>
        </div>

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

