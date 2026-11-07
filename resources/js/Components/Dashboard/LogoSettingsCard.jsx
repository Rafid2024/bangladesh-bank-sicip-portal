import React, { useState } from 'react';
import { usePage, useForm, Link } from '@inertiajs/react';
import { Upload, CheckCircle2, AlertCircle, RotateCcw, ExternalLink, ShieldCheck, Loader2 } from 'lucide-react';
import BentoCard from '../Common/BentoCard';
import Badge from '../Common/Badge';

export default function LogoSettingsCard() {
    const { settings = {} } = usePage().props;

    const [bbPreview, setBbPreview] = useState(null);
    const [sicipPreview, setSicipPreview] = useState(null);
    const [successNotice, setSuccessNotice] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        bb_logo: null,
        bb_logo_base64: null,
        sicip_logo: null,
        sicip_logo_base64: null,
        reset_bb_logo: false,
        reset_sicip_logo: false,
    });

    const fileToBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

    const handleBbChange = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('bb_logo', file);
            setBbPreview(URL.createObjectURL(file));
            try {
                const b64 = await fileToBase64(file);
                setData((prev) => ({ ...prev, bb_logo: file, bb_logo_base64: b64, reset_bb_logo: false }));
            } catch (err) {
                console.error('Error generating base64 preview', err);
            }
        }
    };

    const handleSicipChange = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('sicip_logo', file);
            setSicipPreview(URL.createObjectURL(file));
            try {
                const b64 = await fileToBase64(file);
                setData((prev) => ({ ...prev, sicip_logo: file, sicip_logo_base64: b64, reset_sicip_logo: false }));
            } catch (err) {
                console.error('Error generating base64 preview', err);
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!data.bb_logo && !data.sicip_logo && !data.reset_bb_logo && !data.reset_sicip_logo) {
            return;
        }

        post('/admin/settings/logos', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setSuccessNotice(true);
                setBbPreview(null);
                setSicipPreview(null);
                reset('bb_logo', 'bb_logo_base64', 'sicip_logo', 'sicip_logo_base64', 'reset_bb_logo', 'reset_sicip_logo');
                setTimeout(() => setSuccessNotice(false), 5000);
            },
        });
    };

    const handleReset = (type) => {
        if (!confirm('আপনি কি এই লোগোটি ডিফল্ট অফিশিয়াল ডিজাইনে ফিরিয়ে নিতে চান?')) return;

        const payload = {
            reset_bb_logo: type === 'bb',
            reset_sicip_logo: type === 'sicip',
        };

        post('/admin/settings/logos', {
            data: payload,
            preserveScroll: true,
            onSuccess: () => {
                if (type === 'bb') setBbPreview(null);
                if (type === 'sicip') setSicipPreview(null);
                setSuccessNotice(true);
                setTimeout(() => setSuccessNotice(false), 4000);
            }
        });
    };

    const hasSelectedFiles = Boolean(data.bb_logo || data.sicip_logo);

    return (
        <BentoCard
            span="2x1"
            title="ফর্ম লোগো ম্যানেজমেন্ট (Form Logo Settings)"
            subtitle="বাংলাদেশ ব্যাংক ও SICIP ফর্মের অফিসিয়াল লোগো আপলোড ও পরিবর্তন করুন"
            badge={<Badge variant="primary" size="sm"><ShieldCheck className="w-3 h-3 mr-1 inline" /> ব্রান্ডিং নিয়ন্ত্রণ</Badge>}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {successNotice && (
                    <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5 animate-fadeIn">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="font-medium">লোগো সফলভাবে সংরক্ষিত হয়েছে! ফর্ম এবং প্রিন্ট ভিউতে এখন এই লোগোটি দেখতে পাবেন।</span>
                    </div>
                )}

                {(errors.bb_logo || errors.sicip_logo) && (
                    <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                        <span>{errors.bb_logo || errors.sicip_logo}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Logo 1: Bangladesh Bank */}
                    <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                ১. বাংলাদেশ ব্যাংক লোগো
                            </span>
                            {settings?.bb_logo && (
                                <button
                                    type="button"
                                    onClick={() => handleReset('bb')}
                                    className="text-[11px] text-zinc-400 hover:text-amber-400 flex items-center gap-1 transition"
                                    title="ডিফল্ট লোগোতে ফিরিয়ে নিন"
                                >
                                    <RotateCcw className="w-3 h-3" />
                                    <span>ডিফল্ট</span>
                                </button>
                            )}
                        </div>

                        {/* Preview Box */}
                        <div className="h-28 rounded-xl bg-zinc-950/70 border border-zinc-800 p-2 flex items-center justify-center relative overflow-hidden">
                            {bbPreview ? (
                                <div className="text-center">
                                    <img src={bbPreview} alt="Preview BB" className="h-20 max-w-full object-contain mx-auto" />
                                    <span className="text-[10px] text-emerald-400 font-semibold mt-1 block">নতুন সিলেক্ট করা হয়েছে</span>
                                </div>
                            ) : settings?.bb_logo ? (
                                <div className="text-center">
                                    <img src={settings.bb_logo} alt="Current BB" className="h-20 max-w-full object-contain mx-auto" />
                                    <span className="text-[10px] text-zinc-400 mt-1 block">বর্তমান সক্রিয় লোগো</span>
                                </div>
                            ) : (
                                <div className="w-14 h-14 rounded-full bg-emerald-950/60 border border-emerald-500/40 flex flex-col items-center justify-center text-center">
                                    <span className="text-[9px] text-emerald-300 font-bold leading-none">বাংলাদেশ</span>
                                    <span className="text-[10px] text-emerald-200 font-extrabold my-0.5">ব্যাংক</span>
                                    <span className="text-[7px] text-emerald-400">★ ★ ★</span>
                                </div>
                            )}
                        </div>

                        {/* Upload Input */}
                        <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700/80 cursor-pointer transition">
                            <Upload className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{data.bb_logo ? data.bb_logo.name.substring(0, 18) + '...' : 'নতুন লোগো বেছে নিন'}</span>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleBbChange}
                            />
                        </label>
                    </div>

                    {/* Logo 2: SICIP */}
                    <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                ২. SICIP প্রোগ্রাম লোগো
                            </span>
                            {settings?.sicip_logo && (
                                <button
                                    type="button"
                                    onClick={() => handleReset('sicip')}
                                    className="text-[11px] text-zinc-400 hover:text-amber-400 flex items-center gap-1 transition"
                                    title="ডিফল্ট লোগোতে ফিরিয়ে নিন"
                                >
                                    <RotateCcw className="w-3 h-3" />
                                    <span>ডিফল্ট</span>
                                </button>
                            )}
                        </div>

                        {/* Preview Box */}
                        <div className="h-28 rounded-xl bg-zinc-950/70 border border-zinc-800 p-2 flex items-center justify-center relative overflow-hidden">
                            {sicipPreview ? (
                                <div className="text-center">
                                    <img src={sicipPreview} alt="Preview SICIP" className="h-20 max-w-full object-contain mx-auto" />
                                    <span className="text-[10px] text-blue-400 font-semibold mt-1 block">নতুন সিলেক্ট করা হয়েছে</span>
                                </div>
                            ) : settings?.sicip_logo ? (
                                <div className="text-center">
                                    <img src={settings.sicip_logo} alt="Current SICIP" className="h-20 max-w-full object-contain mx-auto" />
                                    <span className="text-[10px] text-zinc-400 mt-1 block">বর্তমান সক্রিয় লোগো</span>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <div className="text-lg font-black tracking-tight text-blue-400">
                                        SIC<span className="text-amber-500 font-extrabold">●</span>IP
                                    </div>
                                    <span className="text-[10px] text-zinc-400 italic">উদ্যোক্তা হবো, দেশ গড়বো।</span>
                                </div>
                            )}
                        </div>

                        {/* Upload Input */}
                        <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700/80 cursor-pointer transition">
                            <Upload className="w-3.5 h-3.5 text-blue-400" />
                            <span>{data.sicip_logo ? data.sicip_logo.name.substring(0, 18) + '...' : 'নতুন লোগো বেছে নিন'}</span>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleSicipChange}
                            />
                        </label>
                    </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-800">
                    <Link
                        href="/sicip/feasibility-report"
                        className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 font-medium transition"
                    >
                        <span>ফর্মে লোগো প্রিভিউ দেখুন</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    <button
                        type="submit"
                        disabled={processing || !hasSelectedFiles}
                        className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition cursor-pointer"
                    >
                        {processing ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>সংরক্ষণ হচ্ছে...</span>
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="w-4 h-4" />
                                <span>লোগো সেভ করুন</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </BentoCard>
    );
}
