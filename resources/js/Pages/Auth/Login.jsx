import React, { useState } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { Shield, Sparkles, Phone, Mail, ArrowRight, Lock, CheckCircle, KeyRound, Eye, EyeOff, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function Login({ demoAccounts = [] }) {
    const { settings = {} } = usePage().props;
    const [authMode, setAuthMode] = useState('credentials'); // 'credentials' | 'phone_otp'
    const [otpStep, setOtpStep] = useState('phone'); // 'phone' | 'code'
    const [otpMessage, setOtpMessage] = useState(null);
    const [otpLoading, setOtpLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Standard Login Form
    const { data, setData, post, processing, errors } = useForm({
        email: 'admin@novaportal.io',
        password: 'password123',
        remember: true,
    });

    // Phone OTP Form
    const [phoneData, setPhoneData] = useState({
        phone: '+1-555-0199',
        otp: '123456',
    });
    const [phoneError, setPhoneError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/login');
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setOtpLoading(true);
        setPhoneError(null);

        try {
            const response = await fetch('/auth/otp/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ phone: phoneData.phone }),
            });
            const res = await response.json();
            if (res.success) {
                setOtpMessage(res.message + ' (Use Demo Code: 123456)');
                setOtpStep('code');
            } else {
                setPhoneError(res.message || 'Failed to dispatch OTP');
            }
        } catch (err) {
            setOtpMessage('Demo OTP dispatched: use 123456');
            setOtpStep('code');
        } finally {
            setOtpLoading(false);
        }
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        router.post('/auth/otp/verify', {
            phone: phoneData.phone,
            otp: phoneData.otp,
        });
    };

    const handleQuickLogin = (role) => {
        const slug = role.toLowerCase().includes('admin')
            ? 'super_admin'
            : role.toLowerCase().includes('manager')
            ? 'operations_manager'
            : 'client_user';
        router.get(`/auth/quick/${slug}`);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans relative selection:bg-emerald-600 selection:text-white">
            <Head title="অ্যাডমিন ও স্ক্রুটিনি লগইন - বাংলাদেশ ব্যাংক SICIP" />

            {/* Subtle soft backdrop accent */}
            <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-emerald-100/60 via-slate-50/40 to-transparent pointer-events-none"></div>

            <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center mb-6 relative z-10">
                {/* 2 Official Logos in Crisp White Container */}
                <div className="inline-flex items-center justify-center gap-4 bg-white px-5 py-2.5 rounded-2xl shadow-md border border-slate-200/90 mb-3">
                    <div className="flex items-center justify-center" title="বাংলাদেশ ব্যাংক">
                        <img
                            src={settings?.bb_logo || '/uploads/logos/bb_1793994378_UqTbAw.svg'}
                            alt="বাংলাদেশ ব্যাংক লোগো"
                            className="h-12 w-12 object-contain"
                        />
                    </div>
                    <div className="h-8 w-px bg-slate-200"></div>
                    <div className="flex items-center justify-center" title="SICIP">
                        <img
                            src={settings?.sicip_logo || '/uploads/logos/sicip_1793994378_6ZWj0e.png'}
                            alt="SICIP Logo"
                            className="h-10 w-auto max-w-[130px] object-contain"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>অফিসিয়াল অ্যাডমিন ও মূল্যায়ন পোর্টাল</span>
                    </span>
                    <span className="text-xs text-amber-700 font-medium hidden sm:inline">• বাংলাদেশ ব্যাংক PIU</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                    অ্যাডমিন ড্যাশবোর্ড লগইন
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                    Skills for Industry Competitiveness and Innovation Program (SICIP)
                </p>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-xl px-2 sm:px-4 relative z-10">
                {/* Top Back Nav & Notice */}
                <div className="mb-3 flex items-center justify-between text-xs px-1">
                    <a 
                        href="/sicip/feasibility-report" 
                        className="text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center gap-1.5 transition"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>উদ্যোক্তা আবেদন ফরম</span>
                    </a>
                    <span className="text-slate-500 text-[11px] flex items-center gap-1">
                        <Lock className="w-3 h-3 text-amber-600" />
                        নিরাপদ ২-ফ্যাক্টর গেটওয়ে
                    </span>
                </div>

                {/* Main Auth White Card */}
                <div className="rounded-3xl p-6 sm:p-8 bg-white border border-slate-200 shadow-xl shadow-slate-200/70">
                    
                    {/* Mode Toggle Tabs */}
                    <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 border border-slate-200 mb-6">
                        <button
                            type="button"
                            onClick={() => setAuthMode('credentials')}
                            className={`py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
                                authMode === 'credentials'
                                    ? 'bg-white text-emerald-800 shadow-sm'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <Mail className="w-4 h-4 text-emerald-600" />
                            ইমেইল ও পাসওয়ার্ড
                        </button>
                        <button
                            type="button"
                            onClick={() => setAuthMode('phone_otp')}
                            className={`py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
                                authMode === 'phone_otp'
                                    ? 'bg-white text-emerald-800 shadow-sm'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <Phone className="w-4 h-4 text-emerald-600" />
                            মোবাইল ওটিপি (2FA)
                        </button>
                    </div>

                    {/* Email/Password Form */}
                    {authMode === 'credentials' && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    অ্যাডমিন ইমেইল ঠিকানা (Official Email)
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="admin@novaportal.io"
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-xs text-rose-600 mt-1 font-medium">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    গোপন পাসওয়ার্ড (Password)
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="••••••••••••"
                                        required
                                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
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
                                    <p className="text-xs text-rose-600 mt-1 font-medium">{errors.password}</p>
                                )}
                            </div>

                            <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                    />
                                    <span className="font-medium text-slate-700">লগইন সেশন মনে রাখুন</span>
                                </label>
                                <span className="text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer">
                                    পাসওয়ার্ড ভুলে গেছেন?
                                </span>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 shadow-md shadow-emerald-700/20 active:scale-[0.99] transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                            >
                                <Lock className="w-4 h-4" />
                                <span>{processing ? 'প্রবেশ করা হচ্ছে...' : 'অ্যাডমিন ড্যাশবোর্ডে প্রবেশ করুন'}</span>
                                <ArrowRight className="w-4 h-4 ml-1" />
                            </button>
                        </form>
                    )}

                    {/* Phone OTP Form */}
                    {authMode === 'phone_otp' && (
                        <div>
                            {otpStep === 'phone' ? (
                                <form onSubmit={handleSendOtp} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                            নিবন্ধিত অফিসিয়াল মোবাইল নম্বর
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                                <Phone className="w-4 h-4" />
                                            </div>
                                            <input
                                                type="text"
                                                value={phoneData.phone}
                                                onChange={(e) => setPhoneData({ ...phoneData, phone: e.target.value })}
                                                placeholder="+1-555-0199"
                                                required
                                                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition"
                                            />
                                        </div>
                                        {phoneError && (
                                            <p className="text-xs text-rose-600 mt-1 font-medium">{phoneError}</p>
                                        )}
                                        <p className="text-[11px] text-slate-500 mt-1">দেশ কোড সহ আন্তর্জাতিক ফরম্যাট (যেমন: +1-555-0199 বা 01819876543)</p>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={otpLoading}
                                        className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 shadow-md shadow-emerald-700/20 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                                    >
                                        <KeyRound className="w-4 h-4" />
                                        <span>{otpLoading ? 'ওটিপি পাঠানো হচ্ছে...' : '৬ ডিজিটের ওটিপি কোড পাঠান'}</span>
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleVerifyOtp} className="space-y-4">
                                    {otpMessage && (
                                        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
                                            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                                            <span>{otpMessage}</span>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5 text-center">
                                            আপনার মোবাইলে পাঠানো ৬-ডিজিটের কোডটি লিখুন
                                        </label>
                                        <input
                                            type="text"
                                            maxLength={6}
                                            value={phoneData.otp}
                                            onChange={(e) => setPhoneData({ ...phoneData, otp: e.target.value })}
                                            placeholder="123456"
                                            className="w-full py-3 px-4 rounded-xl bg-slate-50 border border-slate-300 text-emerald-700 placeholder-slate-400 text-center font-mono tracking-[0.3em] text-2xl font-black focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition"
                                            required
                                        />
                                    </div>

                                    <div className="flex gap-2.5">
                                        <button
                                            type="button"
                                            onClick={() => setOtpStep('phone')}
                                            className="w-1/3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-bold transition cursor-pointer"
                                        >
                                            পূর্ববর্তী
                                        </button>
                                        <button
                                            type="submit"
                                            className="w-2/3 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 shadow-md shadow-emerald-700/20 transition cursor-pointer flex items-center justify-center gap-1.5"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            <span>যাচাই করে প্রবেশ করুন</span>
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}

                    {/* Quick 1-Click Access Roles */}
                    <div className="mt-8 pt-6 border-t border-slate-200">
                        <div className="flex items-center justify-between mb-3.5">
                            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                দ্রুত ১-ক্লিক অ্যাডমিন অ্যাক্সেস (Quick Login)
                            </span>
                            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                নো পাসওয়ার্ড দরকার
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-2.5">
                            {demoAccounts.map((acc) => (
                                <button
                                    key={acc.email}
                                    type="button"
                                    onClick={() => handleQuickLogin(acc.role)}
                                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 text-left transition flex items-center justify-between group cursor-pointer shadow-sm"
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={acc.avatar}
                                            alt={acc.role}
                                            className="w-10 h-10 rounded-full object-cover border-2 border-slate-200 group-hover:border-emerald-400 transition"
                                        />
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-xs font-bold text-slate-800 group-hover:text-emerald-800 transition">
                                                    {acc.role}
                                                </h4>
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                                                    {acc.badge}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-slate-500 mt-0.5">{acc.email}</p>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 group-hover:bg-emerald-600 group-hover:border-emerald-600 flex items-center justify-center text-slate-500 group-hover:text-white transition shadow-xs">
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Official Security Info */}
                <div className="mt-6 text-center text-xs text-slate-500">
                    <p className="flex items-center justify-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-emerald-600" />
                        <span>বাংলাদেশ ব্যাংক ও অর্থ মন্ত্রণালয় (PIU) নিয়ন্ত্রিত এনক্রিপ্টেড প্রশাসনিক পোর্টাল</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
