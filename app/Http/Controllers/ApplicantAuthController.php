<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class ApplicantAuthController extends Controller
{
    /**
     * Show the applicant login page.
     */
    public function showLogin(): Response
    {
        if (Auth::check()) {
            return Inertia::render('Sicip/Auth/Login', [
                'alreadyLoggedIn' => true,
                'user' => Auth::user(),
            ]);
        }

        return Inertia::render('Sicip/Auth/Login', [
            'alreadyLoggedIn' => false,
        ]);
    }

    /**
     * Show the applicant registration page.
     */
    public function showRegister(): Response
    {
        if (Auth::check()) {
            return Inertia::render('Sicip/Auth/Register', [
                'alreadyLoggedIn' => true,
                'user' => Auth::user(),
            ]);
        }

        return Inertia::render('Sicip/Auth/Register', [
            'alreadyLoggedIn' => false,
        ]);
    }

    /**
     * Handle applicant login using Mobile Number or Email.
     */
    public function login(Request $request)
    {
        $request->validate([
            'login' => ['required', 'string'],
            'password' => ['required', 'string'],
        ], [
            'login.required' => 'আপনার মোবাইল নম্বর বা ইমেইল ঠিকানা দিন।',
            'password.required' => 'পাসওয়ার্ড দিন।',
        ]);

        $login = trim($request->input('login'));
        $password = $request->input('password');

        // Check if login input is email or phone
        $fieldType = filter_var($login, FILTER_VALIDATE_EMAIL) ? 'email' : 'phone';

        $user = User::where($fieldType, $login)->first();

        // Also fallback to phone without leading 0 or with +88 if not found
        if (!$user && $fieldType === 'phone') {
            $cleaned = preg_replace('/[^0-9]/', '', $login);
            if (strlen($cleaned) === 13 && str_starts_with($cleaned, '880')) {
                $cleaned = substr($cleaned, 2);
            }
            $user = User::where('phone', $cleaned)->first();
        }

        if (!$user || !Hash::check($password, $user->password)) {
            return back()->withErrors([
                'login' => 'প্রদত্ত মোবাইল নম্বর / ইমেইল বা পাসওয়ার্ড সঠিক নয়।',
            ]);
        }

        if ($user->status !== 'active') {
            return back()->withErrors([
                'login' => 'আপনার অ্যাকাউন্টটি বর্তমানে নিষ্ক্রিয় রয়েছে। অনুগ্রহ করে সহায়তা টিমে যোগাযোগ করুন।',
            ]);
        }

        Auth::login($user, $request->boolean('remember'));
        $request->session()->regenerate();

        if ($user->isSuperAdmin() || $user->isOperationsManager()) {
            return redirect()->intended(route('sicip.index'))
                ->with('success', 'স্বাগতম অ্যাডমিন! আপনি সফলভাবে প্রবেশ করেছেন।');
        }

        return redirect()->intended(route('sicip.create'))
            ->with('success', 'স্বাগতম ' . $user->name . '! আপনি সফলভাবে লগইন হয়েছেন।');
    }

    /**
     * Handle new applicant registration.
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'regex:/^01[3-9]\d{8}$/', 'unique:users,phone'],
            'email' => ['nullable', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
        ], [
            'name.required' => 'আপনার পুরো নাম লিখুন।',
            'phone.required' => '১১ ডিজিটের মোবাইল নম্বর লিখুন।',
            'phone.regex' => 'সঠিক বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 01819876543)।',
            'phone.unique' => 'এই মোবাইল নম্বর দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা হয়েছে। অনুগ্রহ করে লগইন করুন।',
            'email.unique' => 'এই ইমেইল ঠিকানা দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা হয়েছে।',
            'password.required' => 'কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড দিন।',
            'password.min' => 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।',
            'password.confirmed' => 'পাসওয়ার্ড এবং নিশ্চিতকরণ পাসওয়ার্ড মেলেনি।',
        ]);

        $phone = trim($request->input('phone'));
        $email = trim($request->input('email'));
        if (empty($email)) {
            $email = $phone . '@applicant.sicip.gov.bd';
        }

        $user = User::create([
            'name' => trim($request->input('name')),
            'phone' => $phone,
            'email' => $email,
            'password' => Hash::make($request->input('password')),
            'role' => 'client_user',
            'status' => 'active',
        ]);

        $clientRole = Role::where('slug', 'client_user')->first();
        if ($clientRole) {
            $user->roles()->attach($clientRole);
        }

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->route('sicip.create')
            ->with('success', 'অভিনন্দন ' . $user->name . '! আপনার উদ্যোক্তা অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে। এবার আবেদন ফরম পূরণ করুন।');
    }

    /**
     * Log the applicant out.
     */
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('sicip.login')
            ->with('success', 'আপনি সফলভাবে লগআউট হয়েছেন। পরবর্তীতে যেকোনো সময় পুনরায় লগইন করতে পারবেন।');
    }
}

